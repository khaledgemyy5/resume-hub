# Infrastructure

This directory contains infrastructure-as-code and deployment documentation.

## Directory Structure

```
infra/
├── terraform/          # Terraform configurations
│   ├── environments/   # Environment-specific configs
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── modules/        # Reusable Terraform modules
│       ├── vpc/
│       ├── rds/
│       ├── ecs/
│       └── cloudfront/
├── scripts/            # Deployment scripts
├── docs/               # Architecture documentation
└── init.sql            # Database initialization
```

## AWS Architecture Overview

```
                                    ┌─────────────────┐
                                    │   Route 53      │
                                    │   (DNS)         │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   CloudFront    │
                                    │   (CDN)         │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐      ┌────────▼────────┐              │
           │   S3 Bucket     │      │   ALB           │              │
           │   (Static)      │      │   (Load Bal.)   │              │
           └─────────────────┘      └────────┬────────┘              │
                                             │                        │
                                    ┌────────▼────────┐              │
                                    │   ECS Fargate   │              │
                                    │   (API)         │              │
                                    └────────┬────────┘              │
                                             │                        │
                                    ┌────────▼────────┐              │
                                    │   RDS Postgres  │              │
                                    │   (Database)    │              │
                                    └─────────────────┘              │
                                                                      │
                                    ┌─────────────────┐              │
                                    │   Secrets Mgr   │◄─────────────┘
                                    │   (Credentials) │
                                    └─────────────────┘
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.5.0
- Docker for building container images

## Deployment Steps

### 1. Initial Setup

```bash
# Initialize Terraform
cd infra/terraform/environments/dev
terraform init

# Review plan
terraform plan

# Apply infrastructure
terraform apply
```

### 2. Database Migration

```bash
# Run migrations against RDS
./scripts/migrate.sh
```

### 3. Deploy Application

```bash
# Build and push Docker images
./scripts/deploy.sh
```

## Environment Variables

All sensitive values are stored in AWS Secrets Manager and injected at runtime.

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret for JWT signing |
| CORS_ORIGIN | Allowed CORS origin |

## Monitoring

- **CloudWatch Logs**: All application logs
- **CloudWatch Alarms**: CPU, memory, error rate alerts
- **X-Ray**: Distributed tracing (optional)

## Estimated Costs

| Resource | Monthly Cost (Dev) | Monthly Cost (Prod) |
|----------|-------------------|---------------------|
| RDS (t3.micro) | ~$15 | ~$50 (t3.small) |
| ECS Fargate | ~$10 | ~$30 |
| CloudFront | ~$1 | ~$5 |
| S3 | ~$1 | ~$2 |
| **Total** | **~$27** | **~$87** |

*Costs are estimates and may vary based on usage.*
