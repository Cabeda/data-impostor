---
title: "Data Impostor blog idea | Readings"
date: "2023-11-19"
tags: 
    - newsletter
---

I've gotten an idea that I find kind of cool to write more on this blog. From time to time I feel a lot of Impostor syndrome so I think I'll be picking on small things I find that I'm unable to do and I'll write a small article where I explain how I've done a bit of that feel of lacking knowledge of experience.

Some topics I've written down:

- Created a Flink job
- Create a daily Glue job to Iceberg table
- Git rebases
- Checklists to help speed common development tasks

And so on... I won't be setting hard requirements for now but I feel this is how I feel might be the best way to proceed with this blog.

## Web Dev

Progress: 0% (reset)

I think the focus on this project can't be no more on the work. I've gotten the idea to set an alternative frontend to explore.porto.pt. As this relates a bit into the data stream project one thing might help the other.

## Code challenges

Progress: 0%

The flink course idea is to fullfill a gap I personally feel I have. I get the theory but want to get more practice. But as I'm hoping to get this done through the communication part I think I'll leave this section set to 0 and consider it fullfilled with the advent of code.

## Data Stream

Progress: 26%

I've been focusing on writing the data into iceberg but I've geen getting more challenges than I was expecting. I've got a weird issue on Glue where it detects I have to Spark catalogs instead of one. I'm truly focused on this and finding this as the biggest blocker for the entire presentation. However I'm finding truly refreshin to put my hands on Spark again

### Project

- [ ] How many trips are being canceled?
- [ ] What are the lines with more cancellations?
- [ ] What are the lines with biggest delays?
- [ ] What are the stops with the biggest delays?
- [ ] Create an iceberg table on top of the parquet
- [ ] Set glue job to move data each day from raw to iceberg
- [ ] Preset dashboard with all analysis above

### Presentation

Gotten all the topics below written but it's basically the skeleton of the presentation.

- [ ] Intro to the problem
- [ ] Present the loader to sqlite
- [ ] Present the loader to S3 + parquet
- [ ] how to create the iceberg table
- [ ] Demo of duckdb + dbt
- [ ] Show the preset dashboard with the analysis

## Wellness

Gotten back into running! However I've sadly been unable to find the time and energy to go swim...

## Readings of the week

I've been readin a lot of wheel of time and who knew it would absorve so much time from my readings...

- [Speed up queries with the cost-based optimizer in Amazon Athena | AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/speed-up-queries-with-cost-based-optimizer-in-amazon-athena/)
- [Suddenly, I Understand Software](https://johnwhiles.com/posts/programming-as-theory)
- [AWS Introduces Amazon Linux 2023 Runtime for Lambda by Steef-Jan Wiggers](https://www.infoq.com/news/2023/11/al2023-aws-lambda-functions/)
- [Introducing Amazon MWAA support for Apache Airflow version 2.7.2 and deferrable operators | AWS Big Data Blog](https://aws.amazon.com/fr/blogs/big-data/introducing-amazon-mwaa-support-for-apache-airflow-version-2-7-2-and-deferrable-operators/)
- [Learning Apache Flink S01E04: A [Partial] Exploration of the Flink SQL Client](https://rmoff.net/2023/10/10/learning-apache-flink-s01e04-a-partial-exploration-of-the-flink-sql-client)
