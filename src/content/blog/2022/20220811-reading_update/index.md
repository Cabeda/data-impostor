---
title: "Status update"
date: "2022-08-11"
---

![Photo by Ricardo Resende on Unsplash](./douro.jpeg)

I've quickly gotten a prototype to generate my reading updates. The python script ([repo](https://git.sr.ht/~jecabeda/pocket)) uses the Pocket API (had to move away from instapaper as they didn't approve a developer key for me to use). It facilitates a lot by listing the articles I've read in markdown. I might be doing some adjustments before publishing it as I might move this to typer cli, avoid recurrent logins and add additional features like cleaning the newsletter articles. Let's see 😅

Another small project I've also built was [Keg](https://keg.cabeda.dev/) ([repo](https://github.com/cabeda/keg)), a simple URL shortener. It has an open API so you can just send a curl POST message to retrieve a shortened link:

```shell
curl --request POST \
  --url https://keg.cabeda.dev/<your URL>
```

I've created as a small funny project to use when generating teams on my [randomizer](https://teamrandomizer.cabeda.dev/). As I wanted to avoid the need for a backend and the URL's were getting big, this was a good solution.

Finnally I've added a single API endpoint to this blog to check how many visitors I have. While writing this I've remembered that it should handle CORS as I just want it to handle calls from the blog 😅

## Readings

### Data Engineering

- [Ep 29: Making Sense of the Last 2 years in Data (w/ Jennifer Li + Matt Bornstein of a16z)](https://roundup.getdbt.com/p/ep-29-making-sense-of-the-last-2)
- [Near Real-Time Ingestion For Trino](https://www.starburst.io/blog/near-real-time-ingestion-for-trino/)
- [Inconsistent thoughts on database consistency](https://alexdebrie.com/posts/database-consistency/)

### Engineering

- [Why your daily stand-ups don't work and how to fix them](https://lucasfcosta.com/2022/08/07/how-to-improve-daily-standups.html)

- [Incident Management](https://medium.com/airbnb-engineering/incident-management-ae863dc5d47f)
