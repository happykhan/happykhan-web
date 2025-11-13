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

# Configuration
TRANSCRIPT_DIR = Path("public/microbinfie-transcripts")
CONTENT_DIR = Path("content/microbinfie")

# Hosts (should never be included as guests)
HOST_NAMES = [
    "Lee Katz",
    "Andrew Page",
    "Nabil-Fareed Alikhan",
    "Nabil Fareed Alikhan",
    "Nabil Ali Khan",
    "Nabil Alikhan",
]

def _normalize_name(name: str) -> str:
    s = name.lower()
    # remove common titles and punctuation
    for title in ["dr", "prof", "prof.", "professor"]:
        s = re.sub(rf"\b{title}\b\.?", "", s)
    s = re.sub(r"[^a-z]+", "", s)  # keep letters only
    return s

HOST_KEYS = { _normalize_name(n) for n in HOST_NAMES }

def is_host_name(name: str) -> bool:
    return _normalize_name(name) in HOST_KEYS

def normalize_brand_names(text: str) -> str:
    """Normalize any variant of the show name to 'microbinfie podcast' (lowercase)."""
    variants = [
        r"micro\s*binfie",
        r"micro\s*binfeed",
        r"microbinfie",
        r"microbinfeed",
        r"micro\s*binfeed\s*podcast",
        r"micro\s*binfie\s*podcast",
        r"microbinfie\s*podcast",
        r"microbinfeed\s*podcast",
        r"micro\s*bin fie",
        r"micro\s*bin feed",
    ]
    out = text
    for pat in variants:
        out = re.sub(pat, "microbinfie", out, flags=re.IGNORECASE)
    # Ensure we refer to the show as 'microbinfie podcast'
    out = re.sub(r"\bmicrobinfie\b(?!\s*podcast)", "microbinfie podcast", out, flags=re.IGNORECASE)
    # Collapse duplicates like 'microbinfie podcast podcast'
    out = re.sub(r"\bmicrobinfie podcast\s+podcast\b", "microbinfie podcast", out, flags=re.IGNORECASE)
    return out

def ensure_structured_summary(text: str) -> str:
    """Ensure the summary contains the required sections. If missing, add skeleton headings.
    - Requires '### Key Points' and '### Take-Home Messages'
    - Ensures three themed subsections under Key Points
    """
    t = text.strip()
    has_key_points = re.search(r"^###\s+Key\s+Points\s*$", t, flags=re.IGNORECASE | re.MULTILINE)
    has_take_home = re.search(r"^###\s+Take-Home\s+Messages\s*$", t, flags=re.IGNORECASE | re.MULTILINE)

    if not has_key_points:
        skeleton = (
            "\n\n### Key Points\n\n"
            "#### 1. Theme 1\n- Bullet points...\n\n"
            "#### 2. Theme 2\n- Bullet points...\n\n"
            "#### 3. Theme 3\n- Bullet points...\n"
        )
        t += skeleton

    if not has_take_home:
        t += (
            "\n\n### Take-Home Messages\n"
            "- Bullet 1  \n"
            "- Bullet 2  \n"
            "- Bullet 3\n"
        )

    return t

