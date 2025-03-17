# MontPC.com Website Deployment

This directory contains scripts and configuration files for deploying the MontPC.com website to production.

## Copy Script

The `copy_to_production.sh` script is an interim solution that copies the static website from the mock directory to the production server directory:

```bash
./copy_to_production.sh
```

This copies content from `/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr` to `/var/www/montpc.com`.

## Nginx Configuration

The `montpc.com.conf` file contains the Nginx configuration for the website. Key features:

- Static website serving
- Cache headers for assets
- Security headers
- Commented section for future API backend on port 9701

### Port Allocation

Following the mExpress API standards, the contact form backend will use port 9701, which is reserved for MontPC.com website services.

## Contact Form Backend

The contact form will eventually be powered by an Express.js backend running on port 9701. This will be implemented as part of the Email Service shared component that uses Resend.com.

### Integration Steps

1. Implement the shared Email Service component (port 9002)
2. Create the Contact Form API for MontPC.com (port 9701)
3. Uncomment the API proxy section in the Nginx configuration
4. Update the frontend form to submit to the API endpoint

## Deployment Instructions

1. Run the copy script to update the static website:
   ```bash
   /opt/mExpress/docs/montpc_com/.scripts/copy_to_production.sh
   ```

2. Set up Let's Encrypt SSL certificates:
   ```bash
   # Create directory for ACME challenges
   sudo mkdir -p /var/www/letsencrypt
   
   # Install certbot if not already installed
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain certificates (use --staging flag for testing)
   sudo certbot certonly --webroot -w /var/www/letsencrypt -d montpc.com -d www.montpc.com
   ```

3. Deploy the Nginx configuration:
   ```bash
   sudo cp /opt/mExpress/docs/montpc_com/.scripts/montpc.com.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/montpc.com.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Set up automatic SSL renewal:
   ```bash
   # Test renewal process
   sudo certbot renew --dry-run
   
   # Renewal is handled by a systemd timer automatically installed with certbot
   sudo systemctl status certbot.timer
   ```

## Future Plans

This interim solution will be replaced with a more robust deployment process as part of the full website implementation.