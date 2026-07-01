---
title: 'SOLID and Clean Code never felt solid or clean to me'
date: 2026-07-01T00:00:00Z
categories:
  - notes
  - 
---

![Sheep](/images/sheep.png)

I learned to program through online documentation and projects. I also read books but I don't consider them pivotal to my programming or software engineering career. Some of the books I read are:

* Designing Data-Intensive Applications: really good book. 

* The Mythical Man-Month: felt outdated but useful to understand where the industry came from

* Design Patterns, Elements of Reusable Object-Oriented Software: I don't remember much. I think I read this too early to fully grasp all patterns but at least it gave me a general understanding of Design Patterns

* Clean Code: this book felt like a bunch of advice from a senior engineer, but much of it not being verifiably good advice. As an outsider it at least made me aware that I had to be conscious that my code was going to be read.

One day an interviewer asked me about design patterns and SOLID principles. I started talking about the ones I learned from the Gang of Four book, but he stopped me and said that he meant SOLID principles, and that he was not sure what I was talking about. Now in retrospect I know he was just reading the rubric without knowing much about the topic but I left that interview confused.

So I googled SOLID principles and landed on a [video](https://www.youtube.com/watch?v=zHiWqnTWsn4) where this "uncle bob" dude spent a good chunk of his introduction talking about the water molecule only to then take more than 10 minutes to explain that the rate of new programmers was constantly doubling and that as long as this rate of growth continued, half of all engineers would always be inexperienced. Then after a whole 20 minutes into the talk he starts a real introduction when he explains that bad code slows you down (no shit, Sherlock), that code rigidity, coupling is bad, only to really get into the topic 30 minutes in. 

Nearly half of the talk could have been fully explained in 5 minutes.

# Where I was coming from

Around that time I was in my 3rd year studying history. I had to read and write 1000s of pages a week. I learned that not everyone writes the same and that different disciplines have different writing styles. If you were writing history there's a structure and vocabulary you were implicitly supposed to follow, same for other social sciences, and I assume it's the same for the hard sciences as well.

I see them as cultural rules that arise from reading each other's work until some writing culture emerges. So in order to get good grades I'd try to mimic my professors and their preferred authors writing and investigation styles for my essays. I started to get a feeling of what kind of author I was reading, how dense their writing was, the pacing, and how they mixed narrative with argumentation.

Also for reasons I won't explain here by around that time I had seen around maybe 4 or 5 successful scams/cons very closely. Like actually helplessly being around the con-man and the victim as the con was happening, for months.

All this to say that I had developed a sense for understanding how people wrote and spoke.

# Why does this read like a con?

Not to disrespect "uncle bob" but everything he wrote and talked made me feel like I was being scammed out of my time while trying to convince me this was the talk/writing of a genius programmer.

First of all there's the "uncle bob" nickname, which has this backstory:

> Just to be clear, the name "Uncle Bob" was given to me by a coworker in 1989. It was in my email and uunet signature for years. (There are kids out there who don't know what uunet was). The name stuck, and I eventually adopted it as a brand.
> 
> – Robert C. Martin, https://news.ycombinator.com/item?id=7713646

It's an ok explanation but that doesn't change the fact that the name still feels manipulative for someone that was trying to establish a brand of being a dependable senior engineer.

> Also as a side-note, OF COURSE THERE ARE KIDS THAT DON'T KNOW WHAT UUNET WAS. 
> 
> We get it. You are an "experienced" programmer.

Engineers have a tendency to assume they are impartial machines that are able to see the objective truth, but if there's something that I learned while studying history is that the only way to be able to strive to be objective is to embrace the fact that you are a subjective human being. The more objective you assume you are, the more easily manipulated you can be by subjectivity, be it your own subjectivity or others. The fact that I had coworkers speak fondly of "Uncle Bob" as if he was a real wise uncle and cite him to justify some convoluted dependency injection shenanigans made all my manipulation-senses go off.

Then we have the actual prose he uses. As I said before, his style is overly dependent on filler content. Of course it's not just random filler content. It's stuff he can confidently say while scratching his chin, drop a witty joke here and there, and look smart in the process. If my university professors caught me writing like that they'd deduct points for wasting their time. I saw this done plenty of times in university. Especially from us students. When we wouldn't be able to fill in the required pages we'd resort to over-citing sources and adding slightly related narrations that would have made no impact on arguments other than extend their length.

The way I used to read filler-ridden history books and essays was to just scan the text first, highlighting the actual content and then do a proper read afterwards. The same can be done with Uncle Bob's books.

> “You can see how **smart** Robert is by watching only a small bit of the workshop, talking (and a lot) about software principles in development, **astronomy, math, history, corporate world, and other subjects** that most, what called ‘programmers’, might not even have heard about it!”
> 
> – Someone who apparently liked the filler content

Now I must admit that this is also partly a matter of taste. But in my opinion there's some responsibility to bear if you sell yourself as the source of senior experience to newcomers to the craft. In the best case you are wasting their time. Worst case scenario you are manipulating them into dogmatic behaviour through low substance content that requires quite some faith on the author.

# Acronym Marketing

Boy do software engineers love their acronyms. 

You have the agile acronyms like: SOLID. DRY. KISS. YAGNI.

You have the vendor pushed acronyms like: ACID, CAP, OLAP, OLTP.

The list is endless. Some of them I can get behind. Others have a well researched and honest origin (ACID, CAP) but at the same time it feels like these have proliferated because they have served as marketing bullet points and slogans for both corporations and "agile" proponents. If you really look into it, some SOLID principles are anything but solid when you hold them to scrutiny. The amount of complexity I've seen from engineers needlessly DRYing their code has cost endless hours. And I could go on and on on the topic of people taking these acronyms to the extreme in order to justify their practices.

Acronyms like ACID, CAP, OLAP, OLTP, etc. are included as foundational knowledge for interviews but in practice there are much better alternatives for understanding software systems. The unglamorously acronymed [PACELC](https://en.wikipedia.org/wiki/PACELC_design_principle) design principle is one of my favorites.

To be fair with engineers this seems to be part of US culture. These people use acronyms for everything. When I started working with US-based colleagues I had to google a new acronym every other week. 

> To me the worst offender in the acronym world is EBITDA. At that point you have a whole new word. Just invent a new concept please. Something like Core Operating Earnings or something.

# Wishful Naming

When you write a history book you don't call it "Clean History of Hispanic Colonialism" or "SOLID History of 20th Century Chilean Agricultural Culture". You usually call it what it is. To me people calling their code or software "Clean", "Easy", or "Simple" has always felt wrong. You aren't entitled to declare your own creation to have some subjective trait you strived for when writing it.

I've seen people call their classes (especially when they come from Java) something like SimpleRepository. Why not just Repository? What if I don't find your class simple enough to be awarded that name? Can I just remove it? What if it grows into a ComplexRepository? 

Same goes with books.

Even with all the experience uncle bob might have, he's not entitled to calling his own code clean. Plenty of his examples in the "Clean Code" can be deemed not clean at all and contradictory to his own principles. 

# All I'm trying to say is...

Software engineering culture is overly dogmatic and subjective. We try to think of ourselves as more objective than we are, but we aren't. We fall into marketing techniques like sheep being herded by a cute border collie.

I'm sorry, Uncle Bob. I used you as a punching bag here. I don't like your books or talks, but at least it's honest work. Just a tad too manipulative for my taste.
