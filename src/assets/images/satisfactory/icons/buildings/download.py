import json
import os
import urllib.request
from urllib.parse import urlparse, unquote, quote
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Configuration
JSON_FILE = 'links.json'  # Path to your JSON file with the links
OUTPUT_FOLDER = './'  # Folder where images will be downloaded
MAX_WORKERS = 5  # Number of concurrent downloads

# Thread-safe counter for progress
class ProgressCounter:
    def __init__(self, total):
        self.current = 0
        self.total = total
        self.lock = threading.Lock()

    def increment(self):
        with self.lock:
            self.current += 1
            return self.current

def download_single_image(url, output_folder, progress_counter):
    """Download a single image."""
    try:
        # Extract filename from URL
        path = urlparse(url).path
        filename = unquote(path.split('/')[-3])  # Get the filename before /revision/latest

        filepath = os.path.join(output_folder, filename)
        current = progress_counter.increment()
        total = progress_counter.total

        # Skip if file already exists
        if os.path.exists(filepath):
            print(f"[{current}/{total}] ⏭️  Skipped (already exists): {filename}")
            return True, filename

        print(f"[{current}/{total}] ⬇️  Downloading: {filename}")

        # Transform URL: replace spaces with underscores and URL-encode special chars
        parsed = urlparse(url)
        path_parts = parsed.path.split('/')

        # Process each part of the path
        encoded_parts = []
        for part in path_parts:
            if part:  # Skip empty parts
                # Replace spaces with underscores
                part = part.replace(' ', '_')
                # URL encode special characters (parentheses, etc.)
                part = quote(part, safe='')
            encoded_parts.append(part)

        encoded_path = '/'.join(encoded_parts)
        encoded_url = f"{parsed.scheme}://{parsed.netloc}{encoded_path}"
        if parsed.query:
            encoded_url += f"?{parsed.query}"

        # Download the file
        urllib.request.urlretrieve(encoded_url, filepath)

        print(f"[{current}/{total}] ✓ Downloaded: {filename}")

        # Small delay to be respectful to the server
        time.sleep(0.1)

        return True, filename

    except Exception as e:
        current = progress_counter.current
        total = progress_counter.total
        print(f"[{current}/{total}] ✗ Failed to download {url}: {str(e)}")
        return False, url

def download_images(links, output_folder, max_workers=MAX_WORKERS):
    """Download all images using multiple threads."""

    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    total = len(links)
    print(f"Starting download of {total} images to '{output_folder}/' with {max_workers} concurrent downloads...\n")

    progress_counter = ProgressCounter(total)
    successful = 0
    failed = 0

    # Use ThreadPoolExecutor for concurrent downloads
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all download tasks
        futures = {
            executor.submit(download_single_image, url, output_folder, progress_counter): url
            for url in links
        }

        # Process completed downloads
        for future in as_completed(futures):
            success, result = future.result()
            if success:
                successful += 1
            else:
                failed += 1

    print(f"\n✓ Download complete!")
    print(f"  Successfully downloaded: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Files saved to '{output_folder}/'")

def main():
    # Load links from JSON file
    try:
        with open(JSON_FILE, 'r') as f:
            links = json.load(f)
    except FileNotFoundError:
        print(f"Error: '{JSON_FILE}' not found.")
        print("Please save your JSON array to a file named 'links.json' in the same directory.")
        return
    except json.JSONDecodeError:
        print(f"Error: '{JSON_FILE}' is not valid JSON.")
        return

    if not links:
        print("No links found in JSON file.")
        return

    download_images(links, OUTPUT_FOLDER, MAX_WORKERS)

if __name__ == "__main__":
    main()