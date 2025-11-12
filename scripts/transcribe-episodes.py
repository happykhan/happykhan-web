#!/usr/bin/env python3
"""
Transcribe MicroBinfie podcast episodes using Whisper.

This script:
1. Reads the SoundCloud RSS feed
2. Downloads missing MP3s to podcast_episode_audio/
3. Checks for existing transcripts in public/microbinfie-transcripts/
4. Uses Whisper to transcribe missing episodes
5. Updates MDX frontmatter with transcript links
"""

import os
import re
import sys
import requests
import xml.etree.ElementTree as ET
from pathlib import Path
import subprocess
import frontmatter

# Configuration
RSS_FEED_URL = "https://feeds.soundcloud.com/users/soundcloud:users:698218776/sounds.rss"
AUDIO_DIR = Path("podcast_episode_audio")
TRANSCRIPT_DIR = Path("public/microbinfie-transcripts")
CONTENT_DIR = Path("content/microbinfie")

def extract_episode_number(title):
    """Extract episode number from title."""
    # Match patterns like "Episode 123:" or "123:" at the start
    match = re.match(r'(?:Episode\s+)?(\d+):', title, re.IGNORECASE)
    if match:
        return int(match.group(1))
    # Try to extract from middle: "147 - NextFlow"
    match = re.match(r'(\d+)\s*[-–]\s*', title)
    if match:
        return int(match.group(1))
    return None

def extract_episode_number_from_filename(filename):
    """Extract episode number from MDX filename like mb-147-nextflow.mdx."""
    match = re.match(r'mb-(\d+)-', filename)
    if match:
        return int(match.group(1))
    return None

def generate_slug(title):
    """Generate slug from episode title."""
    # Remove "Episode X:" prefix
    clean_title = re.sub(r'^(?:Episode\s+)?\d+:\s*', '', title, flags=re.IGNORECASE)
    # Convert to lowercase and replace spaces/special chars
    slug = re.sub(r'[^\w\s-]', '', clean_title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def find_mdx_file_by_guid(guid):
    """Find MDX file matching the GUID."""
    for mdx_file in CONTENT_DIR.glob("mb-*.mdx"):
        try:
            post = frontmatter.load(mdx_file)
            if post.get('guid') == guid:
                return mdx_file
        except Exception as e:
            print(f"Error reading {mdx_file}: {e}")
    return None

def download_mp3(url, filename):
    """Download MP3 file if it doesn't exist."""
    filepath = AUDIO_DIR / filename
    
    if filepath.exists():
        print(f"  ✓ MP3 already exists: {filename}")
        return filepath
    
    print(f"  ⬇️  Downloading MP3: {filename}")
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"  ✓ Downloaded: {filename}")
        return filepath
    except Exception as e:
        print(f"  ❌ Error downloading {filename}: {e}")
        return None

def transcribe_audio(audio_path, output_path):
    """Transcribe audio using Whisper."""
    if output_path.exists():
        print(f"  ✓ Transcript already exists: {output_path.name}")
        return True
    
    print(f"  🎤 Transcribing with Whisper...")
    try:
        # Run whisper command
        # Using 'medium' model for good balance of speed/accuracy
        # Output as txt format
        cmd = [
            'whisper',
            str(audio_path),
            '--model', 'medium',
            '--output_format', 'txt',
            '--output_dir', str(TRANSCRIPT_DIR),
            '--language', 'en'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Whisper saves as {basename}.txt, we need to rename to episode-XXX.txt
        whisper_output = TRANSCRIPT_DIR / f"{audio_path.stem}.txt"
        if whisper_output.exists() and whisper_output != output_path:
            whisper_output.rename(output_path)
        
        print(f"  ✓ Transcribed: {output_path.name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ❌ Whisper error: {e.stderr}")
        return False
    except Exception as e:
        print(f"  ❌ Error transcribing: {e}")
        return False

def update_mdx_frontmatter(mdx_file, episode_num):
    """Add transcript link to MDX frontmatter."""
    try:
        post = frontmatter.load(mdx_file)
        transcript_path = f"/microbinfie-transcripts/episode-{episode_num}.txt"
        
        # Check if already has transcript link
        if post.get('transcript') == transcript_path:
            print(f"  ✓ Frontmatter already has transcript link")
            return
        
        # Add transcript to frontmatter
        post['transcript'] = transcript_path
        
        # Write back to file
        with open(mdx_file, 'wb') as f:
            frontmatter.dump(post, f)
        
        print(f"  ✓ Updated frontmatter with transcript link")
    except Exception as e:
        print(f"  ❌ Error updating frontmatter: {e}")

def main():
    """Main transcription workflow."""
    # Create directories if they don't exist
    AUDIO_DIR.mkdir(exist_ok=True)
    TRANSCRIPT_DIR.mkdir(exist_ok=True)
    
    # Check if whisper is installed
    try:
        subprocess.run(['whisper', '--help'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Whisper not found. Install with: pip install openai-whisper")
        sys.exit(1)
    
    print("📻 Fetching RSS feed...")
    try:
        response = requests.get(RSS_FEED_URL, timeout=30)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Error fetching RSS feed: {e}")
        sys.exit(1)
    
    # Parse RSS feed
    root = ET.fromstring(response.content)
    items = root.findall('.//item')
    
    print(f"\n📊 Found {len(items)} episodes in RSS feed\n")
    
    processed = 0
    skipped = 0
    
    for item in items:
        title = item.find('title').text
        guid = item.find('guid').text
        
        # Get audio URL
        enclosure = item.find('enclosure')
        if enclosure is None:
            continue
        audio_url = enclosure.get('url')
        
        # Find corresponding MDX file first (using GUID)
        mdx_file = find_mdx_file_by_guid(guid)
        if not mdx_file:
            print(f"⚠️  No MDX file found for: {title}")
            skipped += 1
            continue
        
        # Extract episode number from MDX filename
        episode_num = extract_episode_number_from_filename(mdx_file.name)
        if not episode_num:
            print(f"⚠️  Can't extract episode number from: {mdx_file.name}")
            skipped += 1
            continue
        
        print(f"\n{'='*60}")
        print(f"Episode {episode_num}: {title}")
        print(f"{'='*60}")
        print(f"  📄 MDX file: {mdx_file.name}")
        
        # Generate filenames
        slug = generate_slug(title)
        mp3_filename = f"MicroBinfie podcast - {episode_num:02d} - {slug}.mp3"
        transcript_filename = f"episode-{episode_num}.txt"
        transcript_path = TRANSCRIPT_DIR / transcript_filename
        
        # Download MP3
        mp3_path = download_mp3(audio_url, mp3_filename)
        if not mp3_path:
            skipped += 1
            continue
        
        # Transcribe if needed
        if not transcript_path.exists():
            if transcribe_audio(mp3_path, transcript_path):
                processed += 1
            else:
                skipped += 1
                continue
        else:
            print(f"  ✓ Transcript already exists: {transcript_filename}")
        
        # Update MDX frontmatter
        update_mdx_frontmatter(mdx_file, episode_num)
    
    print(f"\n{'='*60}")
    print(f"✅ Complete!")
    print(f"   Processed: {processed} new transcripts")
    print(f"   Skipped: {skipped} episodes")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
