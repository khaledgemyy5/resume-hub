#!/bin/bash
#
# EC2 Update Stack Script
# Pulls latest changes and rebuilds containers
#
# Usage: ./scripts/ec2_update_stack.sh
#

set -e

echo "=========================================="
echo "Updating Stack"
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
    print_error "Docker is not installed."
    exit 1
fi

# Pull latest changes
echo "Step 1: Pulling latest changes from git..."
if git pull; then
    print_status "Git pull successful"
else
    print_error "Git pull failed. Check your git configuration."
    exit 1
fi

# Show what changed
echo ""
echo "Recent changes:"
git log --oneline -5
echo ""

# Rebuild and restart containers
echo "Step 2: Rebuilding and restarting containers..."
docker compose up -d --build

# Wait for services
echo ""
echo "Step 3: Waiting for services to restart..."
sleep 5

# Check status
echo ""
echo "Step 4: Checking container status..."
docker compose ps

# Check for any issues
UNHEALTHY=$(docker compose ps --format json 2>/dev/null | grep -c '"Health":"unhealthy"' || echo "0")
if [ "$UNHEALTHY" != "0" ]; then
    print_warning "Some containers are unhealthy. Check logs:"
    echo "  docker compose logs"
else
    print_status "All containers are running"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Update complete!${NC}"
echo "=========================================="
echo ""
echo "View logs: docker compose logs -f"
echo ""
