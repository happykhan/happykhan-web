#!/usr/bin/env python3
"""
Test OpenAI GPT-4o transcription with diarization using a small audio clip.
"""

from pathlib import Path
from openai import OpenAI
import io

# Load API key
def load_api_key():
    credentials_file = Path(".credentials")
    if not credentials_file.exists():
        return None
    
    with open(credentials_file, 'r') as f:
        for line in f:
            if line.startswith('OPENAI_API_KEY='):
                return line.split('=', 1)[1].strip()
    return None

def extract_first_30_seconds_mp3(file_path):
    """Extract approximately the first 30 seconds by reading partial file."""
    # For MP3, we can't easily extract exactly 30s without ffmpeg
    # But we can read first ~500KB which is roughly 30s of audio at typical bitrates
    max_bytes = 500 * 1024  # 500KB should be ~30 seconds
    
    with open(file_path, 'rb') as f:
        return f.read(max_bytes)

# Get a test audio file
audio_file = Path("podcast_episode_audio/MicroBinfie podcast - 147 - 147-nextflow-debate-2.mp3")

if not audio_file.exists():
    print("❌ Test audio file not found")
    print(f"   Looking for: {audio_file}")
    exit(1)

print(f"📁 Test file: {audio_file.name}")
print(f"📏 Full file size: {audio_file.stat().st_size / (1024*1024):.2f} MB")

# Extract first 30 seconds (approximate)
print("✂️  Extracting first ~30 seconds...\n")
audio_clip = extract_first_30_seconds_mp3(audio_file)
print(f"📏 Test clip size: {len(audio_clip) / 1024:.2f} KB\n")

# Load API key
api_key = load_api_key()
if not api_key:
    print("❌ No API key found in .credentials")
    exit(1)

print("✅ API key loaded")

# Initialize client
client = OpenAI(api_key=api_key)

print("🎤 Testing GPT-4o transcription with diarization...\n")

try:
    # Create a file-like object from bytes
    audio_file_obj = io.BytesIO(audio_clip)
    audio_file_obj.name = "test_clip.mp3"
    
    response = client.audio.transcriptions.create(
        model="gpt-4o-transcribe-diarize",
        file=audio_file_obj,
        response_format="diarized_json",
        chunking_strategy="auto"
    )
    
    print("✅ Transcription successful!\n")
    print(f"Response type: {type(response)}")
    print(f"Has segments: {hasattr(response, 'segments')}")
    
    if hasattr(response, 'segments'):
        print(f"Number of segments: {len(response.segments)}\n")
        
        # Show all segments from the clip
        print("All segments:")
        for i, segment in enumerate(response.segments):
            print(f"\nSegment {i+1}:")
            print(f"  Speaker: {segment.speaker if hasattr(segment, 'speaker') else 'N/A'}")
            print(f"  Text: {segment.text if hasattr(segment, 'text') else 'N/A'}")
            print(f"  Start: {segment.start if hasattr(segment, 'start') else 'N/A'}s")
            print(f"  End: {segment.end if hasattr(segment, 'end') else 'N/A'}s")
    else:
        print("Raw response:")
        print(response)
    
    print("\n✅ Test completed successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
