/**
 * Enhanced Photo Downloader for Boris Photos
 * 
 * This script tries to find different images for each finition by looking
 * for image variation clues in the HTML.
 * 
 * Usage: node enhanced_photo_downloader.js [URL] [photo_index]
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
 * Extracts all images from a page and tries to match variations
 */
async function extractImagesWithVariations(url) {
  const tempFile = path.join('/tmp', 'boris_page.html');
  
  try {
    // Download the page content
    console.log(`🔄 Fetching page: ${url}`);
    execSync(`curl -s -A "${CONFIG.userAgent}" "${url}" > ${tempFile}`);
    
    // Read the page content
    const content = fs.readFileSync(tempFile, 'utf8');
    
    // Try to extract the page title to use as the collection name
    const titleRegex = /<title[^>]*>(.*?)<\/title>/i;
    const titleMatch = content.match(titleRegex);
    const pageTitle = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract all images from the page
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const allImages = [];
    let imgMatch;
    
    while ((imgMatch = imgRegex.exec(content)) !== null) {
      const imgUrl = imgMatch[1];
      // Filter for higher quality images
      if (imgUrl && 
          (imgUrl.includes('.jpg') || 
           imgUrl.includes('.jpeg') || 
           imgUrl.includes('.png')) && 
          !imgUrl.includes('icon') &&
          !imgUrl.includes('thumb') &&
          imgUrl.includes('squarespace-cdn.com')) {
        
        // Ensure URL is absolute
        const fullUrl = imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl;
        // Ensure we get the highest quality by removing format parameters
        const baseUrl = fullUrl.split('?')[0];
        
        // Store image with its context (nearby HTML can help identify variations)
        const context = imgMatch[0]; // Full img tag
        allImages.push({
          url: baseUrl,
          highQualityUrl: baseUrl + '?format=2500w', // Force high quality
          context: context
        });
      }
    }
    
    // Also look for data-image attributes which often contain highest quality versions
    const dataImgRegex = /<img[^>]+data-image="([^"]+)"[^>]*>/g;
    while ((imgMatch = dataImgRegex.exec(content)) !== null) {
      const imgUrl = imgMatch[1];
      if (imgUrl && (imgUrl.includes('.jpg') || imgUrl.includes('.jpeg') || imgUrl.includes('.png'))) {
        const fullUrl = imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl;
        const baseUrl = fullUrl.split('?')[0];
        
        const context = imgMatch[0];
        allImages.push({
          url: baseUrl,
          highQualityUrl: baseUrl + '?format=2500w',
          context: context
        });
      }
    }
    
    // Clean up the temp file
    fs.unlinkSync(tempFile);
    
    // Group similar images together to find variations of the same photo
    const imageGroups = groupSimilarImages(allImages);
    
    console.log(`🔍 Found ${allImages.length} images grouped into ${imageGroups.length} photo sets`);
    
    return {
      pageTitle: pageTitle,
      imageGroups: imageGroups
    };
  } catch (error) {
    console.error('Error extracting images:', error);
    return {
      pageTitle: 'Unknown',
      imageGroups: []
    };
  }
}

/**
 * Groups similar images that might be variations of the same photograph
 */
