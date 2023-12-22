---
title: "Global view in a regional world"
type: "data"
date: "2021-01-18"
---

As a data engineer, my main goal is to create a single and complete source of truth. This has brought me into the cloud and the ELT architecture where we can easily bring all data into a single source (usually a data warehouse) for later usage. However, in recent years we've seen a bigger awareness on where the data is stored and in some cases a requirement to hold it and keep it in a specific region. For teams like BI, this trend becomes a challenge. How can we produce analysis with data that can't be moved away from another region? To solve this we have the following options:

### Pre aggregation of data

Although we can't move the data away from the region, we can do local aggregation of the data and then merge it (i.e total revenue). However, for teams with existing infrastructure, this approach quickly becomes unfeasible as global analysis would require a refactor of all processes and the BI tool. Additionally, to don't remove previous visibility on the user's data we'd need to have a BI tool instance on each region.

### SQL Query Engine

Another option is to move the query engine like Trino (former prestoSQL). By separating the data storage from the processing we could leverage its ability to query multiple databases and add views that automatically query the same data on different regions. We'd only need to do simple adjustments to our reports to read from the slightly adjusted sources. This type of abstraction also has the plus of abstracting away the addition of further regions. However, this kind of approach has some drawbacks:

- If you aren't using a SQL query engine already it can be difficult to just replace one engine with another. Luckily in my professional case we were already moving into a data lake architecture and all components were already set.
- Different regions can have different schemas. This type of abstraction can be done manually but in case you automate this, you might find that the regions don't match. It's important to set data alerts for missing data and to define a default region as your source of truth.
- You must make sure that the output of the SQL query engine isn't stored anywhere (some temporary cache might be allowed for performance reasons). If this isn't the case your architecture might become non-compliant.

## Conclusion

This new type of challenge can appear even for small data teams as the users, the owners of their data, set these as a requirement from the start. For all data teams that might have the goal of going international, you should start thinking on either adding a SQL query engine (there multiple good options on all cloud providers) or on developing your data models with aggregations throughout it.
