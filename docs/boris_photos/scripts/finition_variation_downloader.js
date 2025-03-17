/**
 * Finition Variation Downloader for Boris Photos
 * 
 * This script attempts to download the different visual variations 
 * of a photo based on finition type by simulating browser interactions.
 * 
 * Usage: node finition_variation_downloader.js [URL] [photo_name]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { createWriteStream } = require('fs');

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  finitions: [
    'original',
    'Dibond', 
    'Plexi', 
    'Dibond avec cadre alu', 
    'Dibond avec caisse américaine', 
    'Plexi avec cadre alu', 
    'Plexi avec caisse américaine'
  ],
  // Add sizes which might be used to find variations
  sizes: ['30x40', '40x60', '60x90', '80x120', '100x150']
};

/**
 * Downloads a file from a URL to a specified path
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Setup the request with proper headers
    const options = {
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Referer': 'https://www.borismolinier.com/'
      }
    };

    const file = createWriteStream(outputPath);
    
    https.get(url, options, (response) => {
      // Check if the response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      // Pipe the response to the file
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(outputPath)}`);
        resolve(outputPath);
      });
    }).on('error', (err) => {
      // Clean up the file in case of an error
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

/**
 * Extracts detail page URLs from collection page
 */
async function extractProductLinks(url) {
  const tempFile = path.join('/tmp', 'boris_collection_page.html');
  
  try {
    // Download the page content
    console.log(`🔄 Fetching collection page: ${url}`);
    execSync(`curl -s -A "${CONFIG.userAgent}" "${url}" > ${tempFile}`);
    
    // Read the page content
    const content = fs.readFileSync(tempFile, 'utf8');
    
    // Find product links
    const productLinkRegex = /<a[^>]+href="([^"]+)"[^>]*class="[^"]*product-title[^"]*"[^>]*>/g;
    const productLinks = [];
    let linkMatch;
    
    while ((linkMatch = productLinkRegex.exec(content)) !== null) {
      const link = linkMatch[1];
      // Make sure it's a full URL
      const fullLink = link.startsWith('http') ? link : `https://www.borismolinier.com${link}`;
      productLinks.push(fullLink);
    }
    
    // If traditional method failed, try another approach
    if (productLinks.length === 0) {
      const altLinkRegex = /<a[^>]+href="([^"]+\/boutiqueenligne\/[^"]+\/[^"]+)"[^>]*>/g;
      while ((linkMatch = altLinkRegex.exec(content)) !== null) {
        const link = linkMatch[1];
        // Filter out links that aren't product pages
        if (link.includes('/boutiqueenligne/') && 
            !link.endsWith('/boutiqueenligne/') &&
            !link.includes('category')) {
          const fullLink = link.startsWith('http') ? link : `https://www.borismolinier.com${link}`;
          if (!productLinks.includes(fullLink)) {
            productLinks.push(fullLink);
          }
        }
      }
    }
    
    // Clean up the temp file
    fs.unlinkSync(tempFile);
    
    console.log(`🔍 Found ${productLinks.length} product links`);
    return productLinks;
  } catch (error) {
    console.error('Error extracting product links:', error);
    return [];
  }
}

/**
 * Extracts different image variations from a product detail page
 */
