# Terraform configuration skeleton
# This is a placeholder - expand based on requirements

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment to use S3 backend for state
  # backend "s3" {
  #   bucket         = "ammar-resume-terraform-state"
  #   key            = "state/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "ammar-resume"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = ""
}

# Outputs
output "api_endpoint" {
  description = "API endpoint URL"
  value       = "TODO: Add after ECS/ALB setup"
}

output "web_endpoint" {
  description = "Web application URL"
  value       = "TODO: Add after CloudFront setup"
}

output "database_endpoint" {
  description = "RDS endpoint"
  value       = "TODO: Add after RDS setup"
  sensitive   = true
}

# TODO: Add module references
# module "vpc" {
#   source = "./modules/vpc"
#   ...
# }
#
# module "rds" {
#   source = "./modules/rds"
#   ...
# }
#
# module "ecs" {
#   source = "./modules/ecs"
#   ...
# }
#
# module "cloudfront" {
#   source = "./modules/cloudfront"
#   ...
# }
