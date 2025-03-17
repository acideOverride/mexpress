#\!/usr/bin/env python3
"""
Script to download full size images from Giandra's portfolio site
"""

import requests
from bs4 import BeautifulSoup
import os
import time
import re
import json
from urllib.parse import urljoin
import random

BASE_URL = "https://eau-prodigieuse.fr"
OUTPUT_DIR = "/opt/mExpress/docs/giandra_photos/__mocks__/frontend/img/collections"

# Collection mapping from URL paths to folder names
COLLECTIONS = {
    "/moving-the-aquatic-mountains": "RENVERSER LES MONTAGNES",
    "/inonder-giverny": "COMME A GIVERNY", 
    "/renoncer-au-sens": "COSMOGONIE",
    "/la-matiere-eau-1": "TISSER LA MATIERE",
    "/invoquer-les-protecteurs": "ESPRITS DE NOTRE ESPRIT",
    "/the-surfing-angels-project-1": "Surfing Angels",
    "/caresser-le-bleu": "LE GRAND BLEU"
}

# Headers to mimic a browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
}

def get_soup(url):
    """Get BeautifulSoup object from URL"""
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Failed to fetch {url}: {response.status_code}")
            return None
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_fullsize_image_urls(html_content):
    """Extract full-size image URLs from HTML content"""
    # Pattern to match the highest resolution images (1920px width)
    pattern = r'https://cdn\.myportfolio\.com/[^"\']+?_rw_1920\.jpg\?[^"\'\s,]+'
    matches = re.findall(pattern, html_content)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_urls = []
    for url in matches:
        # Clean up URL (some URLs may contain trailing quotes or commas)
        clean_url = url.split(' ')[0].rstrip(',')
        if clean_url not in seen:
            seen.add(clean_url)
            unique_urls.append(clean_url)
    
    return unique_urls

def download_image(url, directory, index, collection_name):
    """Download an image and save it to the specified directory"""
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Failed to download {url}: {response.status_code}")
            return None
            
        # Create a descriptive filename based on collection and index
        filename = f"{collection_name.lower().replace(' ', '_')}_{index:03d}.jpg"
        filepath = os.path.join(directory, filename)
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
            
        print(f"Downloaded: {filename} <- {url}")
        return filepath
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def process_collection(collection_path, collection_name):
    """Process a single collection and download its full-size images"""
    collection_url = urljoin(BASE_URL, collection_path)
    print(f"\nProcessing collection: {collection_name} from {collection_url}")
    
    # Create collection directory
    collection_dir = os.path.join(OUTPUT_DIR, collection_name)
    os.makedirs(collection_dir, exist_ok=True)
    
    # Get page content
    try:
        response = requests.get(collection_url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Failed to fetch {collection_url}: {response.status_code}")
            return
            
        # Extract all full-size image URLs
        img_urls = extract_fullsize_image_urls(response.text)
        
        if not img_urls:
            print(f"No high-resolution images found for collection {collection_name}")
            return
            
        print(f"Found {len(img_urls)} high-resolution images")
        
        # Download images
        downloaded = 0
        for i, url in enumerate(img_urls):
            if download_image(url, collection_dir, i + 1, collection_name):
                downloaded += 1
                # Be nice to the server
                time.sleep(random.uniform(0.5, 1.5))
        
        print(f"Downloaded {downloaded} images for {collection_name}")
        
        # Create a metadata file with collection info
        soup = BeautifulSoup(response.text, 'html.parser')
        try:
            title_elem = soup.find(['h1', 'h2'], class_='title')
            description_elem = soup.find('p', class_='description')
            
            title = title_elem.text.strip() if title_elem else collection_name
            description = description_elem.text.strip() if description_elem else ""
            
            metadata = {
                "title": title,
                "description": description,
                "image_count": downloaded,
                "url": collection_url,
                "high_resolution": True
            }
            
            with open(os.path.join(collection_dir, "metadata.json"), 'w') as f:
                json.dump(metadata, f, indent=2)
                
        except Exception as e:
            print(f"Error creating metadata: {e}")
            
    except Exception as e:
        print(f"Error processing collection {collection_name}: {e}")

def main():
    """Main function to download all collections"""
    print("Starting download of high-resolution collection images...")
    
    # Create main output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Process each collection
    for path, name in COLLECTIONS.items():
        process_collection(path, name)
        # Wait between collections to be nice to the server
        time.sleep(random.uniform(1.0, 2.0))
        
    print("\nAll collections processed\!")

if __name__ == "__main__":
    main()
