---
title: "Taking control of my feed"
pubDate: 2026-08-08
heroImage: reading.jpg
heroImageAlt: https://unsplash.com/photos/open-book-lot-Oaqk7qqNh_c
tags:
  - status
---


It's been some time since I've done any deep dives on this blog. I've kept it alive with an integration with my mastodon account (hey, people can comment now!) and with my Readeck integration to this blog. Every day, github actions checks for favorite articles that I haven't archived, extracts my notes and updates the blog on https://cabeda.dev/reads.

This is quite interesting, and allows me to have public notes that show where my interests lie. But I also think that it doesn't truly reflect my thoughts or allow me to better articulate my takes on the fast changes we are seeing in software engineering thanks to AI.

Through the years I've been refining a process to keep up to date. Usually the problems to solve are:

1. How do we track? It's important to define a process to receive updates
2. What to read? For this we need a curated feed of articles
3. How to read? A read-it-later app is a must to avoid drowning in the feed era.

## How do we track?

TLDR: RSS

RSS is a very old but nice standard that defines how each website can make it's articles known to readers. So if I had a dev that I wanted to follow I could pick on his feed, add it to an RSS client and from there on I'd get updates.

This by itself was a true game changer. Yes, books and papers are nice but you don't know what to read, it's through articles from references in the industry that you get to know about new and old concepts, can see what is being discussed that you don't know about and get tips on how to become a better engineer.

## What to read?

TLDR: Follow the people that you think are interesting and iterate. Remember to keep the feed slim and relevant.

At the beginning I didn't know what to follow but that's exactly part of the process. For an entire generation that is used to having their feed completely controlled, the RSS liberates you to subscribe to what interests you.

At the beginning this was very clunky, you follow youtube channels that aren't that great, or developers that don't write very good articles (like me 😅). But with time, and I mean years, you start to get more value from the feed, you start to understand what interests you, ignore the rest and remove the ones that are no longer relevant. At the moment I have 83 channels I follow and if I check the feed from 2 years ago it would probably be very different.

Now I get updates from Martin Kleppman, from data engineering weekly and many, many devs. I also watch a couple of youtube feeds that bring me a lot of value and that are quite fun.

However it's important to state how easy it is to get addicted to this flow. After a while I noticed that while some people opened the phone to check instagram, I was opening Feedly to check if there were any new articles. For a while that can be ok but it's also the perfect way to get burned out. You try to read everything. At one point, to try and get inbox zero I wouldn't take my eyes off my phone.

So I decided to do something interesting: set up a read-it-later app.

## How to read?

TLDR: Read-it-later app is a must to avoid drowning in the feed era.

I wanted to read the articles but I soon realized that with more than 100 articles per week, that I was unable to do anything else. So I set out to once per week I would open the feed and check all articles there. If it's something quick and interesting (a 1-2 minute read) I can read it immediately, but for the majority of the time I'll just click the "save it later" button. My focus during that time is to filter out the articles that I think are interesting. I can skim it, check the beginning and end of it to get the gist of it and then have it added to my to-read pile.

Then, with the list set if the list is too big, I'll reconsider some articles and remove them. My goal is to have something that can be read during that week, and preferably that I can finish early. It's important to note that I do this for everything, series, the newspaper (subscribed to Expresso, which has weekly editions).

## Take control of the stack

At this point it's important to note that I don't recommend this to everyone. If you want to try out RSS + a read-it-later feel free to use Feedly + Readeck.com. However I think that having the entire stack provided with technology that just works.

So currently my self-hosted stack is:

- RSS: [Miniflux](https://github.com/Cabeda/miniflux_deployment)
- Read-it-later: [Readeck](https://github.com/Cabeda/readeck_deployment)
- Podcasts: Pocket casts (testing out pinepods at the moment)

For hosting I'm using [fly.io](https://fly.io/) which is a great platform for hosting small apps.

## Next steps

So, in terms of stack I'm quite happy. The important part is for you to define what is important to you and define a process that gives you time to read and think about what you learned in depth. Taking control of the feed is a great way to do that. It gives you the ability to filter out the noise and avoid the addiction that doom scroll brings and that social media has been designed for.

In a future article I'll write about how I take notes and try to maximize the value I get from my reading through the miniflux + readeck integration and link it here.
