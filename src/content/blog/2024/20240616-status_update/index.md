---
title: Chatbot, me vs nextjs | Readings
pubDate: 2024-06-16
tags:
  - newsletter
heroImage: ./coffeeshop.avif
heroImageAlt:  https://unsplash.com/photos/brown-wooden-table-and-chairs-xhKG01FN2uk
---

For this week my main goal had been on advancing on a chatbot UI to the openAI api. I'm using the assistant API for a private project. The application is working as an MVP and even got it using the streaming API.

![](2024-06-15-18-56-50.png)

After I do a final deploy of the app I'll write a post about the experience of setting an assistant.

Another project I got was to redeploy the [POS-mobile](https://github.com/Cabeda/POS-mobile) in a new server since [Planetscale hobby plan is no more 😭](https://planetscale.com/docs/concepts/hobby-plan-deprecation-faq). I've done very quickly to supabase thanks to prisma. With a quick swap of the client and the credentials and done!

Sadly I went down the rabbit hole of demoing some new features:

1. Thermal printing with WebUSB API
2. Migrate to next app routing
3. Setup Supabase authentication

I was successful with the first 2 but with the introduction of server/client components I've been battling about grasping how this works. The signIn requests stopped working and it seems that the recommended way is to keep as much as possible on the server and create tiny client components (as these are the ones that support things like useEffect and useState).

So, at the moment I have a Demo that took a whole day and that I'm unsatisfied with. Of course this means I'll be devouring next docs for this week 😅

## Readings

- [What's new in the world of React? | React Conf 2024 Recap by Syntax](https://youtube.com/watch?si=e5_emG8K_KoYMIGS&v=udXZw-9LdOM): Nice recap of the react conf. Was really interested in the react compiler to simplify the hi and the react native getting lots of attention. Might consider creating a simple app to test it
- [Announcing DuckDB 1.0.0 – DuckDB by Mark Raasveldt and Hannes Mühleisen](https://duckdb.org/2024/06/03/announcing-duckdb-100): DuckDB got it's first stable release!
- [How (some) good corporate engineering blogs are written](https://danluu.com/corp-eng-blogs/): This really pushes for me to try and bring this to my own company. How difficult would it be? 😅
- [Knowledge Bases for Amazon Bedrock now lets you configure Guardrails](https://aws.amazon.com/about-aws/whats-new/2024/05/knowledge-bases-amazon-bedrock-configure-guardrails/): Awesome to see blocked words. Exactly what I wanted for my project
- [So, you think you’ve got dbt test bloat? | by Dave Flynn | In the Pipeline | Apr, 2024 | Medium by Dave Flynn](https://medium.com/inthepipeline/so-you-think-youve-got-dbt-test-bloat-37491fb330d5): I have never gotten into this scale but the strategy to avoid data alert fatigue sounds quite reasonable
- [Airbnb Open-Sources its ML Feature Platform Chronon - InfoQ by Sergio De Simone](https://www.infoq.com/news/2024/04/airbnb-chronon-open-sourced/): Need to further check this platform. Usually Netflix releases really good open source projects
- [Chronon, Airbnb’s ML Feature Platform, Is Now Open Source | by Varant Zanoyan | The Airbnb Tech Blog | Apr, 2024 | Medium by Varant Zanoyan](https://medium.com/airbnb-engineering/chronon-airbnbs-ml-feature-platform-is-now-open-source-d9c4dba859e8)
- [Databricks Agrees to Acquire Tabular, the Company Founded by the Original Creators of Apache Iceberg - Databricks](https://www.databricks.com/company/newsroom/press-releases/databricks-agrees-acquire-tabular-company-founded-original-creators?ref=blef.fr): This are big news! What will databricks do with two standards? Which one will die? Iceberg? Or data lake?

## Goal of the week

- Finish development of the app UI
- Develop auth flow on pos-mobile app
- Trim down on the omnivore reading list (155 articles 😅)
