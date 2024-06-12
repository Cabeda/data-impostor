---
title: TIL: dbt no-file mode: How to run on a secured fargate container
pubDate: 2024-06-12
tags:
  - til
  - dbt
---

So for today I had a fun challenge. Run dbt in a fargate container with the flag `ReadonlyRootFilesystem` set to true. This means that the container can't write to the filesystem. And why? Because this is a good practice to avoid any data corruption or security issues. A container should be immutable and stateless.

The problem is that dbt when running generates [dbt artifacts](https://docs.getdbt.com/reference/artifacts/dbt-artifacts). These are store on the `target` folder.

To try and solve this I went with the following approach:

1. Generate the target files on build time (the files shouldn't change)
2. Use the flag `no-write-json` which avoid the `manifest.json`

After having this done, I still got the issue that `graph_summary.json` was being generated. After a lot of digging I found out that the [flag order matters](https://docs.getdbt.com/docs/dbt-versions/core-upgrade/upgrading-to-v1.5#behavior-changes) 🤦🏽‍♂️.

So, the biggest takeaway. Instead of `dbt run --no-write-json` run `dbt --no-write-json run`...
