---
draft: false
tags:
  - afs
title: 'Acronym Fatigue Series part 1: CAP, ACID and friends'
categories:
  - notes
description: ''
date: 2026-07-05T01:25:03Z
---
![pexels-eduraw-37245214.jpg](/images/pexels-eduraw-37245214.jpg)

### _This is part of the AFS (Acronym Fatigue Series) I'm working on. If you haven't, please read the introduction first to understand why I'm wary of acronyms [here](http://localhost:1313/posts/acryonym-fatigue-series-why-i-m-wary-of-engineering-acronyms/)._

> Note: CAP and ACID are useful concepts that every software engineer should know. This is not a criticism of the ideas behind the Acronyms. It's a criticism of engineers making mistakes due to their acronymic nature.

CAP, ACID, and others (such as BASE, PACELC), are acronyms that represent sound concepts and but their acronymic nature can be considered harmful. But before we dive deep into CAP and ACID, let's ponder for a moment if there's really any gains from using Acronyms when discussing technical concepts.

> Also Note: Here I'll consider Initialisms and Acronyms interchangeably because I'm fatigued of both. Acronyms are when you pronounce the abbreviation as if it was a new word (NATO -> nay-toe, NASA -> nassa, scuba, laser, etc), and in Initialisms you spell each letter (DIY, FYI, BRB, etc). I didn't know this until after I started this series. In Spanish, ["acronimos" are a subset of "siglas"](https://www.rae.es/ortograf%C3%ADa/siglas-y-acr%C3%B3nimos), so I've always been ignorant of their distinction and used them almost interchangeably.

## Do few ~word~ syllable do trick?

> Why waste time say lot word when few word do trick?
>
> -- Kevin, The Office

Let's first  introduce the "do few syllable do trick?" (dfsdt) principle. The main appeal of Acronyms is that they supposedly make communication faster. Abbreviations in general are some sort of linguistically compression. They must be useful in general, otherwise we wouldn't use them. But for example DIY, when spoken, only saves you from pronouncing a single syllable. WWW is worse, because "double u" is awful at compressing syllables. But then you have CAP, an acronym that compresses three words into a single syllable, surely it must save some time. Or does it?

I'll define "dfsdt" principle as vaguely as principles are usually defined: whenever using abbreviations, is the time saved worth it? For something like NATO I think it's absolutely necessary. It stands for: "North Atlantic Treaty Organization". It's something that people pronounce quite frequently in their everyday lives, and pronouncing that whole name out loud for me sounds like a mouthful. I'm fine with acronyms for organization names.

On the other hand, is CAP, ACID and friends something you really have to say in your average workday? I've mostly written it and read it, only having pronounced them a few times during meetings, and probably during interviews. How much time can be saved by acronyms in text? Adults don't read spelling every letter, [we scan the text at thought speed](https://devz.cl/posts/reading-is-the-closest-thing-we-have-to-telepathy/), and writing on a keyboard makes them trivial in terms of time spent on them. They even occupy very few bytes of this whole article, and this article is about them! For me CAP, ACID, etc, not do trick.

So here's one of my guidances for the dfsdt principle: having to share a concept in spoken english makes it way more worth as an acronym than in written english. CAP, ACID, BASE, etc have not been worth the hassle. But what hassle am I referring to?

## The illusion of understanding

CAP stands for Consistency, Availability, Partition Tolerance, and is famously summarized as "pick two". ACID stands for Atomicity, Consistency, Isolation, Durability, and defines the characteristics of a transactional system where data validity is intended even in the presence of operational issues.  

> I'm not doing a full explanation of CAP or ACID here. Due to the length of this article, any explanation I can do is at most insufficient. If anyone wants a full explanation and updated review I'd refer them to [Brewwer's "CAP Twelve Years Later" article](https://www.researchgate.net/publication/220476881_CAP_Twelve_years_later_How_the_Rules_have_Changed).

Here I've only expanded the acronyms, there's no actual knowledge gain because: what does each concept in each acronym mean? An infamous example is that Consistency means totally different things for CAP and ACID. In CAP, consistency means linearizability: where a distributed system behaves as a single copy of the data. In ACID, Consistency means that the database invariants are kept in between transactions.

In summary, acronyms provide an added layer of indirection where the learner can gain a false sense of knowledge when they've only unpacked the concepts.

## Passenger letters

I admit it. ACID and BASE (Basically Available, Soft State, Eventual Consistency) are cool acronyms. BASE is defined in opposition to ACID, just like the chemical concepts. They are so cool in fact it makes me think they were molded into making the acronym work.

Kleppman in "Designing Data Intensive Applications" famously wrote: "the letter C doesn’t really belong in ACID". He identifies Consistency as an application level responsibility in opposition to a database level one.

Brewer (one of the authors that coined BASE), regarding ACID and BASE wrote: 
> Although both terms are more mnemonic than precise, the BASE acronym (being second) is a bit more awkward: Basically Available, Soft state, Eventually consistent.
> -- [Brewwer's "CAP Twelve Years Later" article](https://www.researchgate.net/publication/220476881_CAP_Twelve_years_later_How_the_Rules_have_Changed)

The acronyms look cool because they were designed to. They are not meant to be fully precise, and some letters are being carried by the others.

## There is no anti-memetics division here

The usefulness of the usage of acronyms is not for the reader. It's first and foremost to make the acronym memetic. And I'm all for memes. They are useful and fun. CAP and ACID have had a wonderful lifespan, and I'm grateful for the authors that thoroughly studied database systems and later coined them. But as I wrote, their acronymic nature makes it useful for spreading the idea itself (and maybe for the authors). 

I must ask myself: in this day and age, are there more useful concepts that we could be giving more attention than CAP, ACID, and friends? Are they useful enough to satisfy the dfsdt principle? I think not. For the reasons above and [others](https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html) [from](https://ocw.tudelft.nl/course-readings/2-2-8-beyond-consistency-from-cap-to-pacelca/) more renowned authors, these concepts are reductive and in my opinion we'd be better-off if instead we started discussing the actual properties of a database system directly instead of trying to unpack acronyms that have already served their purpose. In the end, I want colleagues to talk about linearizability, serializability, eventual consistency, availability models, etc.

This is not to say that there's no discussion around these more precise concepts, but software engineers, specially those not working data-centric environments, may be stuck only in the memetic acronyms.

> Foot Note: the dfsdt principle infringes itself (5 spoken letters vs 7 syllables from the sentence, only written a few times in this single article, never spoken out loud). It's an abomination. It's everything I'm writing against, and this is the last time I'll hopefully ever type it.
