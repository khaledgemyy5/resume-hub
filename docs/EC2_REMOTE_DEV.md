# EC2 Remote Development Guide

Run the full stack on AWS EC2 and access it securely from your phone via Termux SSH.

## Prerequisites

- AWS account with EC2 access
- SSH client (Termux on Android, or any terminal)
- Basic familiarity with Linux commands

---

## 1. Create EC2 Instance

### Instance Configuration

| Setting | Recommended Value |
|---------|-------------------|
| AMI | Ubuntu 22.04 LTS |
| Instance Type | t3.small (minimum) or t3.medium |
| Storage | 20 GB gp3 |
| Key Pair | Create new or use existing |

### Security Group Rules

**CRITICAL: Only allow SSH from your IP. Never expose the database or admin publicly.**

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP/32 | SSH access |

⚠️ **DO NOT add rules for ports 3001, 5173, or 5432** - use SSH tunneling instead.

### Launch Steps

1. Go to EC2 Dashboard → Launch Instance
2. Select Ubuntu 22.04 LTS AMI
3. Choose t3.small or larger
4. Configure security group with SSH only
5. Create or select key pair
6. Launch instance
7. Note the public IP address

---

## 2. Connect to EC2

### From Desktop/Laptop

```bash
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### From Termux (Android)

```bash
# Install OpenSSH in Termux
pkg install openssh

# Copy your .pem file to Termux storage
# Then connect:
ssh -i ~/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## 3. Bootstrap the Server

### Option A: Automated Setup

```bash
# Clone the repository first
git clone https://github.com/YOUR_USERNAME/ammar-resume.git
cd ammar-resume

# Run bootstrap script
chmod +x scripts/ec2_bootstrap_ubuntu.sh
./scripts/ec2_bootstrap_ubuntu.sh

# IMPORTANT: Log out and back in for docker group to take effect
exit
# Then reconnect via SSH
```

### Option B: Manual Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Install git (usually pre-installed)
sudo apt install -y git

# Log out and back in
exit
```

---

## 4. Configure Environment

### Create API Environment File

```bash
cd ~/ammar-resume
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```

**Required changes for production-like setup:**

```env
# Server
NODE_ENV=production
PORT=3001

# Database (uses docker-compose internal network)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ammar_resume

# Authentication - USE STRONG VALUES!
JWT_SECRET=generate-a-long-random-string-here-minimum-32-chars
JWT_EXPIRES_IN=7d

# CORS - allow localhost for SSH tunnel access
CORS_ORIGIN=http://localhost:5173

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-very-strong-password-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Create Web Environment File

```bash
cp apps/web/.env.example apps/web/.env
nano apps/web/.env
```

**Required changes:**

```env
# API URL - use localhost for SSH tunnel access
VITE_API_URL=http://localhost:3001

# Data mode - use http to connect to real API
VITE_DATA_MODE=http

# Optional
VITE_ENABLE_ANALYTICS=true
```

### Generate Secure Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate ADMIN_PASSWORD
openssl rand -base64 16
```

---

## 5. Run the Stack

### Start All Services

```bash
cd ~/ammar-resume
chmod +x scripts/ec2_run_stack.sh
./scripts/ec2_run_stack.sh
```

### Verify Services

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f api
docker compose logs -f web
```

### Stop Services

```bash
docker compose down
```

---

## 6. SSH Tunneling (Secure Access)

**This is the key to secure access without opening ports publicly.**

### From Desktop/Laptop

```bash
# Single command to tunnel both web and API
ssh -i /path/to/your-key.pem \
    -L 5173:localhost:5173 \
    -L 3001:localhost:3001 \
    ubuntu@<EC2_PUBLIC_IP>
```

Then open `http://localhost:5173` in your browser.

### From Termux (Android)

```bash
# Create tunnel
ssh -i ~/your-key.pem \
    -L 5173:localhost:5173 \
    -L 3001:localhost:3001 \
    ubuntu@<EC2_PUBLIC_IP>

# Keep this terminal open
# Open Termux:Widget or another terminal to browse
```

