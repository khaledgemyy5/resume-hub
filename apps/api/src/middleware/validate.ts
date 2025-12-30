import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Validation middleware factory
 * Creates middleware that validates request data against a Zod schema
 */
export function validate<T>(schema: ZodSchema<T>, target: ValidateTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
      const result = schema.parse(data);
      
      // Replace the target with validated/transformed data
      if (target === 'body') {
        req.body = result;
      } else if (target === 'query') {
        req.query = result as typeof req.query;
      } else {
        req.params = result as typeof req.params;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: { errors: formattedErrors },
          },
        });
        return;
      }
      
      // Re-throw unexpected errors
      throw error;
    }
  };
}

/**
 * Validate request body
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return validate(schema, 'body');
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return validate(schema, 'query');
}

/**
 * Validate route parameters
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return validate(schema, 'params');
}
