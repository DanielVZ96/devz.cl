---
title: 'How to learn to code in the age of AI'
date: 2026-05-07T00:00:00Z
draft: false
description: 'Notes on learning to code with AI around: start with curiosity, build things, read docs, and grow the complexity over time.'
summary: "Enjoy it, play video games, read books, read documentation, code, increase complexity, deploy your code, use it, look for community, and maybe find a job if that's what you want."
tags:
  - coding
  - learning
  - ai
  - tis-100
  - games
categories:
  - notes
images:
  - /images/tis-100-screenshot.jpg
---

*TLDR: enjoy it, play video games, read books, read documentation, install Linux at least once, increase complexity, deploy your code, use it, look for community, and maybe find a job if that's what you want.*

I've always wanted to share how I taught myself how to code. It was a fun experience and extremely rewarding, not only money-wise, but also really fun in itself.

Nowadays, with AI, we see younger generations struggling to force themselves to understand the code they are writing. It's extremely convenient to just let AI write the code and only verify it's doing its job. I've seen friends fall into this trap where in the end they are automating themselves away from experience.

I hope this entertains anyone curious on how self-taught people learn and helps someone who wants to learn how to code in this new age of software authoring.

# No vibing until you've felt this first.

The year was 2017. The Legend of Zelda: Breath of the Wild just came out and it's a masterpiece. So good, you can go fight the final boss right after you leave the tutorial area.

My best friend who has always been good at video games is speedrunning it, and he's doing great. He even got to hold the world record for some time. Naturally he started streaming his runs on Twitch. He was using some chatbots to help him during his stream. For example he had a command to tell people his schedule, his current Personal Best time, etc.

Maybe making a free alternative for him should be easy. I had been learning to code in Python for some months by then, and that kind of project ought to be pretty straightforward right? RIGHT?

In retrospect it was a simple task. But for me it was a huge undertaking. I had to read the Twitch documentation to learn how to connect to a chat room, learn what websockets were, what ports were, what IRC was, learn about asynchronous python code, about multiprocessing, and so much more.

But I was having fun.

After a day or two I had a python file with no more than 800 lines of code that connected to the stream chat room, read messages until one started with a !, looked up the command in a python dictionary and sent the corresponding answer in a response.

The first command/response pair that worked felt magical.

Magical not only because it worked, but because I understood WHY and HOW it worked. Something that at first felt out of my realm of possibilities, now felt as if I myself had mastered the magic spell and was wielding it with my own will.

### Tip 1: No vibe coding until you've felt like a wizard.

Not a Gandalf level wizard. Abracadaniel level is fine. As long as you are having some fun, you'll continue learning.

But how did I get to this point where I could code and investigate computing concepts by myself? How did I start learning?

# How to start.

It's hard to define the exact moment I started learning to code.

It may be when I tried to learn JavaScript when I was 15. But all I managed to do there was play a bit with the browser console.

It may be when I joined the robotics club at my school, but all I did there was copy the script to turn a LED ON and OFF before I stopped attending.

No.

The exact moment I started learning was in a video game: TIS-100.

![TIS-100 screenshot](/images/tis-100-screenshot.jpg)

> TIS-100 is an open-ended programming game by Zachtronics, the creators of SpaceChem and Infinifactory, in which you rewrite corrupted code segments to repair the TIS-100 and unlock its secrets. It's the assembly language programming game you never asked for!
>
> -- TIS-100 Steam Description

This is the game. A bunch of boxes where you write some fantasy assembly code.

I haven't played it in a while but from what I can remember the goal was to fill in code on those squares to satisfy some output. In order to do that you had to read the manual.

I spent quite a few nights scanning this PDF to find how to solve each level. At first it was quite demanding but once I got the hang of it, it was so satisfying.

### Tip 2: Start by playing games, have fun.

Here's some other game recommendations to start with:

* Turing Complete

* Shenzhen I/O

* 7 Billion Humans

* Human Resource Machine

* Replicube

# Import Antigravity

Once I finished playing TIS-100, moving to a high-level programming language (in my case Python) felt like what Goku must've felt after his 100x gravity sessions on his way to planet Namek.

Everything low-level was just an import away from being already abstracted out for me.

Reading the documentation felt so much nicer and complete in comparison to scrolling in that PDF manual.

One of my first projects was a calculator app using Qt. Then I got into Django and started working on a Historical Document ingestion service. I even paired with my History professors to develop that (it never saw the light of the day). I even self-hosted it in a free DigitalOcean instance.

