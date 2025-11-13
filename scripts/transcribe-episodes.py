#!/usr/bin/env python3
"""
Transcribe MicroBinfie podcast episodes using OpenAI Whisper API.

This script:
1. Reads the SoundCloud RSS feed
2. Downloads missing MP3s to podcast_episode_audio/
3. Checks for existing transcripts in public/microbinfie-transcripts/
4. Uses OpenAI Whisper API to transcribe missing episodes
5. Updates MDX frontmatter with transcript links
"""

import os
import re
import sys
import requests
import xml.etree.ElementTree as ET
from pathlib import Path
import frontmatter
from openai import OpenAI
from pydub import AudioSegment
from mutagen import File as MutagenFile
import io
import subprocess
import shlex
import tempfile
import imageio_ffmpeg

# Configuration
RSS_FEED_URL = "https://feeds.soundcloud.com/users/soundcloud:users:698218776/sounds.rss"
AUDIO_DIR = Path("podcast_episode_audio")
TRANSCRIPT_DIR = Path("public/microbinfie-transcripts")
CONTENT_DIR = Path("content/microbinfie")

# Load OpenAI API key from .credentials file
def load_api_key():
    """Load OpenAI API key from .credentials file."""
    credentials_file = Path(".credentials")
    if not credentials_file.exists():
        return None
    
    with open(credentials_file, 'r') as f:
        for line in f:
            if line.startswith('OPENAI_API_KEY='):
                return line.split('=', 1)[1].strip()
    return None

# Ensure pydub finds an ffmpeg binary via imageio-ffmpeg (no system install needed)
def ensure_ffmpeg_available():
    """Ensure ffmpeg is available via imageio-ffmpeg and on PATH.
    Returns the full path to ffmpeg if available, otherwise None.
    """
    try:
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        ffmpeg_dir = os.path.dirname(ffmpeg_path)
        os.environ['PATH'] = ffmpeg_dir + os.pathsep + os.environ.get('PATH', '')
        return ffmpeg_path
    except Exception:
        return None

