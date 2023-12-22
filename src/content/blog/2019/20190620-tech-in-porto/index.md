---
title: 'A perspective on Tech In Porto'
date: '2019-06-20'
---

![](https://images.unsplash.com/photo-1555881400-89d5a9c86668?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

A conference in Porto is a good conference :-p

## Intro

Hi! I've attended Tech In Porto and I thought I'd write a brief summary of my experience. The conference started in 2017 and is organized by Jumia, an equivalent of Amazon but with origins in Nigeria.

The conference was divided into two rooms and I was lucky enough that there weren't any talks that I wanted to attend happening simultaneously (kudos for that). Below you can find the entire program

![](LRM_EXPORT_13690194368627_20190615_105943442-feb051fe-9cfd-4a9f-9ec8-a4a26fc6e3d2.jpeg)

Has a bit of reflection I know. But please humor me and ignore it

Below are some of the notes I took of the talks I went. Some are more complete than others but, if you find one of the talks interesting you can watch the entire conference on their [youtube channel](https://www.youtube.com/channel/UC68_0ykcFWp8OOOpLXnJNPQ).

## Micro ships history

The first talk was all related to the history of microchips. Not my area of expertise but it was cool to see the evolution from 1950 to today with examples such as Xbox One which applies a technique called system on a ship. As the development of ships can take a long time from the first prototype until the discovery of flaws, engineers are starting to invest in the use of software to simulate hardware and speed up the process. The talk was presented by Carlos Palminha. You can check his Bio below.

![](Untitled-f1a55195-bb9d-4d51-b9b2-fadb639e74f1.png)

## Microservices 101

This talk was funny as it was the first time I saw an alumni, graduated in the same year as me, present at a conference.

The talk was really a 101, with a brief presentation of Microservices, which are promoted as an evolution from monolithic architectures. However, there are some cons, being one of them a bigger overhead in the initial development phase and in management. Nonetheless, for teams with a fast pacing and a certain size, it can be a good fit.

Afterward, Neves presents three ways of migrating from monolithic to microservices being them:

- Change data capture
- Strangler pattern
- Branch by abstraction

They are all well suited for their use cases but I am frankly more inclined to the strangler pattern.

At the end of the talk, we were presented with techniques for testing and monitoring (which are overlooked too many times).

![](IMG_20190613_115010-0c146892-d32f-406d-93b2-1202e43e7455.jpg)

## Diving into Merkle trees

This was one of two talks given by Talkdesk (disclosure: the ompany I work in) and was presented by Pedro Tavares. He starts by presenting a group he's in, Papers We Love, from where he found a paper called "A certified Digital Signature" from 1989, written by Ralph Merkle.

![](IMG_20190613_120948-6fa1bf8e-3cec-44f2-97d3-7e1a4fbb500e.jpg)

Merkle trees are binary trees of an infinite number of cryptographic hashes with leaves pointing to a data block. At first, this might seem to be just jargon but gradually I started to see it's importance. Some use cases are auditing of databases, peer to peer file transfer and copy on write.

This talk might not be for everyone but I found it to be extremely interesting and I love when you have that Eureka moment where everything becomes clear.

## Intelligent Query Processing

I'd say Niko is the most knowledgeable SQL developer I ever met. I truly liked his humor and how he handled the crowd, making a talk that could very well put everyone to sleep, into one with very good tips and that pushed us to question the black magic of query planning.

![](Untitled-4155c66a-eb25-4571-a54c-86258234435a.png)

Had to leave his brief Bio here

Niko started by questioning our knowledge of how SQL works internally. There are proprietary versions like Oracle and SQL Server which have many optimizations not found on open source alternatives like PosgresQL

Some of the techniques used for the so called Intelligent Query Processing are in the image below.

![](IMG_20190613_144714-78686aca-df30-4a04-8a96-d65b7004be88.jpg)

Sorry for the blur

He also showed, with the help of pure math (not magical AI), that it's impossible to always choose the best plan to run a query, we have to be happy with the possible best. And sometimes it is still a bad choice. On the image below you can see some of the examples presented by Niko.

![](IMG_20190613_145652-f56a248f-20da-48da-8580-028a60433158.jpg)

## Unicorn on-call

And this is the second talk from Talkdesk, given by Pedro Torres. He has been working on improving the process of on-call engineers and proposes to guides us through the history of Talkdesk on-call with the help of Age of Empires game.

To that end, the talk was divided into 4 ages: Stone, Tool, Bronze and Iron.

![](IMG_20190613_150135-fbedad51-13e2-4d4a-a67c-55efcca56cf4.jpg)

Some technical problems overlooked by a unicorn

The stone age was a period where, according to Pedro, even the CEO would come and help. If there was an alert, it was all hands on deck.

Next, the tool age started by implementing some tools to monitor the health of the system (ex: VictorOps) and setting up some processes (ex: blameless post mortem). However, with too much alerts and with even alarms on staging, there were some cases of burn out.

The bronze age was when talkdesk started to see some refinement. The team went from 2 engineers to 20, acacio's list was introcuded (homage to Ac·cio Cruz, SRE on google) and the shadowing program was created (a new recruit is set with a senior).

Finally, the next steps were presented. In the hope of making on-call rock, the gamification of the team is being introduced in a so called "Vanguard" program. One of the biggest improvements is the allocation of on-call engineers to a separate backlog where they set aside their normal work and instead focus on how to improve on-call and the systems resiliency.

The talk was very easy to follow and the idea that Pedro was trying to pass that on-call doesn't have to suck was very well understood and might have given some engineers ideas of how to improve the processes in their companies.

# Day 2

![](https://images.unsplash.com/photo-1472640828211-0912f310f3f9?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

Second day, a new day!

## Service mesh

This was a talk I was very interested in as I have been listening to some [podcasts](https://softwareengineeringdaily.com/2019/06/06/service-mesh-interface-with-lachlan-evenson/) related to this new concept (new to me at least).

The service mesh promises to solve some higher order problems that kubernets doesn't. One of the most recognised programs, and presented in this talk by Ricardo Castro is [Istio](https://istio.io/), developed mainly by Google.

In this service the main components are:

- Envoy
- Pilot
- Mixer
- Citadel
- Galley

After presenting the main components, Ricardo showed another aspect that makes this type of architecture interesting. Chaos testing. The main idea is that, by shutting down some nodes or components from the production system, we can check the resiliency of the system. I had only seen this being implemented by Netflix and [Gremlin](https://www.gremlin.com/) so it's nice to see this branch of engineering growing (but this isn't my area of expertise).

Another idea presented was that of monitoring, that can be done with the help of Jaeger UI (and other alternatives). Finally, the presentation ended with how to get a snapshot of the mesh (called service graph).

## Automating the full Data Science pipeline

The talk presented by Miguel Ara√∫jo, data science manager at Feedzai was an interesting one. He started by explaining the main business, fraud detection, and then went into showing some of the work done to automate data science (autoML) and improve the models in the process.

![](image-1560510592332-b67de86b-5ec3-4378-9398-20d416a0530b.jpg4702293714369671287.jpg)

Some autoML services

There were three improvements that Miguel focused on. **Semantic aware feature engineering**, **automatic model selection** and **auto** **model monitoring**.

The first one, and what I deemed as the most interesting, focuses on detecting the best possible features automatically by using tags picked up apriori. This is called feature engineering and Miguel showed some numbers alleging that their methods (in the process of patenting) was much faster and worked at least as good as humans.

![](IMG_20190614_121444-4d40158b-84f7-40db-9efa-2537ed9ad8d9.jpg)

The second improvement, automatic model selection showed some odd results pointing to the fact that random search of the best model presented better results than a grid search. Finally, auto model monitoring tries to detect if the model keeps the same level of accuracy.

![](IMG_20190614_122625-e4606637-1774-436c-a192-87e4d6db2144.jpg)

Key points of auto model monitoring

## Wrapping up

I found that some of the talks had new and interesting ideas. The ones related to data were specially important for me but I don't think I found one that was specially mind blowing. There were some mishaps with the sound system but in the overall, the conference was well organised and I hope there's more like this in Porto :-)

![](https://images.unsplash.com/photo-1513735492246-483525079686?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb)

No better way to finish than with a beautiful image of Porto
