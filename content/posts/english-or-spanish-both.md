---
categories:
  - notes
custom_js:
  - english_spanish_spelling
draft: false
title: English or Spanish? Both.
date: 2026-09-09T00:00:00-04:00
description: What happens when you keep English pronunciation but write it with mostly Spanish spelling rules?
tags:
  - projects
  - language
---
![8A7647FE-7E4F-4630-B312-0CC775B71909_1_105_c.jpeg](/images/8A7647FE-7E4F-4630-B312-0CC775B71909_1_105_c.jpeg)
-- Photo I took in London. Sorry Britain for what I'm about to do.

# Learning to read and write English is a nightmare

I've been learning English for around 25 years already, and there are still words that there's no way I could've known how they were pronounced. Even simple common words keep tripping me up: schedule, choir, chores. Turns out some are pronounced one way in British and another in American English!

> Does this happen to native English speakers?

Then, to add insult to injury there's a myriad of words that are loaned and remixed from other languages (mainly french) that anglicized pronunciation and kept spelling: rendezvous, debris, depot, bouquet, ballet, and more.

# A deterministic world exists

Spanish is my native language. In Spanish if you can read a word you are almost guaranteed to be able to pronounce it. The only exception I've found so far is "jeans". Unfortunately it doesn't work the other way around; you cannot always infer the spelling from pronunciation alone, specially in accents with Ceceo/Seseo (where S, or C and maybe Z become indistinguishable), and also due to distinctions such as b/v, silent h, g/j.

> Note: I'm sure this is not exclusive to Spanish, I'd love to hear from other written languages that exhibit this property.

Since I was very little, spelling bees have been an otherworldly concept; how could you make a contest on how words are written if it only consists in a easy to learn set of rules and very few exceptions here and there? Growing up for me was noticing that in English exceptions are the rule. 

So I *know* from experience that it is possible to be able to pronounce a word by only reading it. Then it's only natural to wonder how would English look if it was written using Spanish spelling rules?

{{< english-spanish-spelling >}}

Enter "English or Spanish". My latest invention. Try writing any English sentence and then hear how an automatic speaker reads it both in normal English or Spanish-readable English.

# Spanish is doing most of the work

The initial version was a pile of letter replacements. `ee` became `i`, `tion` became `shon`, and so on. It worked for a few carefully selected sentences and immediately fell apart when I typed almost anything else.

Consider _photograph_. Its two written `o`s represent different sounds. A letter replacement doesn't know this, but a pronunciation dictionary does:

`photograph` → `/F OW1 T AH0 G R AE2 F/` → `fóutagraf`

The widget now looks up the English pronunciation first, breaks it into phonemes, and only then writes those phonemes with the new alphabet. It uses the [CMU Pronouncing Dictionary](https://github.com/cmusphinx/cmudict) for known words, some hand-tuned exceptions where I disagree with the mechanical result, and the old unreliable spelling rules as a last resort.

You can disable my hand-tuned words. I added the checkbox because otherwise it would be suspiciously easy for me to hide every bad result with another exception.

# I've got a confession to make

__This is not Spanish.__

I originally tried to approximate every English sound using normal Spanish pronunciation. That made `think` become `dink` in Latin American Spanish and `zink` in Spain. Both are readable approximations, but both throw away the sound that made the problem interesting in the first place.

So this is not OG Spanish anymore. It adds a few conventions:

- `v` is the English `/v/`, never the `b` some Spanish dialects use (like mine).
- `th` is `/θ/`, the sound at the start of _think_.
- `sh` covers both the sound in _ship_ and the similar sound in _measure_.
- `r` is always the soft English `/ɹ/`, never tapped or rolled.
- `t` is the English `t`, including all the strange things it does in words like _top_, _stop_, _water_, and _button_. This is a huge concession in my opinion.

> Using `r` with the Spanish could approximate the American flap in water, but then we'd have two `r` and I don't want to go through another character/symbol choosing rabbit hole while also having to handle all other `t` pronouciations.

The vowels start with their Spanish sounds: `a` as in _casa_, `e` as in _mesa_, `i` as in _sí_, `o` as in _cosa_, and `u` as in _tú_. Then I combine them to recover English sounds Spanish doesn't normally write: `ai` as in _eye_, `au` as in _cow_, `ei` as in _day_, `ou` as in _go_, `oi` as in _boy_, and `iu` as in _new_.

Everything else tries to stay readable through Spanish rules.

> `I` becomes `Ai` because the English pronoun is pronounced `/aɪ/`. I left the second letter lowercase so it doesn't look like artificial intelligence invaded the sentence.

# Why not IPA?

The International Phonetic Alphabet already solves the problem of writing pronunciation. It also solves it much more precisely than this thing.

But most people can't read IPA. I can only slowly decode the small part I have encountered while working on this. The point here isn't to invent a better phonetic alphabet. The idea is to borrow an alphabet millions of people already know and see if it works at all.

That is also why the Personal mode exists. If `th` should be `d` to you, change it. If _measure_ should use something other than `sh`, change that too. There is no neutral English accent hiding behind the interface, and there is definitely no single Spanish ear listening to it.

# What are these tildes?

In Spanish, these tildes or accent marks indicate what syllable needs to be stressed. These are the stress categories:

- Agudas: Stress falls on the last syllable. Examples: Canción, Café, Reloj, Compás.
- Graves: Stress falls on the second-to-last syllable. Examples: Casa, Árbol, Fácil.
- Esdrújulas: Stress falls on the third-to-last syllable. Examples: Música, Pájaro, Teléfono.
- Sobresdrújulas: Stress occurs before the third-to-last syllable. Examples Dígamelo, Rápidamente.

> Note: You'll notice some words don't have accent marks, that's because there's rules for implicit accents. For example Agudas only get accent marks when they end on "N", "S" or a vowel.

In Spanish not all stressed syllables have tildes, but in the tool above they are always marked in order to avoid coding an extra set of rules and hopefully make it even more explicit for non-Spanish speakers.

# Where this... thing breaks

English has dialects. Spanish has dialects. The pronunciation dictionary mostly describes General American English, the vowel mappings are rough, names are unpredictable, and words like _record_ change pronunciation depending on whether they are nouns or verbs.

The browsers voices also don't read it perfectly. Some voices read some phrases better than others.

> I dare you to paste this whole post into the tool and hear it from end to end with different voices. Sometimes it's quite hard to make out what they are trying to say.

And Spanish spelling isn't perfectly phonetic either. It is simply much more consistent than English for this particular job.

All of this is fine. I wasn't trying to reform English or create an international standard. I wanted to make a sentence look Spanish until you read it out loud and notice it was English all along.

# Sorry English speakers, Ai fikst ior spéling. __Ior uélcam__.
