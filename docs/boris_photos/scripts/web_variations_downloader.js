/**
 * Web Variations Downloader for Boris Photos
 * 
 * This script downloads photo variations from the website directly
 * based on the variations documented in VARIATIONS.md
 * 
 * Usage: node web_variations_downloader.js [collection_name] [photo_name]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  variationsFile: '/opt/mExpress/docs/boris_photos/__mocks__/current/images/VARIATIONS.md',
  collectionUrls: {
    'COULEUR': 'https://www.borismolinier.com/boutiqueenligne/couleur',
    'NOIR_ET_BLANC': 'https://www.borismolinier.com/boutiqueenligne/noir-et-blanc'
  },
  defaultCollectionName: 'COULEUR'
};

/**
 * Parses variations from the VARIATIONS.md file
 * @returns {Object} Variations with finition names and corresponding URLs
 */
function parseVariations() {
  console.log('📋 Parsing variations from VARIATIONS.md...');
  
  const variationsContent = fs.readFileSync(CONFIG.variationsFile, 'utf-8');
  const variations = {};
  
  // Parse the content - it has a pattern of finition name followed by URL
  const lines = variationsContent.split('\n');
  
  let currentFinition = null;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;
    
    // If line starts with http, it's a URL for the previous finition
    if (line.trim().startsWith('http')) {
      if (currentFinition) {
        variations[currentFinition] = line.trim();
      }
      continue;
    }
    
    // If line contains an image tag, skip it
    if (line.includes('<img')) continue;
    
    // Otherwise, it's a finition name
    if (!line.includes('http')) {
      currentFinition = line.trim();
    }
  }
  
  console.log(`✅ Found ${Object.keys(variations).length} variations:`);
  for (const [finition, url] of Object.entries(variations)) {
    console.log(`   - ${finition}: ${url.substring(0, 50)}...`);
  }
  
  return variations;
}

/**
 * Fetches HTML content from a URL
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} The HTML content
 */
function fetchHtmlContent(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };

    https.get(url, options, (response) => {
      // Check if the response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
        return;
      }

      let data = '';
      
      // A chunk of data has been received
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received
      response.on('end', () => {
        resolve(data);
      });
      
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Parses photos and their URLs from HTML content
 * @param {string} htmlContent - The HTML content to parse
 * @returns {Array} Array of photo objects with title and URLs
 */
function parsePhotosFromHtml(htmlContent) {
  console.log('📋 Parsing photos from HTML content...');
  const photos = [];
  
  // Pattern to extract photo titles
  const titleRegex = /"title": "([^"]+)"/g;
  const titles = [];
  let matchTitle;
  
  while ((matchTitle = titleRegex.exec(htmlContent)) !== null) {
    titles.push(matchTitle[1]);
  }
  
  console.log(`Found ${titles.length} photo titles in the collection`);
  
  // For each title, find the image URLs
  for (const title of titles) {
    // Find a chunk of HTML that contains this title
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titlePattern = new RegExp(`"title": "${escapedTitle}"[\\s\\S]+?(?:<\\/figure>|<\\/a>\\s*<\\/div>)`, 'g');
    const photoChunks = htmlContent.match(titlePattern);
    
    if (photoChunks && photoChunks.length > 0) {
      // Get all image URLs from this chunk using multiple patterns
      let urls = [];
      
      // Look for standard data-src attributes (main images)
      const dataSrcMatches = photoChunks[0].match(/data-src="([^"]+)"/g) || [];
      urls = dataSrcMatches.map(url => url.replace(/^data-src="/, '').replace(/"$/, ''));
      
      // Also look for src attributes (sometimes used for loaded images)
      const srcMatches = photoChunks[0].match(/src="(https:\/\/images\.squarespace-cdn[^"]+)"/g) || [];
      const srcUrls = srcMatches.map(url => url.replace(/^src="/, '').replace(/"$/, ''));
      
      // Look for ProductItem-gallery-slides-item-image class (caisse/cadre variations)
      const slideImageMatches = photoChunks[0].match(/ProductItem-gallery-slides-item-image[^>]+data-src="([^"]+)"/g) || [];
      const slideUrls = slideImageMatches.map(match => {
        const urlMatch = match.match(/data-src="([^"]+)"/);
        return urlMatch ? urlMatch[1] : null;
      }).filter(url => url !== null);
      
      // Combine all URLs and remove duplicates
      const allUrls = [...urls, ...srcUrls, ...slideUrls];
      const uniqueUrls = [...new Set(allUrls)];
      
      if (uniqueUrls.length > 0) {
        console.log(`  - "${title}": Found ${uniqueUrls.length} images (${dataSrcMatches.length} main, ${slideUrls.length} slides)`);
        photos.push({
          title,
          urls: uniqueUrls
        });
      }
    }
  }
  
  console.log(`✅ Found ${photos.length} photos in the collection`);
  
  return photos;
}

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
 * Extract the unique ID from a URL string
 * For example: https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1648219510843-4NYES5DUINHJQR1NO2YQ/echapée-caisse-americaine-boris-molinier.jpg
 * Would return: 1648219510843-4NYES5DUINHJQR1NO2YQ
 */
