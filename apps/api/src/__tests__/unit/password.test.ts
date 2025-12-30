import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, checkPasswordStrength } from '../../lib/password.js';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword('testPassword123!');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('testPassword123!');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password (due to salt)', async () => {
      const hash1 = await hashPassword('testPassword123!');
      const hash2 = await hashPassword('testPassword123!');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'mySecurePassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hash = await hashPassword('correctPassword123!');
      const isValid = await verifyPassword('wrongPassword123!', hash);
      expect(isValid).toBe(false);
    });

    it('should handle empty password gracefully', async () => {
      const hash = await hashPassword('somePassword123!');
      const isValid = await verifyPassword('', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should accept strong password', () => {
      const error = checkPasswordStrength('StrongP@ssw0rd!123');
      expect(error).toBeNull();
    });

    it('should reject password without uppercase', () => {
      const error = checkPasswordStrength('weakpassword123!');
      expect(error).not.toBeNull();
      expect(error).toContain('uppercase');
    });

    it('should reject password without lowercase', () => {
      const error = checkPasswordStrength('WEAKPASSWORD123!');
      expect(error).not.toBeNull();
      expect(error).toContain('lowercase');
    });

    it('should reject password without number', () => {
      const error = checkPasswordStrength('WeakPassword!@#');
      expect(error).not.toBeNull();
      expect(error).toContain('number');
    });

    it('should reject short password', () => {
      const error = checkPasswordStrength('Short1!');
      expect(error).not.toBeNull();
      expect(error).toContain('12 characters');
    });

    it('should reject common passwords', () => {
      const error = checkPasswordStrength('Password123!');
      expect(error).not.toBeNull();
      expect(error).toContain('common');
    });
  });
});