def load_anthropic_api_key():
    """Load Anthropic API key from environment or .credentials file."""
    if os.environ.get("ANTHROPIC_API_KEY"):
        return os.environ["ANTHROPIC_API_KEY"]
    cred_file = Path(".credentials")
    if cred_file.exists():
        try:
            with open(cred_file, 'r') as f:
                for line in f:
                    if line.startswith('ANTHROPIC_API_KEY='):
                        return line.split('=', 1)[1].strip()
        except Exception:
            pass
    return None

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
    # Lazy import to avoid hard dependency at module import time
    import anthropic
    api_key = os.environ.get("ANTHROPIC_API_KEY") or load_anthropic_api_key()
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not configured")
    # Ensure env is set for downstream SDK
    os.environ["ANTHROPIC_API_KEY"] = api_key
    client = anthropic.Anthropic(api_key=api_key)

    # Choose model: allow override via env; else use a robust fallback list
    model_override = os.environ.get("ANTHROPIC_MODEL")
    model_candidates = [
        model_override,
        "claude-3-5-sonnet-latest",
        "claude-3-5-haiku-latest",
        "claude-3-5-sonnet-20240620",
        "claude-3-haiku-20240307",
    ]
    model_candidates = [m for m in model_candidates if m]

    # Build prompt in two parts to avoid f-string brace issues
    prompt_header = (
        "You are analyzing a podcast episode transcript to enhance its metadata and content.\n\n"
        f"Episode: {title}\n"
        f"Episode Number: {episode_num}\n\n"
        "Current episode content (MDX):\n"
        f"{current_content if current_content else 'No content yet'}\n\n"
        "Existing guests in frontmatter:\n"
        f"{existing_guests if existing_guests else 'None'}\n\n"
        "Full transcript:\n"
        f"{transcript[:15000]}  # First 15k chars to avoid token limits\n\n"
    )

    prompt_static = """
Please analyze this transcript and provide:

1. Summary: Provide a structured markdown section to APPEND to the MDX using EXACTLY this layout (no extra headings). Use the phrase "microbinfie podcast" exactly when referring to the show. Ensure the summary is substantial (overview ~60–120 words; 2–4 bullets per theme):

[2–3 sentence high-level overview.]

### Key Points

#### 1. [Theme 1]
- Bullet points...

#### 2. [Theme 2]
- Bullet points...

#### 3. [Theme 3]
- Bullet points...

### Take-Home Messages
- Bullet 1  
- Bullet 2  
- Bullet 3  

2. Guests: List all guests mentioned with their names, affiliations, and any URLs mentioned (GitHub, Twitter, websites)
3. Tags: Generate 5-10 relevant tags for this episode (beyond the default "microbinfie" and "podcast")

Format your response as JSON (no code fences, no ellipses/placeholders like ...). Put the ENTIRE structured markdown block into the array 'summary_lines' (each markdown line as one string element):
{
  "summary_lines": ["line 1", "line 2", "line 3"],
  "guests": [
    {"name": "Full Name", "affiliation": "Institution/Role", "url": "https://..."}
  ],
  "tags": ["tag1", "tag2", "tag3"]
}

Important:
- Only include guests who are actually interviewed or featured (not just mentioned)
- For affiliations, include institution and role if mentioned
- For URLs, only include if explicitly mentioned in transcript
- Tags should be lowercase, hyphenated (e.g., "machine-learning", "genome-assembly")
- Include technical topics, software tools, organisms, and themes discussed
- Keep summary engaging and informative
- Do NOT wrap the JSON in code fences
- The summary MUST be valid GitHub-flavored Markdown and follow the layout above
- Do NOT include the hosts as guests under any circumstances. The hosts are: Lee Katz, Andrew Page, and Nabil-Fareed Alikhan.
"""

    prompt = prompt_header + prompt_static

    last_err = None
    for model in model_candidates:
        try:
            message = client.messages.create(
                model=model,
                max_tokens=2048,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            response_text = message.content[0].text

            # Extract JSON from response (might be wrapped in markdown code blocks)
            import json
            json_match = re.search(r'```(?:json)?\s*(\{[\s\S]*?\})\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)

            # Remove common placeholders/ellipses that break JSON
            response_text = response_text.replace("...,", "").replace(", ...", "").replace("...", "")

            data = json.loads(response_text)
            # Normalize summary: prefer summary_lines if present
            if isinstance(data, dict) and 'summary' not in data and 'summary_lines' in data:
                if isinstance(data['summary_lines'], list):
                    data['summary'] = "\n".join([str(x) for x in data['summary_lines']])

            # Post-process: brand normalization and structure enforcement
            if isinstance(data, dict) and 'summary' in data and isinstance(data['summary'], str):
                s = normalize_brand_names(data['summary'])
                s = ensure_structured_summary(s)
                data['summary'] = s

            return data

        except Exception as e:
            last_err = e
            # Try next model if this one fails (e.g., 404 not found)
            continue

    print(f"  ❌ AI enhancement error: {last_err}")
    return None

def update_episode_mdx(mdx_file, enhancements):
    """Update MDX file with AI-generated enhancements."""
    try:
        post = frontmatter.load(mdx_file)
        
        # Update guests if we found new ones
        if enhancements.get('guests'):
            # Filter out any hosts mistakenly included by the model
            filtered_guests = [g for g in enhancements['guests'] if not is_host_name(g.get('name', ''))]
            # Merge with existing guests, avoid duplicates
            existing_names = {g.get('name', '').lower() for g in post.get('guests', [])}
            new_guests = [
                g for g in filtered_guests 
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
        
        # Update content with summary: replace if minimal, else append/update marked block
        current_content = post.content.strip()
        summary_md = enhancements.get('summary')
        if summary_md:
            START_MARK = "<!-- AI ENHANCEMENT START -->"
            END_MARK = "<!-- AI ENHANCEMENT END -->"
            block = f"\n\n{START_MARK}\n{summary_md}\n{END_MARK}\n"

            if len(current_content) < 200:
                post.content = summary_md
                print(f"  ✅ Added AI-generated summary (replaced minimal content)")
            else:
                if START_MARK in current_content and END_MARK in current_content:
                    import re as _re
                    new_content = _re.sub(
                        _re.compile(_re.escape(START_MARK) + r"[\s\S]*?" + _re.escape(END_MARK), _re.MULTILINE),
                        f"{START_MARK}\n{summary_md}\n{END_MARK}",
                        current_content
                    )
                    post.content = new_content
                    print(f"  ✅ Updated AI-generated summary block")
                else:
                    post.content = current_content + block
                    print(f"  ✅ Appended AI-generated summary to end of content")
        
        # Write back to file
        with open(mdx_file, 'wb') as f:
            frontmatter.dump(post, f)
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error updating MDX: {e}")
        return False

def main():
    """Main enhancement workflow."""
    # Ensure API key present or in .credentials
    api_key = load_anthropic_api_key()
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not found (env or .credentials)")
        print("   Get your API key from: https://console.anthropic.com/")
        print("   Then either:\n     - export ANTHROPIC_API_KEY=...\n     - or add ANTHROPIC_API_KEY=... to .credentials")
        sys.exit(1)
    os.environ["ANTHROPIC_API_KEY"] = api_key
    
    # Check dependency lazily
    try:
        import anthropic  # noqa: F401
    except ImportError:
        print("❌ anthropic package not found. Install with:\n   pip install anthropic")
        sys.exit(1)
    
    if not TRANSCRIPT_DIR.exists():
        print(f"❌ Transcript directory not found: {TRANSCRIPT_DIR}")
        sys.exit(1)
    
    # Optional CLI filter: pass a start/end episode number (inclusive)
    # Usage examples:
    #   python scripts/enhance-episodes-from-transcripts.py 1 128
    #   python scripts/enhance-episodes-from-transcripts.py 1-128
    allowed = None
    if len(sys.argv) >= 2:
        arg1 = sys.argv[1]
        start = end = None
        if '-' in arg1 and len(sys.argv) == 2:
            try:
                s, e = arg1.split('-', 1)
                start, end = int(s), int(e)
            except ValueError:
                start = end = None
        elif len(sys.argv) >= 3:
            try:
                start = int(sys.argv[1])
                end = int(sys.argv[2])
            except ValueError:
                start = end = None
        if start is not None and end is not None and start <= end:
            allowed = set(range(start, end + 1))

    print("🤖 Starting AI-powered episode enhancement...\n")
    
    enhanced = 0
    skipped = 0
    errors = 0
    
    # Process all MDX files
    for mdx_file in sorted(CONTENT_DIR.glob("mb-*.mdx")):
        episode_num = extract_episode_number_from_filename(mdx_file.name)
        
        if not episode_num:
            continue
        # Apply filter if provided
        if allowed is not None and episode_num not in allowed:
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
