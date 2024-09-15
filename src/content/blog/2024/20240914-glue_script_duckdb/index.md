---
title: "Getting back on track"
pubDate: 2024-08-29
tags:
  - newsletter
---

So, with me having to do a bit more with AWS glue, I have a couple of things I would like to test out on the platform. One of those is to start small. And how small can one get? At first, I thought we were obliged to use the minimum 2 DPU's and run an entire spark job to do anything on the service but it seems we can scale down to a single DPU or even a fraction of it using glue python scripts (1/16 DPUs to be exact). So, with so small of a machine, can we run normal operations on it?

## The test

Wanted to test out ibis but it doesn't support it as the minimum python requirement is 3.10 and glue supports only 3.9 (a huge drawback in my opinion).

So my goal is to process a small dataset (1GB) using duckdb and see how it performs. I need to retrieve it from an s3 bucket, process it and write it back to another s3 bucket. I will be using the smallest DPU available (1/16 DPU) and see how it performs.
