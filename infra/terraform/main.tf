# =============================================================================
# Ammar Resume - AWS Infrastructure
# =============================================================================
# Modular Terraform configuration for deploying web and API to AWS
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Uncomment to use S3 backend for state (recommended for team use)
  # backend "s3" {
  #   bucket         = "ammar-resume-terraform-state"
  #   key            = "state/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

# -----------------------------------------------------------------------------
# Provider Configuration
# -----------------------------------------------------------------------------

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge({
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }, var.additional_tags)
  }
}

# Provider for us-east-1 (required for CloudFront ACM certificates)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = merge({
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }, var.additional_tags)
  }
}

# -----------------------------------------------------------------------------
# Local Values
# -----------------------------------------------------------------------------

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# VPC Module
# -----------------------------------------------------------------------------

module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  tags               = local.common_tags
}

# -----------------------------------------------------------------------------
# Security Module
# -----------------------------------------------------------------------------

module "security" {
  source = "./modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  vpc_cidr     = module.vpc.vpc_cidr
  tags         = local.common_tags
}

# -----------------------------------------------------------------------------
# ECR Module
# -----------------------------------------------------------------------------

module "ecr" {
  source = "./modules/ecr"

  project_name          = var.project_name
  environment           = var.environment
  image_retention_count = 10
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# RDS Module
# -----------------------------------------------------------------------------

module "rds" {
  source = "./modules/rds"

  project_name            = var.project_name
  environment             = var.environment
  vpc_id                  = module.vpc.vpc_id
  subnet_ids              = module.vpc.private_subnet_ids
  security_group_id       = module.security.rds_sg_id
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  db_name                 = var.db_name
  db_username             = var.db_username
  multi_az                = var.db_multi_az
  backup_retention_period = var.db_backup_retention
  tags                    = local.common_tags
}

# -----------------------------------------------------------------------------
# ECS Module
# -----------------------------------------------------------------------------

module "ecs" {
  source = "./modules/ecs"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  private_subnet_ids    = module.vpc.private_subnet_ids
  alb_security_group_id = module.security.alb_sg_id
  ecs_security_group_id = module.security.ecs_sg_id
  ecr_repository_url    = module.ecr.repository_url
  cpu                   = var.api_cpu
  memory                = var.api_memory
  desired_count         = var.api_desired_count
  min_count             = var.api_min_count
  max_count             = var.api_max_count
  certificate_arn       = var.certificate_arn
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# S3 + CloudFront Module
# -----------------------------------------------------------------------------

module "s3_cloudfront" {
  source = "./modules/s3-cloudfront"

  project_name    = var.project_name
  environment     = var.environment
  domain_name     = var.domain_name
  certificate_arn = var.certificate_arn
  price_class     = var.cloudfront_price_class
  tags            = local.common_tags
}
