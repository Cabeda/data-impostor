---
title: "Reading Update | dbt speaker!"
date: "2021-12-11"
---

![Photo by Florian Wehde on Unsplash](./berlin.jpeg)

Well, on thursday I went through my first international talk at Coalesce where I've talked about [dbt in a data mesh world](https://coalesce.getdbt.com/talks/dbt-in-a-data-mesh-world/) (basically it's trino + data mesh + dbt at talkdesk). Quite exciting 😄

## Data Engineering

- [Should you put several event types in the same Kafka topic?](https://martin.kleppmann.com/2018/01/18/event-types-in-kafka-topic.html) - Good tips on how to separate kafka topics
- [How Airbnb Built “Wall” to prevent data bugs](https://scribe.rip/airbnb-engineering/how-airbnb-built-wall-to-prevent-data-bugs-ad1b081d6e8f) - airbnb take on data quality tests
- [Why query planning for streaming systems is hard](https://www.scattered-thoughts.net/writing/why-query-planning-for-streaming-systems-is-hard) - I've been working with streaming pipelines (in scala) and I gotta say that good SQL in streaming would be much better to simplify some workflows
- [Hudi, Iceberg and Delta Lake: Data Lake Table Formats Compared](https://lakefs.io/hudi-iceberg-and-delta-lake-data-lake-table-formats-compared/) - a good take on which table format to use, I'm currently focusing on iceberg it's good to see competition in the field
- [Hive Metastore – Why It’s Still Here and What Can Replace It?](https://lakefs.io/hive-metastore-why-its-still-here-and-what-can-replace-it/) - another article from lakefs, this one gives more of a history review to where we are
- [Democratizing Metric Definition and Discovery at Airbnb](https://www.youtube.com/watch?v=rpgBge-qJnM) - airbnb has developed a framework to generate metrics from configs and automate and streamline the whole process
- [The missing piece of the modern data stack](https://benn.substack.com/p/metrics-layer) - another take on why we need a metrics layer
- [Upgrading to 1.0.0](https://docs.getdbt.com/docs/guides/migration-guide/upgrading-to-1-0-0) - dbt has finally gotten it's first stable release! We've gotten a ton of features but I'm exited for the metric layer and where it leads

## Engineering

- [Cleaning Up Git History](https://blog.sulami.xyz/posts/cleaning-up-git-history/) - I've more recently gotten into the problems of how to manage a repo with multiple contributions and having a clean history can really help
- [Ship / Show / Ask](https://martinfowler.com/articles/ship-show-ask.html) - This is a review on how to balance between shipping immediatly and waiting for peer-review
- [What’s New In Python 3.10](https://docs.python.org/3/whatsnew/3.10.html) - Python 3.10 has been some time ago but I hadn't taken the opportunity to read the release notes. Pattern matching is really exciting as we see ittaking some ideas from languages like scala
