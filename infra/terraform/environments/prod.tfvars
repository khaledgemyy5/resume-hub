# =============================================================================
# Production Environment Configuration
# =============================================================================

project_name = "ammar-resume"
environment  = "prod"
aws_region   = "us-east-1"

# Networking
vpc_cidr           = "10.1.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# Domain (configure with your domain)
domain_name     = "" # e.g., "example.com"
api_subdomain   = "api"
certificate_arn = "" # ARN of ACM certificate in us-east-1

# Database (production-ready)
db_instance_class    = "db.t3.small"
db_allocated_storage = 50
db_name              = "ammar_resume"
db_username          = "postgres"
db_multi_az          = true
db_backup_retention  = 30

# ECS (production-ready)
api_cpu           = 512
api_memory        = 1024
api_desired_count = 2
api_min_count     = 2
api_max_count     = 8

# CloudFront
cloudfront_price_class = "PriceClass_100"

# Tags
additional_tags = {
  CostCenter = "production"
}
