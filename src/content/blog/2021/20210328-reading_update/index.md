---
title: "Reading Update"
date: "2021-03-28"
---

![Photo by samuel hanna on Unsplash](./samuel-hanna-kmZe7p4Kb3A-unsplash.jpg)

This week I've been preping for three things. Read a book on Scala, writing about SQL VS code pipelines, and on how to create a new DBT adapter for Trino. I'm not that great on multitaskin but I guess, according with my energy, I'll go from code > writing > reading.

## Architecture

I've found time to read the paper [Lakehouse: A New Generation of Open Platforms that UnifyData Warehousing and Advanced Analytics](http://cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf). The case for moving away from closed-sourced data warehouses into open systems with storage in an open format really resonates with me. The paper was writeen by databricks but also makes the case for systems like Trino + Apache Iceberg (which is devoloping quite nicely) which goes forward in bringing the data into an unified interface, instead of being stored in data silos.

Fivetran gives Strava as a use case on how to leverage it's platform to improve the speed from sources into a data warehouse in [Scaling Data Culture Is a Marathon, Not a Sprint](https://fivetran.com/blog/scaling-data-culture-is-a-marathon-not-a-sprint). As a user of fivetran I can say that it really helps to integrate data systems into a data warehouse although I also see a world where Presto plus open source solutions like Airbyte improve the move of data between systems (API's, databases, files, etc).

Cloudfare shows an interesting use of Clickhouse in an operational system for bot detection in [Lessons Learned from Scaling Up Cloudflare’s Anomaly Detection Platform](https://blog.cloudflare.com/lessons-learned-from-scaling-up-cloudflare-anomaly-detection-platform/). These new use cases are really mind opening on the possibilities of these systems for work outside BI or even reporting.˙˙˙˙˙

## File format

[Storage size and generation time in popular file formats](https://medium.com/adaltas/storage-size-and-generation-time-in-popular-file-formats-48a23190c1da) is a great read on benchmark for file formats and compression techniques.

## SQL

[Taming the Dependency Hell with dbt](https://medium.com/tiqets-tech/taming-the-dependency-hell-with-dbt-2491771a11be) gives a nice example on how DBT improved the management of data systems and show the current challenges of it (including performance when running very heavy queries).

I've realized that I need to take a deeper look into optimization of data objects like indexes, partitions and sharding. [Explaining Your Postgres Query Performance](https://blog.crunchydata.com/blog/three-easy-things-to-remember-about-postgres-indexes) gives some suscint points on how indexes work and that they require planning to make them useful and to not create bigger issues.

Be well and stay safe :-)
