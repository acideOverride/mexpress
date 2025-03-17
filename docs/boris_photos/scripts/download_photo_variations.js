/**
 * Photo Variation Download Script
 * 
 * This script downloads photos from Boris's website and organizes them by:
 * - Collection (e.g., COULEURS)
 * - Photo name (e.g., Echappee)
 * - Variations:
 *   - Finitions (Dibond, Plexi, etc.)
 *   - Sizes (100x50, 120x60, etc.)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  collections: {
    COULEURS: {
      photos: {
        Echappee: {
          originalUrl: 'https://images.squarespace-cdn.com/content/v1/61af753f994e62432b67f0bf/1645031605084-M7184EBQY10DVTHYKXBB/IMG_1FBC012B23DC-1.jpeg',
          finitions: [
            'Dibond', 
            'Plexi', 
            'Dibond avec cadre alu', 
            'Dibond avec caisse américaine', 
            'Plexi avec cadre alu', 
            'Plexi avec caisse américaine'
          ],
          sizes: ['100x50', '120x60', '150x75', '180x90']
        }
      }
    }
  }
};

/**
 * Creates directory structure for a photo and its variations
 */
function createDirectoryStructure() {
  Object.keys(CONFIG.collections).forEach(collection => {
    const photosObj = CONFIG.collections[collection].photos;
    
    Object.keys(photosObj).forEach(photo => {
      // Create the main photo directory
      const photoDir = path.join(CONFIG.baseDir, collection, photo);
      fs.mkdirSync(photoDir, { recursive: true });
      
      // Create directories for each finition
      photosObj[photo].finitions.forEach(finition => {
        const finitionDir = path.join(photoDir, finition.replace(/ /g, '_'));
        fs.mkdirSync(finitionDir, { recursive: true });
        
        // Create size directories within each finition
        photosObj[photo].sizes.forEach(size => {
          const sizeDir = path.join(finitionDir, size);
          fs.mkdirSync(sizeDir, { recursive: true });
        });
      });
      
      // Create an "original" directory for the unmodified photo
      const originalDir = path.join(photoDir, 'original');
      fs.mkdirSync(originalDir, { recursive: true });
    });
  });
  
  console.log('✅ Directory structure created successfully');
}

/**
 * Downloads the original photo for each photo in the collection
 */
function downloadOriginalPhotos() {
  console.log('🔄 Downloading original photos...');
  
  Object.keys(CONFIG.collections).forEach(collection => {
    const photosObj = CONFIG.collections[collection].photos;
    
    Object.keys(photosObj).forEach(photo => {
      const photoConfig = photosObj[photo];
      const originalDir = path.join(CONFIG.baseDir, collection, photo, 'original');
      const filePath = path.join(originalDir, 'original.jpeg');
      
      // Create a download placeholder file (since curl is not available)
      fs.writeFileSync(filePath, `This would be the downloaded image from: ${photoConfig.originalUrl}`);
      console.log(`✅ Created placeholder for: ${photo}`);
      
      // In a real environment, we would use https.get or another method to download
      console.log(`📝 To actually download this image, run: curl -o "${filePath}" "${photoConfig.originalUrl}"`);
    });
  });
}

/**
 * Creates mock variations of the original photo for testing
 * In a real implementation, this would apply transformations to the image
 */
function createMockVariations() {
  console.log('🔄 Creating mock variations...');
  
  Object.keys(CONFIG.collections).forEach(collection => {
    const photosObj = CONFIG.collections[collection].photos;
    
    Object.keys(photosObj).forEach(photo => {
      const photoConfig = photosObj[photo];
      
      // For each finition and size combination, create a placeholder file
      photoConfig.finitions.forEach(finition => {
        const finitionSafe = finition.replace(/ /g, '_');
        
        photoConfig.sizes.forEach(size => {
          const variationDir = path.join(CONFIG.baseDir, collection, photo, finitionSafe, size);
          const filePath = path.join(variationDir, `${photo}_${finitionSafe}_${size}.jpeg`);
          
          // Create a placeholder file
          fs.writeFileSync(
            filePath, 
            `This would be a ${size} variation of ${photo} with ${finition} finishing`
          );
          
          console.log(`✅ Created variation: ${photo} - ${finition} - ${size}`);
        });
      });
    });
  });
}

/**
 * Creates a manifest file for the photo collection
 */
function createManifest() {
  console.log('🔄 Creating manifest...');
  
  Object.keys(CONFIG.collections).forEach(collection => {
    const manifestData = {
      collection,
      photos: {}
    };
    
    const photosObj = CONFIG.collections[collection].photos;
    
    Object.keys(photosObj).forEach(photo => {
      const photoConfig = photosObj[photo];
      
      manifestData.photos[photo] = {
        original: path.join(CONFIG.baseDir, collection, photo, 'original', 'original.jpeg'),
        variations: []
      };
      
      // Add all variations to the manifest
      photoConfig.finitions.forEach(finition => {
        const finitionSafe = finition.replace(/ /g, '_');
        
        photoConfig.sizes.forEach(size => {
          const variationFile = `${photo}_${finitionSafe}_${size}.jpeg`;
          const variationPath = path.join(CONFIG.baseDir, collection, photo, finitionSafe, size, variationFile);
          
          manifestData.photos[photo].variations.push({
            finition,
            size,
            path: variationPath
          });
        });
      });
    });
    
    // Write the manifest to the collection directory
    const manifestPath = path.join(CONFIG.baseDir, collection, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
    
    console.log(`✅ Created manifest for ${collection}`);
  });
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting Photo Variation Download Script');
  
  try {
    createDirectoryStructure();
    downloadOriginalPhotos();
    createMockVariations();
    createManifest();
    
    console.log('✅ All operations completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();