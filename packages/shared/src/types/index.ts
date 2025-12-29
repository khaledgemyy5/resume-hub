// Base types for the resume application

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  highlights: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  highlights: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  profileId: string;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  profileId: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  repoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certification {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Full resume type
export interface Resume {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}