I also made my first useful program: a script that created a slideshow for every image on a folder. It was for my dad who wanted to sell a bunch of stuff to some clients.

Another useful program was one for a summer job my girlfriend-now-wife got me. It consisted of writing some mail aimed at her university students based on a spreadsheet. There were hundreds of them. So naturally I wrote a script that read the spreadsheets and generated the Word documents that later would be printed as mail.

Then I made the chatbot I mentioned above. It consisted of a web service that provided the admin interface, and a worker that would join the stream chat and answer any commands. I hosted it on DigitalOcean, and in order to deploy it I had to get used to using SSH, the Linux command line, running a webserver (I think I was using Apache), setting up DNS, and systemd units if I remember correctly.

### Tip 3: Choose a high-level programming language and build stuff with it.

After coding for a while I decided to move to Linux (I installed Arch Linux with i3wm btw) because every dependency was one command away vs how in Windows world I had to mess up with installation wizards, UI for setting the Path, sometimes the registry maybe, etc. In Linux everything being a file felt so much simpler to me.

### Tip 4: Learn Linux and deploy your stuff as production-ready as possible.

Something I'd like to highlight here is that as a History student I was quite used to reading and writing a lot. And the python documentation was way easier to read in comparison to historiography and even easier to read when compared to philosophy. So I read the python docs as much as I could. Same with the Django and DRF docs.

### Tip 5: Read the documentation.

I cannot emphasize enough how grateful I am for how open and straightforward the documentation is. It helped me learn plenty of concepts I didn't know even existed. If they referenced something I didn't know, I was a web search away of grasping a new concept.

Also in same topic of reading, books can be quite useful. To be honest I didn't get much of my technical chops from books, but in the absence of a mentor, they share knowledge from decades of experience. Some books I read during this time were:

* The Mythical Man-Month

* Design Patterns: Elements of Reusable Object-Oriented Software (ok this was a bit more technical)

* The Pragmatic Engineer

* Clean Code (I don't recommend this one)

### Tip 6: Read books.

# Look mom! I got a job!

So after some months of coding I reaaaally wanted to be able to talk about this stuff with other people. I found some meetups I could attend and I went to a few at a local makerspace, and one about Big Data in a local university.

In one of those meetups I was talking about the projects I was running on DigitalOcean with another attendee and he told me that surely if I tried I should be able to get a job. So that's what I did.

### Tip 7: Find communities to talk about tech.

I applied to a few small startup job postings that in my opinion at that time I was barely qualified for. Out of 12 I was interviewed at 3 of them, and I was offered a job at those three.

It took me between 2 weeks and a month to get a job. Those were some intense weeks where I had to juggle interviews, take-home interview assignments, barely attending my university classes and around 2 nights with barely any sleep.

When I talked about this with my first boss he told me he was astonished I was able to land the job. In that specific process somehow I beat other 120 applicants. But in his own words I happened to know and had used almost every tech they were using, except maybe for Elasticsearch and their orchestrator which was pre-Kubernetes era Deis.

### Tip 8: You lose nothing trying to find a job.

# Coding in the age of AI

This was my experience about 8-9 years ago. I got my first job in 2018. At that time, agentic coding wasn't something I expected to be so common in 2026 but it is. Nowadays most of my code is AI generated. So advising anyone to not use AI for their work would be hypocritical of me. But newcomers must learn how stuff works, at the very least at a high level. That way they will at least know what to prompt to the AI when more specific instructions are needed.

I don't want to get much into the weeds here. Maybe it's a good topic for another post. But this industry has changed, and I'm not sure what the most optimal route is for newcomers to be able to find a job. But I know at the very least that in order to start learning, avoiding vibe-coding is a good idea. When I started learning I was advised (by the internet) to not just copy-paste stuff from Stack Overflow. It's the same principle here.

# Bonus track: media that inspired me

* Movies/Series:

  * The Internship: A movie about a pair of friends with no technical chops that miraculously get an internship at Google. I'm not sure about how accurate the movie was, but from what I remember it was fun. *I put it first because it was the first piece of media that confirmed me (even if naively) that I could land a job as a self-taught.*

  * Mr. Robot

  * Silicon Valley

* Essays/Blogs

  * https://www.paulgraham.com/articles.html

  * https://martinfowler.com/

  * https://danluu.com/

  * https://fasterthanli.me/

  * https://www.joelonsoftware.com/
