---
title: "Semester review"
pubDate: 2025-01-05
heroImage: penguins.avif
heroImageAlt: https://unsplash.com/photos/group-of-penguins-Jy4-xk34q0s
tags:
  - semester
  - blogging
---


Looking back at the goals I had set for myself on this semester, I gotta say that they have been a bit lacking. The main goal was to write an article per week but since I didn't set the articles ahead of time, and neither set where I should publish them, I started to avoid writing them and the semester flew by.

For the next couple of months I have the following goals:

- Write an article per week on a data framework
- Migrate POS project 100% to Postgres
- Create a realtime dashboard to track Porto transports

Outside of programming, I have the following goals:

- Prepare my wedding
- 3x a week workout (run, gym, football)

## Blogging

One thing that lacked is a focus on a specific subject. In this case, I want to focus on the stack I'm working with at the moment which involves AWS Glue + Apache Iceberg.

My idea for this semester will be to work on developing a data framework that works like dbt but uses spark allowing to run both locally as well as deploy seamless to AWS. The stack must be able to:

- Ingest data from multiple sources
- Easily download the required dependencies (like jars)
- Enable output of CDK code to integrate with existing CDK project.
- Support data quality checks
- Support data lineage
- Support data versioning

At the end I'd love to have the journey documented in a series of articles and have something that both my team as well as others can use to quickly get data pipelines working. Worst case scenario I'll have a nice project to show off at the end of the semester.

## Personal

So, this is the year where I'll be having my wedding. I've already programmed the save the date and I'm now starting to prepare the invitations. I'm hoping to have something simple but tailored to each guest with the help of my fiancée.

At the end I'm also hoping on setting a website for the wedding but I still don't know what we're supposed to have there that can't be on the invite.

## POS

Every year I help the local church by helping support on the POS system. I've recently pushed for the migration to a Postgres database of the mobile and I've set the goal of migrating the desktop app to the same database (currently on MySQL). Furthermore, the app requires a new database for each event which is quite bothersome so I'll be rewriting the app to support multiple events on the same database. The code is on .NET framework which is always nice 😅

## Realtime dashboard

I've gotten to work last year on Porto's transport API which was the theme for my talk at Lisbon and Porto. It was a great experiment to get back on track on the talks but now I truly think I can make a difference by creating a dashboard that helps the people of Porto track where are the buses. I have done some testing and the data isn't reliable so I might need to do a bit of research on how to get something useful out of it.

I don't think I'll have time for that this semester but it would be great to start storing the data to have a comparison, year-over-year of how late the transports are.

I'll be focusing on this project as soon as I have the POS project migration done successfully.

## Workout

I've, as usual, gained a lot of weight during the holidays. Going to be taking a 3x workout and together with the inclusion of more vegetables and vegetarian meals, should get me down to 70kg. However it's important to note that I've finnaly been able to run the São Silvestre (10km) for which I'm really proud of.

## Reading

I've observed that too much reading doesn't get me as much as I'd like. As such, I've set Friday's aside for reading. I'm now using readeck which I'd love to start using to write down notes. If I can't get the reading done on that day, unless it's something really important, I'll skim it and move on.

## Conclusion

I think the plan is quite ambitious but I'm also fond of it. The goal for this week is:

- Write down an overview of what a data framework should look like and the main components
- Define the migration plan for the POS project
- Schedule the wedding tasks (define the honeymoon destination and the what the invitations should look like)

See yah! 👋
