# =============================================================================
# Output Values
# =============================================================================

# -----------------------------------------------------------------------------
# VPC Outputs
# -----------------------------------------------------------------------------

output "vpc_id" {
  description = "VPC ID"
  value       = "TODO: module.vpc.vpc_id"
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = "TODO: module.vpc.public_subnet_ids"
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = "TODO: module.vpc.private_subnet_ids"
}

# -----------------------------------------------------------------------------
# Web / CloudFront Outputs
# -----------------------------------------------------------------------------

output "web_bucket_name" {
  description = "S3 bucket name for web assets"
  value       = "TODO: module.s3_cloudfront.bucket_name"
}

output "web_bucket_arn" {
  description = "S3 bucket ARN"
  value       = "TODO: module.s3_cloudfront.bucket_arn"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = "TODO: module.s3_cloudfront.distribution_id"
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = "TODO: module.s3_cloudfront.domain_name"
}

output "web_endpoint" {
  description = "Web application URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "TODO: https://d1234567890.cloudfront.net"
}

# -----------------------------------------------------------------------------
# API / ECS Outputs
# -----------------------------------------------------------------------------

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = "TODO: module.ecr.repository_url"
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = "TODO: module.ecs.cluster_name"
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = "TODO: module.ecs.service_name"
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = "TODO: module.ecs.alb_dns_name"
}

output "api_endpoint" {
  description = "API endpoint URL"
  value       = var.domain_name != "" ? "https://${var.api_subdomain}.${var.domain_name}" : "TODO: https://alb-1234567890.us-east-1.elb.amazonaws.com"
}

# -----------------------------------------------------------------------------
# Database Outputs
# -----------------------------------------------------------------------------

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = "TODO: module.rds.endpoint"
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = 5432
}

output "database_url" {
  description = "Full database connection URL (for migrations)"
  value       = "TODO: postgresql://${var.db_username}:PASSWORD@endpoint:5432/${var.db_name}"
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Security Outputs
# -----------------------------------------------------------------------------

output "api_security_group_id" {
  description = "Security group ID for API tasks"
  value       = "TODO: module.security.api_sg_id"
}

output "rds_security_group_id" {
  description = "Security group ID for RDS"
  value       = "TODO: module.security.rds_sg_id"
}

output "alb_security_group_id" {
  description = "Security group ID for ALB"
  value       = "TODO: module.security.alb_sg_id"
}
