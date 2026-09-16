---
draft: false
tags: []
title: My Software Agnostic Window Management Setup
categories: []
description: ''
date: 2026-09-16T15:20:21Z
---
![escritorio-3.png](/images/escritorio-3.png)
-- My homebrew website editor + Raycast

I have had virtualy the same window manager setup since 2017, when I installed Linux for the first time in my  Microsoft Surface Pro 3 laptop. During these years I've been swapping multiple Linux distros and also using macOS.

> Note: My current main machine is a light Macbook Air M4, paired with a Thinkpad T470p acting as a homelab/server for all my sandboxing and homelabbing needs.

# How?

The first thing I setup when I installed i3wm in 2017 was a set of keyboard shortcuts to my most used Apps: slack, the browser, music, etc. Then I adapted the keyboard shortcuts to manipulate windows and workspaces to my liking. And finally I installed an omni search solution that I think at that time was implemented through Rofi for everything else.

The only thing that has changed, beside software, are the modifiers. In Linux I think I used Super+Alt for moving windows and workspaces and Super+Shift for opening apps. Since in macOS the Cmd key is used regularly by Apps, I use Option+Control and Option+Shift instead.

# My shortcuts

This is from memory so I may be forgetting something. I'll try to keep this updated.

## Apps. Option+Shift+:
* B: Browser (currently Dia)
* T: Terminal (currently Ghostty)
* M: Apple Music
* S: Slack
* N: Notes
* L: Linear
* P: Password Manager
* I: Iphone Duplication
* W: WhatsApp
* D: Database Manager (currently Dbeaver)
* G: Game Engine (currently Godot)
* Z: Code Editor (currently Zed)
* X: Xcode
* . (dot): Dictation

## Window Management. Option+Control+:
* hjkl: Tile window to the left, bottom, up, right
* M: Maximize (I like to leave some padding to see my background around the windows)
* +/-: shrink or enlarge window
* R: Reasonable Size for smaller windows
* TODO: Moving window to another space

# Porting

I almost always use windows Maximized and only tile while doing some multitasking so this minimal setup works for me. Because of this, so far I've had little trouble porting this. For macOS I use Raycast for the Omni bar, Apps shortcuts, and Window Management. In Linux I've always used WMs that let me easily setup shortcuts (i3, sway, PaperWM, etc).