function extractUrlId(url) {
  const matches = url.match(/\/([^\/]+)\/([^\/]+?)(\?.*)?$/);
  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
}

/**
 * Matches a photo's URLs to specific variations based on pattern matching
 */
function matchVariationsToPhoto(photoUrls, variations) {
  const result = {};
  
  // Extract IDs from variation URLs for comparison
  const variationIds = {};
  for (const [finition, url] of Object.entries(variations)) {
    const id = extractUrlId(url);
    if (id) {
      variationIds[finition] = id;
    }
  }
  
  // For each photo URL, try to match it with a variation pattern
  for (const photoUrl of photoUrls) {
    const photoId = extractUrlId(photoUrl);
    
    if (!photoId) continue;
    
    // Look for exact ID matches first
    let matched = false;
    for (const [finition, variationId] of Object.entries(variationIds)) {
      if (photoId === variationId) {
        result[finition] = photoUrl;
        matched = true;
        break;
      }
    }
    
    // If no exact match, try to match the image filename pattern
    if (!matched) {
      const filename = photoUrl.split('/').pop().split('?')[0].toLowerCase();
      
      // Check for specific keywords in the filename
      if (filename.includes('caisse-americaine') || filename.includes('caisse_americaine') || 
          filename.includes('caisse-a') || filename.includes('caisse_a') || 
          filename.includes('caisse-noir') || filename.includes('_caisse-a-noir')) {
        result['dibond caisse americaine / plexi caisse americaine'] = photoUrl;
      } else if (filename.includes('cadre-alu') || filename.includes('cadre_alu') ||
                filename.includes('cadre-noir') || filename.includes('cadre_noir')) {
        result['dibond cadre alu / plexi cadre alu'] = photoUrl;
      } else if (photoUrl.endsWith('.jpeg') || filename.includes('original')) {
        result['original'] = photoUrl;
      } else if (!Object.values(result).includes(photoUrl)) {
        // If this URL doesn't match any pattern and isn't already included, assume it's dibond/plexi
        result['dibond/plexi'] = photoUrl;
      }
    }
  }
  
  // Ensure we capture all images even if they don't match our standard patterns
  // Add any remaining unmatched URLs to appropriate categories based on file naming patterns
  for (const photoUrl of photoUrls) {
    if (!Object.values(result).includes(photoUrl)) {
      const filename = photoUrl.split('/').pop().split('?')[0].toLowerCase();
      
      // Check for additional patterns that might indicate finition types
      if (filename.includes('-3-') || filename.includes('_3_') || 
          filename.includes('caisse') || filename.includes('noir-3')) {
        if (!result['dibond caisse americaine / plexi caisse americaine']) {
          result['dibond caisse americaine / plexi caisse americaine'] = photoUrl;
        }
      } else if (filename.includes('-2-') || filename.includes('_2_') || 
                filename.includes('cadre') || filename.includes('alu')) {
        if (!result['dibond cadre alu / plexi cadre alu']) {
          result['dibond cadre alu / plexi cadre alu'] = photoUrl;
        }
      } else if (filename.includes('-1-') || filename.includes('_1_') || 
                filename.includes('original') || filename.includes('simple')) {
        if (!result['original']) {
          result['original'] = photoUrl;
        }
      } else if (!result['dibond/plexi']) {
        // Last resort, assume it's dibond/plexi if no other match found
        result['dibond/plexi'] = photoUrl;
      }
    }
  }
  
  // If we haven't found an original image, use the first URL as original
  if (!result['original'] && photoUrls.length > 0) {
    result['original'] = photoUrls[0];
  }
  
  return result;
}

/**
 * Downloads all variations for a single photo
 */
