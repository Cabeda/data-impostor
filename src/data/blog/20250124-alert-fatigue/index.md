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

# Why On-Call Matters

I’m always in awe of those who do on-call work. While preferences vary, being able to quickly respond to incidents and maintain system uptime is a high-impact, high-rewarding job. More importantly, when done effectively, it not only keeps systems running but also improves users’ trust in the team’s capabilities.

So, what are the main components in an application to enable on-call? There are four main components:

1. Logging
2. Monitoring metrics
3. Alerts
4. Runbook

These are the building blocks for a reliable system, but they're not enough. As soon as you deploy the app to production, you become responsible for it and must consider that you might receive input in the following forms:

1. User feedback
2. Bug reports
3. Alerts

Both user feedback and bug reports are important, as they are one of the main ways to detect unknown unknowns, that is, issues that you didn't know you had and, therefore, aren’t monitored. Having mechanisms to collect and mitigate these issues is crucial and should have another post dedicated to it.
Assuming we have the main issues monitored, we start to have an automated feedback loop, which I like to call a virtuous cycle of improvement. This cycle can be summarized as:

1. You have a system working nominally
2. You receive an alert
3. You deploy an improvement and the system is back to nominal

This is the ideal scenario but it's important to note one thing: Everything relies on the team being able to handle all the alerts. If the reports and alerts just keep piling up, two things can happen:

- The team will start ignoring alerts
- The team will burn out, and development will grind to a halt  

In both situations, the application starts to degrade. How can this be avoided?

## The perfect scenario

Let's follow an ideal case.

You start your day with a task you’re focused on. However, you’re on this week’s on-call rotation, and in the middle of the day, you receive an alert in the Slack channel #prod-alerts, tagging you as the current first-line responder. You immediately open the message and see that it's an issue you've never encountered before. Below the error message is a link to the project's runbook. You click on it and start reading, following the outlined procedure. The issue is classified as a P4, which, according to the [five severity levels](https://www.splunk.com/en_us/blog/learn/incident-severity-levels.html), means it’s a minor issue.
You follow the mitigation process (which coincidentally was documented by last week's responder) and log each step in the incident thread. While executing the runbook, you notice a minor discrepancy. Fortunately, since the channel is open, a colleague spots your request for help, provides guidance, and you swiftly resolve the issue. You complete the remaining runbook steps and successfully stabilize the system.

After this, you sigh in relief and proceed to write the post-mortem. With the logs in the thread, this is quickly done, and you even get time to update the runbook with the issue you've found. With more time to think, you now remember from the on-call handoff that this issue was a possibility, due to a newly introduced feature. You pick up the ticket (already created) and link it as the main action needed to avoid the incident. The team will probably give it more priority and tackle it in the next sprint now that they know it's an actual issue. You then go back to your task, and your peaceful day continues.

## Lessons learned

We got to see how a well-oiled on-call team operates. So, what are the main takeaways?

- Alert on what's important
- Have a single channel for alerts
- Set up open channels for communication
- Ensure alerts are sent to the right people: the responder was the only one notified
- Maintain clear documentation on alerts (runbooks): alerts can be intense moments. To avoid mistakes, reduce cognitive load to a minimum
- Ensure alerts are actionable: the runbook needs to be clear on what to do. If it's not actionable, it's not an alert
- Log every action: this helps with post-mortems and runbook improvements.
- Have a clear escalation path: if the responder can't solve the issue, it's important to have another person to rely on or at least rubber duck the issue
- Categorize the alerts by severity: this helps separate the critical from the non-critical and reduces the responder's workload
- Non-critical alerts should be documented in the post-mortem's future actions session and tackled later during the normal development cycle
- Ensure there is a clear on-call rotation: there should be no Supermen on the team; everyone should be able to respond to alerts
- Provide time and space to improve the system (post-mortems, retrospectives)

Operating your applications can be a great empowering experience if done right. However, there needs to be a good work-life balance to avoid burning out or alert fatigue. With the action items above, I hope you can enhance your response experience and make it a rewarding one for your team. Consider revisiting the documentation periodically to ensure it remains up-to-date and effective.
