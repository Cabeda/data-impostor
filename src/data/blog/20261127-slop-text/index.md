---
title: "Slop just raised the bar"
pubDate: 2026-11-27
tags:
  - ai
  - slop
  - thoughts
---

<link rel="stylesheet" href="/slop/demo.css" />

I think there's a clear smell to AI-generated content. We can identify it, and we deem it of less quality. Why is that?

In my opinion it's all a matter of perspective. The value we put on things comes from the effort in them. We value handmade work because we see the love put into it, or the learning process at least. If we see marketing using AI, we consider that the product got the same care, that is, almost none.

That is why we consider really good-looking websites slop, because we now see the same patterns on thousands of other websites. For example, AI for a time decided that purple was the color to make a design edgy. I did that on my [bingo app](https://bingo.cabeda.dev). I prompted with "make the design edgy" and voilà, it was purple all over.

Now, we can say that we've been invaded by slop, but I also think we've had that for a long time — people used to email me dramatic PowerPoints telling a story with the gladiator in the background at the beginning of the 2000s.

No, I'm optimistic that now the web has become accessible to many more people and that we raised the bar for what something made with love means.

## What we can build

Let's consider my personal website, [cabeda.dev](https://cabeda.dev). I've had a basic Astro theme for years, but within a couple of hours I was able to:

1. Improve the Lighthouse score to 100 (and it's now a CI job)
2. Redesign entirely to a theme that increases the reading quality (following my own benchmark)
3. Get a nice animation
4. Introduce semantic search for my content
5. Add a TTS system
6. Preload links to make the UX almost instant
7. Offline mode

For sure, there are some pesky bugs I need to resolve. The animation of my name still needs improvement to be buttery smooth, for example. And of course I need to improve my writing. But I now have a really good base, and I can focus on improving the quality of the blog. That list is the base.

Now I can focus on the content.
For example, let's imagine we are explaining the new syntax on Python 3.15 for unpacking inside comprehensions ([PEP 798](https://peps.python.org/pep-0798/)). We could have shared Python snippets and that was it. Or we could have AI help us bootstrap a full Python environment in the browser, which is much more engaging.

<figure class="slop-demo" data-listen-summary="The demo runs the Python 3.15 line, [*row for row in rows], on two interpreters. On Python 3.14 it raises a SyntaxError. On Python 3.15 it returns the flattened list, [1, 2, 3, 4, 5]." data-listen-reviewed="true">
<figcaption>Flatten a list on Python 3.14 and 3.15</figcaption>

```python
rows = [[1, 2], [3], [4, 5]]

[*row for row in rows]  # 3.15
```

<p class="slop-demo-hint">Run the same line on both. Before 3.15, the same flattening is <code>[x for row in rows for x in row]</code>.</p>
<div class="slop-demo-actions">
<button type="button" data-python="3.14">Run on 3.14</button>
<button type="button" data-python="3.15">Run on 3.15</button>
</div>
<p class="slop-demo-output" data-output aria-live="polite">Python loads from a CDN on the first click — about 13 MB, once.</p>
</figure>
<script type="module" src="/slop/demo.js"></script>

This demo is not the article. It is the kind of side quest that used to eat an afternoon, pull me away from the point, or make me drop the example. This time it took minutes, so the example stayed in and the article is richer for it. The effort that matters is still mine; only the detour got shorter.

## Length is no longer effort

The same thing happens with text: production got cheap. I write for myself because the writing in itself serves as a mechanism for thinking. But in many cases we have reports that are full of unnecessary text because, up until now, a 10-page report was something that took effort.

But now? Again I'm an optimist. I think we'll enter an age where we'll want text that is straight to the point, and we'll leave the more eloquent text for when it's absolutely necessary to pass the message or story. Just as [Mark Twain said](https://www.marktwainproject.org/letters/uccl01772/):

> I notice that you use plain, simple language, short words and brief sentences. That is the way to write English — it is the modern way and the best way. Stick to it; don't let fluff and flowers and verbosity creep in. When you catch an adjective, kill it. No, I don't mean utterly, but kill most of them — then the rest will be valuable. They weaken when they are close together. They give strength when they are wide apart. An adjective habit, or a wordy, diffuse, flowery habit, once fastened upon a person, is as hard to get rid of as any other vice.

I can generate a lot of text to help me, but if I send some text to a human the expectation is that I took the time to ensure its quality, that it's my voice in there. If I do a presentation and use AI to generate the content, it's still OK. But we need to ensure that:

1. The content we use to present is clear and engaging.
2. We understand what we are presenting.
3. The presentation achieves its goal.

AI is a tool. A very powerful one, but the choice of how to use it is ours. Are we going to do the same, but faster? Or are we raising the bar to new heights?
