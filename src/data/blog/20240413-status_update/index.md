---
title: "Porto data | Readings"
pubDate: "2024-04-13"
tags:
  - newsletter
heroImage: "./porto_centro.avif"
heroImageAlt: https://unsplash.com/photos/opened-white-wood-framed-glass-window-TmB3wiXntxs
---

Although my focus was to be with the Udemy course I have to be frank that I've done almost nothing. However, I've gotten to work a bit on delivering porto.cabeda.dev where I pick on the data from explore porto and show it more practically. I used nextJS and GitHub Copilot to quickly get a POC but when I started to use it I realized that the data itself wasn't reliable.
After 1/2 days feeling that I wouldn't be able to improve the project however, I got a response on Reddit stating that I might be able to read the data from the MQTT bus directly. I still need to check it but it has given me new hope of at least delivering an API with more reliable data.

## Readings of the week

- [Visual Studio Code March 2024 by Microsoft](https://code.visualstudio.com/updates/v1_88): The extension updates with no window reload is great! The diff editor is also looking very good and I might use the floating editors for markdown viewing. Oh, and the automatic Python selection is a good one
- [gradio-app/gradio: Build and share delightful machine learning apps, all in Python. 🌟 Star to support our work!](https://github.com/gradio-app/gradio): Very interesting tool recommended by Thougthworks for POC
- [Technology Radar | An opinionated guide to today's technology landscape | Thoughtworks](https://www.thoughtworks.com/radar): Really good insights as always from Thoughtworks
- [autoconf makes me think we stopped evolving too soon](http://rachelbythebay.com/w/2024/04/02/autoconf/): Setting immutability and checking the checksum more frequently instead of having to test over and over again just seems like it should be the default
- [Reddit Migrates Media Metadata from S3 and Other Systems into AWS Aurora Postgres - InfoQ by Rafal Gancarz](https://www.infoq.com/news/2024/03/reddit-metadata-s3-postgres/): Incredible to see Postgres being choosen for it's versalitity and capability to process on high throughput use cases (100rpk/s)
- [The jobs being replaced by AI - an analysis of 5M freelancing jobs - bloomberry by Henley Wing Chiu](https://bloomberry.com/i-analyzed-5m-freelancing-jobs-to-see-what-jobs-are-being-replaced-by-ai/): Didn't know about the freelancing sites but very interesting to know. It might be even greater to get a similar comparison from linkedin
- [Unit tests | dbt Developer Hub](https://docs.getdbt.com/docs/build/unit-tests): Very powerful indeed. I'll now be sure to add these to all data projects
- [The Data Streaming Landscape 2024 | by Kai Waehner | Mar, 2024 | Medium by Kai Waehner](https://kai-waehner.medium.com/the-data-streaming-landscape-2024-6e078b1959b5): I'm seeing red panda as a potencial tech to test. Which one would allow me to avoid java completely? 😅
- [pip install data-stack - by Julien Hurault by Julien Hurault](https://juhache.substack.com/p/pip-install-data-stack?ref=blef.fr): Dlthub and cloudquery seem like good and simple alternatives for small projects.

## Goals for this week

- Still to Finish the AWS Data Engineer course (Udemy). (Part 3)
- Run small tests on the data from the MQTT bus
- Read the aws glue documentation
