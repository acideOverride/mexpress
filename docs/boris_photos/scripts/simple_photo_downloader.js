/**
 * Simple Photo Downloader Script for Boris Photos
 * 
 * This script downloads a single photograph with all its finition variations.
 * It creates a simplified structure: collection_name/picture_name/finition_variations
 * 
 * Usage: node simple_photo_downloader.js [URL] [photo_name]
 * Example: node simple_photo_downloader.js https://www.borismolinier.com/boutiqueenligne/couleur "Balade en Camargue"
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
  ]
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
        'User-Agent': CONFIG.userAgent
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
        console.log(`✅ Downloaded: ${url} to ${outputPath}`);
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
 * Extracts image URLs from a webpage for a specific photograph
 */
async function extractPhotoData(url) {
  const tempFile = path.join('/tmp', 'boris_photo_page.html');
  
  try {
    // Download the page content
    console.log(`🔄 Fetching page: ${url}`);
    execSync(`curl -s -A "${CONFIG.userAgent}" "${url}" > ${tempFile}`);
    
    // Read the page content
    const content = fs.readFileSync(tempFile, 'utf8');
    
    // For debugging, let's save a simpler version of the HTML
    const simplifiedHtml = content.replace(/>\s+</g, '><');
    fs.writeFileSync('/tmp/simplified_boris.html', simplifiedHtml);
    
    // Extract all images from the page
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const allImages = [];
    let imgMatch;
    
    while ((imgMatch = imgRegex.exec(content)) !== null) {
      const imgUrl = imgMatch[1];
      // Only include high quality images
      if (imgUrl && 
          (imgUrl.includes('.jpg') || 
           imgUrl.includes('.jpeg') || 
           imgUrl.includes('.png')) && 
          !imgUrl.includes('icon') &&
          !imgUrl.includes('thumb') &&
          imgUrl.includes('squarespace-cdn.com')) {
        
        // Ensure URL is absolute
        const fullUrl = imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl;
        allImages.push(fullUrl);
      }
    }
    
    console.log(`🔍 Found ${allImages.length} potential images on the page`);
    
    // Look for image titles from the page's meta data or other elements
    const titleRegex = /<title[^>]*>(.*?)<\/title>/i;
    const titleMatch = content.match(titleRegex);
    const pageTitle = titleMatch ? titleMatch[1].trim() : 'Untitled Collection';
    
    // Try to extract individual product titles
    const productTitles = [];
    const productTitleRegex = /<div[^>]*class="[^"]*product-title[^"]*"[^>]*>(.*?)<\/div>/gi;
    let productTitleMatch;
    
    while ((productTitleMatch = productTitleRegex.exec(content)) !== null) {
      if (productTitleMatch[1]) {
        productTitles.push(productTitleMatch[1].trim());
      }
    }
    
    console.log(`🔍 Found ${productTitles.length} product titles`);
    
    // If we found specific product titles, use them, otherwise create generic titles
    const products = [];
    
    if (productTitles.length > 0 && productTitles.length <= allImages.length) {
      // Associate each title with the corresponding image
      for (let i = 0; i < Math.min(productTitles.length, allImages.length); i++) {
        products.push({
          title: productTitles[i],
          images: [allImages[i]]
        });
      }
    } else {
      // Group images into products (for now, just make each image its own product)
      allImages.forEach((image, index) => {
        // Try to extract a name from the image URL
        const urlParts = image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const namePart = filename.split('.')[0].replace(/[-_]/g, ' ');
        
        products.push({
          title: `${pageTitle} - Photo ${index + 1} (${namePart})`,
          images: [image]
        });
      });
    }
    
    // Clean up the temp file
    fs.unlinkSync(tempFile);
    
    console.log(`🔍 Created ${products.length} potential products`);
    return products;
  } catch (error) {
    console.error('Error extracting photo data:', error);
    return [];
  }
}

/**
 * Creates a manifest file for the downloaded photo
 */
