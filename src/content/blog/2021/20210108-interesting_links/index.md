---
title: "This week interesting links"
date: "2021-01-10"
---

This week I've mainly focused on either data quality through examples like Great Expectation or on data modeling with the help of Airflow and DBT. But the article below show how themes like good quality article are becoming mainstream!

[Why is DBT so important?](https://highgrowthengineering.substack.com/p/why-is-dbt-so-important-) is a good article on the main selling points of DBT. A framework that brings software good practices to data modeling.
For teams that can't use DBT cloud, frameworks like airflow are increasingly important, and the trend for better integration between these tools is great, as presented on [Building a Scalable Analytics Architecture with Airflow and DBT: Part 1](https://www.astronomer.io/blog/airflow-dbt-1) and it's [follow up](https://www.astronomer.io/blog/airflow-dbt-2).

After running our models, I'm used to thinking that this data will only be seen on a BI tool or excel. However, after reading [Making your DBT models more useful with Census](https://blog.getcensus.com/making-your-dbt-models-more-useful-with-census/) I've become interested on the idea of outputting the results of DBT models into other services like salesforce.

But, although DBT is great by itself, we can further integrate good software practices such as observability as explained in [Data Observability: The Next Frontier of Data Engineering](https://towardsdatascience.com/data-observability-the-next-frontier-of-data-engineering-f780feb874b). Another good example on how to improve our pipelines is [Data Quality](https://medium.com/memory-leak/data-quality-a-primer-f6a945915511), which presents the case for always validating our models with data tests.

Finally I'm taking some notes from [Building a robust data pipeline with DBT, Airflow, and Great Expectations](https://www.youtube.com/watch?v=9iN6iw7Lamo&feature=youtu.be) to implement in future data pipelines.

As always, have a good week :-)
