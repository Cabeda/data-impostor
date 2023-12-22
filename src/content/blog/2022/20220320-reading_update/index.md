---
title: "Reading Update"
date: "2022-03-20"
---

![Photo by Patrick Perkins on Unsplash](./blade_runner.jpeg)

I've gotten some interesting reading this week and, although I think I read quite a bit, I also think that my to read pile keeps increasing 😅. Nonetheless I want to start and finish the Database Internals so I'll keep it piling and see if I can write an overview of it before returning to my reading updates.

## Data Engineering

- [Storing UTC is not a silver bullet](https://codeblog.jonskeet.uk/2019/03/27/storing-utc-is-not-a-silver-bullet/) - An interesting take on when transforming to UTC might not work (with every transformation we might loose something)
- [Why We Switched Our Data Orchestration Service](https://engineering.atspotify.com/2022/03/why-we-switched-our-data-orchestration-service/) - Spotify moves away from Luigi to Flyte for their batch jobs. This was the first time hearing about it and I'll be keeping an eye on it
- [Database of Databases](https://dbdb.io/) - A nice list of existing databases and respective overview of features
- [How sharding a database can make it faster](https://stackoverflow.blog/2022/03/14/how-sharding-a-database-can-make-it-faster/) - A good overview on how sharding can help scale and optimize a table as it gets bigger
- [Using Spark in EMR with Apache Iceberg](https://tabular.io/blog/emr-spark-and-iceberg/) - A very useful article on how to use iceberg on AWS EMR + jupyter notebooks

## Engineering

- [Why Kubernetes is important for the future of data platforms?](https://mertkavi.com/why-kubernetes-is-important-for-the-future-of-data-platforms/) - A take on using more of kubernetes for data intensive platforms. As I see technologies like airflow and spark move to kubernetes I tend to concur with what Mert writes
- [Why I Prefer Makefiles Over package.json Scripts](https://spin.atomicobject.com/2021/03/22/makefiles-vs-package-json-scripts/) - At first I prefered the package.json format but after reading this I have to accept that makefile and other formats like the ones used by gradle and sbt can be more powerful
- [Which is better: A single Kafka cluster to rule them all, or many?](https://developers.redhat.com/articles/2022/03/10/which-better-single-kafka-cluster-rule-them-all-or-many) - Red hat list of pros and cons of either having a single kafka cluster or multiple ones leaning into having multiple as long as we don't have strict requirements of ordering
- [Addressing Python Dependency Confusion at Pinterest](https://medium.com/pinterest-engineering/addressing-python-dependency-confusion-at-pinterest-e0a0609c8e9) - Pinterest gives an introduction into dependency confunsion, a mechanism that allows the injection of malware into our applications, and how they deal with it
- [Scripting with Go](https://bitfieldconsulting.com/golang/scripting) - After some months creating a CLI in go I tend to concur that for automating scripts for wide use bash isn't a great tool while golang is presenting as a good alternative

Stay safe and Have a nice week :-)