def get_audio_duration_seconds(audio_path: Path) -> float:
    """Get duration in seconds using mutagen (no decoding)."""
    try:
        mf = MutagenFile(str(audio_path))
        if mf is not None and mf.info is not None and hasattr(mf.info, 'length'):
            return float(mf.info.length)
    except Exception:
        pass
    # Fallback: parse duration from ffmpeg -i output to avoid requiring ffprobe
    ffmpeg_path = ensure_ffmpeg_available()
    if not ffmpeg_path:
        raise RuntimeError("ffmpeg not available for duration fallback")
    try:
        # ffmpeg prints info to stderr
        proc = subprocess.run(
            [ffmpeg_path, '-i', str(audio_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
            text=True
        )
        out = proc.stderr
        # Look for: Duration: 00:03:12.34,
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+)[\.,](\d+)", out)
        if m:
            h, m_, s, cs = m.groups()
            seconds = int(h) * 3600 + int(m_) * 60 + int(s) + int(cs) / 100.0
            return float(seconds)
    except Exception:
        pass
    raise RuntimeError("Unable to determine audio duration")

def chunk_audio_to_bytes(audio_path: Path, max_seconds: int = 1200):
    """Yield (offset_seconds, chunk_bytes_io) for each chunk <= max_seconds.
    Uses ffmpeg (from imageio-ffmpeg) directly; no ffprobe required.
    """
    ffmpeg_path = ensure_ffmpeg_available()
    if not ffmpeg_path:
        raise RuntimeError("ffmpeg binary not available (imageio-ffmpeg)")

    # Determine total duration via mutagen/ffmpeg fallback
    total_seconds = get_audio_duration_seconds(audio_path)
    start_sec = 0.0
    while start_sec < total_seconds:
        remaining = total_seconds - start_sec
        this_len = min(max_seconds, remaining)
        # Use ffmpeg to output a clipped MP3 chunk to stdout
        cmd = [
            ffmpeg_path,
            '-ss', str(start_sec),
            '-t', str(this_len),
            '-i', str(audio_path),
            '-vn',
            '-acodec', 'libmp3lame',
            '-b:a', '128k',
            '-f', 'mp3',
            'pipe:1'
        ]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if proc.returncode != 0:
            raise RuntimeError(f"ffmpeg failed to produce chunk at {start_sec}s: {proc.stderr.decode(errors='ignore')[:200]}")
        buf = io.BytesIO(proc.stdout)
        buf.name = "chunk.mp3"
        buf.seek(0)
        yield (start_sec, buf)
        start_sec += this_len

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

def transcribe_audio(audio_path, output_path, client):
    """Transcribe audio using GPT-4o diarization, auto-chunking client-side if needed.
    - Chunks to <=1200s to satisfy model's 1400s max duration per request.
    - Concatenates diarized segments, adjusts timestamps, and writes a readable transcript.
    """
    if output_path.exists():
        print(f"  ✓ Transcript already exists: {output_path.name}")
        return True

    print(f"  🎤 Transcribing with GPT-4o (speaker diarization, chunked)...")
    try:
        duration = get_audio_duration_seconds(audio_path)
        # Collect combined segments across chunks
        combined_segments = []
        chunk_idx = 1
        for offset_sec, chunk_bytes in chunk_audio_to_bytes(audio_path, max_seconds=1200):
            # Insert a visible marker for each chunk boundary
            combined_segments.append({
                'marker': True,
                'start': offset_sec,
                'index': chunk_idx
            })
            response = client.audio.transcriptions.create(
                model="gpt-4o-transcribe-diarize",
                file=chunk_bytes,
                response_format="diarized_json",
                chunking_strategy="auto"
            )
            # Merge segments with offset
            if hasattr(response, 'segments') and response.segments:
                for seg in response.segments:
                    # Normalize speaker label to a short token
                    spk = getattr(seg, 'speaker', 'Unknown')
                    text = getattr(seg, 'text', '').strip()
                    start = float(getattr(seg, 'start', 0.0)) + offset_sec
                    end = float(getattr(seg, 'end', 0.0)) + offset_sec
                    if text:
                        combined_segments.append({
                            'speaker': spk,
                            'text': text,
                            'start': start,
                            'end': end,
                        })
            chunk_idx += 1

        if not combined_segments:
            print("  ❌ No segments returned from diarization")
            return False

        # Sort segments by start time and format
        combined_segments.sort(key=lambda s: s['start'])
        transcript_text = format_diarized_transcript_from_list(combined_segments)

        # Save transcript
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(transcript_text)

        print(f"  ✓ Transcribed with speaker diarization: {output_path.name}")
        return True

    except Exception as e:
        print(f"  ❌ Transcription error: {e}")
        return False

def format_diarized_transcript(response):
    """Backwards-compatible formatter if a single-response object is provided."""
    if not hasattr(response, 'segments'):
        return str(response)
    segs = []
    for seg in response.segments:
        if getattr(seg, 'text', '').strip():
            segs.append({
                'speaker': getattr(seg, 'speaker', 'Unknown'),
                'text': getattr(seg, 'text').strip(),
                'start': float(getattr(seg, 'start', 0.0)),
                'end': float(getattr(seg, 'end', 0.0)),
            })
    segs.sort(key=lambda s: s['start'])
    return format_diarized_transcript_from_list(segs)

def format_diarized_transcript_from_list(segments):
    """Format a list of diarized segments into readable blocks per speaker.
    Output per block: [HH:MM:SS] [Speaker X]: text
    """
    def fmt_time(seconds: float) -> str:
        seconds = int(seconds)
        h = seconds // 3600
        m = (seconds % 3600) // 60
        s = seconds % 60
        return f"{h:02d}:{m:02d}:{s:02d}"
    transcript_lines = []
    current_speaker = None
    current_text = []
    block_start = None
    for seg in segments:
        # Handle inserted chunk markers
        if seg.get('marker'):
            # Flush pending speaker block before marker
            if current_speaker and current_text:
                # Write with start-only timestamp for the block
                start_str = fmt_time(block_start if block_start is not None else 0)
                transcript_lines.append(
                    f"[{start_str}] [Speaker {current_speaker}]: {' '.join(current_text)}\n"
                )
                current_speaker = None
                current_text = []
                block_start = None
            idx = seg.get('index', 0)
            t = fmt_time(seg.get('start', 0.0))
            transcript_lines.append(f"----- chunk {idx} start @ {t} -----\n")
            continue

        speaker = seg['speaker']
        text = seg['text']
        if speaker != current_speaker:
            if current_speaker and current_text:
                # Close previous block with start-only timestamp
                start_str = fmt_time(block_start if block_start is not None else 0)
                transcript_lines.append(
                    f"[{start_str}] [Speaker {current_speaker}]: {' '.join(current_text)}\n"
                )
            current_speaker = speaker
            current_text = [text]
            block_start = seg['start']
        else:
            current_text.append(text)
            # Keep earliest start; end time not shown in start-only mode
    if current_speaker and current_text:
        start_str = fmt_time(block_start if block_start is not None else 0)
        transcript_lines.append(
            f"[{start_str}] [Speaker {current_speaker}]: {' '.join(current_text)}\n"
        )
    return "\n".join(transcript_lines)

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
    
    # Load OpenAI API key
    api_key = load_api_key()
    if not api_key:
        print("❌ OpenAI API key not found in .credentials file")
        print("   Add to .credentials: OPENAI_API_KEY=sk-...")
        sys.exit(1)
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    print("✅ OpenAI API key loaded\n")
    
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

    # Optional CLI filter: pass episode numbers to process, e.g.
    #   python scripts/transcribe-episodes.py 145 146
    allowed_episode_nums = set()
    for arg in sys.argv[1:]:
        try:
            allowed_episode_nums.add(int(arg))
        except ValueError:
            pass
    
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

        # Apply optional CLI filter
        if allowed_episode_nums and episode_num not in allowed_episode_nums:
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
            if transcribe_audio(mp3_path, transcript_path, client):
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
