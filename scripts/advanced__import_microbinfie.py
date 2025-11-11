import requests
from openai import OpenAI
from bs4 import BeautifulSoup
from os import  path, getenv, makedirs
from datetime import datetime
import textwrap
import argparse
from pydub import AudioSegment
from dotenv import load_dotenv
import logging 
import re
rss_feed  = 'https://feeds.soundcloud.com/users/soundcloud:users:698218776/sounds.rss'

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_credentials(crendentials_file=".credentials"):
    load_dotenv(crendentials_file)
    credentials = {
        'OPENAI_API_KEY': getenv('OPENAI_API_KEY')
    }
    return credentials

def binfie_rss(rss_feed):
    r = requests.get(rss_feed)
    soup = BeautifulSoup(r.content, features='html.parser')
    articles = soup.findAll('item')      
    article_list = []
    for a in articles:
        title = a.find('title').text.replace(':', ' ')
        episode_number_regex = re.match(r'(\d+)\s', title)
        if episode_number_regex:
            episode_number = episode_number_regex.group(1)
        else:
            episode_number = None
        safe_name = a.find('link').next.strip().split('/')[-1]
        mp3_url = a.find('enclosure')['url']
        link = a.find('link').next.strip()
        tidy_date = ' '.join(a.find('pubdate').text.split(' ')[:4])
        published = datetime.strptime(tidy_date, "%a, %d %b %Y")
        desc = a.find('itunes:summary').next
        track_id = a.find('guid').next.split('/')[1]
        emb = f'<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{track_id}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/microbinfie" title="Micro Binfie Podcast" target="_blank" style="color: #cccccc; text-decoration: none;">Micro Binfie Podcast</a> · <a href="https://soundcloud.com/microbinfie/40-a-crash-course-in-sars-cov-2-bioinformatics" title="{title}" target="_blank" style="color: #cccccc; text-decoration: none;">40 A crash course in SARS-CoV-2 bioinformatics</a></div>'

        # emb =  f'{link}'
        article = {
            'title': title,
            'link': link,
            'description': desc,
            'published': published, 
            'safe_name': safe_name,
            'embed': emb,
            'mp3_url': mp3_url,
            'episode_number': episode_number
            }
        article_list.append(article)
    return article_list

# Transcribe the audio file with OpenAI Whisper
def transcribe_audio(filename):
    client = OpenAI()
    audio = AudioSegment.from_mp3(filename)
    chunk_length_ms = 10 * 60 * 1000  # 10 minutes in milliseconds
    chunks = [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]

    transcriptions = []
    for i, chunk in enumerate(chunks):
        chunk_filename = f"chunk_{i}.mp3"
        chunk.export(chunk_filename, format="mp3")
        with open(chunk_filename, "rb") as chunk_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=chunk_file,
                response_format="text",
            )
            transcriptions.append(transcription)

    transcription_text = " ".join(transcriptions)
    return transcription_text

def create_assistants():

    client = OpenAI()

    summary_assistant = client.beta.assistants.create(
    name="Microbinfie Summary Assistant",
    instructions="""Extract the key points specifically related to microbial bioinformatics from the following podcast transcript. 
    Focus on the most relevant insights, technical discussions, tools, methodologies, and challenges mentioned in the field. 
    Present the key points clearly and concisely. Include main topics covered. Format as Markdown. Italisize scientific names and technical terms. Do not include a markdown block ```. Do not include a title.""",
    model="gpt-4o",
    )

    tidy_assistant = client.beta.assistants.create(
        name="Microbinfie tidyup Assistant",
        instructions="""Convert text into markdown. Clean up any formatting issues. Italisize scientific names and technical terms.""",
        model="gpt-4o",
    )

    return summary_assistant, tidy_assistant

def summarise_transcript(filename, summary_assistant):
        client = OpenAI()        
        summary_points = [] 
        with open(filename, "r") as transcript_file:
            words = transcript_file.read().split(' ')
            chunk_size = 10000
            
            chunks = [words[i:i + chunk_size] for i in range(150, len(words) - 100, chunk_size)]
            
            for chunk in chunks:
                prompt = f"{chunk}."
                thread = client.beta.threads.create(
                messages=[
                    {
                    "role": "user",
                    "content": prompt,
                    }
                ]
                )
                run = client.beta.threads.runs.create_and_poll(
                    thread_id=thread.id,
                    assistant_id=summary_assistant.id
                )
                if run.status == 'completed': 
                    logging.info("Fetch complete, now fetching summary...")
                    messages = client.beta.threads.messages.list(thread_id=thread.id)
                    for content_row in messages.data[0].content:
                            summary_points.append(content_row.text.value)
                else:
                    logging.info(run.status)
        return ' '.join(summary_points)


