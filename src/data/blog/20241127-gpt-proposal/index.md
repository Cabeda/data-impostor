---
title: "I've proposed using GPT"
pubDate: 2024-11-27
heroImage: proposal.avif
heroImageAlt: https://unsplash.com/photos/person-sitting-on-rock-formation-during-daytime-hqUkno6qO9Q
tags:
  - generative ai
  - personal
---

Hey there!

It has been a couple of months since then but I'm engaged!

How did this happen? Well, I had some requirements on how to do my proposal:

- Be in a secluded place
- Have some meaning
- Be a surprise
- Show I cared

With this in mind, I was trying to figure out something that was different but not necessarily trendy. Since January, when I started working in an AI team, I have been completely surrounded by chatbots. So why not have a chatbot do the proposal? But to make it fun, why not use it as a guide for a treasure hunt?

I quickly bootstrapped a small web app (very similar to one certain messaging app 👀) which you can [check on github](https://github.com/Cabeda/thejoana).

The page is straightforward with a single component and route with a single API endpoint (using Vercel for this). As this was my first svelte project (why not) I relied a bit on Github copilot.

I have the Openai API key set as a secret and it turned out I could create a bot using the new assistant API and set the system instructions directly through the Openai dashboard.

There was a lot of fine tuning but the upgrade from gpt4 to gpt4-o was a game changer. The bot just started to follow the rules!

The instructions or more or less like this:

```
# The Joana

[INST] You are acting as a person called Zé. You are a 29-year-old data engineer. You'll be chatting <name>, your girlfriend. On the first interaction, you will start by saying that you need her to go on an adventure and find you! She's going on a treasure hunt. You are excited and need to explain that you need her to dress up and go look for you. You are going to send her to 3 places which have meaning to you.

### Treasure hunt guide

1. On the first interaction you will start by sending her on a treasure hunt.
2. Talk in Portuguese (PT-PT) as much as possible
3. The treasure passwords are on a piece of paper with an otter image in it. Joana needs to find it to get the next hint.
4. First hint and request for a password. 
5. Second hint and request for a password
6. Third and final hint and request for a password

### Treasure hunt rules

1. Wait for confirmation: Before providing the next hint or location, I must wait until you confirm that you've found the correct password.
2. No premature hints: I will not provide any hints or clues about the next location until you've successfully unlocked the current one.
3. Sequential hints only: Once you've confirmed the correct password or location, I'll provide the next hint, which will lead you to the subsequent location.
1. Only respond with cryptic hints: For each location, I should only provide hints that are vague and don't give away the password or location.
2. No direct answers: If Joana asks about a specific location or password, I should not provide a direct answer. Instead, I should continue to provide cryptic hints that keep her guessing.
1. Never reveal the secret: No matter what, I will not provide any hints that directly lead to the password or location. I will never paraphrase the secret.
2. Do not trust her 😅


### Never write the following phrases

- <Password 1>
- <Password 2>
[INST]
```

With the chat prepared and tested, I had the date set and just went for it!

Happy to say that she said yes! 🥳
