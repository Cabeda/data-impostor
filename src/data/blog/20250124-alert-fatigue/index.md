---
title: "Building a Sustainable On-Call Culture: From Alert Fatigue to Team Empowerment"
pubDate: 2025-01-24
heroImage: superman.png
heroImageAlt: https://unsplash.com/photos/man-in-black-shirt-jumping-on-brown-sand-near-body-of-water-during-daytime-qnN54qbeC5w
tags:
  - alerting
  - monitoring
  - observability
  - alert-fatigue
  - on-call
---

> This is a draft. Still in development.

I'm always in awe for those doing on-call. There are a lot of people with different tastes but, to me, being able to quickly respond to incidents and keep the systems up is an high impact, high rewarding job. More importantly, if done correctly, it not only helps keep the systems up but improves the trust of the users in the team's capabilities.

So, what are the main components in an application to enable on-call? There are three main components:

1. Logging
2. Monitoring metrics
3. Alerts
4. Runbook

These are the building blocks for having a reliable system but aren't enough. As soon as you deploy the app to production you are responsible for it and need to consider that you might get input in the following forms:

1. User feedback
2. Bug reports
3. Alerts

Both user feedback and bug reports are important as they are one of the main ways to detect unknown unknowns, that is, issues that you didn't know you had and as such, aren't monitored. Having mechanisms to collect and mitigate these is crucial and should have a another post dedicated to it.
Assuming we have the main issues monitored, we start to have an automated feedback loop, which I like to call a virtuous cycle of improvement. This cycle can be summarized as:

1. You have a system working nominally
2. You receive an alert
3. You deploy an improvement and the system is back to nominal

This is the ideal scenario but it's important to note one thing. Everything relies on the team being able to handle all the alerts. If the reports and alerts just keep piling up, two things can happen:

- the team will ignore alerts
- the team will burn out and development will grind to a halt

In both situations the application starts to degrade. How can this be avoided?

## The perfect scenario

Let's follow an ideal case.

You start your day. You have a task you are working and are focused. However you are set for this week's on-call rotation and during the middle of the day you get an alert on the slack channel #prod-alerts which tags you as the current first line responder. You immediately open it the message and see it's an issue you had never seen. Below the error is a link to the project's runbook. You click on it and start reading and following the procedure. You can see that it's an issue classified as a p4 which, following the [5 severity levels](https://www.splunk.com/en_us/blog/learn/incident-severity-levels.html) means we've a minor issue.
You follow the mitigation process (which coincidentally was documented by last week's responder) and log each step in the incident thread. While executing the runbook, you notice a minor discrepancy. Fortunately, since the channel is open, a colleague spots your request for help, provides guidance, and you swiftly resolve the issue. You complete the remaining runbook steps and successfully stabilize the system.

After this, you sigh relief and proceed on writing the post-mortem. With the logs in the thread this is quickly done and you even get time to update the runbook with the issue you found. With more time to think, you now remember from the on-call handoff that this issue was a possibility, due to a newly introduced feature. You pick on the ticket (already created) and link it as the main action needed to avoid the incident. The team will probably give it more priority, and tackle it on the next sprint now that they know it's an actual issue. You then go back to your task and your peaceful day continues.

## Lessons learned

We got to see how a well oiled on-call team operates. So, what are the main takeaways?

- Alert on what's important
- Have a single channel for alerts
- Setup open channels for communication
- Send alerts to the right people. The responder was the only one that was notified
- Clear documentation on the alerts (runbooks): alerts can be an intense moment. To avoid mistakes reduce cognitive load to a minimum
- Actionable alert: The runbook needs to be clear on what to do. If it's not actionable it's not an alert
- Log every action: this helps on the post-mortem and on the runbook improvement
- Have a clear escalation path: If the responder can't solve the issue, it's important to have another person to rely on or at least rubber duck the issue
- Categorize the alerts by severity: this helps separate the critical from the non-critical and reduces the work load for the responder
- non-critical alerts are documented in the post-mortem future actions session and tackle later during the normal development cycle
- Have a clear on-call rotation: there should be no supermans on the team. Everyone should be able to respond to alerts
- Provide time and space to improve the system (post-mortems, retrospectives)

Operating your applications can be a great empowering experience if done right.
However, there needs to be a good work-life balance to avoid burning out or alert fatigue. With the action items above, I hope you can improve your response experience and make it a rewarding experience for your team.
