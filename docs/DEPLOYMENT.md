# Deployment Guide

This guide covers the deployment journey from local development to production on AWS.

## Deployment Environments

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Deployment Pipeline                                │
│                                                                              │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐          │
│   │  Local   │────▶│  EC2 Dev │────▶│ AWS Dev  │────▶│ AWS Prod │          │
│   │ Docker   │     │  Docker  │     │ Fargate  │     │ Fargate  │          │
│   └──────────┘     └──────────┘     └──────────┘     └──────────┘          │
│                                                                              │
│   SQLite/PG         PostgreSQL      RDS Postgres    RDS Multi-AZ           │
│   localhost         SSH tunnel      VPC private     VPC private            │
│   Hot reload        Hot reload      CI/CD deploy    CI/CD deploy           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 1. Local Development

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker Desktop

### Quick Start
```bash
# Clone and install
git clone <repo>
pnpm install

# Start services (PostgreSQL)
docker compose up -d postgres

# Setup database
cd apps/api
cp .env.example .env
npx prisma migrate dev
pnpm run seed

# Run development servers
cd ../..
pnpm run dev       # Web on :5173
pnpm run dev:api   # API on :3001
```

### Environment Variables (Local)
```env
# apps/api/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ammar_resume
JWT_SECRET=dev-secret-at-least-32-chars-long!!
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!
```

## 2. EC2 Development Server

For team development or testing in a cloud environment.

### Setup EC2 Instance
```bash
# Bootstrap Ubuntu EC2 (run on instance)
curl -fsSL https://raw.githubusercontent.com/<repo>/main/scripts/ec2_bootstrap_ubuntu.sh | bash
```

### Deploy Stack
```bash
# SSH to EC2
ssh -i key.pem ubuntu@ec2-ip

# Clone and run
git clone <repo>
cd ammar-resume
./scripts/ec2_seed_and_run.sh
```

### Access via SSH Tunnel
```bash
# From local machine - tunnel to services
ssh -i key.pem -L 5173:localhost:5173 -L 3001:localhost:3001 ubuntu@ec2-ip

# Access in browser
# Web: http://localhost:5173
# API: http://localhost:3001
```

### Environment Variables (EC2)
```env
# Same as local, but with EC2-specific values
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ammar_resume
JWT_SECRET=<generate-secure-secret>
CORS_ORIGIN=http://localhost:5173
```

## 3. AWS Development (Terraform)

### Prerequisites
- AWS CLI configured
- Terraform 1.5+
- Route 53 domain (optional)

### Initial Setup
```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Review plan
terraform plan -var-file="environments/dev.tfvars"

# Apply infrastructure
terraform apply -var-file="environments/dev.tfvars"
```

### Post-Infrastructure Setup
```bash
# Get outputs
terraform output

# Run database migrations
export DATABASE_URL=$(terraform output -raw database_url)
cd ../../apps/api
npx prisma migrate deploy
pnpm run seed
```

### GitHub Actions Setup

1. **Create IAM Role for GitHub Actions**
   - Use OIDC authentication (no long-lived credentials)
   - Grant permissions: ECR, ECS, S3, CloudFront, Secrets Manager

2. **Configure Repository Secrets**
   ```
   AWS_ROLE_ARN: arn:aws:iam::ACCOUNT:role/github-actions
   ADMIN_EMAIL: admin@example.com
   ADMIN_PASSWORD: <secure-password>
   ```

3. **Configure Repository Variables (per environment)**
   ```
   # dev environment
   VITE_API_BASE_URL: https://api-dev.example.com
   S3_BUCKET_NAME: ammar-resume-dev-web
   CLOUDFRONT_DISTRIBUTION_ID: E1234567890
   ECR_REPOSITORY: ammar-resume-dev-api
   ECS_CLUSTER: ammar-resume-dev
   ECS_SERVICE: ammar-resume-dev-api
   ECS_TASK_FAMILY: ammar-resume-dev-api
   DATABASE_URL_SECRET_ID: ammar-resume-dev-database-url
   ```

### Deploy via CI/CD
```bash
# Web deploys automatically on push to main (paths: src/*, apps/web/*)
# API deploys automatically on push to main (paths: apps/api/*)

# Manual deploy
gh workflow run deploy-web.yml -f environment=dev
gh workflow run deploy-api.yml -f environment=dev
```

## 4. AWS Production

