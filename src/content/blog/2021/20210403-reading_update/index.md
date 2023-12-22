---
title: "Reading Update"
date: "2021-04-03"
---

![Photo by Alfons Morales on Unsplash](./alfons-morales-YLSwjSy7stw-unsplash.jpg)

This was a relative calm week. I've read a lot and coded less than I wanted. I'll try to focus more on development and less in reading for the next weeks.

## Analytics

Data isn't a panacea and I've found [What Data can't do](https://www.newyorker.com/magazine/2021/03/29/what-data-cant-do) a great overview on how the wrong data will lead to wrong insights.
As SQL is a declarative language, the query planner takes care of finding the most performant way of retrieving data. Ben Levy and Christian Charukiewicz write in [Speeding up SQL queries by orders of magnitude using UNION](https://www.foxhound.systems/blog/sql-performance-with-union/) of a case where the results aren't optimal and how a UNION can greatly improve a query.
[How Data Discovery Tools Enable Data Democratization](https://www.datacamp.com/community/blog/data-discovery-tools?utm_medium=email&utm_source=customerio&utm_id=7190073&utm_campaign=dc_insights&utm_term=v2blog) is an article by datacamp on why and how these tools improve the data trust and fluency.

## Stream

Kafka has been working on deprecating zookeeper and has finally gotten a preview, as shown in [Apache Kafka Made Simple: A First Glimpse of a Kafka Without ZooKeeper](https://www.confluent.io/blog/kafka-without-zookeeper-a-sneak-peek/). This is really exciting as it simplifies the deployment of a cluster and increases the reliability and performance of kafka itself (specially when increasing horizontaly).
[Why Kafka Is so Fast](https://medium.com/swlh/why-kafka-is-so-fast-bde0d987cd03) gives some insights into the reason on how Kafka'architecture makes it look as "fast" (not the best term to be used but makes a point).

## Code

I've been giving more attention to scala as a good entry point to a functional programming language. With all the good things it brings, it also has some challenges to solve as explained in [Scala is a Maintenance Nightmare](https://mungingdata.com/scala/maintenance-nightmare-upgrade/).

Good week, stay safe :-)
