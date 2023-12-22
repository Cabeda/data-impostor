---
title: "Logseq, Impostor Syndrome | Readings"
date: "2023-11-05"
tags: 
    - newsletter
---

![https://unsplash.com/photos/selective-color-photography-of-three-person-holding-umbrellas-under-the-rain-IeV07y5UK3k](./rain.avif)

I've been able to move my personal thoughts and notes to Logseq instead of just using random notes + vs code. I can easily revert to the old way as the ony thing I had to change for the migration was rename my files from YYYYMMDD.md to YYYY_MM_DD.md. Simple enough!

As the tool doesn't have git sync builtin for Android, I've had a bit more trouble setting up Syncthings. I've yet to fully understand how it functions but for now I'm quite satisfied. For backup I still keep the git working on my local computer.

Additionaly I've been thinking a bit on how to keep working on the Code challenges and I think I need to do an hybrid. I'll be picking on doing a course this month instead of the code challenge. The code challenge will be left for December with the Advent of Code.

Finally I have to prepare the POS systems for the traditional São Magusto festivity where I live in.

## Web Dev

Progress: 10%

Another week with ADR's...

## Code challenges

Progress: 4%

So I've decided to revamp this section and get a certificate around Flink. Still need to choose one

## Data Stream

Progress: 25%

I've had a bit of laziness on picking on this. My goal was to have all developments finished by Saturday but I've got a lot more to do. I've boostrapped dbt to power the analytics, I've fixed a bug as I needed to have say I have the following checklist divided by the project and the presentation:

### Project

- [ ] How many trips are being canceled?
- [ ] What are the lines with more cancellations?
- [ ] What are the lines with biggest delays?
- [ ] What are the stops with the biggest delays?
- [ ] Create an iceberg table on top of the parquet
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

Second week under a storm (now called Ciáran). I've gone to 2 soccer games but I'm yet to run 10KM for the São Silvestre training. Moving the progress a bit nonetheless.

## Readings of the week

And this has been the week I trimmed the list to 0. I've add to delete a lot of articles which I just wouldn't been able to read but I'm quite happy. My expectations now is to have this list trimmed every month instead of trying to keep it at 0 every day.

- [Tracking SQLite Database Changes in Git | Garrit's Notes](https://garrit.xyz/posts/2023-11-01-tracking-sqlite-database-changes-in-git)
- [SQLite 3.44: Interactive release notes by Anton Zhiyanov](https://antonz.org/sqlite-3-44/)
- [Spark on AWS Lambda: An Apache Spark runtime for AWS Lambda | AWS Big Data Blog](https://aws.amazon.com/fr/blogs/big-data/spark-on-aws-lambda-an-apache-spark-runtime-for-aws-lambda)
- [DuckDB Extensions for AWS Lambda](https://extensions.quacking.cloud)
- [How to communicate like a GitHub engineer: our principles, practices, and tools - The GitHub Blog by Ben Balter, Allison Matlack](https://github.blog/2023-10-04-how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools)
- [Introducing hybrid access mode for AWS Glue Data Catalog to secure access using AWS Lake Formation and IAM and Amazon S3 policies | AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/introducing-hybrid-access-mode-for-aws-glue-data-catalog-to-secure-access-using-aws-lake-formation-and-iam-and-amazon-s3-policies)
- [Inside New Query Engine of MongoDB | Nikita Lapkov](https://laplab.me/posts/inside-new-query-engine-of-mongodb)
- [8 annoying A/B testing mistakes every engineer should know - PostHog by Lior Neu-ner](https://posthog.com/blog/ab-testing-mistakes)
- [fast_data_cdc_apache_flink.webm](https://ftp.fau.de/fosdem/2023/K.4.201/fast_data_cdc_apache_flink.webm)
- [MotherDuck: MotherDuck + dbt: Better Together by MotherDuck](https://motherduck.com/blog/motherduck-duckdb-dbt)
- [Building and operating a pretty big storage system called S3 | All Things Distributed by Werner Vogels](https://www.allthingsdistributed.com/2023/07/building-and-operating-a-pretty-big-storage-system.html)
  - "I’ve spent a lot of time at Amazon thinking about how important and effective the focus on ownership is to the business, but also about how effective an individual tool it is when I work with engineers and teams.": This is something I've seen recently and that personally pushes me to do better
- [How to Manage Databases with CI/CD | HackerNoon by Tomas Fernandez](https://hackernoon.com/how-to-manage-databases-with-cicd)
- [Using Postgres FILTER](https://www.crunchydata.com/blog/using-postgres-filter)
- [Optimizing Postgres's Autovacuum for High-Churn Tables | Tembo by Adam Hendel](https://tembo.io/blog/optimizing-postgres-auto-vacuum)
- [Deno 1.38: HTML doc generator and HMR](https://deno.com/blog/v1.38)
- [The beauty of finished software | Jose M.](https://josem.co/the-beauty-of-finished-software)
- [A systematic approach to debugging | nicole@web](https://ntietz.com/blog/how-i-debug-2023)
- [Stacked Diffs (and why you should know about them) by Gergely Orosz](https://newsletter.pragmaticengineer.com/p/stacked-diffs)
- [Apache Iceberg optimization: Solving the small files problem in Amazon EMR | AWS Big Data Blog](https://aws.amazon.com/blogs/big-data/apache-iceberg-optimization-solving-the-small-files-problem-in-amazon-emr)
- [Amazon Kinesis Data Generator](https://github.com/awslabs/amazon-kinesis-data-generator)
  - "(KDG) tool to generate sample sensor data information using the following template": Need to take a further look to generate data for test environments
- [DuckDB + Dbt + great expectations = Awesome Data pipelines | by Pranav Kohli | Sep, 2023 | Medium by Pranav Kohli](https://pran-kohli-1990.medium.com/duckdb-dbt-great-expectations-awesome-data-pipelines-8b459ccd7afc)
- [Streaming SQL in Data Mesh by Netflix Technology Blog | Netflix TechBlog by Netflix Technology Blog](https://netflixtechblog.com/streaming-sql-in-data-mesh-0d83f5a00d08?source=rss----2615bd06b42e---4)
