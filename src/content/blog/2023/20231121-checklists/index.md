---
title: "Checklists"
date: "2023-11-21"
tags: 
    - development
    - agile
    - checklists
---

![https://unsplash.com/photos/person-writing-bucket-list-on-book-RLw-UC03Gwc](./checklist.avif)

> This document will be a live document where I reflect and update my most current view

So, I've been one to be methodic in my practice and I truly think automation in software engineering is one of the secret powers of the industry. Taking inspiration from an article I read [3 years ago](https://blog.acolyer.org/2020/01/08/ironies-of-automation/), I find that for any recurring task this is the expected lifecycle:

1. Document the process
2. Improve the documents on each iteration
3. Automate small bits of the process with scripts
4. Automate the entire process/Deprecate the process

Looking back at this I find two tasks that I don't see being automated that much and that I don't often have a very good track of having process I follow. Development and peer review. And as I get bored very quickly, I think I should be taking a step of documenting how I go with each one of these. Depending on the project there might be more or less degrees of automation but here are my checklists.

## Development checklist

- [ ] What are the requirements?
- [ ] Is there an architecture design?
- [ ] What tests can I think of? Can I automate those?
- [ ] Write the mocked implementation (Divide hard parts into multiple PR's)
- [ ] Write some logs on the stepping being done. Will be useful for later debugging
- [ ] Make sure the tests and the code can be run on debug locally
- [ ] Write the actual requirements
- [ ] Run the tests until all green
- [ ] Run the linter (if not automated)
- [ ] Validate the tests coverage (if not automated)
- [ ] Create PR
- [ ] Review comments
- [ ] Merge

## Peer review checklist

- [ ] Read the description of the task
- [ ] Skim the entire code. Take notes on things you find odd
- [ ] List resource changes
- [ ] Given the description list the tests you think would better match this
- [ ] Run the tests locally. Debug if possible
- [ ] Check if your expectations of the tests are matched by the test suite
- [ ] Format the code

Given the checklist above I see that these are very high-level steps that can be further documented (phase 2 of automation) and the scripts to facilitate them can also be identified. As I've been working across multiple languages (python, JS, TS, terraform) each project will have different processes but I think that just shows that I'm moving between phases 1-3.

Looking back at the lists above I guess I need another checklist to guide on the tests creation. But I'll leave it for another time.
