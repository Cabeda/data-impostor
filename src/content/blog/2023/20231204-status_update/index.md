---
title: "Start of Advent of Code | Readings"
date: "2023-12-04"
tags: 
    - newsletter
---

![https://unsplash.com/@anniespratt](./crown.avif)

## Web Dev

Progress: 0%

I still want to pick on this project whenever I have some free time. I've been listening to wheel of time only when doing chores which has only freed me to do the code challenge. That and playing a bit of The Witness (great puzzle game BTW).

## Code challenges

Progress: 8%

So, this week I started doing the Advent of Code. Still need to pick on day 3 but again, I'm not too afraid to let the challenges to be finished on a later day. The objective is to do them all, no time limit. Although day 3 is quite a challenge. I see people set basic UI, using weird languages. But I'm doing everything in python on my first try.

## Data Stream

Progress: 65%

I want to have an initial draft with a presentation from the beginning to the end. I think I have more than enough material for it but the slides are still very superficial and rely a bit on the demo going well. I need to finish the analysis on the evidence.dev and still need to get the latest data. For some reason duckdb is getting an out of buffer error when pulling the s3 data for the last months. Looking at the following [issue](https://github.com/duckdb/duckdb/issues/2608#issuecomment-970074658), it might be due to corrupt file.

### Project

- [X] Evidence dashboard with the analysis
- [X] How many trips are being canceled?
- [X] What are the lines with more cancellations?
- [X] What are the stops with the biggest cancellations?
- [X] Create an iceberg table on top of the parquet
- [X] Set glue job to move data each day from raw to iceberg
- [ ] Update the local tables with the latest data
- [ ] What are the lines with more delays?
- [ ] What are the stops with the biggest delays?

### Presentation

- [X] Intro to the problem
- [X] Present the loader to sqlite
- [X] Present the loader to S3 + parquet
- [ ] how to create the iceberg table
- [ ] Demo of duckdb + dbt
- [ ] Show the dashboard with the analysis

## Wellness

Nothing major. Still playing 2 soccer games per week. I have a month until the corrida de São Silvestre and have installed the Just Run 5K to 10K app to set a training schedule.

## Readings of the week

I've started reading Wheel of Time second book "The Great hunt" but at the same time I'm feeling a bit bad for not picking on my pile of phisical books.

![Pile of shame](./pile_books.avif)

- [Thoughts on Amazon Express One and its impact in Data Infrastructure by Ananth Packkildurai](https://www.dataengineeringweekly.com/p/thoughts-on-amazon-express-one-and)
- [Recap of AWS re:Invent 2023 by Renato Losio](https://www.infoq.com/news/2023/12/aws-reinvent-2023-recap/)
- [Build and manage your modern data stack using dbt and AWS Glue through dbt-glue, the new “trusted” dbt adapter | AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/build-and-manage-your-modern-data-stack-using-dbt-and-aws-glue-through-dbt-glue-the-new-trusted-dbt-adapter/)
- [My $500M Mars Rover Mistake: A Failure Story — Chris Lewicki by Chris Lewicki](https://www.chrislewicki.com/articles/failurestory)
- [My first week with the new dbt. - by Tristan Handy by Tristan Handy](https://roundup.getdbt.com/p/my-first-week-with-the-new-dbt)
