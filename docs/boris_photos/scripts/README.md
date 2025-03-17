# Boris Photos Scripts

This directory contains various scripts for working with Boris Molinier's photo collection.

## Main Scripts

### full_photo_downloader.js (Recommended)

**Purpose**: Download ALL photo variations including those that only appear after selecting Finition and Taille options on the website.

**Usage**:
```
node full_photo_downloader.js [collection_name] [photo_title]
```

**Parameters**:
- `collection_name`: The name of the collection to download (e.g., "COULEUR", "NOIR_ET_BLANC")
- `photo_title`: (Optional) A specific photo title to process (if not provided, all photos will be processed)

**Features**:
- Fetches photo data directly from the website in real-time
- Handles special variation patterns that only appear after user selection
- Detects special naming patterns like "_Caisse-A-Noir-3-2.jpg" and "Alu-Noir-3-2.jpg"
- Properly categorizes all variations regardless of naming convention
- Creates comprehensive manifest files with all variation metadata
- Organizes photos by collection and title

**Example**:
```
# Download all photos with all variations from the NOIR_ET_BLANC collection
node full_photo_downloader.js NOIR_ET_BLANC

# Download a specific photo with all its variations
node full_photo_downloader.js COULEUR "Echappée"
```

### web_variations_downloader.js

**Purpose**: Download photo variations directly from the website based on the patterns in VARIATIONS.md.

**Usage**:
```
node web_variations_downloader.js [collection_name] [photo_title]
```

**Parameters**:
- `collection_name`: The name of the collection to download (e.g., "COULEUR", "NOIR_ET_BLANC")
- `photo_title`: (Optional) A specific photo title to process (if not provided, all photos will be processed)

**Features**:
- Fetches photo data directly from the website in real-time
- Parses HTML to extract all photos and their URLs
- Matches variation patterns from VARIATIONS.md to each photo
- Downloads all variations for each photo
- Creates a manifest.json file for each photo with all its variations
- Organizes photos by collection and title

**Example**:
```
# Download all photos from the NOIR_ET_BLANC collection
node web_variations_downloader.js NOIR_ET_BLANC

# Download a specific photo from the COULEUR collection
node web_variations_downloader.js COULEUR "Echappée"
```

### finw_variations_downloader.js

**Purpose**: Find all photo variations from the VARIATIONS.md patterns across the entire photo collection in collection_ListGrid.md.

**Usage**:
```
node finw_variations_downloader.js [collection_name] [photo_title]
```

**Parameters**:
- `collection_name`: (Optional) The name of the collection to save photos to (defaults to "COULEUR")
- `photo_title`: (Optional) A specific photo title to process (if not provided, all photos will be processed)

**Features**:
- Automatically extracts photo variations from VARIATIONS.md
- Extracts photo titles and URLs from collection_ListGrid.md (local file)
- Matches variation patterns across all photos
- Downloads all variations for each photo
- Creates a manifest.json file for each photo with all its variations
- Organizes photos by collection and title

**Example**:
```
# Download variations for a single photo
node finw_variations_downloader.js COULEUR "Echappée"

# Download variations for all photos in the default collection
node finw_variations_downloader.js

# Download variations for all photos in a specific collection
node finw_variations_downloader.js NOIR_ET_BLANC
```

## Legacy Scripts

### variation_downloader.js
Downloads variations for a single photo using hardcoded variation URLs.

### download_photo_variations.js
Downloads photo variations from a single source.

### enhanced_photo_downloader.js
An enhanced version that supports multiple collections.

### finition_variation_downloader.js
Focuses on downloading different finition variations.

### generate_variations.js
Generates variation previews from original photos.

### real_image_downloader.js
Downloads real images from the website.

### real_website_scraper.js
Scrapes the real website for photos.

### scrape_boris_website.js
General website scraper for Boris Molinier's website.

### simple_photo_downloader.js
Simple version for downloading individual photos.

### test_photo_structure.js
Tests the photo directory structure.