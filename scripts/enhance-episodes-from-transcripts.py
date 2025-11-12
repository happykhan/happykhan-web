#!/usr/bin/env python3
"""
Enhance MicroBinfie episode MDX files using transcript content.

This script:
1. Reads transcript files
2. Uses AI to generate summaries
3. Extracts guest information
4. Generates relevant tags
5. Updates MDX frontmatter and content
"""

import os
import re
import sys
from pathlib import Path
import frontmatter
import anthropic

# Configuration
TRANSCRIPT_DIR = Path("public/microbinfie-transcripts")
CONTENT_DIR = Path("content/microbinfie")

def extract_episode_number_from_filename(filename):
    """Extract episode number from MDX filename like mb-147-nextflow.mdx."""
    match = re.match(r'mb-(\d+)-', filename)
    if match:
        return int(match.group(1))
    return None

def read_transcript(episode_num):
    """Read transcript file for an episode."""
    transcript_file = TRANSCRIPT_DIR / f"episode-{episode_num:02d}.txt"
    if not transcript_file.exists():
        return None
    
    try:
        with open(transcript_file, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"  ❌ Error reading transcript: {e}")
        return None

def enhance_episode_with_ai(episode_num, title, current_content, transcript, existing_guests):
    """Use Claude to analyze transcript and generate enhancements."""
    
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    prompt = f"""You are analyzing a podcast episode transcript to enhance its metadata and content.

Episode: {title}
Episode Number: {episode_num}

Current episode content (MDX):
{current_content if current_content else "No content yet"}

Existing guests in frontmatter:
{existing_guests if existing_guests else "None"}

Full transcript:
{transcript[:15000]}  # First 15k chars to avoid token limits

Please analyze this transcript and provide:

1. **Summary**: Write a 2-3 paragraph summary of the episode content (in markdown format)
2. **Guests**: List all guests mentioned with their names, affiliations, and any URLs mentioned (GitHub, Twitter, websites)
3. **Tags**: Generate 5-10 relevant tags for this episode (beyond the default "microbinfie" and "podcast")

Format your response as JSON:
{{
  "summary": "markdown formatted summary here",
  "guests": [
    {{"name": "Full Name", "affiliation": "Institution/Role", "url": "https://..."}},
    ...
  ],
  "tags": ["tag1", "tag2", "tag3", ...]
}}

Important:
- Only include guests who are actually interviewed or featured (not just mentioned)
- For affiliations, include institution and role if mentioned
- For URLs, only include if explicitly mentioned in transcript
- Tags should be lowercase, hyphenated (e.g., "machine-learning", "genome-assembly")
- Include technical topics, software tools, organisms, and themes discussed
- Keep summary engaging and informative"""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.content[0].text
        
        # Extract JSON from response (might be wrapped in markdown code blocks)
        import json
        json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)
        
        return json.loads(response_text)
        
    except Exception as e:
        print(f"  ❌ AI enhancement error: {e}")
        return None

def update_episode_mdx(mdx_file, enhancements):
    """Update MDX file with AI-generated enhancements."""
    try:
        post = frontmatter.load(mdx_file)
        
        # Update guests if we found new ones
        if enhancements.get('guests'):
            # Merge with existing guests, avoid duplicates
            existing_names = {g.get('name', '').lower() for g in post.get('guests', [])}
            new_guests = [
                g for g in enhancements['guests'] 
                if g.get('name', '').lower() not in existing_names
            ]
            
            if new_guests:
                current_guests = post.get('guests', [])
                post['guests'] = current_guests + new_guests
                print(f"  ✅ Added {len(new_guests)} new guest(s)")
        
        # Add new tags
        if enhancements.get('tags'):
            current_tags = post.get('tags', [])
            # Keep existing tags, add new ones
            existing_tag_set = set(current_tags)
            new_tags = [t for t in enhancements['tags'] if t not in existing_tag_set]
            
            if new_tags:
                post['tags'] = current_tags + new_tags
                print(f"  ✅ Added {len(new_tags)} new tag(s): {', '.join(new_tags)}")
        
        # Update content with summary if current content is minimal
        current_content = post.content.strip()
        if enhancements.get('summary') and len(current_content) < 200:
            post.content = enhancements['summary']
            print(f"  ✅ Added AI-generated summary")
        elif enhancements.get('summary'):
            print(f"  ℹ️  Episode already has content, skipping summary")
        
        # Write back to file
        with open(mdx_file, 'wb') as f:
            frontmatter.dump(post, f)
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error updating MDX: {e}")
        return False

def main():
    """Main enhancement workflow."""
    
    # Check for API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("❌ ANTHROPIC_API_KEY environment variable not set")
        print("   Get your API key from: https://console.anthropic.com/")
        print("   Then run: export ANTHROPIC_API_KEY='your-key-here'")
        sys.exit(1)
    
    # Check dependencies
    try:
        import anthropic
    except ImportError:
        print("❌ anthropic package not found. Install with:")
        print("   pip install anthropic")
        sys.exit(1)
    
    if not TRANSCRIPT_DIR.exists():
        print(f"❌ Transcript directory not found: {TRANSCRIPT_DIR}")
        sys.exit(1)
    
    print("🤖 Starting AI-powered episode enhancement...\n")
    
    enhanced = 0
    skipped = 0
    errors = 0
    
    # Process all MDX files
    for mdx_file in sorted(CONTENT_DIR.glob("mb-*.mdx")):
        episode_num = extract_episode_number_from_filename(mdx_file.name)
        
        if not episode_num:
            continue
        
        # Load episode data
        try:
            post = frontmatter.load(mdx_file)
            title = post.get('title', mdx_file.name)
        except Exception as e:
            print(f"❌ Error reading {mdx_file.name}: {e}")
            errors += 1
            continue
        
        print(f"\n{'='*60}")
        print(f"Episode {episode_num}: {title}")
        print(f"{'='*60}")
        
        # Read transcript
        transcript = read_transcript(episode_num)
        if not transcript:
            print(f"  ⏭️  No transcript available")
            skipped += 1
            continue
        
        print(f"  📝 Transcript loaded ({len(transcript)} chars)")
        
        # Get current state
        current_content = post.content.strip()
        existing_guests = post.get('guests', [])
        
        print(f"  🤖 Analyzing with Claude...")
        
        # Get AI enhancements
        enhancements = enhance_episode_with_ai(
            episode_num,
            title,
            current_content,
            transcript,
            existing_guests
        )
        
        if not enhancements:
            print(f"  ❌ Failed to get AI enhancements")
            errors += 1
            continue
        
        # Update MDX file
        if update_episode_mdx(mdx_file, enhancements):
            enhanced += 1
        else:
            errors += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Enhancement complete!")
    print(f"   Enhanced: {enhanced} episodes")
    print(f"   Skipped: {skipped} episodes (no transcript)")
    print(f"   Errors: {errors} episodes")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
