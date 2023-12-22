---
title: "Reading Update"
date: "2021-03-20"
---

![Photo by Theo Eilertsen Photography on Unsplash](./theo-eilertsen-photography-ajhmqq12XvI-unsplash.jpg)

Hi!

I've gotten into reading most articles I had for the past weeks. I'm seeing more and more regarding streaming pipelines although I think there's much to be done in batch. In the next weeks I'll be taking a closer look into DBT and it's internal, to better understand the best way to integrate it into my current work. The tool is great to work in a single data warehouse but isn't ready yet for a data mesh.

## Databases

[Cleaning Up Your Postgres Database](https://blog.crunchydata.com/blog/cleaning-up-your-postgres-database) gives really good tips for postgreSQL. In recent weeks I've tried to move millions of events into postgres and can atest that this isn't a really great use case for postgres 😅.

AWS also gives some tips on how to store timeseries tables on Postgres on [Designing high-performance time series data tables on Amazon RDS for PostgreSQL](https://aws.amazon.com/pt/blogs/database/designing-high-performance-time-series-data-tables-on-amazon-rds-for-postgresql/).

**TIL**: B-tree index is great but can increase in size linearly. BRIN index tracks the minimum and maximum time values over a range so it can be a great match for time-series databases (in doubt use B-tree)!

For OLTP databases, Postgres and mysql are some of the best known (open source is a plus). After reading [Performance differences between Postgres and MySQL](https://arctype.com/blog/performance-difference-between-postgresql-and-mysql/) I've actually gotten some good insights into their internals.

## Analysis

It's very easy to develop some dashboards but it can be a bit harder to make it useful. In [Best practices for BI dashboards](https://www.metabase.com/learn/building-analytics/dashboards/bi-dashboard-best-practices.html), Metabase gives some tips on how to develop a dashboard that actually helps in the decision making process.

Spotify gives an overview on their experimentation framework on [Spotify’s New Experimentation Coordination Strategy](https://engineering.atspotify.com/2021/03/10/spotifys-new-experimentation-coordination-strategy/). This is a long way from simple A/B testing and makes the case for deeper analytics to improve a product.

## Data Processing

Flink gives a nice overview on [Batch Execution Mode](https://flink.apache.org/2021/03/11/batch-execution-mode.html) using their unified API.

**TIL**: Difference of tumbling window and a hopping window in a streaming pipeline 😎

Airflow is a great tool but, to be correctly used, needs to thought as a worflow tool and not as a data processor. The article [TaskFlow API in Apache Airflow 2.0 — Should You Use It?](https://towardsdatascience.com/taskflow-api-in-apache-airflow-2-0-should-you-use-it-d6cc4913c24c#771d) starts by explaining what is the taskflow API but ends with a warning. Airflow, specially in 2.0, is great to manage multiple processes, but we are best saving state and doing heavy computations with other tools like spark and Presto.

Stay safe, stay well 🙌
