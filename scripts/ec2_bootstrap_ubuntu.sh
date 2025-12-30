#!/bin/bash
#
# EC2 Bootstrap Script for Ubuntu 22.04
# Installs Docker, Docker Compose, and Git
#
# Usage: ./scripts/ec2_bootstrap_ubuntu.sh
#

set -e

echo "=========================================="
echo "EC2 Bootstrap Script for Ubuntu 22.04"
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

# Check if running on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
    print_warning "This script is designed for Ubuntu. Proceed with caution."
fi

echo "Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_status "System packages updated"

echo ""
echo "Step 2: Installing Docker..."
if command -v docker &> /dev/null; then
    print_status "Docker is already installed"
else
    curl -fsSL https://get.docker.com | sudo sh
    print_status "Docker installed"
fi

echo ""
echo "Step 3: Installing Docker Compose plugin..."
if docker compose version &> /dev/null; then
    print_status "Docker Compose is already installed"
else
    sudo apt install -y docker-compose-plugin
    print_status "Docker Compose installed"
fi

echo ""
echo "Step 4: Installing Git..."
if command -v git &> /dev/null; then
    print_status "Git is already installed"
else
    sudo apt install -y git
    print_status "Git installed"
fi

echo ""
echo "Step 5: Enabling Docker service..."
sudo systemctl enable docker
sudo systemctl start docker
print_status "Docker service enabled and started"

echo ""
echo "Step 6: Adding current user to docker group..."
if groups $USER | grep -q docker; then
    print_status "User already in docker group"
else
    sudo usermod -aG docker $USER
    print_status "User added to docker group"
fi

echo ""
echo "Step 7: Installing additional utilities..."
sudo apt install -y \
    htop \
    curl \
    wget \
    nano \
    vim \
    tmux \
    screen \
    unzip
print_status "Utilities installed"

echo ""
echo "=========================================="
echo -e "${GREEN}Bootstrap complete!${NC}"
echo "=========================================="
echo ""
echo "Installed versions:"
echo "  Docker:         $(docker --version 2>/dev/null || echo 'not available yet')"
echo "  Docker Compose: $(docker compose version 2>/dev/null || echo 'not available yet')"
echo "  Git:            $(git --version)"
echo ""
print_warning "IMPORTANT: You must log out and back in for docker group changes to take effect!"
echo ""
echo "Next steps:"
echo "  1. Log out: exit"
echo "  2. Log back in via SSH"
echo "  3. Clone your repo: git clone <your-repo-url>"
echo "  4. Set up environment files"
echo "  5. Run: ./scripts/ec2_run_stack.sh"
echo ""
