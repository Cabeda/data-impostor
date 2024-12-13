---
title: "TIL: Run openai to generate images"
pubDate: 2024-09-12
tags:
  - openai
  - python
---

After another, very fun Dungeons&Dragons sessions I wanted to generate an image for a scene that occured. It envolved a camel falling through a well (there's a very long story behind it). I quickly remembered that OpenAI had dall-e but sadly I found out that it Dall-E 3 doesn't have a free tier.

![no free tier for dall-e according to their main page](dalle_intro_page.avif)

Although I could have used free alternatives (midjourney or flux.1 came to mind) I decided to use the credits I have on openAI to get a premium image (the free tiers usually provide a light version, or in the case of flux.1, schnell 😅). Looking at the docs I was surprised on how easy it is to get something working. Here goes my 2 minute script.

Note: I guess that at 0.04€ it's obvious why they make the API so smooth.

```python

import requests
from openai import OpenAI

client = OpenAI()

response = client.images.generate(
    model="dall-e-3",
    prompt="a camel jumping to a well with it's legs wide open. The look is of an animated series inspired by anime. The image angle is from inside the well looking up at the camel which we can see mainly the belly pointed at the camera. The sky is of a bright blue and the scene is slightly funny",
    size="1024x1024",
    quality="standard",
    n=1,
)

image_url = response.data[0].url

print(image_url)

# Download the image using the URL

image = requests.get(image_url)

# Save the image
with open("camel.jpg", "wb") as file:
    file.write(image.content)

```

And the final result:

![camel jumping into well](camel.avif)

As a plus, I've installed the dependencies using uv. I can get the code above to run in less than 10 seconds with the following commands:

```bash
uv init
uv add openai requests
uv run dalle.py
```

## Conclusion

For the cases where I need to generate something very specific, I might just open my purse a little bit next time.
