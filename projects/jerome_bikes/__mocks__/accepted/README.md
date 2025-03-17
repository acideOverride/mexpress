# Jerome Bikes Website

## Project Overview
This directory contains the mockups and frontend components for the Jerome Bikes website, a bike rental and reservation management system.

## Directory Structure
- `/frontend/` - Contains all frontend files
  - `/components/` - UI components organized by section
    - `/customer-portal/` - Customer-facing interface
      - `future-portal-fr.html` - Main homepage for customers (French)
      - `/bike-listing/` - Bike catalog section
        - `bikes-listing-fr.html` - Bike catalog page (French)
    - `/admin-dashboard/` - Admin interface for staff
      - `dashboard-mockup-fr.html` - Admin dashboard (French)
  - `/img/` - Images and assets
  - `/scripts/` - JavaScript files
  - `/styles/` - CSS files that haven't been moved to component directories

## Main Entry Points
1. **Customer Portal (Homepage)**: `/frontend/components/customer-portal/future-portal-fr.html`
   - This is the main landing page for customers
   - Contains bike rental introduction and search functionality

2. **Bike Listing**: `/frontend/components/customer-portal/bike-listing/bikes-listing-fr.html`
   - Displays the catalog of available bikes
   - Includes filtering and sorting options

3. **Admin Dashboard**: `/frontend/components/admin-dashboard/dashboard-mockup-fr.html`
   - Staff interface for managing rentals and inventory

## CSS Organization
- Each component has its own CSS file in the same directory as the HTML
- Common styles are shared through imports
- No inline styles are used (all moved to external CSS files)

## Deployment
To deploy the website to the web server:
1. Run the deployment script: `./deploy.sh`
2. The script will copy the frontend files to `/var/www/velos.montpc.com/`
3. Access the website at `http://velos.montpc.com/`

## URL Structure After Deployment
- Homepage: `http://velos.montpc.com/components/customer-portal/future-portal-fr.html`
- Bike Catalog: `http://velos.montpc.com/components/customer-portal/bike-listing/bikes-listing-fr.html`
- Admin Dashboard: `http://velos.montpc.com/components/admin-dashboard/dashboard-mockup-fr.html`

For nginx configuration, you may want to create redirects from root to the main customer portal page.