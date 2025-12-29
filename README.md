# Ammar Resume - Monorepo

A minimalist, text-first personal resume/portfolio application built with modern tooling.

## Architecture Overview

```
ammar-resume/
├── apps/
│   ├── web/          # React + Vite + TypeScript (frontend)
│   └── api/          # Node.js + Express + TypeScript (backend)
├── packages/
│   └── shared/       # Shared types, Zod schemas, utilities
├── infra/            # AWS deployment docs + Terraform skeleton
├── docker-compose.yml
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Validation | Zod (shared schemas) |
| Testing | Vitest (web), Jest/Vitest (api) |
| Deployment | Docker, AWS (ECS/Lambda) |

## Local Development Setup

### Prerequisites

- Node.js >= 20.x
- pnpm >= 8.x (recommended) or npm
- Docker & Docker Compose
- PostgreSQL 15+ (via Docker)

### Environment Variables

Create `.env` files in each app directory:

**apps/api/.env**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ammar_resume
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
```

**apps/web/.env**
```env
VITE_API_URL=http://localhost:3001
```

### Quick Start

```bash
# 1. Install dependencies (from root)
pnpm install

# 2. Start infrastructure (PostgreSQL)
docker-compose up -d postgres

# 3. Run database migrations
pnpm --filter api db:migrate

# 4. Start development servers
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

### Docker Compose Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

## Project Structure Details

### apps/web (Frontend)

React SPA with:
- Vite for fast HMR and optimized builds
- React Router for client-side routing
- TailwindCSS for styling
- Vitest + React Testing Library for tests
- Code-splitting and lazy loading for performance

### apps/api (Backend)

Express server with:
- TypeScript for type safety
- Helmet for security headers
- Rate limiting via express-rate-limit
- Zod for input validation
- JWT authentication for admin routes
- PostgreSQL via node-postgres (pg)

### packages/shared

Shared code between apps:
- TypeScript interfaces and types
- Zod validation schemas
- Utility functions
- API response types

## Security Measures

- Helmet.js for HTTP security headers
- Rate limiting on all endpoints
- Input validation with Zod schemas
- JWT-based authentication for admin
- CORS configuration
- SQL injection prevention via parameterized queries
- Environment variable validation at startup

## Performance Optimizations

- Minimal JavaScript bundle (code-splitting)
- Lazy loading for routes and components
- Static asset caching headers
- Gzip/Brotli compression
- Database connection pooling
- API response caching where appropriate

## Deployment

See `infra/` directory for:
- Terraform configurations
- AWS architecture diagrams
- Deployment scripts
- CI/CD pipeline examples

## Lovable Development

This project can also be edited via [Lovable](https://lovable.dev). The `src/` directory contains the React frontend that runs in Lovable's preview.

**Note**: The monorepo structure (apps/api, packages/shared) requires local development with Node.js for full functionality. Lovable only runs the React frontend.

## License

MIT
