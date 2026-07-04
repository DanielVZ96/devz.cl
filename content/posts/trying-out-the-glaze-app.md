---
draft: false
tags:
  - software
  - meta
title: Glaze made me an editor for this site
categories:
  - notes
description: ''
date: 2026-07-03T23:09:19Z
---
![The website editor Glaze made for me](/images/glazeapp.png)
> _Desktop apps,
reimagined by you.
Create any app in minutes by chatting with AI. Beautiful, powerful, and truly personal._
>
> – Glaze's description on their site

This is a static Hugo site running on GitHub Pages. So my authoring setup was pretty simple. I'd just author the Markdown in a WYSIWYG Markdown editor, preview the site on my browser with a local Hugo dev server, and git commit + push to publish.

But for some reason, what I want is a clean editor where I can do all that at once. 

So when [Glaze](https://www.glaze.app/) launched, I knew what to test it on.

## Here are the prompts I used

> Create an editor for my personal blog that uses Hugo and a personal theme. See the config attached

It did pretty well for a first attempt, but I found some issues.

> Make the front-matter editor more compact. It’s using 1/3 of the screen. The live server is not showing anything.

After that, it was in a pretty usable state, but why stop here?

> Add a way to insert images by selecting them. It should copy it to the images folder.

![file-picker](/images/file-picker.png)

While it was implementing that, I remembered a recent [blunder](https://news.ycombinator.com/item?id=48751290)

![blunder in hackernews](/images/blunder.png)

> Also compress/shrink images when copying them, so they don’t make the site slow

![shrink](/images/shrink.png)

(This size still heavy, I'll have to ask it to make compression even more aggressive)

Then I noticed the Publish button was committing all files.

> Let me choose which files to commit when running Publish.

![File Publish Picker](/images/file-publish-pick.png)

Then some bug fixes were needed.

> Live preview isn’t working now.

> The Publish Changes Editor looks wrong. Also, add a file editor so I can clean up the work-tree.

And at last, I asked it to polish the file editor a bit more.

> Add filters for the project files picker/editor. Uncommitted/committed, folder, type, etc. Also, an order by.

![File Picker Improvements](/images/file-picker-improvements.png)

## It also generates cute icons.

With the editor finished, I asked it to make the icon in cozy anime style, and I consider my new editor finished:

![App Icon](/images/devz-app-icon.jpg)

## Could I have done this by myself?

Most probably. I used to do Full-Stack work but I'm a bit rusty on frontend stuff since I've been working exclusively in Data Engineering for quite some time now. 

Also I try to restrict the time I spend on this blog to just an hour a day max. Anything more and I might start ignoring everything else. And with this plus my recent Sudoku obsession (I'm containing myself from implementing my own solver AHHH), I'm at the brink of a productivity catastrophe.

All this to say technically speaking, yes. Practically, probably not.

## I think I like Glaze.
Some next steps I might be using Glaze for in the next few days:
* Change the stock native macOS style into a cozy writing vibe.
* Explore the store for cool apps.
* Add media management/editing capabilities for images and videos.
* Add short-code/partials code editors and evaluators.
* Leverage local dictionaries and AI for proofreading.
* Maybe deploy status?