def make_final_summary(clean_desc, tidy_assistant):
    client = OpenAI() 
    prompt = clean_desc
    thread = client.beta.threads.create(
    messages=[
        {
        "role": "user",
        "content": prompt,
        }
    ]
    )
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=tidy_assistant.id
    )
    final_summary = []     
    if run.status == 'completed': 
        logging.info("Fetch complete, now fetching summary...")
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        for content_row in messages.data[0].content:
                final_summary.append(content_row.text.value)
    else:
        logging.info(run.status)
    final_text = ' '.join(final_summary)
    return final_text

# Main function to execute the workflow
def main():
    logging.info('Starting scraping')
    load_credentials()
    summary_assistant, tidy_assistant = create_assistants()

    makedirs(args.work_dir, exist_ok=True)
    # Ensure transcript directory exists (now under public for direct serving)
    makedirs(args.transcript_dir, exist_ok=True)

    for article in binfie_rss(rss_feed):
        dir_name = 'content/microbinfie/' 
        safe_title = re.sub(r'^\d+\s*', '', article['title'])  # Remove leading numbers
        safe_title = re.sub(r'[^\w\s-]', '', safe_title).strip().lower().replace(' ', '-')
        if article['episode_number']:
            index_file = path.join(dir_name,  'mb-' + article['episode_number'] + '-' + safe_title + ".mdx")
            if not path.exists(index_file):
                clean_desc = textwrap.fill(article["description"])
                episode_number = article['episode_number']
                transcript_path = path.join(args.transcript_dir, 'episode-' + episode_number + '.txt')
                # Download the audio file if not found 
                mp3_filepath = path.join(args.work_dir, f"MicroBinfie podcast - {episode_number} - {safe_title}.mp3")
                if not path.exists(mp3_filepath) or path.getsize(mp3_filepath) == 0:
                    logging.info(f"Downloading {article['mp3_url']} to {mp3_filepath}")
                    response = requests.get(article['mp3_url'])
                    with open(mp3_filepath, 'wb') as mp3_file:
                        mp3_file.write(response.content)
                # Transcribe the audio file if not found
                if not path.exists(transcript_path) or path.getsize(transcript_path) == 0:
                    logging.info(f"Transcribing {mp3_filepath} to {transcript_path}")
                    transcription = transcribe_audio(mp3_filepath)
                    wrapped_transcription = textwrap.fill(transcription, width=80)
                    with open(transcript_path, 'w') as transcript_file:
                        transcript_file.write(wrapped_transcription)
                if path.exists(transcript_path):
                    logging.info(f"Summarising {transcript_path}")
                    summary_points = summarise_transcript(transcript_path, summary_assistant)
                    final_text = make_final_summary(clean_desc, tidy_assistant)
                    with open(index_file, 'w',  encoding='utf-8') as f:
                        f.write('---\n')
                        f.write(f'date: {article["published"]}\n')
                        f.write(f'title: MicroBinfie Podcast, {article["title"]}\n')
                        f.write(f'link: {article["link"]}\n')
                        f.write('tags:\n')
                        f.write('  - microbinfie\n')
                        f.write('  - podcast\n')
                        f.write('---\n')
                        f.write(f'{final_text}\n\n')
                        if summary_points:
                            f.write('### Extra notes\n\n')
                            f.write(f'{summary_points}\n\n')
                        episode_number_padded = episode_number.zfill(2)
                        f.write(f'[Episode {episode_number_padded} transcript](/microbinfie-transcripts/episode-{episode_number_padded}.txt)\n\n')

    logging.info('Finished scraping')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--rss_feed', type=str, help=f'RSS feed URL. Default: {rss_feed}', default=rss_feed)
    parser.add_argument('--work_dir', type=str, help='Temporary working dir. Default: podcast_episode_audio', default='podcast_episode_audio')
    parser.add_argument('--transcript_dir', type=str, help='transcript text directory. Default now served from public/', default='public/microbinfie-transcripts')

    args = parser.parse_args()

    rss_feed = args.rss_feed
    main()
