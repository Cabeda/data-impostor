---
title: "Working with just my voice"
pubDate: 2026-11-04
tags:
  - ai
  - tts
  - stt
  - thoughts
---


Last week I've gotten access to my 



1. Explain my pain
   1. Keep focus
   2. ensure that I understood what was the output
2. Train my presentation


## Voice skill
   1. Create a separate issue as it should simplify a bit the output . The previous voice should serve as the basis for the next article. 
   2. Unintended effect of making requests using my voice: the creation of a voice skill that generates simple text. The best way to get the s
   3. Create a skills on skills.sh with it


```md
# Listen once

Write for a listener who cannot look back at the previous sentence. Preserve the meaning, scope, uncertainty and conditions of the source.

## Shape the explanation

1. Identify the intended audience and the message they need to understand. Infer these from the request when possible.
2. Establish what is wrong or needed, why it matters, and the intended outcome before describing implementation details.
3. Put actions in a useful order. State prerequisites before the actions that depend on them. Put a condition beside the action it controls.
4. Separate the core explanation from supporting evidence. Keep exact identifiers, paths, version inventories and advisory references in a documentation section when the listener does not need them to understand the decision.
5. Review the result as a continuous spoken explanation. Rewrite any passage that requires looking back, decoding notation or remembering several unresolved references.

Keep the user's required document structure. Use the amount of detail the task needs rather than a fixed sentence length or number of steps.

## Write for listening

- Give each sentence one main idea. Use complete sentences with a clear actor and action.
- Explain a component's purpose before relying on an unfamiliar technical name. Expand abbreviations when they first matter to the audience.
- Use the same name for the same thing. Repeat a short noun when “it”, “this” or “they” could refer to more than one thing.
- Express arrows, slash-separated alternatives and compressed status strings in words. Explain what a number measures before giving the number.
- Make the core meaning independent of bold text, layout, colour and tables. When a table is required, introduce its conclusion in prose.
- Keep essential permissions, exceptions and negative outcomes explicit. A short qualification belongs in the main explanation when it changes what someone may do.
- Retain exact technical values where precision affects a decision or makes an instruction executable. Improve the surrounding explanation rather than rounding or renaming them.

## Preserve the facts

Distinguish a recorded observation from current verified behaviour, a proposed change from an approved change, and a tested fix from a deployed fix. Keep the source's limits visible.

A security finding calls for investigation; it does not establish exploitation. Missing expiry information does not establish an expired credential. Successful local tests do not establish a successful rollout.

Keep supporting evidence available when simplifying. If a source detail is ambiguous, retain the uncertainty or ask for clarification rather than inventing a clearer story. Describe a source's historical claims as historical unless the task includes checking them again.

## Combine with other writing skills

This skill organises explanations for listening. It can be used independently.

When the task also calls for a domain template, use that template for structure. For example, man-jira determines the issue sections and where acceptance criteria belong. Apply these listening rules within that structure. If unslop is also requested or available for the task, use it for a final style pass without removing necessary context or qualifications.

## Examples

### Missing monitoring information

Before:

> Tags=null; expiry absent; Errors=ALARM; DaysUntilExpiry=INSUFFICIENT_DATA.

After:

> The maintenance check found missing credential expiry information. The monitoring service could not report how many days remained. Restore that information and verify that monitoring works again. These findings do not mean the credentials have expired.

### An unverified security finding

Before:

> Triage active Inspector findings against deployed Lambda versions and record remediation or false-positive disposition.

After:

> Review the security warnings for the running application functions. Check whether each warning applies to the deployed code. Fix confirmed problems. If a warning is a false positive, record the evidence and explain why.

### A fix with a security blocker

Before:

> HEIC regression green; bundled native decoder vulnerable; publication gated.

After:

> The trial fix converted HEIC photos successfully, but its image decoder had known security problems. Keep the fix unpublished until a safe decoder is available. Then repeat the conversion and security checks.

## Final check

After one listen, could the intended audience explain:

- What is wrong or needed, and why it matters?
- What should happen next, and under which conditions?
- What evidence would show that the work is finished?

Check that the rewrite still contains every condition needed for a correct decision. Treat this review as an editorial check, not proof that a listener or speech engine has tested the result.
```