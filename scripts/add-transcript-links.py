#!/usr/bin/env python3
"""
Add transcript links to MicroBinfie episode frontmatter.

This script checks for existing transcripts and adds the link to the frontmatter.
"""

import re
from pathlib import Path
import frontmatter

# Configuration
TRANSCRIPT_DIR = Path("public/microbinfie-transcripts")
CONTENT_DIR = Path("content/microbinfie")

def extract_episode_number_from_filename(filename):
    """Extract episode number from MDX filename like mb-147-nextflow.mdx."""
    match = re.match(r'mb-(\d+)-', filename)
    if match:
        return int(match.group(1))
    return None

def main():
    """Add transcript links to MDX frontmatter."""
    
    if not TRANSCRIPT_DIR.exists():
        print(f"❌ Transcript directory not found: {TRANSCRIPT_DIR}")
        return
    
    # Get all existing transcripts
    transcripts = {
        int(re.search(r'episode-(\d+)\.txt', f.name).group(1)): f
        for f in TRANSCRIPT_DIR.glob("episode-*.txt")
        if re.search(r'episode-(\d+)\.txt', f.name)
    }
    
    print(f"📝 Found {len(transcripts)} transcript files\n")
    
    updated = 0
    skipped = 0
    
    # Process all MDX files
    for mdx_file in sorted(CONTENT_DIR.glob("mb-*.mdx")):
        episode_num = extract_episode_number_from_filename(mdx_file.name)
        
        if not episode_num:
            print(f"⚠️  Can't extract episode number: {mdx_file.name}")
            skipped += 1
            continue
        
        # Check if transcript exists for this episode
        if episode_num not in transcripts:
            print(f"⏭️  Episode {episode_num:3d}: No transcript - {mdx_file.name}")
            skipped += 1
            continue
        
        try:
            # Load the MDX file
            post = frontmatter.load(mdx_file)
            transcript_path = f"/microbinfie-transcripts/episode-{episode_num:02d}.txt"
            
            # Check if already has correct transcript link
            if post.get('transcript') == transcript_path:
                print(f"✓  Episode {episode_num:3d}: Already has transcript - {mdx_file.name}")
                skipped += 1
                continue
            
            # Add transcript to frontmatter
            post['transcript'] = transcript_path
            
            # Write back to file
            with open(mdx_file, 'wb') as f:
                frontmatter.dump(post, f)
            
            print(f"✅ Episode {episode_num:3d}: Added transcript link - {mdx_file.name}")
            updated += 1
            
        except Exception as e:
            print(f"❌ Episode {episode_num:3d}: Error - {e}")
            skipped += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Complete!")
    print(f"   Updated: {updated} files")
    print(f"   Skipped: {skipped} files")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