async function extractProductVariations(productUrl) {
  const tempFile = path.join('/tmp', 'boris_product_page.html');
  
  try {
    // Download the page content
    console.log(`🔄 Fetching product page: ${productUrl}`);
    execSync(`curl -s -A "${CONFIG.userAgent}" "${productUrl}" > ${tempFile}`);
    
    // Read the page content
    const content = fs.readFileSync(tempFile, 'utf8');
    
    // Extract product title
    const titleRegex = /<h1[^>]*class="[^"]*ProductItem-details-title[^"]*"[^>]*>(.*?)<\/h1>/s;
    const titleMatch = content.match(titleRegex);
    const productTitle = titleMatch ? titleMatch[1].trim() : 'Untitled Product';
    
    console.log(`📷 Product: ${productTitle}`);
    
    // Extract all images
    const imgRegex = /<img[^>]+data-src="([^"]+)"[^>]*>/g;
    const images = new Set();
    let imgMatch;
    
    while ((imgMatch = imgRegex.exec(content)) !== null) {
      const imgUrl = imgMatch[1];
      if (imgUrl && (imgUrl.includes('.jpg') || imgUrl.includes('.jpeg') || imgUrl.includes('.png'))) {
        images.add(imgUrl);
      }
    }
    
    // Try to find data-image attributes which often contain highest quality images
    const dataImgRegex = /<img[^>]+data-image="([^"]+)"[^>]*>/g;
    while ((imgMatch = dataImgRegex.exec(content)) !== null) {
      const imgUrl = imgMatch[1];
      if (imgUrl && (imgUrl.includes('.jpg') || imgUrl.includes('.jpeg') || imgUrl.includes('.png'))) {
        images.add(imgUrl);
      }
    }
    
    // Also check for src attributes directly
    const srcImgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    while ((imgMatch = srcImgRegex.exec(content)) !== null) {
      const imgUrl = imgMatch[1];
      if (imgUrl && 
          (imgUrl.includes('.jpg') || imgUrl.includes('.jpeg') || imgUrl.includes('.png')) &&
          !imgUrl.includes('icon') && 
          !imgUrl.includes('thumb')) {
        images.add(imgUrl);
      }
    }
    
    // Extract data from structured JSON if available (often contains variant info)
    const jsonDataRegex = /<script[^>]+type="application\/json"[^>]*>(.*?)<\/script>/gs;
    const jsonMatches = content.matchAll(jsonDataRegex);
    
    let structuredData = [];
    for (const match of jsonMatches) {
      try {
        const jsonData = JSON.parse(match[1]);
        if (jsonData && typeof jsonData === 'object') {
          structuredData.push(jsonData);
        }
      } catch (e) {
        // Not valid JSON or not the data we're looking for
      }
    }
    
    // Clean up the temp file
    fs.unlinkSync(tempFile);
    
    // Format the extracted images
    const imageArray = Array.from(images);
    
    console.log(`🔍 Found ${imageArray.length} potential image variations`);
    
    // Process the structure data to look for variations
    let variationMap = {};
    
    // Adding the base image to variations
    if (imageArray.length > 0) {
      variationMap.original = imageArray[0];
    }
    
    // Try to intelligently map variations by analyzing the image URLs and structured data
    CONFIG.finitions.forEach(finition => {
      if (finition === 'original') return; // Already set
      
      const sanitizedFinition = finition.toLowerCase().replace(/\s+/g, '_');
      
      // See if we can find a matching variation in the URLs
      const matchingImage = imageArray.find(img => {
        // Look for variations in the URL that might indicate finition
        const lowerImgUrl = img.toLowerCase();
        const finitionWords = finition.toLowerCase().split(' ');
        
        return finitionWords.some(word => 
          lowerImgUrl.includes(word) || 
          lowerImgUrl.includes(word.replace(/[éèêë]/g, 'e'))
        );
      });
      
      if (matchingImage) {
        variationMap[sanitizedFinition] = matchingImage;
      } else {
        // If we can't find a specific match, use a different image if available
        const index = CONFIG.finitions.indexOf(finition);
        if (index < imageArray.length) {
          variationMap[sanitizedFinition] = imageArray[index];
        } else {
          // Fall back to original
          variationMap[sanitizedFinition] = imageArray[0];
        }
      }
    });
    
    return {
      title: productTitle,
      url: productUrl,
      variations: variationMap
    };
  } catch (error) {
    console.error('Error extracting product variations:', error);
    return null;
  }
}

/**
 * Creates a manifest file for the downloaded photo
 */
