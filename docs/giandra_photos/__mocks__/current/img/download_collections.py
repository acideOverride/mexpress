#\!/usr/bin/env python3
"""
Script to download all collections and their images from eau-prodigieuse.fr
"""

import requests
from bs4 import BeautifulSoup
import os
import time
import re
import json
from urllib.parse import urljoin

BASE_URL = "https://eau-prodigieuse.fr"
OUTPUT_DIR = "/opt/mExpress/docs/giandra_photos/__mocks__/current/img"

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

def extract_img_urls(soup):
    """Extract image URLs from soup"""
    img_urls = []
    
    # Find all image elements
    for img in soup.find_all('img'):
        # Try srcset first (for responsive images)
        if img.get('srcset'):
            srcset = img['srcset']
            # Get the largest image from srcset (usually the last one)
            parts = srcset.split(',')
            for part in reversed(parts):
                url = part.strip().split(' ')[0]
                if url and url.startswith('http'):
                    img_urls.append(url)
                    break
        # Fallback to src attribute
        elif img.get('src') and img['src'].startswith('http'):
            img_urls.append(img['src'])
            
    # Find image URLs in background-image styles
    for div in soup.find_all(['div', 'span']):
        style = div.get('style', '')
        if 'background-image' in style:
            url_match = re.search(r'url\([\'"]?(.*?)[\'"]?\)', style)
            if url_match and url_match.group(1).startswith('http'):
                img_urls.append(url_match.group(1))
                
    # Look for JSON data that might contain image URLs
    scripts = soup.find_all('script', type='application/json')
    for script in scripts:
        try:
            data = json.loads(script.string)
            # Recursively search for image URLs in JSON
            img_urls.extend(extract_urls_from_json(data))
        except:
            pass
            
    # Filter for likely artwork images (exclude icons, small thumbnails)
    filtered_urls = []
    for url in img_urls:
        # Look for common image file extensions
        if re.search(r'\.(jpe?g|png|gif|webp)($|\?)', url, re.IGNORECASE):
            # Exclude small images and icons by looking at the URL
            if not re.search(r'(icon|logo|avatar|thumbnail|small)', url, re.IGNORECASE):
                filtered_urls.append(url)
    
    return filtered_urls

def extract_urls_from_json(data):
    """Recursively extract image URLs from JSON data"""
    urls = []
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                urls.extend(extract_urls_from_json(value))
            elif isinstance(value, str) and re.search(r'\.(jpe?g|png|gif|webp)($|\?)', value, re.IGNORECASE):
                if value.startswith('http'):
                    urls.append(value)
    elif isinstance(data, list):
        for item in data:
            urls.extend(extract_urls_from_json(item))
    return urls

def download_image(url, directory, index):
    """Download an image and save it to the specified directory"""
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            return None
            
        # Extract file extension from the URL or default to jpg
        if '.' in url.split('/')[-1]:
            ext = url.split('/')[-1].split('.')[-1].split('?')[0].lower()
            # Sanitize extension
            if ext not in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                ext = 'jpg'
        else:
            ext = 'jpg'
            
        filename = f"image_{index:03d}.{ext}"
        filepath = os.path.join(directory, filename)
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
            
        print(f"Downloaded: {filename} <- {url}")
        return filepath
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def process_collection(collection_path, collection_name):
    """Process a single collection and download its images"""
    collection_url = urljoin(BASE_URL, collection_path)
    print(f"\nProcessing collection: {collection_name} from {collection_url}")
    
    # Create collection directory
    collection_dir = os.path.join(OUTPUT_DIR, collection_name)
    os.makedirs(collection_dir, exist_ok=True)
    
    # Get page content
    soup = get_soup(collection_url)
    if not soup:
        return
        
    # Extract image URLs
    img_urls = extract_img_urls(soup)
    if not img_urls:
        print(f"No images found for collection {collection_name}")
        return
        
    print(f"Found {len(img_urls)} images")
    
    # Download images
    downloaded = 0
    for i, url in enumerate(img_urls):
        if downloaded >= 20:  # Limit to 20 images per collection to avoid overloading
            break
            
        if download_image(url, collection_dir, i + 1):
            downloaded += 1
            # Be nice to the server
            time.sleep(0.5)
    
    print(f"Downloaded {downloaded} images for {collection_name}")
    
    # Create a metadata file with collection info
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
        }
        
        with open(os.path.join(collection_dir, "metadata.json"), 'w') as f:
            json.dump(metadata, f, indent=2)
            
    except Exception as e:
        print(f"Error creating metadata: {e}")

def main():
    """Main function to download all collections"""
    print("Starting download of all collections...")
    
    # Create main output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Process each collection
    for path, name in COLLECTIONS.items():
        process_collection(path, name)
        # Wait between collections to be nice to the server
        time.sleep(1)
        
    print("\nAll collections processed\!")

if __name__ == "__main__":
    main()
