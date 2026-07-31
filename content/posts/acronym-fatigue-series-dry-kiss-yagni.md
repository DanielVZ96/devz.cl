---
draft: false
tags:
  - afs
title: 'AFS II: PLEASE stop invocating KISS and DRY'
categories:
  - notes
description: ''
date: 2026-07-05T01:27:44Z
---
### _This is part of the AFS (Acronym Fatigue Series) I'm working on. If you haven't, please read the introduction first to understand why I'm wary of acronyms [here](http://localhost:1313/posts/acryonym-fatigue-series-why-i-m-wary-of-engineering-acronyms/)._

![dry.jpg](/images/dry.jpg)

> _DRY_ = Don't Repeat Yourself
>
> _KISS_ = Keep it simple[,] stupid (some add the comma some don't)
> 
> Note: I like KISS _in principle_.


Ah yes. DRY and KISS. The ultimate hand-wavy acronyms invoked to ask for pedantic changes in pull requests. The acronyms I use to reassure myself that the refactor I am doing is necessary despite the tangled mess I am coding.

They are well meaning advice. They try to guide coders into better code. Generally smaller. More maintainable. But in reality maintainable code, more than subjective simplicity and non-repetition, requires careful thought and understanding. It requires empathy for the person that will have to read and work on the code you wrote, even if that's yourself in a few months, because we all know you will not remember why you did something in a specific way 7 months ago.

> Also Note: Here I'll consider Initialisms and Acronyms interchangeably because I'm fatigued of both. Acronyms are when you pronounce the abbreviation as if it was a new word (NATO -> nay-toe, NASA -> nassa, scuba, laser, etc), and in Initialisms you spell each letter (DIY, FYI, BRB, etc). I didn't know this until after I started this series. In Spanish, ["acronimos" are a subset of "siglas"](https://www.rae.es/ortograf%C3%ADa/siglas-y-acr%C3%B3nimos), so I've always been ignorant of their distinction and used them almost interchangeably.

# Keep it simple stupid

Coined by [Kelly Johnson](https://en.wikipedia.org/wiki/Kelly_Johnson_(engineer)) as part of his philosophy of making easy to repair combat jets. It is not clear to me if it should have the comma or not (calling the counterpart stupid vs keeping stuff stupidly simple). Regardless, it was coined in a very specific context and for a specific reason: making jets easily repairable for an average mechanic under combat conditions.

In software one of the first main advocates of the KISS principle is the UNIX Philosophy. In this case the UNIX Philosophy encompassed multiple principles that some people summarized as the KISS principle. Again. Here the KISS principle isn't the center of the UNIX Philosophy. It's just a way to summarize their principles.

When KISS is randomly invoked in a PR or discussion, I don't really know how to respond. It is such a broad acronym that it can mean anything. I mean I like simplicity too and in general I do agree with keeping things simple, but in what regard do we need to keep it simple? In UNIX for example it materializes in modularity and making simple tools that can then be composed into more complex tasks. It also materializes into the interface being just simple text. And that's it.

But what does KISS mean when designing an API? Do we keep the implementation simple so that it can be easily maintainable? Do we keep the interface simple so it can be easily used? Do we keep the scope of each endpoint simple so they can be versatile and support any future use-case? Simple can mean anything.

Simplicity is a very subjective matter. "Simple" in Java is not the same as "simple" in Python. "Simple" in Golang is not the same as "simple" in Ruby. In Python it may be about reducing the amount of work required for a feature. In Golang it's about keeping a minimalist featureset. In Java idk I haven't used it. In Ruby, similar to Python, it's about readability, minimizing human effort, but also about elegance. And in the they are all _fine_ interpretations of simplicity.  

So each language and programming paradigm carries its own culture. Not only in the structure of code but also the tooling for each language becomes an expression of the culture around it. 

XML, SOAP, JSON, REST, Protobuf, GRPC: They all are a product of their language culture and time. KISS was probably thought of in some way or another for each one of these formats/protocols, with very different results. KISS is not a culture. KISS is timeless. Everyone likes simplicity. Period. The question is what is simplicity for you? 

# DRY is a mess

> _Roses are red_
> 
> _Violets are blue_
> 
> _I abstracted for DRY_
> 
> _And now my code is a mess for you_
> 
> – Me

As I said, I like KISS in principle. But DRY on the other hand, I consider *harmful*.

I like repeating myself. I like letting the code grow until it begs for a refactor. I also like to write well thought abstractions when I've understood and worked on the problem for long enough. It's rewarding, but it usually comes after an awful initial implementation. Be it a prototype, pre-existing code, or my own flawed code deployed to production.

DRY for the sake of DRY is *awful*. It's an advice given to newcomers that don't really have the experience to know that a bad abstraction is way worse than no abstraction. I cringe when I write this because somewhere in some server or disk there's code my young self wrote that I'm not proud of and had to be rewritten or decommissioned altogether. But I also smile because I remember the smelliest most tasty code I've ever had the pleasure working on:
* Its entrypoint was a huge if-else statement that called a different function in each branch alongside some ad-hoc code
* Guess what? Each function implementation was the same in general but with some modifications here and there

I'm sure there's an appropriate abstraction for that code. Something like the Strategy Pattern mixed with who knows what. But for me, ever since that first commit, working on that codebase was a breeze. Even if it wasn't my code I was easily able to understand it. No need to follow a deep nest of function calls, class declarations and overloads. No dependency injection that hid the implementation of methods being called. I just had to read every function from top to bottom and that was all. Why would I want to lose that?

The worst code I've ever had to work on was this reporting API where there was no repetition. Every class declared had rarely an implementation and consisted in just a few parameter overloads. But in order to understand what each parameter did you had to dive deep into tens of tens of classes being inherited, mixed-in, methods being defined and re-defined. The people that wrote the initial code loved it. They knew exactly what parameter to add to each class. But for me it was an insurmountable code-base.

All this to say I've been burnt by DRY enough times that I despise that acronym. Not repeating yourself should not be a goal.

# Memes. It's all memes.

My issue with DRY and KISS is that they are a dangerous combination of inapplicable and memetic advice. Very easy to remember. Cool to share. Useless to apply.

> Note: I was also going to write about YAGNI but I think I rest my case here about acronymic advice. I'm not going to need it here.
