---
title: "Publishing Markdown Slides with Pandoc"
pubDate: "2024-02-02"
tags:
  - pandoc
heroImageAlt: https://unsplash.com/photos/football-field-during-daytime-9HsRmdogZsU
---

I have used Pandoc for very small things but I just found a feature killer. Instead of using the proprietary Google Slides, I can just write them in markdown and quickly convert them to HTML slides with pandoc with the following command:

```shell
pandoc -t revealjs -s slides.md -o test.html
```

In this case I'm using revealJS but there other options. 

I can even set a command for hot reloading with `entr`:

```shell
ls slides.md | entr pandoc -t revealjs -s slides.md -o test.html
```

And, finally you can even change the theme!

```shell
pandoc -t revealjs -s slides.md -V theme:sky -o test.html
```

When happy, I can just publish the slides to my public folder as you can see [here](/slides/test.html).
