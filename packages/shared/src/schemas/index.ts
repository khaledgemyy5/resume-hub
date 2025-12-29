import { z } from 'zod';

// Profile schemas
export const profileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  bio: z.string().max(2000),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createProfileSchema = profileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProfileSchema = createProfileSchema.partial();

// Experience schemas
export const experienceSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  company: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  location: z.string().max(100).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  description: z.string().max(2000),
  highlights: z.array(z.string().max(500)),
  order: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createExperienceSchema = experienceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateExperienceSchema = createExperienceSchema.partial();

// Education schemas
export const educationSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().min(1).max(200),
  location: z.string().max(100).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  gpa: z.string().max(10).optional(),
  highlights: z.array(z.string().max(500)),
  order: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createEducationSchema = educationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEducationSchema = createEducationSchema.partial();

// Skill schemas
export const proficiencyEnum = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

export const skillSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  proficiency: proficiencyEnum,
  order: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createSkillSchema = skillSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSkillSchema = createSkillSchema.partial();

// Project schemas
export const projectSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  technologies: z.array(z.string().max(50)),
  url: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema.partial();

// Certification schemas
export const certificationSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  name: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  credentialId: z.string().max(100).optional(),
  credentialUrl: z.string().url().optional(),
  order: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createCertificationSchema = certificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCertificationSchema = createCertificationSchema.partial();

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

// Query schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Export types inferred from schemas
export type ProfileInput = z.infer<typeof createProfileSchema>;
export type ExperienceInput = z.infer<typeof createExperienceSchema>;
export type EducationInput = z.infer<typeof createEducationSchema>;
export type SkillInput = z.infer<typeof createSkillSchema>;
export type ProjectInput = z.infer<typeof createProjectSchema>;
export type CertificationInput = z.infer<typeof createCertificationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