function groupSimilarImages(images) {
  // For simplicity, we'll use a basic grouping approach
  // In a real implementation, this could use image similarity or pattern matching
  const groups = [];
  
  // First, sort images by filename to help group similar ones
  images.sort((a, b) => {
    const aFilename = a.url.split('/').pop();
    const bFilename = b.url.split('/').pop();
    return aFilename.localeCompare(bFilename);
  });
  
  // Group images with similar filenames
  let currentGroup = [];
  let currentBaseFilename = '';
  
  images.forEach(image => {
    const filename = image.url.split('/').pop();
    const baseName = filename.split('.')[0].replace(/[-_\d]+$/, ''); // Remove suffixes like _1, _2
    
    if (baseName !== currentBaseFilename && currentGroup.length > 0) {
      // Save the completed group and start a new one
      groups.push([...currentGroup]);
      currentGroup = [];
    }
    
    currentGroup.push(image);
    currentBaseFilename = baseName;
  });
  
  // Add the last group
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  // Generate multiple variations for each group based on our finitions
  return groups.map(group => {
    // Sort the group images by quality (use URL length as a rough proxy)
    group.sort((a, b) => b.url.length - a.url.length);
    
    // Use heuristics to determine which variation might match which finition
    const variationMap = {};
    
    // Always use the first image as original
    variationMap.original = group[0].highQualityUrl;
    
    // For other finitions, try to find a match or use a different image if available
    CONFIG.finitions.forEach((finition, index) => {
      if (finition === 'original') return;
      
      const sanitizedFinition = finition.toLowerCase().replace(/\s+/g, '_');
      
      // Try to find a matching image by looking at context for finition keywords
      const matchingImage = group.find(img => 
        finition.toLowerCase().split(' ').some(keyword => 
          img.context.toLowerCase().includes(keyword)
        )
      );
      
      if (matchingImage) {
        variationMap[sanitizedFinition] = matchingImage.highQualityUrl;
      } else if (index < group.length) {
        // Use a different image if available
        variationMap[sanitizedFinition] = group[index].highQualityUrl;
      } else {
        // Fall back to original
        variationMap[sanitizedFinition] = group[0].highQualityUrl;
      }
    });
    
    // Extract a name from the first image URL
    const url = group[0].url;
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const photoName = filename.split('.')[0].replace(/[-_]/g, ' ');
    
    return {
      name: photoName,
      images: group,
      variations: variationMap
    };
  });
}

/**
 * Downloads all variations for a specific photo
 */
async function downloadPhotoVariations(photo, collectionName) {
  // Sanitize the photo name for use as a directory name
  const sanitizedTitle = photo.name
    .replace(/[^a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ\s-]/g, '')
    .replace(/\s+/g, '_');
    
  // Create directory for this photo
  const photoDir = path.join(CONFIG.baseDir, collectionName, sanitizedTitle);
  fs.mkdirSync(photoDir, { recursive: true });
  
  console.log(`🖼️ Downloading variations for "${photo.name}"...`);
  
  const downloadedFiles = {
    urls: {},
    files: {}
  };
  
  // Download each variation
  for (const [finition, imageUrl] of Object.entries(photo.variations)) {
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
    originalName: photo.name,
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
    console.log('🚀 Starting Enhanced Photo Downloader');
    
    // Get the URL and optional photo index
    const url = process.argv[2] || 'https://www.borismolinier.com/boutiqueenligne/couleur';
    const photoIndex = parseInt(process.argv[3], 10) || 0;
    
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
    
    // Extract images and try to find variations
    const extractResult = await extractImagesWithVariations(url);
    
    if (extractResult.imageGroups.length === 0) {
      console.error('❌ Error: No images found on the page');
      process.exit(1);
    }
    
    // Select the photo to download
    let selectedPhoto;
    
    if (photoIndex >= 0 && photoIndex < extractResult.imageGroups.length) {
      selectedPhoto = extractResult.imageGroups[photoIndex];
      console.log(`🔍 Selected photo #${photoIndex + 1}: "${selectedPhoto.name}"`);
    } else {
      // Find the most likely photo (one with the most images)
      selectedPhoto = extractResult.imageGroups.reduce(
        (best, current) => current.images.length > best.images.length ? current : best,
        extractResult.imageGroups[0]
      );
      console.log(`🔍 Auto-selected photo with most variations: "${selectedPhoto.name}"`);
    }
    
    // Download all variations for this photo
    const downloadResult = await downloadPhotoVariations(selectedPhoto, collectionName);
    
    console.log(`\n✅ Successfully downloaded variations for "${selectedPhoto.name}"`);
    console.log(`📁 Images saved to: ${downloadResult.dir}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();