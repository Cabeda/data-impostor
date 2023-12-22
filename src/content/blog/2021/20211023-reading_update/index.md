---
title: "Reading Update"
date: "2021-10-23"
---

![Photo by Serey Morm on Unsplash](./iceland.jpeg)

I've taken some time from writing my reading updates and I'd say some of the articles have gone into something I like to call knowledge oblivion. I read them, found them interesting, some knowledge might have got stuck in the back of my mind, ready to be useful if the situation calls for it, but most of it is gone. One of the reasons for writing these reading updates is to consolidate and reflect a bit on important topics and be able to remember them. Nonetheless here are some of the articles I found interesting.

## Organization

- [Incident Review and Postmortem Best Practices](https://blog.pragmaticengineer.com/postmortem-best-practices): good ideas on how to resolve incidents and avoid them thereafter
- [Software developers have stopped caring about reliability](https://drewdevault.com/2021/10/17/Reliability.html): Drew makes the case for focusing again on reliability, simplicity, and battle-tested against new and unreliable
- [Some reasons to work on productivity and velocity](https://danluu.com/productivity-velocity): article stating how important it's to be on the lookout for constant improvement
- [Willingness to look stupid](https://danluu.com/look-stupid/): as a follow-up, this article resonated with me on not bothering with simple and even stupid questions as the alternative would be to have huge basic knowledge gaps
- [Building a data team at a mid-stage startup: a short story](https://erikbern.com/2021/07/07/the-data-team-a-short-story.html): reads like a story on how we can bring a data team into changing a whole company to a data-driven mindset

## Data Engineering

- [Project Magnet, providing push-based shuffle, now available in Apache Spark 3.2](https://engineering.linkedin.com/blog/2021/push-based-shuffle-in-apache-spark): speed optimizations on spark that should avoid unnecessary data moves
- [RabbitMQ Streams Overview](https://blog.rabbitmq.com/posts/2021/07/rabbitmq-streams-overview): RabbitMQ ventures into the same path of Kafka streams. I'd say this might be a good case for users that only really need rabbitMQ because Kafka or Pulsar are overkill
- [Partition and cluster BigQuery tables with Airbyte and dbt](https://airbyte.io/recipes/bigquery-partition-cluster): interesting use case on how to extract with airbyte and apply further transformations with dbt. A very interesting architecture to consider
- [The Death of Hype: What's Next for Scala](https://www.lihaoyi.com/post/TheDeathofHypeWhatsNextforScala.html): Haoyi gives his insights on the popularity of scala and why it has a promising future (and not a hyped one)
- [Data Lineage at Slack](https://slack.engineering/data-lineage-at-slack): slack writes about why lineage improves data visibility and quality and how they built a SQL parser to automate this process
- [Backfilling Airflow DAGs using Marquez](https://openlineage.io/blog/backfilling-airflow-dags-using-marquez/): again on the data catalog theme, Open Lineage shows how integrating the metadata of airflow into Marquez can enable interesting flows like notification of users of lack of data quality or the need of running backfills
- [What the Heck is a Data Mesh?!](https://cnr.sh/essays/what-the-heck-data-mesh): I'll be giving a presentation on Coalesce 2021 where I present how data mesh is being integrated into my current employee but this article is a great overview of some of the core ideas of this architecture
- [10 Common Mistakes When Building Analytical Data Models](https://betterprogramming.pub/10-common-mistakes-when-building-analytical-data-models-814c763d1b70): Anna writes about how we should write our data models for the long turn
- [How to Analyze CDC Data in Iceberg Data Lake Using Flink](https://www.alibabacloud.com/blog/how-to-analyze-cdc-data-in-iceberg-data-lake-using-flink_597838): Change Data Capture (CDC) has great potential of improving the movement of data between systems and in this case, Alibaba writes on why moving data to Iceberg using Flink should be a thing
- [For SQL](https://pedram.substack.com/p/for-sql): interesting read for SQL users and others that might have some aversion to it
- [Shopify's Path to a Faster Trino Query Execution: Infrastructure](https://shopifyengineering.myshopify.com/blogs/engineering/faster-trino-query-execution-infrastructure): Shopify insights into how to manage Trino clusters for both Ad-hoc and scheduled queries

## Engineering

- [A sticky situation](https://www.infoq.com/presentations/sticky-canaries): is a presentation on how Netflix built a platform to test their hypothesis. They started by testing hypotheses like, "will the system work if we kill this?" and later added the ability to move part of the traffic to new features and test key metrics. This latest use case is a great way of making data-driven decisions and I'd say it's one that I'd like to implement on all products I develop/maintain
