# =============================================================================
# Development Environment Configuration
# =============================================================================

project_name = "ammar-resume"
environment  = "dev"
aws_region   = "us-east-1"

# Networking
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]

# Domain (leave empty for CloudFront default domain)
domain_name     = ""
certificate_arn = ""

# Database (minimal for dev)
db_instance_class    = "db.t3.micro"
db_allocated_storage = 20
db_name              = "ammar_resume"
db_username          = "postgres"
db_multi_az          = false
db_backup_retention  = 7

# ECS (minimal for dev)
api_cpu           = 256
api_memory        = 512
api_desired_count = 1
api_min_count     = 1
api_max_count     = 2

# CloudFront
cloudfront_price_class = "PriceClass_100"

# Tags
additional_tags = {
  CostCenter = "development"
}
