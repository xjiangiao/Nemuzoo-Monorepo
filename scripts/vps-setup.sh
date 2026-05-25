#!/bin/bash
# VPS Initial Setup Script
# Run this on your VPS (ubuntu@43.130.60.3) once to set up the medusa deployment environment.
#
# Usage: ssh ubuntu@43.130.60.3 'bash -s' < scripts/vps-setup.sh

set -e

echo "=== Setting up Medusa deployment environment ==="

# Create app directory
sudo mkdir -p /opt/medusa
sudo chown -R $USER:$USER /opt/medusa

# Copy docker-compose.yml (run from your local machine):
# scp docker-compose.yml ubuntu@43.130.60.3:/opt/medusa/

# Create .env file (run from your local machine after creating .env.production):
# scp .env.production ubuntu@43.130.60.3:/opt/medusa/.env

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
  echo "Installing Nginx..."
  sudo apt-get update -y
  sudo apt-get install -y nginx
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
  echo "Installing Certbot..."
  sudo apt-get install -y certbot python3-certbot-nginx
fi

# Copy Nginx configs (run from local):
# scp nginx/admin.nemuzoo.com.conf ubuntu@43.130.60.3:/tmp/
# scp nginx/api.nemuzoo.com.conf ubuntu@43.130.60.3:/tmp/
# ssh ubuntu@43.130.60.3 'sudo mv /tmp/admin.nemuzoo.com.conf /etc/nginx/sites-available/'
# ssh ubuntu@43.130.60.3 'sudo mv /tmp/api.nemuzoo.com.conf /etc/nginx/sites-available/'
# ssh ubuntu@43.130.60.3 'sudo ln -sf /etc/nginx/sites-available/admin.nemuzoo.com.conf /etc/nginx/sites-enabled/'
# ssh ubuntu@43.130.60.3 'sudo ln -sf /etc/nginx/sites-available/api.nemuzoo.com.conf /etc/nginx/sites-enabled/'
# ssh ubuntu@43.130.60.3 'sudo nginx -t && sudo systemctl reload nginx'

# Get SSL certificates
# ssh ubuntu@43.130.60.3 'sudo certbot --nginx -d admin.nemuzoo.com -d api.nemuzoo.com --non-interactive --agree-tos -m your-email@example.com'

# Ensure Docker is running
sudo systemctl enable docker
sudo systemctl start docker

echo "=== VPS setup complete ==="
echo ""
echo "Next steps (run from your local machine):"
echo "  1. scp docker-compose.yml ubuntu@43.130.60.3:/opt/medusa/"
echo "  2. scp .env.production ubuntu@43.130.60.3:/opt/medusa/.env"
echo "  3. scp nginx/*.conf ubuntu@43.130.60.3:/tmp/"
echo "  4. ssh ubuntu@43.130.60.3 'sudo mv /tmp/admin.nemuzoo.com.conf /etc/nginx/sites-available/ && sudo mv /tmp/api.nemuzoo.com.conf /etc/nginx/sites-available/ && sudo ln -sf /etc/nginx/sites-available/admin.nemuzoo.com.conf /etc/nginx/sites-enabled/ && sudo ln -sf /etc/nginx/sites-available/api.nemuzoo.com.conf /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx'"
echo "  5. ssh ubuntu@43.130.60.3 'sudo certbot --nginx -d admin.nemuzoo.com -d api.nemuzoo.com'"
echo "  6. Set up GitHub Secrets (see README section on CI/CD)"
