---
title: "Streams, streams and streams | Readings"
date: "2023-11-14"
tags: 
    - newsletter
---

![https://unsplash.com/photos/closeup-photography-of-gold-colored-ornament-sMCBEI5zkqc](./cashier.avif)

Taking a bit more attention to Kinesis I think it becomes very interesting to understand some of the insides of the stream world. Things like temporal joins and the way Flink/Data Analytics creates subscribers to handle the Shards should be an interesting deep dive in a separate article.

Regarding The event last week went with no major issues. The POS system we are using is a bit old but it works. It would be great to simplify some of the process such as creating the order and printing but I guess it might be too much.

## Web Dev

Progress: 10%

Gotten to do very small change to the mobile POS in preparation for São Magusto. It would be great to test the printer because it's the main way to get an alternative POS working. I'm also thinking on setting an alternative app to explore.porto.pt and taking some inspiration from Porto.bus app. But this will be just to have some frontend/app fun when I'm not able to do anything else.

## Code challenges

Progress: 4%

Going to pick on the https://developer.confluent.io/courses/apache-flink/intro/ this week. It's quite small course to do it in a go.

## Data Stream

Progress: 25%

I've been doing some experimentations with the iceberg table. The table and I've set a glue crawler to detect the table format on the raw data bucket. However I now need to setup the glue job. So I'll be keeping the list below to try and do the rest as I think there's a lot for so little time and I'll update the progress.

### Project

- [ ] How many trips are being canceled?
- [ ] What are the lines with more cancellations?
- [ ] What are the lines with biggest delays?
- [ ] What are the stops with the biggest delays?
- [ ] Create an iceberg table on top of the parquet
- [ ] Set glue job to move data each day from raw to iceberg
- [ ] Preset dashboard with all analysis above

### Presentation

- [ ] Intro to the problem
- [ ] Present the loader to sqlite
- [ ] Present the loader to S3 + parquet
- [ ] how to create the iceberg table
- [ ] Demo of duckdb + dbt
- [ ] Show the preset dashboard with the analysis

## Wellness

Progress: 20%

This week's game was really good! However I feel I need to train for the 10K as it would greatly help me with the stamina to keep the rythm throughout the game. That and the fact that I've ordered a swytch kit to convert my bike to eletrical. Will be a fun project.

## Readings of the week

This week didn't get a lot of reading done, I've again gotten to add the articles to omnivore and will eventually prune them. I've been building more interest around Flink and I truly want to do some exercises with both FlinkSQL as well as with Pyflink bu the articles from Robin were very interesting.

- [Data Engineering in 2022: Storage and Access](https://rmoff.net/2022/09/14/data-engineering-in-2022-storage-and-access/)
- [Streaming SQL in Data Mesh by Netflix Technology Blog | Netflix TechBlog by Netflix Technology Blog](https://netflixtechblog.com/streaming-sql-in-data-mesh-0d83f5a00d08?source=rss----2615bd06b42e---4)

- [Learning Apache Flink S01E02: What <em>is</em> Flink?](https://rmoff.net/2023/10/02/learning-apache-flink-s01e02-what-is-flink)
- [Learning Apache Flink S01E04: A [Partial] Exploration of the Flink SQL Client](https://rmoff.net/2023/10/10/learning-apache-flink-s01e04-a-partial-exploration-of-the-flink-sql-client)
