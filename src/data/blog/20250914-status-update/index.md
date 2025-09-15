---
title: "Status Update - Infra above all"
pubDate: 2025-09-15
heroImage: wedding.avif
heroImageAlt: https://unsplash.com/photos/gold-wedding-band-on-white-textile-8vaQKYnawHw
tags:
  - status
---


For the last couple of months I've been off as I've had to organize my wedding. Now I'm back and would like to dive a bit deeper into some of topics I've been working on. This seems like a more natural step of instead of stating what I wished I had done I can now state what I have accomplished. Much more useful.

In the last couple of weeks I've tried to move my photos from google to immich. The solution looks great but what I found is that I much prefer to use the cloud. Hetzner seems like a great cheap option. My raspberry is still great but I'll use it for non-critical stuff like the jellyfin server and copyparty.

## Immich

My proposed architecture was:

- Raspberry pi 4 with 8GB ram to run immich server
- Podman + Docker compose file
- Hetzner storing box for backup of the photos

However I've gotten into a lot of issues with the availability of the Immich server. The immich_server kept crashing and I didn't find a low effort solution to backup and restore. I used borgbackup for the backing up ( actually think it's a great tool) but I think I'd prefer to have a solution where the postgres database is a Supabase instance and the photos were actually stored in a blob storage.

I think I'll be giving it another go in the future.

## Copyparty

I've gotten to deploy it locally on my network, like Jellyfin I want to safely make it available outside my network but need to find time to learn how Cloudflare tunnels work. The idea is to have an easy file server that doesn't take much maintenance time. It's kinda in a limbo yet,

## Readeck

I've upgraded to version 0.20.0. Also took the opportunity to reduce my reading list to near 0. To make things a bit faster to read I also like to have the articles as audio. I've iterated a bit on the TTS solution to push upstream but since I rely a bit on AI it's not acceptable to merge following their requirements. As an alternative I'm either using Eleven reader or if I have some time use epub_to_audiobook to generate an audiobook version. I'm considering creating a PR to enable m4b output as well.
  
## TIL

- CDK refactor: It didn't work as I expected but this seems like a good idea as at the moment it feels a bit messy doing big refactors of aws infra
- Feature engineering: Yes I've been working for a while as a data engineer but the definition of what is feature engineering is a bit fuzzy. To me at moment it's all data transformations that are focused on outputting data for ML models. Some techniques are one hot, label, ordinal encoding. Good to see it on https://duckdb.org/2025/08/15/ml-data-preprocessing.html

## Next week

I plan to start setting a new project around a personal code data engineering challenge. This is to be my personal challenge for the foreseeable future and from which I hope I'll write some blogposts with my learnings.
