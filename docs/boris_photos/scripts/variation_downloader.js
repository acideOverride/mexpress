/**
 * Variation Downloader for Boris Photos
 * 
 * This script downloads photos with actual different finition variations
 * based on the variations documented in VARIATIONS.md
 * 
 * Usage: node variation_downloader.js [photo_name]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  variations: {
    'original': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219236704-MWI1BIKO8QSQIL52QIT9/IMG_E37735CCBB9D-1.jpeg?format=2500w',
    'dibond': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219507752-5S1AIT1BGMPWZO4VEZ7R/Les+Voiles+de+Saint-Tropez+2021%C2%A9Boris+Molinier-4.jpg?format=2500w',
    'plexi': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219507752-5S1AIT1BGMPWZO4VEZ7R/Les+Voiles+de+Saint-Tropez+2021%C2%A9Boris+Molinier-4.jpg?format=2500w',
    'dibond_avec_cadre_alu': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219510850-6KU3GWKIS5BCW8Q2RGLR/echap%C3%A9e-cadre-alu-boris-molinier.jpg?format=2500w',
    'plexi_avec_cadre_alu': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219510850-6KU3GWKIS5BCW8Q2RGLR/echap%C3%A9e-cadre-alu-boris-molinier.jpg?format=2500w',
    'dibond_avec_caisse_américaine': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219510843-4NYES5DUINHJQR1NO2YQ/echap%C3%A9e-caisse-americaine-boris-molinier.jpg?format=2500w',
    'plexi_avec_caisse_américaine': 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219510843-4NYES5DUINHJQR1NO2YQ/echap%C3%A9e-caisse-americaine-boris-molinier.jpg?format=2500w'
  }
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
 * Downloads all variations for a single photo
 */
async function downloadPhotoVariations(photoName, collectionName) {
  // Sanitize the photo name for use as a directory name
  const sanitizedTitle = photoName
    .replace(/[^a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ\s-]/g, '')
    .replace(/\s+/g, '_');
    
  // Create directory for this photo
  const photoDir = path.join(CONFIG.baseDir, collectionName, sanitizedTitle);
  fs.mkdirSync(photoDir, { recursive: true });
  
  console.log(`🖼️ Downloading variations for "${photoName}"...`);
  
  const downloadedFiles = {
    urls: {},
    files: {}
  };
  
  // Download each variation
  for (const [finition, imageUrl] of Object.entries(CONFIG.variations)) {
    const outputPath = path.join(photoDir, `${sanitizedTitle}_${finition}.jpg`);
    
    try {
      await downloadFile(imageUrl, outputPath);
      
      downloadedFiles.urls[finition] = imageUrl;
      downloadedFiles.files[finition] = outputPath;
    } catch (error) {
      console.error(`❌ Error downloading ${finition} variation:`, error.message);
    }
  }
  
  // Create a manifest file
  const manifestData = {
    collection: collectionName,
    photoName: sanitizedTitle,
    originalName: photoName,
    downloadDate: new Date().toISOString(),
    variations: []
  };
  
  Object.keys(downloadedFiles.files).forEach(finition => {
    manifestData.variations.push({
      finition: finition,
      path: downloadedFiles.files[finition],
      sourceUrl: downloadedFiles.urls[finition]
    });
  });
  
  // Write the manifest to the photo directory
  const manifestPath = path.join(photoDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
  
  console.log(`✅ Created manifest for ${sanitizedTitle}`);
  
  return {
    title: sanitizedTitle,
    dir: photoDir
  };
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Variation Downloader');
    
    // Get the photo name from command line arguments or use default
    const photoName = process.argv[2] || 'Echappée';
    const collectionName = process.argv[3] || 'COULEUR';
    
    console.log(`📁 Using collection name: ${collectionName}`);
    
    // Create the collection directory
    const collectionDir = path.join(CONFIG.baseDir, collectionName);
    fs.mkdirSync(collectionDir, { recursive: true });
    
    // Download all variations for this photo
    const downloadResult = await downloadPhotoVariations(photoName, collectionName);
    
    console.log(`\n✅ Successfully downloaded variations for "${photoName}"`);
    console.log(`📁 Images saved to: ${downloadResult.dir}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();