async function downloadPhotoVariations(photo, variations, collectionName) {
  // Sanitize the photo name for use as a directory name
  const sanitizedTitle = photo.title
    .replace(/[^a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ\s-]/g, '')
    .replace(/\s+/g, '_');
    
  // Create directory for this photo
  const photoDir = path.join(CONFIG.baseDir, collectionName, sanitizedTitle);
  fs.mkdirSync(photoDir, { recursive: true });
  
  console.log(`\n🖼️ Processing "${photo.title}"...`);
  console.log(`- Found ${photo.urls.length} different URLs for this photo`);
  
  // Match photo URLs to variations
  const matchedVariations = matchVariationsToPhoto(photo.urls, variations);
  console.log(`- Matched ${Object.keys(matchedVariations).length} variations for this photo`);
  
  // Log special detection of non-standard patterns
  for (const [finition, url] of Object.entries(matchedVariations)) {
    const filename = url.split('/').pop().split('?')[0];
    if (filename.includes('Caisse-A-Noir') || 
        filename.includes('caisse-noir') || 
        filename.includes('-3-') || 
        filename.includes('_3_')) {
      console.log(`  📋 Special pattern detected: "${filename}" → ${finition}`);
    }
  }
  
  const downloadedFiles = {
    urls: {},
    files: {}
  };
  
  // Download each variation
  for (const [finition, imageUrl] of Object.entries(matchedVariations)) {
    const outputPath = path.join(photoDir, `${sanitizedTitle}_${finition.replace(/\//g, '_')}.jpg`);
    
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
    originalName: photo.title,
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
    dir: photoDir,
    downloadedCount: Object.keys(downloadedFiles.files).length
  };
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Web Variations Downloader');
    
    // Get the collection name from command line arguments or use default
    const collectionName = process.argv[2] || CONFIG.defaultCollectionName;
    console.log(`📁 Using collection name: ${collectionName}`);
    
    // Check if we have a URL for this collection
    if (!CONFIG.collectionUrls[collectionName]) {
      console.error(`❌ No URL defined for collection "${collectionName}"`);
      console.log('Available collections:');
      Object.keys(CONFIG.collectionUrls).forEach(name => {
        console.log(`- ${name}`);
      });
      process.exit(1);
    }
    
    console.log(`🌐 Fetching collection from: ${CONFIG.collectionUrls[collectionName]}`);
    
    // Parse variations
    const variations = parseVariations();
    
    // Fetch and parse collection data
    const htmlContent = await fetchHtmlContent(CONFIG.collectionUrls[collectionName]);
    const photos = parsePhotosFromHtml(htmlContent);
    
    // Create the collection directory
    const collectionDir = path.join(CONFIG.baseDir, collectionName);
    fs.mkdirSync(collectionDir, { recursive: true });
    
    // Download all photos with their variations
    console.log(`\n📥 Processing ${photos.length} photos from collection...`);
    
    // Get photo title from command line args if provided
    const requestedPhotoTitle = process.argv[3];
    
    // Filter photos if a specific title was requested
    const photosToProcess = requestedPhotoTitle 
      ? photos.filter(p => p.title.toLowerCase().includes(requestedPhotoTitle.toLowerCase()))
      : photos;
    
    if (requestedPhotoTitle && photosToProcess.length === 0) {
      console.error(`❌ No photos found matching "${requestedPhotoTitle}"`);
      console.log('Available photos:');
      photos.forEach(p => console.log(`- ${p.title}`));
      process.exit(1);
    }
    
    console.log(`Will process ${photosToProcess.length} photos`);
    
    const results = [];
    for (const photo of photosToProcess) {
      try {
        const result = await downloadPhotoVariations(photo, variations, collectionName);
        results.push(result);
      } catch (error) {
        console.error(`❌ Error processing photo "${photo.title}":`, error.message);
      }
    }
    
    // Generate summary
    console.log('\n📊 Download Summary:');
    console.log(`- Total photos processed: ${results.length}/${photosToProcess.length}`);
    
    const totalVariations = results.reduce((sum, result) => sum + result.downloadedCount, 0);
    console.log(`- Total variations downloaded: ${totalVariations}`);
    console.log(`- Photos saved to: ${collectionDir}`);
    
    // List all processed photos with their variations
    console.log('\n📸 Processed Photos:');
    for (const result of results) {
      console.log(`- ${result.title}: ${result.downloadedCount} variations`);
    }
    
    console.log('\n✅ Photo variations download completed successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();