### Differences from Dev
- Multi-AZ RDS for high availability
- Multiple ECS tasks for redundancy
- S3 versioning enabled
- CloudFront with custom domain
- Stricter security groups

### Production Deployment
```bash
cd infra/terraform

# Apply production infrastructure
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
```

### Production Migrations

**CRITICAL: Always follow this process for production migrations**

1. **Create backup before migration**
   ```bash
   aws rds create-db-snapshot \
     --db-instance-identifier ammar-resume-prod \
     --db-snapshot-identifier pre-migration-$(date +%Y%m%d)
   ```

2. **Review migration**
   ```bash
   # Check what will be applied
   gh workflow run migrate-db.yml -f environment=prod -f action=status
   ```

3. **Apply migration**
   ```bash
   gh workflow run migrate-db.yml -f environment=prod -f action=deploy
   ```

4. **Verify deployment**
   ```bash
   curl https://api.example.com/health
   ```

### Rollback Procedures

**Web Rollback:**
```bash
# Re-deploy previous commit
git checkout <previous-sha>
gh workflow run deploy-web.yml -f environment=prod
```

**API Rollback:**
```bash
# List recent task definitions
aws ecs list-task-definitions --family-prefix ammar-resume-prod-api --sort DESC

# Update to previous version
aws ecs update-service \
  --cluster ammar-resume-prod \
  --service ammar-resume-prod-api \
  --task-definition ammar-resume-prod-api:PREVIOUS \
  --force-new-deployment
```

**Database Rollback:**
```bash
# Restore from snapshot (creates new instance)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier ammar-resume-prod-restored \
  --db-snapshot-identifier pre-migration-20240101
```

## Environment Variable Checklist

### Required for All Environments

| Variable | Description | Where Set |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | Secrets Manager |
| `JWT_SECRET` | JWT signing key (32+ chars) | Secrets Manager |
| `CORS_ORIGIN` | Allowed origin URL | ECS task definition |
| `NODE_ENV` | `development` or `production` | ECS task definition |

### Required for Initial Setup

| Variable | Description | Where Set |
|----------|-------------|-----------|
| `ADMIN_EMAIL` | Initial admin email | GitHub Secrets |
| `ADMIN_PASSWORD` | Initial admin password | GitHub Secrets |

### Web Build Variables

| Variable | Description | Where Set |
|----------|-------------|-----------|
| `VITE_API_BASE_URL` | API endpoint URL | GitHub Variables |
| `VITE_DATA_MODE` | `http` for real backend | Build-time |

## Monitoring & Debugging

### CloudWatch Logs
```bash
# Stream API logs
aws logs tail /ecs/ammar-resume-prod-api --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /ecs/ammar-resume-prod-api \
  --filter-pattern "ERROR"
```

### Health Checks
```bash
# API health
curl https://api.example.com/health

# Web (check HTTP status)
curl -I https://example.com
```

### Common Issues

**503 Service Unavailable:**
- Check ECS task status: `aws ecs describe-services --cluster X --services Y`
- Check target group health: `aws elbv2 describe-target-health --target-group-arn X`

**Database Connection Failed:**
- Verify security group allows ECS → RDS
- Check DATABASE_URL secret is correct
- Ensure RDS is in same VPC

**CORS Errors:**
- Verify CORS_ORIGIN matches frontend URL exactly
- Check ALB is forwarding Origin header

## Cost Management

### Dev Environment (~$50-80/month)
- Use `db.t3.micro` for RDS
- Single ECS task
- Consider scheduled scaling (stop at night)

### Production (~$150-300/month)
- Use reserved capacity for predictable workloads
- Enable S3 Intelligent Tiering
- Set CloudWatch log retention (30 days)

### Cost Alerts
```bash
# Set up billing alert
aws budgets create-budget \
  --account-id ACCOUNT_ID \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

## Security Checklist

- [ ] All secrets in Secrets Manager (never in code)
- [ ] RDS in private subnet (no public access)
- [ ] ECS tasks in private subnet with NAT
- [ ] ALB with TLS 1.2+ only
- [ ] CloudFront with HTTPS redirect
- [ ] Security groups with minimal ingress
- [ ] IAM roles with least privilege
- [ ] GitHub Actions using OIDC (no long-lived keys)
- [ ] Dependency auditing in CI (`pnpm audit`)
- [ ] OWASP ZAP scanning in CI