function createManifest(collectionName, photoName, variationMap) {
  const manifestData = {
    collection: collectionName,
    photoName: photoName,
    downloadDate: new Date().toISOString(),
    productUrl: variationMap.productUrl,
    variations: []
  };
  
  Object.keys(variationMap.files).forEach(finition => {
    manifestData.variations.push({
      finition: finition,
      path: variationMap.files[finition],
      sourceUrl: variationMap.urls[finition]
    });
  });
  
  // Write the manifest to the photo directory
  const manifestPath = path.join(CONFIG.baseDir, collectionName, photoName, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
  
  console.log(`✅ Created manifest for ${photoName}`);
  return manifestPath;
}

/**
 * Downloads all variations of a specific product
 */
async function downloadProductVariations(productData, collectionName) {
  if (!productData) {
    console.error('❌ No product data available');
    return null;
  }
  
  // Sanitize the title for use as a directory name
  const sanitizedTitle = productData.title
    .replace(/[^a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ\s-]/g, '')
    .replace(/\s+/g, '_');
    
  // Create directory for this product
  const productDir = path.join(CONFIG.baseDir, collectionName, sanitizedTitle);
  fs.mkdirSync(productDir, { recursive: true });
  
  console.log(`🖼️ Downloading variations for "${productData.title}"...`);
  
  const downloadedFiles = {
    urls: {},
    files: {}
  };
  
  // Track the product URL for the manifest
  downloadedFiles.productUrl = productData.url;
  
  // Download each variation
  for (const [finition, imageUrl] of Object.entries(productData.variations)) {
    const outputPath = path.join(productDir, `${sanitizedTitle}_${finition}.jpg`);
    
    try {
      await downloadFile(imageUrl, outputPath);
      
      downloadedFiles.urls[finition] = imageUrl;
      downloadedFiles.files[finition] = outputPath;
    } catch (error) {
      console.error(`❌ Error downloading ${finition} variation:`, error.message);
    }
  }
  
  return {
    title: sanitizedTitle,
    downloads: downloadedFiles
  };
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Finition Variation Downloader');
    
    // Get the URL and optional photo name
    const url = process.argv[2] || 'https://www.borismolinier.com/boutiqueenligne/couleur';
    const targetPhotoName = process.argv[3] || null;
    
    if (!url) {
      console.error('❌ Error: Please provide a URL as a command line argument');
      process.exit(1);
    }
    
    // Extract collection name from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const collectionName = pathParts[pathParts.length - 1].toUpperCase() || 'COLLECTION';
    
    console.log(`📁 Using collection name: ${collectionName}`);
    
    // Create the collection directory
    const collectionDir = path.join(CONFIG.baseDir, collectionName);
    fs.mkdirSync(collectionDir, { recursive: true });
    
    // Get product links from the collection page
    const productLinks = await extractProductLinks(url);
    
    if (productLinks.length === 0) {
      console.error('❌ Error: No product links found on the collection page');
      process.exit(1);
    }
    
    // Choose which product to download
    let targetProductLink;
    
    if (targetPhotoName) {
      // Find a product that matches the requested name
      const productIndex = parseInt(targetPhotoName, 10);
      
      if (!isNaN(productIndex) && productIndex > 0 && productIndex <= productLinks.length) {
        // If the target is a valid number, use it as an index
        targetProductLink = productLinks[productIndex - 1];
        console.log(`🔍 Selected product #${productIndex} of ${productLinks.length}`);
      } else {
        // Otherwise try to match the name
        console.log(`🔍 Looking for product with name: ${targetPhotoName}`);
        // We'll need to fetch each product page to check names
        for (const link of productLinks) {
          const productData = await extractProductVariations(link);
          if (productData && productData.title.toLowerCase().includes(targetPhotoName.toLowerCase())) {
            targetProductLink = link;
            console.log(`🔍 Found matching product: "${productData.title}"`);
            break;
          }
        }
      }
    }
    
    // If no specific product was found or requested, use the first one
    if (!targetProductLink) {
      targetProductLink = productLinks[0];
      console.log(`🔍 Using first product: ${targetProductLink}`);
    }
    
    // Extract variations for the selected product
    const productData = await extractProductVariations(targetProductLink);
    
    // Download all variations
    const downloadResult = await downloadProductVariations(productData, collectionName);
    
    if (downloadResult) {
      // Create manifest
      createManifest(collectionName, downloadResult.title, downloadResult.downloads);
      
      console.log(`\n✅ Successfully downloaded variations for "${productData.title}"`);
      console.log(`📁 Images saved to: ${path.join(CONFIG.baseDir, collectionName, downloadResult.title)}`);
    } else {
      console.error('❌ Error: Failed to download product variations');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();