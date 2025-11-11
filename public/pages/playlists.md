---
layout: post
title: Music suggestions playlists
published: true
---
I'm always looking for new music. I found an applet on [IFTTT](https://ifttt.com/applets/X9h3Mnmd-automatically-add-the-top-posts-from-the-r-listentothis-subreddit-to-a-spotify-playlist), which didn't work. It couldn't handle posts other than "Artist - Title". So I wrote my own and put it up on [Github](https://github.com/happykhan/listentoeverything/). Here are some specifics:

* [Reddit](http://reddit.com) is social media site where users post material, which is voted for or against by others. The higher the vote, the higher the prominence of the material
* There are many specific channels (subreddits) for different Music genres; We can use these lists to make curated playlists.
* Playlist are based on either the 'top' posts or 'hot' posts lists e.g. [/r/music top of the week](https://www.reddit.com/r/music/top/?t=week)
* I use [Spotipy](https://spotipy.readthedocs.io/en/latest/) and [PRAW](https://praw.readthedocs.io/en/latest/) for talking to Spotify and Reddit. 
* The program cleans the list up with custom parser. 
* Each playlist are limited to 100 songs. As new songs are added, the oldest ones are removed. 
* I update the playlists every day. 

Source code: [https://github.com/happykhan/listentoeverything/](https://github.com/happykhan/listentoeverything/)

{% include_relative playlist_summary.md %}
