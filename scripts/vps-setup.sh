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

# Create env files (run from your local machine after creating them):
# scp .env.production ubuntu@43.130.60.3:/opt/medusa/.env.production
# scp .env.staging ubuntu@43.130.60.3:/opt/medusa/.env.staging

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
# scp nginx/*.conf ubuntu@43.130.60.3:/tmp/
# ssh ubuntu@43.130.60.3 'sudo mv /tmp/*.conf /etc/nginx/sites-available/'
# ssh ubuntu@43.130.60.3 'for site in admin.nemuzoo.com api.nemuzoo.com admin-staging.nemuzoo.com api-staging.nemuzoo.com; do sudo ln -sf /etc/nginx/sites-available/$site.conf /etc/nginx/sites-enabled/; done'
# ssh ubuntu@43.130.60.3 'sudo nginx -t && sudo systemctl reload nginx'

# Get SSL certificates
# ssh ubuntu@43.130.60.3 'sudo certbot --nginx -d admin.nemuzoo.com -d api.nemuzoo.com -d admin-staging.nemuzoo.com -d api-staging.nemuzoo.com --non-interactive --agree-tos -m your-email@example.com'

# Ensure Docker is running
sudo systemctl enable docker
sudo systemctl start docker

echo "=== VPS setup complete ==="
echo ""
echo "Next steps (run from your local machine):"
echo "  1. scp docker-compose.yml ubuntu@43.130.60.3:/opt/medusa/"
echo "  2. scp .env.production ubuntu@43.130.60.3:/opt/medusa/.env.production"
echo "  3. scp .env.staging ubuntu@43.130.60.3:/opt/medusa/.env.staging"
echo "  4. scp nginx/*.conf ubuntu@43.130.60.3:/tmp/"
echo "  5. ssh ubuntu@43.130.60.3 'sudo mv /tmp/*.conf /etc/nginx/sites-available/ && for site in admin.nemuzoo.com api.nemuzoo.com admin-staging.nemuzoo.com api-staging.nemuzoo.com; do sudo ln -sf /etc/nginx/sites-available/\$site.conf /etc/nginx/sites-enabled/; done && sudo nginx -t && sudo systemctl reload nginx'"
echo "  6. ssh ubuntu@43.130.60.3 'sudo certbot --nginx -d admin.nemuzoo.com -d api.nemuzoo.com -d admin-staging.nemuzoo.com -d api-staging.nemuzoo.com'"
echo "  7. Set up GitHub production and staging environments with separate secrets and variables."
