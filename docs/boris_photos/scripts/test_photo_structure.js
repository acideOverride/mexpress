/**
 * Test Script for Boris Photos Structure
 * 
 * This script validates the directory structure and files created by the
 * download_photo_variations.js script.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

// Configuration
const CONFIG = {
  baseDir: '/opt/mExpress/docs/boris_photos/PHOTOS_DATABASE',
  collections: ['COULEURS'],
  photos: {
    COULEURS: ['Echappee']
  },
  finitions: [
    'Dibond', 
    'Plexi', 
    'Dibond_avec_cadre_alu', 
    'Dibond_avec_caisse_américaine', 
    'Plexi_avec_cadre_alu', 
    'Plexi_avec_caisse_américaine'
  ],
  sizes: ['100x50', '120x60', '150x75', '180x90']
};

/**
 * Validates the basic directory structure
 */
function testDirectoryStructure() {
  console.log('🔄 Testing directory structure...');
  
  // Test base directory
  assert.ok(fs.existsSync(CONFIG.baseDir), 'Base directory should exist');
  
  // Test collection directories
  CONFIG.collections.forEach(collection => {
    const collectionPath = path.join(CONFIG.baseDir, collection);
    assert.ok(fs.existsSync(collectionPath), `Collection directory ${collection} should exist`);
    
    // Test photo directories
    CONFIG.photos[collection].forEach(photo => {
      const photoPath = path.join(collectionPath, photo);
      assert.ok(fs.existsSync(photoPath), `Photo directory ${photo} should exist`);
      
      // Test original directory
      const originalPath = path.join(photoPath, 'original');
      assert.ok(fs.existsSync(originalPath), `Original directory for ${photo} should exist`);
      
      // Test original file
      const originalFilePath = path.join(originalPath, 'original.jpeg');
      assert.ok(fs.existsSync(originalFilePath), `Original file for ${photo} should exist`);
      
      // Test finition directories
      CONFIG.finitions.forEach(finition => {
        const finitionPath = path.join(photoPath, finition);
        assert.ok(fs.existsSync(finitionPath), `Finition directory ${finition} should exist`);
        
        // Test size directories
        CONFIG.sizes.forEach(size => {
          const sizePath = path.join(finitionPath, size);
          assert.ok(fs.existsSync(sizePath), `Size directory ${size} should exist for ${finition}`);
          
          // Test variation file
          const variationFilePath = path.join(sizePath, `${photo}_${finition}_${size}.jpeg`);
          assert.ok(fs.existsSync(variationFilePath), `Variation file for ${photo} with ${finition} at ${size} should exist`);
        });
      });
    });
    
    // Test manifest file
    const manifestPath = path.join(collectionPath, 'manifest.json');
    assert.ok(fs.existsSync(manifestPath), `Manifest file for ${collection} should exist`);
  });
  
  console.log('✅ Directory structure tests passed');
}

/**
 * Validates the manifest file
 */
function testManifest() {
  console.log('🔄 Testing manifest files...');
  
  CONFIG.collections.forEach(collection => {
    const manifestPath = path.join(CONFIG.baseDir, collection, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Test manifest structure
    assert.strictEqual(manifest.collection, collection, `Manifest should be for collection ${collection}`);
    assert.ok(manifest.photos, 'Manifest should have photos object');
    
    // Test photos in manifest
    CONFIG.photos[collection].forEach(photo => {
      assert.ok(manifest.photos[photo], `Manifest should include photo ${photo}`);
      assert.ok(manifest.photos[photo].original, `Manifest should have original path for ${photo}`);
      assert.ok(Array.isArray(manifest.photos[photo].variations), `Manifest should have variations array for ${photo}`);
      
      // Count expected variations
      const expectedVariationsCount = CONFIG.finitions.length * CONFIG.sizes.length;
      assert.strictEqual(
        manifest.photos[photo].variations.length, 
        expectedVariationsCount, 
        `Should have ${expectedVariationsCount} variations for ${photo}`
      );
    });
  });
  
  console.log('✅ Manifest tests passed');
}

/**
 * Main test function
 */
function runTests() {
  console.log('🚀 Starting Photo Structure Tests');
  
  try {
    testDirectoryStructure();
    testManifest();
    
    console.log('✅ All tests passed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();