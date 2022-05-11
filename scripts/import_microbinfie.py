
import requests
from bs4 import BeautifulSoup
from os import  path
from datetime import datetime
import textwrap

rss_feed  = 'https://feeds.soundcloud.com/users/soundcloud:users:698218776/sounds.rss'

def binfie_rss(rss_feed):
    r = requests.get(rss_feed)
    soup = BeautifulSoup(r.content, features='html.parser')
    articles = soup.findAll('item')      
    article_list = []
    for a in articles:
        title = a.find('title').text.replace(':', ' ')
        safe_name = a.find('link').next.strip().split('/')[-1]
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
            'embed': emb
            }
        article_list.append(article)
    return article_list


print('Starting scraping')
for article in binfie_rss(rss_feed):
    dir_name = 'content/microbinfie/' 
    index_file = path.join(dir_name,  'mb-' + article['safe_name'] + ".mdx")
    if not path.exists(index_file):
        with open(index_file, 'w',  encoding='utf-8') as f:
            date_format = article["published"].strftime("%Y-%m-%d")
            clean_desc = textwrap.fill(article["description"])
            f.write('---\n')
            f.write(f'date: {article["published"]}\n')
            f.write(f'title: MicroBinfie Podcast, {article["title"]}\n')
            f.write(f'link: {article["link"]}\n')
            f.write(f'tags:\n')
            f.write(f'  - microbinfie\n')
            f.write(f'  - podcast\n')
            f.write('---\n')
            f.write(f'{clean_desc}\n\n')
         #    f.write(f'{article["embed"]}\n')



print('Finished scraping')