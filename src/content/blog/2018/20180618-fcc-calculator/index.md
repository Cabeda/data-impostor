---
title: "Free Code Camp Calculator"
date: "2018-06-18"
---

To improve some of my knowledge of Frontend I took the FreeCodeCamp (FCC) course. It's a fantastic way to starting making some projects if you are just starting coding or don't have any ideia of where to start.

This was one of my first projects in react and, although it isn't perfect, I think the result is pretty good.

In terms of libraries I've used the following:
* react
* typescript
* Bootstrap 4 (Alpha 6)
* Math.js

As a rule I prefer to substitute babel with typescript and use bootstrap to speed up the project design.

[Math.js](http://mathjs.org/) is a crucial library (it's the one suggested by FCC) which takes cares of all the math. 

One example of using it:

```
// (3 + 4) *2
math.chain(3)
    .add(4)
    .multiply(2)
    .done() // The output is 14 
```

The final result is the following:

<iframe width="560" height="315" src="https://codepen.io/Cabeda/embed/BddXxN" frameborder="0" allowfullscreen></iframe>



Hope you have a great day :-)


