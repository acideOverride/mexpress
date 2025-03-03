# MontPC CRM Deployment Guide

This document outlines the steps to deploy the MontPC CRM application to a staging environment.

## Prerequisites

- Node.js 16+ installed on the server
- MongoDB 5.0+ installed and running
- Nginx or another web server for serving the frontend
- PM2 or another process manager for running the backend

## Backend Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/montpc/crm.git
   cd crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the packages:
   ```bash
   npm run build
   ```

4. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=staging
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/montpc_crm
   API_BASE_URL=/api
   ```

5. Start the backend server using PM2:
   ```bash
   pm2 start packages/core/dist/index.js --name montpc-crm-api
   ```

6. Configure PM2 to start on system boot:
   ```bash
   pm2 startup
   pm2 save
   ```

## Frontend Deployment

1. Build the frontend:
   ```bash
   cd projects/montpc_crm/frontend
   npm run build
   ```

2. Configure Nginx:
   Create a new Nginx configuration file `/etc/nginx/sites-available/montpc-crm`:
   ```nginx
   server {
       listen 80;
       server_name crm.montpc.staging;

       root /path/to/crm/projects/montpc_crm/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the site:
   ```bash
   ln -s /etc/nginx/sites-available/montpc-crm /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

## Verification Steps

1. Verify the backend API is running:
   ```bash
   curl http://localhost:3000/api/customers
   ```

2. Verify the frontend is accessible:
   Open a browser and navigate to `http://crm.montpc.staging`

3. Test the core functionality:
   - Customer management
   - Repair ticket management
   - Dashboard functionality

## Troubleshooting

### Backend Issues
- Check the PM2 logs: `pm2 logs montpc-crm-api`
- Verify MongoDB connection: `mongo mongodb://localhost:27017/montpc_crm`
- Check environment variables: `pm2 env montpc-crm-api`

### Frontend Issues
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`
- Verify the build files exist: `ls -la /path/to/crm/projects/montpc_crm/frontend/dist`
- Check browser console for JavaScript errors

## Rollback Procedure

If deployment fails, follow these steps to rollback:

1. Stop the new backend:
   ```bash
   pm2 stop montpc-crm-api
   ```

2. Revert to the previous version:
   ```bash
   git checkout <previous-commit>
   npm install
   npm run build
   ```

3. Start the previous version:
   ```bash
   pm2 start packages/core/dist/index.js --name montpc-crm-api
   ```

4. Rebuild and deploy the frontend:
   ```bash
   cd projects/montpc_crm/frontend
   npm run build
   ```

## Maintenance

- Regular backups of the MongoDB database should be scheduled
- Monitor server resources using tools like htop, free, df
- Set up log rotation for application logs