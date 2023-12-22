---
title: "TIL | 2023-01-25"
date: "2023-01-25"
---

## Today I learned

- Metabase can have a little issue on 0.45.1 converting a number from dynamodb (bigint when it should be a decimal)
- SQS FIFO works in batches. It doesn't process the next batch while the current isn't finished or redirected to a dead queue
- Messages are ordered by the message group ID (just like in kafka topics) ([source](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html) )
- [EventStorming](https://serverlessland.com/event-driven-architecture/visuals/event-storming) seems to be a nice tool to gather all domains and understand the workflow through a timeline and detect potential bottlenecks
- Finances
  - PCI DSS = Payment Card Industry Data Security Standard (currently on version 4 and required to process data from card networks)
  - SAD = Sensitive authentication data
  - PAN = Primary account number
  - Uptime: is a measurement of system reliability and is typically expressed as a percentage of time the computer, server, or system has been working or ready for use
  - Availability is the probability that a system will work as required when needed during a mission period

## Things I'd like to learn

- Can the dataflow be automated using X-ray maps?
