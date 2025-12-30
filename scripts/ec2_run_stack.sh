#!/bin/bash
#
# EC2 Run Stack Script
# Pulls latest changes and starts the full stack
#
# Usage: ./scripts/ec2_run_stack.sh
#

set -e

echo "=========================================="
echo "Starting Full Stack"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Working directory: $PROJECT_ROOT"
echo ""

# Check if docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Run ec2_bootstrap_ubuntu.sh first."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available."
    exit 1
fi

# Check for required environment files
echo "Step 1: Checking environment files..."

API_ENV="apps/api/.env"
WEB_ENV="apps/web/.env"

if [ ! -f "$API_ENV" ]; then
    print_error "Missing $API_ENV"
    echo ""
    echo "Create it from the example:"
    echo "  cp apps/api/.env.example apps/api/.env"
    echo "  nano apps/api/.env"
    echo ""
    echo "Required variables:"
    echo "  - JWT_SECRET (generate with: openssl rand -base64 32)"
    echo "  - ADMIN_PASSWORD (use a strong password)"
    exit 1
else
    print_status "API environment file found"
fi

if [ ! -f "$WEB_ENV" ]; then
    print_warning "Missing $WEB_ENV - creating from example..."
    if [ -f "apps/web/.env.example" ]; then
        cp apps/web/.env.example "$WEB_ENV"
        print_status "Created $WEB_ENV from example"
    else
        echo "VITE_API_URL=http://localhost:3001" > "$WEB_ENV"
        echo "VITE_DATA_MODE=http" >> "$WEB_ENV"
        print_status "Created $WEB_ENV with defaults"
    fi
else
    print_status "Web environment file found"
fi

# Validate critical API env vars
echo ""
echo "Step 2: Validating environment configuration..."

if grep -q "your-secret-key-change-in-production" "$API_ENV" 2>/dev/null || \
   grep -q "dev-secret" "$API_ENV" 2>/dev/null; then
    print_warning "JWT_SECRET appears to be using a default value!"
    echo "         Generate a secure secret: openssl rand -base64 32"
fi

if grep -q "admin-password" "$API_ENV" 2>/dev/null; then
    print_warning "ADMIN_PASSWORD appears to be using a default value!"
    echo "         Use a strong password for production."
fi

print_status "Environment validation complete"

# Pull latest changes
echo ""
echo "Step 3: Pulling latest changes from git..."
if git pull; then
    print_status "Git pull successful"
else
    print_warning "Git pull failed or not a git repo. Continuing anyway..."
fi

# Build and start containers
echo ""
echo "Step 4: Building and starting containers..."
docker compose up -d --build

# Wait for services to be ready
echo ""
echo "Step 5: Waiting for services to be ready..."
sleep 5

# Check container status
echo ""
echo "Step 6: Checking container status..."
docker compose ps

# Show logs snippet
echo ""
echo "=========================================="
echo -e "${GREEN}Stack is running!${NC}"
echo "=========================================="
echo ""
echo "Access via SSH tunnel:"
echo "  ssh -L 5173:localhost:5173 -L 3001:localhost:3001 ubuntu@<EC2_IP>"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Useful commands:"
echo "  View logs:     docker compose logs -f"
echo "  Stop stack:    docker compose down"
echo "  Update stack:  ./scripts/ec2_update_stack.sh"
echo ""
print_warning "Security reminder: Access /admin only via SSH tunnel!"
echo ""
