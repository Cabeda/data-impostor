---
title: "RSS feed"
pubDate: 2026-06-06
heroImage: 
heroImageAlt: 
tags:
  - status
---


It's been some good time since I've done any deep dives on this blog. I've kept it alive with an integration with my mastodon account (hey, people can comment now!) and with my readeck integration to this blog. Every day, hgithub actions checks for favorite articles that haven't been archived, extracts my notes and updates the blog on cabeda.dev/reads.

This is quite interesting, and allows me to have public notes that show where my interest lies. But I also think that it doesn't truly reflect my thoughts or allow me to better articulate my takes on the fast changes we are seeing in software engineering thanks to AI.

For the current article I'd like to focus on how I keep up to date, the pros and cons of the system and what can be improved.

##  The problem

When I started back in 2016 I was truly lost. I wanted to be a data scientist but I considered that I should take leverage of my major in software engineering. I didn't know what were trends and so I started studying about AI and did my master thesis on a specific model (ended up creating a random forest model). Now that I look back it was something very basic but it allowed to put my first foot into data and AI.

There were a lot of articles to read and that's when a friend of mine suggested I start tracking the blogs and feeds of what interest me more. 


## RSS

He showed me feedly and introduced me to RSS. RSS is a very old but nice standard that defines how each website can make it's articles known to readers. So if I had a dev that I wanted to follow I could pick on his feed, add it to an RSS client and from there on I'd get updates. 

<Explain what RSS is >

This by itself was a true game changeer. Yes, books and papers are nice but you don't know what do read, it's through articles from references in the industry that you get to know about new and old concepts, can see what is being discussed that you don't know about and get tips on how to become a better engineer.

## Control your feed

At the beginning I didn't know what to follow but that's exactly part of the process. For an entire generation that is used to having their feed completely controlled, the RSS liberates you to subscribe to what interests you. 

At the beginning this was very clunky, you follow youtube channels that aren't that great, or developers that don't very good articles (like me 😅). But with time, and I mean years, you start to get more value from the feed, you start to understand what interest you, ignore the rest and remove the ones that are no longer relevant. At the moment I have 83 channels I follow and if I check the feed from 2 years ago it would probably be very different.

Now I get updates from Martin Kleppman, from data engineering weekly and many, many devs. I also watch a couple of youtube feeds that bring me a lot of value and that are quite fun (like veritasium).

However it's important to state how easy it is to get addicted to this flow. After a while I noticed that while some people opened the phone to check instagram, that I was opening feedly to check if there was any new articles. For a while that can be ok but it's also the perfect way to get burned out. You try to read everything. At a point, to try and get inbox zero I wouldn't take my eyes of my phone.

So I decided to do something interesting. To set a read it later app.

## Read it later

I want to read the articles but I also need to do more than this, to have an actual life so I decided on the following process. Once per week I open the feed and check all articles there. If it's something quick and interesting (1/2 minutes read) I can read it immediatly but for the majority of the time I'll just click on the save it later. My focus during that time is to filter out on the articles that I think are interesting. I can skim it, check the beginning and end of it to get the gist of it and then have it added to my to read pile.

Then, with the list set if the list is too big, I'll reconsider some articles and remove them. My goals is to have something that can be read during that week, and preferably that I can finish early. It's important to note that I do this for everything, series, the newspaper (subscribed to expresso that has a weekly editions).

For the actual software I started with pocket, moved to omnivore and it shutdown, moved to my current system readeck. Readeck is a great piece of software, with the philosophy of using boring tech. And it was with the move to this system that I decided to take full control of my stack

## Take control of the stack

At this point it's important to note that I don't recommend this to everyone. If you want to try out RSS + a read-it-later feel free to use feedly + readeck.com. However I think that having the entire stack allowed me to truly remove all ads, and have technoloy that just worked.

So, with that said, as I was using readeck I looked for the best RSS client. There a lot and you can't go much wrong but ended up going with miniflux. Its just works and has a very simple guide on getting it to run on docker with a sqlite server.

So, I got both app with fly.io configs. ([miniflux](https://github.com/Cabeda/miniflux_deployment) and [readeck](https://github.com/Cabeda/readeck_deployment)).  It's basically a fly.toml config and a dockerfile. The bonus is that both apps are so light that they fit under the 5$ free tier from fly.io!

## Next steps

So, in terms of stack I'm quite happy, I've got some minor bugs that I've opened issues to fix and the main complaint I had of not having offline reading has been fixed by both IOS and android app clients. Neat!
