/**
 * Real Image Downloader Script for Boris Photos
 * 
 * This script downloads actual photos from Boris's website based on a provided URL
 * and organizes them by collection, photo name, and variations.
 * 
 * Usage: node real_image_downloader.js [URL]
 * Example: node real_image_downloader.js https://www.borismolinier.com/boutiqueenligne/couleur
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { createWriteStream } = require('fs');

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  // Test with a single image first
  testMode: process.argv.includes('--test'),
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
 * Extracts image URLs from a webpage
 */
function extractImagesFromPage(url) {
  return new Promise((resolve, reject) => {
    const tempFile = path.join('/tmp', 'boris_photos_page.html');
    
    try {
      // Download the page content
      console.log(`🔄 Fetching page: ${url}`);
      execSync(`curl -s -A "${CONFIG.userAgent}" "${url}" > ${tempFile}`);
      
      // Read the page content
      const content = fs.readFileSync(tempFile, 'utf8');
      
      // Extract all image URLs using regex
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
      const imgSrcRegex = /<img[^>]+src="([^"]+)"[^>]*>/;
      
      const matches = content.match(imgRegex) || [];
      
      // Extract the actual URLs and filter out non-image files and small thumbnails
      const imageUrls = matches
        .map(img => {
          const srcMatch = img.match(imgSrcRegex);
          return srcMatch ? srcMatch[1] : null;
        })
        .filter(url => url && (
          url.includes('.jpg') || 
          url.includes('.jpeg') || 
          url.includes('.png') || 
          url.includes('squarespace-cdn.com')
        ))
        .filter(url => !url.includes('thumb') && !url.includes('icon') && !url.endsWith('.svg'));
      
      // Clean up the temp file
      fs.unlinkSync(tempFile);
      
      console.log(`🔍 Found ${imageUrls.length} potential images`);
      resolve(imageUrls);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Processes a single image URL
 */
async function processImageUrl(imageUrl, collectionName, index) {
  try {
    // Create a safe filename from the URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // Format the photo name
    const photoName = `Photo_${index}`;
    
    // Create the directory structure
    const photoDir = path.join(CONFIG.baseDir, collectionName, photoName);
    const originalDir = path.join(photoDir, 'original');
    fs.mkdirSync(originalDir, { recursive: true });
    
    // Download the original image
    const outputPath = path.join(originalDir, filename);
    await downloadFile(imageUrl, outputPath);
    
    // Create simple variations for testing
    const finitions = ['Dibond', 'Plexi'];
    const sizes = ['100x50', '120x60'];
    
    if (CONFIG.testMode) {
      // Only create directory structure in test mode
      finitions.forEach(finition => {
        const finitionDir = path.join(photoDir, finition.replace(/ /g, '_'));
        
        sizes.forEach(size => {
          const sizeDir = path.join(finitionDir, size);
          fs.mkdirSync(sizeDir, { recursive: true });
          
          // Create a symlink to the original as a placeholder for the variation
          const variationPath = path.join(sizeDir, `${photoName}_${finition}_${size}${path.extname(filename)}`);
          fs.copyFileSync(outputPath, variationPath);
        });
      });
    }
    
    return {
      photoName,
      originalPath: outputPath,
      imageUrl
    };
  } catch (error) {
    console.error(`❌ Error processing ${imageUrl}:`, error.message);
    return null;
  }
}

/**
 * Creates a manifest file for the downloaded photos
 */
function createManifest(collectionName, photos) {
  const manifestData = {
    collection: collectionName,
    downloadDate: new Date().toISOString(),
    photoCount: photos.length,
    photos: {}
  };
  
  photos.forEach(photo => {
    if (!photo) return;
    
    manifestData.photos[photo.photoName] = {
      original: photo.originalPath,
      sourceUrl: photo.imageUrl
    };
  });
  
  // Write the manifest to the collection directory
  const manifestPath = path.join(CONFIG.baseDir, collectionName, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
  
  console.log(`✅ Created manifest for ${collectionName}`);
  return manifestPath;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Real Image Downloader Script');
    
    // Get the URL from command line arguments
    const url = process.argv[2] || 'https://www.borismolinier.com/boutiqueenligne/couleur';
    
    if (!url) {
      console.error('❌ Error: Please provide a URL as a command line argument');
      process.exit(1);
    }
    
    // Extract collection name from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const collectionName = pathParts[pathParts.length - 1].toUpperCase() || 'COLLECTION';
    
    console.log(`📁 Using collection name: ${collectionName}`);
    console.log(`🔄 ${CONFIG.testMode ? 'TEST MODE' : 'FULL MODE'}: ${CONFIG.testMode ? 'Processing test image only' : 'Processing all images'}`);
    
    // Extract images from the page
    const imageUrls = await extractImagesFromPage(url);
    
    // Filter to only include high-quality images and ensure URLs are properly formatted
    const highQualityUrls = imageUrls
      .map(url => {
        // Make sure URLs are absolute
        if (url.startsWith('//')) {
          return 'https:' + url;
        }
        return url;
      })
      .filter(url => 
        // Include high-quality images or anything that looks like a full photograph
        (url.includes('format=') && 
        !url.includes('format=100w') && 
        !url.includes('format=300w')) ||
        url.includes('.jpg') ||
        url.includes('.jpeg') ||
        url.includes('.png')
      );
    
    // Sort by highest quality (prefer larger formats)
    const sortedUrls = highQualityUrls.sort((a, b) => {
      // Prioritize by format size
      const aFormat = a.match(/format=(\d+)w/);
      const bFormat = b.match(/format=(\d+)w/);
      
      if (aFormat && bFormat) {
        return parseInt(bFormat[1]) - parseInt(aFormat[1]);
      }
      
      // If no format, prioritize by filename length (usually more descriptive files)
      return b.length - a.length;
    });
    
    // Log the first few URLs for debugging
    if (sortedUrls.length > 0) {
      console.log('🔍 Top URLs:');
      sortedUrls.slice(0, Math.min(3, sortedUrls.length)).forEach(url => 
        console.log(`  - ${url}`)
      );
    }
    
    // Take only a subset in test mode
    const targetUrls = CONFIG.testMode 
      ? sortedUrls.slice(0, 1) 
      : sortedUrls;
    
    console.log(`🖼️ Processing ${targetUrls.length} images...`);
    
    // Process each image URL
    const photoPromises = targetUrls.map((url, index) => 
      processImageUrl(url, collectionName, index + 1)
    );
    
    const photos = await Promise.all(photoPromises);
    const successfulPhotos = photos.filter(Boolean);
    
    // Create a manifest if we have successful photos
    if (successfulPhotos.length > 0) {
      createManifest(collectionName, successfulPhotos);
    } else {
      console.log('⚠️ No photos were successfully downloaded. Skipping manifest creation.');
    }
    
    console.log(`✅ Successfully downloaded ${successfulPhotos.length} out of ${targetUrls.length} images`);
    console.log(`📁 Images saved to: ${path.join(CONFIG.baseDir, collectionName)}`);
    
    if (CONFIG.testMode) {
      console.log('\n🔍 TEST MODE COMPLETED');
      console.log('To download all images, run without the --test flag:');
      console.log(`node ${process.argv[1]} ${url}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();