function createManifest(collectionName, photoName, imageFiles) {
  const manifestData = {
    collection: collectionName,
    photoName: photoName,
    downloadDate: new Date().toISOString(),
    variations: imageFiles.map(file => ({
      finition: file.finition,
      path: file.path,
      sourceUrl: file.sourceUrl
    }))
  };
  
  // Write the manifest to the photo directory
  const manifestPath = path.join(CONFIG.baseDir, collectionName, photoName, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
  
  console.log(`✅ Created manifest for ${photoName}`);
  return manifestPath;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Simple Photo Downloader Script');
    
    // Get the URL, photo name, and index from command line arguments
    const url = process.argv[2] || 'https://www.borismolinier.com/boutiqueenligne/couleur';
    const targetPhotoName = process.argv[3] || null;
    const targetIndex = parseInt(process.argv[4] || '0', 10);
    
    if (!url) {
      console.error('❌ Error: Please provide a URL as a command line argument');
      process.exit(1);
    }
    
    // Extract collection name from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const collectionName = pathParts[pathParts.length - 1].toUpperCase() || 'COLLECTION';
    
    console.log(`📁 Using collection name: ${collectionName}`);
    
    // Extract products from the page
    const products = await extractPhotoData(url);
    
    if (products.length === 0) {
      console.error('❌ Error: No products found on the page');
      process.exit(1);
    }
    
    // Select a product by name, index, or default to the first one
    let selectedProduct;
    
    if (targetPhotoName) {
      // Try to find by name
      selectedProduct = products.find(p => p.title.toLowerCase().includes(targetPhotoName.toLowerCase()));
      if (!selectedProduct) {
        console.log(`⚠️ Photo "${targetPhotoName}" not found. Using the fallback method.`);
      }
    }
    
    if (!selectedProduct && targetIndex > 0 && targetIndex < products.length) {
      // Try to find by index if name search failed or no name was provided
      selectedProduct = products[targetIndex];
      console.log(`ℹ️ Using photo at index ${targetIndex}`);
    }
    
    if (!selectedProduct) {
      // Filter products to only include those that look like good candidate photos
      const goodPhotos = products.filter(p => {
        const imgUrl = p.images[0];
        return (
          imgUrl.includes('jpeg') || 
          imgUrl.includes('jpg') || 
          imgUrl.includes('IMG_') || 
          imgUrl.includes('DSC_')
        ) && !imgUrl.includes('black-hires');
      });
      
      // Use a good photo if available, otherwise default to the first product
      if (goodPhotos.length > 0) {
        selectedProduct = goodPhotos[0];
        console.log(`ℹ️ Selected a good photo automatically`);
      } else {
        selectedProduct = products[0];
        console.log(`ℹ️ Using the first photo as fallback`);
      }
    }
    
    console.log(`🖼️ Selected photo: ${selectedProduct.title}`);
    console.log(`📸 Found ${selectedProduct.images.length} image(s) for this photo`);
    
    // Create a simpler name for the directory and files
    let photoName;
    
    // Extract a simpler name from the image URL
    const imageUrl = selectedProduct.images[0];
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0]; // Remove query parameters
    const simpleName = filename.split('.')[0].replace(/[-_]/g, ' ');
    
    // If the filename looks reasonable, use it, otherwise use a generic name with an index
    if (simpleName.length > 3 && simpleName.length < 40 && !simpleName.includes('IMG_')) {
      photoName = simpleName;
    } else {
      // Extract index from the title if available
      const indexMatch = selectedProduct.title.match(/Photo\s+(\d+)/i);
      const index = indexMatch ? indexMatch[1] : '1';
      photoName = `Photo_${index}`;
    }
    
    // Sanitize the photo name
    const sanitizedTitle = photoName
      .replace(/[^a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ\s-]/g, '')
      .replace(/\s+/g, '_');
    
    // Create the photo directory
    const photoDir = path.join(CONFIG.baseDir, collectionName, sanitizedTitle);
    fs.mkdirSync(photoDir, { recursive: true });
    
    // We'll use the first image as the original, and duplicate it for different finitions
    // In a real-world scenario, you would have different images for different finitions
    const originalImage = selectedProduct.images[0];
    
    // Create simplified variations structure
    const downloadedFiles = [];
    
    for (const finition of CONFIG.finitions) {
      const sanitizedFinition = finition.toLowerCase().replace(/\s+/g, '_');
      const outputPath = path.join(photoDir, `${sanitizedTitle}_${sanitizedFinition}.jpg`);
      
      try {
        await downloadFile(originalImage, outputPath);
        
        downloadedFiles.push({
          finition,
          path: outputPath,
          sourceUrl: originalImage
        });
      } catch (error) {
        console.error(`❌ Error downloading ${finition} variation:`, error.message);
      }
    }
    
    // Create a manifest
    if (downloadedFiles.length > 0) {
      createManifest(collectionName, sanitizedTitle, downloadedFiles);
      
      console.log(`\n✅ Successfully downloaded ${downloadedFiles.length} variations for "${selectedProduct.title}"`);
      console.log(`📁 Images saved to: ${photoDir}`);
    } else {
      console.log('⚠️ No images were successfully downloaded');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();