Then use a browser to access `http://localhost:5173`.

### Persistent Tunnel with autossh

```bash
# Install autossh (on client machine)
# Ubuntu/Debian:
sudo apt install autossh
# macOS:
brew install autossh
# Termux:
pkg install autossh

# Create persistent tunnel
autossh -M 0 -f -N \
    -i /path/to/your-key.pem \
    -L 5173:localhost:5173 \
    -L 3001:localhost:3001 \
    ubuntu@<EC2_PUBLIC_IP>
```

---

## 7. Update the Stack

When you push new code:

```bash
cd ~/ammar-resume
./scripts/ec2_update_stack.sh
```

This will:
1. Pull latest changes from git
2. Rebuild and restart containers

---

## 8. Termux Workflow

### Initial Setup (One Time)

```bash
# Install packages
pkg update && pkg upgrade
pkg install openssh git autossh

# Setup storage access
termux-setup-storage

# Copy SSH key to Termux
cp /storage/emulated/0/Download/your-key.pem ~/
chmod 600 ~/your-key.pem
```

### Daily Workflow

```bash
# 1. Start SSH tunnel
ssh -i ~/your-key.pem \
    -L 5173:localhost:5173 \
    -L 3001:localhost:3001 \
    ubuntu@<EC2_PUBLIC_IP>

# 2. In another Termux session (or use screen/tmux)
# Access the site at http://localhost:5173

# 3. To update code on EC2
cd ~/ammar-resume
./scripts/ec2_update_stack.sh
```

### Using Screen for Multiple Sessions

```bash
# Start screen
screen

# Start tunnel in first window
# Press Ctrl+A, then C for new window
# Press Ctrl+A, then N to switch windows
```

---

## Security Best Practices

### ⚠️ Critical Security Notes

1. **NEVER expose /admin publicly** - Always use SSH tunnel
2. **NEVER open database port (5432)** to the internet
3. **Use strong passwords** for ADMIN_PASSWORD and JWT_SECRET
4. **Restrict SSH to your IP** in security group
5. **Keep your .pem file secure** - chmod 600

### Recommended Security Enhancements

```bash
# Disable password authentication (SSH key only)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Firewall (UFW)

```bash
# Enable UFW
sudo ufw allow OpenSSH
sudo ufw enable

# Verify - should only show SSH
sudo ufw status
```

---

## Troubleshooting

### Containers Not Starting

```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Check memory
free -m

# Restart Docker
sudo systemctl restart docker
```

### Database Connection Issues

```bash
# Check postgres is healthy
docker compose ps postgres

# View postgres logs
docker compose logs postgres

# Connect to database manually
docker compose exec postgres psql -U postgres -d ammar_resume
```

### SSH Tunnel Not Working

```bash
# Check if ports are in use locally
lsof -i :5173
lsof -i :3001

# Kill existing processes if needed
kill -9 <PID>

# Verify tunnel is active
ssh -v -i ~/your-key.pem \
    -L 5173:localhost:5173 \
    ubuntu@<EC2_PUBLIC_IP>
```

### Permission Denied for Docker

```bash
# Add yourself to docker group
sudo usermod -aG docker $USER

# Apply without logout (temporary)
newgrp docker
```

---

## Cost Optimization

### Stop Instance When Not Using

```bash
# From AWS Console or CLI
aws ec2 stop-instances --instance-ids i-xxxxx

# Start when needed
aws ec2 start-instances --instance-ids i-xxxxx
```

### Use Spot Instances (for dev only)

- Up to 90% cost savings
- May be interrupted (rare for t3.small)
- Good for development, not production

---

## Quick Reference

| Task | Command |
|------|---------|
| Start stack | `./scripts/ec2_run_stack.sh` |
| Stop stack | `docker compose down` |
| Update stack | `./scripts/ec2_update_stack.sh` |
| View logs | `docker compose logs -f` |
| API logs | `docker compose logs -f api` |
| Web logs | `docker compose logs -f web` |
| DB shell | `docker compose exec postgres psql -U postgres` |
| Restart service | `docker compose restart api` |
