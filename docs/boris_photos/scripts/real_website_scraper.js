/**
 * Real Boris Molinier Website Scraper
 * 
 * This script uses Puppeteer to actually scrape the Boris Molinier website.
 * It extracts photo information from the COULEUR collection and saves it.
 * 
 * Prerequisites:
 * npm install puppeteer fs-extra path
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  collectionUrl: 'https://www.borismolinier.com/boutiqueenligne/couleur',
  outputFile: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE/scraped_data.json'
};

/**
 * Main scraping function
 */
async function scrapeWebsite() {
  console.log('🚀 Starting website scraper');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log(`🔄 Opening page: ${CONFIG.collectionUrl}`);
    const page = await browser.newPage();
    await page.goto(CONFIG.collectionUrl, { waitUntil: 'networkidle2' });
    
    // Wait for the content to load
    await page.waitForSelector('.ProductList-grid');
    
    // Extract all photo items
    const photos = await page.evaluate(() => {
      const items = document.querySelectorAll('.ProductList-item');
      
      return Array.from(items).map(item => {
        // Get the title
        const titleElement = item.querySelector('.ProductItem-title');
        const title = titleElement ? titleElement.textContent.trim() : 'Unknown';
        
        // Get the description
        const descElement = item.querySelector('.ProductItem-details-excerpt');
        const description = descElement ? descElement.textContent.trim() : '';
        
        // Get the image URL
        const imgElement = item.querySelector('.ProductItem-gallery-slides-item-image');
        const imageUrl = imgElement ? imgElement.getAttribute('data-src') : '';
        
        // Get the price
        const priceElement = item.querySelector('.ProductItem-details-price');
        const price = priceElement ? priceElement.textContent.trim() : 'Price not available';
        
        // Get the product URL for more details
        const linkElement = item.querySelector('a.ProductItem-title-link');
        const productUrl = linkElement ? linkElement.href : '';
        
        return {
          title,
          description,
          imageUrl,
          price,
          productUrl,
          // We'll need to visit each product page to get available sizes
          sizes: ['100x50', '120x60', '150x75', '180x90'] // Default sizes, will need to be updated
        };
      });
    });
    
    console.log(`✅ Scraped ${photos.length} photos from the collection page`);
    
    // For each photo, visit its page to get more details
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      if (photo.productUrl) {
        console.log(`🔄 Visiting product page: ${photo.title}`);
        await page.goto(photo.productUrl, { waitUntil: 'networkidle2' });
        
        // Extract sizes and other details from the product page
        const details = await page.evaluate(() => {
          // This selector would need to be adjusted based on the actual website structure
          const sizeOptions = document.querySelectorAll('.product-variants option');
          
          const sizes = Array.from(sizeOptions).map(option => option.textContent.trim());
          
          // Get a better description if available
          const fullDescElement = document.querySelector('.ProductItem-details-excerpt');
          const fullDescription = fullDescElement ? fullDescElement.textContent.trim() : '';
          
          // Get a better image URL if available
          const mainImageElement = document.querySelector('.ProductItem-gallery-slides-item-image');
          const mainImageUrl = mainImageElement ? mainImageElement.getAttribute('data-src') : '';
          
          return {
            sizes: sizes.length > 0 ? sizes : ['100x50', '120x60', '150x75', '180x90'],
            fullDescription: fullDescription,
            mainImageUrl: mainImageUrl
          };
        });
        
        // Update the photo with additional details
        if (details.sizes.length > 0) {
          photo.sizes = details.sizes;
        }
        
        if (details.fullDescription) {
          photo.description = details.fullDescription;
        }
        
        if (details.mainImageUrl) {
          photo.imageUrl = details.mainImageUrl;
        }
        
        console.log(`✅ Updated details for: ${photo.title}`);
      }
    }
    
    // Save the scraped data
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify({ COULEURS: photos }, null, 2));
    console.log(`✅ Saved scraped data to ${CONFIG.outputFile}`);
    
    return { COULEURS: photos };
  } catch (error) {
    console.error('❌ Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Ensure the output directory exists
    fs.ensureDirSync(path.dirname(CONFIG.outputFile));
    
    // Scrape the website
    const scrapedData = await scrapeWebsite();
    
    console.log('✅ Scraping completed successfully');
    return scrapedData;
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
} else {
  // Export for use in other scripts
  module.exports = { scrapeWebsite };
}
