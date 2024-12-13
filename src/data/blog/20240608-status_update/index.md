---
title: Roadtrip | Readings
pubDate: 2024-06-08
tags:
  - newsletter
heroImage: ./bilbao.avif
heroImageAlt:  https://unsplash.com/photos/high-rise-building-JD7lQkhFoIA
---

For this week there hasn't been a lot happening. I've been on vacations (roadtrip through Spain and Portugal) and day dreaming about switching to an EV. Got a google sheets with some calculations and it seems to payoff in about 8 years with the current gas price and usage. I've been trimming a bit on the reading but aside from this I took the opportunity to relax and visit some friends.

## Readings

- [You'll regret using natural keys by Mark Seemann](https://blog.ploeh.dk/2024/06/03/youll-regret-using-natural-keys/): Nice reminder. Almost every data might need correction. If you need an id and can’t fully control it you might get issues in the future
- [Amazon CloudWatch Logs announces Live Tail streaming CLI support - AWS](https://aws.amazon.com/about-aws/whats-new/2024/06/amazon-cloudwatch-logs-announces-live-tail-streaming-cli-support/)
- [Things you wish you didn't need to know about S3 by Daniel Grzelak](https://blog.plerion.com/things-you-wish-you-didnt-need-to-know-about-s3/): As a a frequent user of S3 I’m amazed of not knowing this “little things” that could easily put data at risk. Certainly a good read to also bookmark
- [Nimble and Lance: The Parquet Killers - by Chris Riccomini by Chris Riccomini](https://materializedview.io/p/nimble-and-lance-parquet-killers): Interesting to see proposals for improved columnar formats. I’ll wait a bit more but for ai workloads it seems to be interesting. Will this be implemented in data engineering tools?
- [Do you model in dbt or BI? — Omni Analytics by chris](https://omni.co/blog/do-you-model-in-dbt-or-bi?ref=blef.fr): Interesting take. I’m a bit on the side that we can do analysis using dbt nonetheless and not mmodel everything. It’s more about having good separation of responsibilities and the bi tool should be focused on the viz and reports with light transformations related to these
- [React 19 Beta – React](https://react.dev/blog/2024/04/25/react-19): This is a long one but react delivers nice quality of life improvements as well as server side rendering (and suspense with the use looks smooth)
- [dbt-core/CHANGELOG.md at 1.8.latest · dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core/blob/1.8.latest/CHANGELOG.md): And we’ve got unit tests in dbt!!!
- [AI for Data Journalism: demonstrating what we can do with this stuff right now](https://simonwillison.net/2024/Apr/17/ai-for-data-journalism/): An interesting presentation on using llm and it’s state

## Goal of the week

- Trim down on the omnivore reading list
- Develop a quick and easy chat app
