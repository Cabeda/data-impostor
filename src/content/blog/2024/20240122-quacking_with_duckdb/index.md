---
title: "Quacking with DuckDB, a Duck take on Porto Mass Transit"
pubDate: "2023-12-27"
tags:
  - newsletter
---

So, with the meetup I'm doing on January 10, I've wanted to get an article to serve as an alternative to the talk.

## Why the talk?

So, there were two things I wanted to do and combine. Get a real world issue and analyze it through data with DuckDB. As I've been trying to use my personal car less and less, I got first hand experience on the public transportation of Porto, Portugal. The metro is frequent and reliable so I didn't want to focus on it. But the buses? Well, it has been a recurrent issue through the years. The schedule is considered only as a suggestion. Multiple times I heard on how the bus not only would be late, but it would never arrive. So, I decided to check if I could dive a bit deeper.

## The API

So, how can we access the data? At first glance there's no public API and no dataset so I started looking into the newest platform, [explore porto](https://explore.porto.pt/). It is able to plan a trip and we go search on the map, there's some information regarding the bus stops. And, after double checking in person, the green indicator is of realtime data!

![Bus stop realtime data](./images/2023-12-27-15-23-18.png)

This is great as it means we can retrieve not only the scheduled buses but actually the time of delay. So, I opened the dev console and started snooping the network requests. With a quick glance we can see that the requests are made to an open [graphql endpoint](https://otp.services.porto.digital/otp/routers/default/index/graphql). After playing around with it for a bit, I was able to get the data I wanted.

```graphql
query StopRoute(
  $startTime_1: Long!
  $timeRange_2: Int!
  $numberOfDepartures_3: Int!
) {
  stops {
    id
    name
    code
    lat
    lon
    locationType
    zoneId
    vehicleType
    vehicleMode
    platformCode
    ...F3
  }
}
fragment F1 on Stoptime {
  serviceDay
  realtimeState
  realtimeDeparture
  scheduledDeparture
  realtimeArrival
  scheduledArrival
  arrivalDelay
  departureDelay
  realtime
  serviceDay
  pickupType
  headsign

  stop {
    id
    code
    platformCode
  }
  trip {
    gtfsId
    directionId
    tripHeadsign
    pattern {
      route {
        gtfsId
        shortName
        longName
        mode
        color
        agency {
          name
          id
        }
        id
      }
      code
      id
    }
    id
  }
}

fragment F2 on Stop {
  gtfsId
  name
  desc
  zoneId
  id
}
fragment F3 on Stop {
  gtfsId
  _stoptimesWithoutPatterns24f6Pa: stoptimesWithoutPatterns(
    startTime: $startTime_1
    timeRange: $timeRange_2
    numberOfDepartures: $numberOfDepartures_3
    omitCanceled: true
  ) {
    ...F1
  }
  id
  ...F2
}
```

It's a long query but the gist of it is that we got for all transport stops the next X (set to by 5) buses. So, now we had how to query the data but have to store it every minute to get a more complete dataset.

## The loader

For a first iteration I created a Deno script that run the graphql query and stored the data in a sqlite database. The script is available on [github](https://github.com/Cabeda/porto-stcp-realtime/blob/de3d62e6f5f50fcc14f669650667b8b64b86b31e/deno_loader/main.ts). I added a created_at column at this point to be able to get the latest datapoint for each bus trip. This later resolved a problem to measure the delay of the buses.

This worked great for the first couple of days, I could query it directly or through duckDB. However, after a while the file got to a huge size. At this point I saw that I was going to need to find another solution to run outside my computer. I couldn't just run an EC2 since this was expensive and in case of machine failure I could lose the entire file. So, I decided to go test serverless and move away from sqlite.

## The S3 loader

At this point I got to do some napkin calculations. I had around 2500 stops and I was getting the next 5 buses every minute. This meant around 18 million rows per day and, as my plan was to analyze 2 months of data, I was going to process around 1 billion rows!

If I went with a solution like postgres or mysql in the cloud I would quickly get to a huge bill. So, I made the next sensible solution, store the data on S3.

I could store each request as json but, as I had full control of the stack I decided to go with parquet. The format is supported by duckdb so this meant I could query it directly.
