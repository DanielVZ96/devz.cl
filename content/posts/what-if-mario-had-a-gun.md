---
title: 'What if Mario had a gun'
date: 2026-05-11T00:00:00Z
tags:
  - projects
  - gamedev
categories:
  - notes
---

Mario 64 and Mario Odyssey are one of my favorite videogames. 

> *Mario Sunshine could be up there as well but my right joycon is broken and there's a point in the game where I have to look at the sun but can't enter first person camera mode.*

There's something about the movement in those games that makes you feel badass. There's also the fact that you can beat virtually any minion in a single bounce, but combat isn't the main highlight in mario games. But what if it was?

When I was little, my favorite game was Modern Warfare 2. I spent way more time than I'd like to admit on online matchups. Again, when you got that kill streak and unlocked the AC-130 you also felt like a badass. But the repetitiveness of the franchise made shooters fall out of grace for me. 

# Then what if mario had a gun?

Well, there's [Shotgun Mario 64](https://www.youtube.com/watch?v=YHdUHSv2lPc). I haven't played it myself but by the looks of it the gun is overpowered for combat and kinda breaks the game. It does give you an extra movement option and it may be fun to speedrun but in general it seems more like a parody attempt.

Movement shooters are another genre that is similar to the Mario + Guns concept, but they are historically leaning more into Quake inspired movement in an FPS setting. What I want is to be able to do a Triple Jump into a backflip and shoot enemies in the air. So that's what I implemented.

{{< video src="/videos/triple-jump-shoot.webm" >}}

So to answer the question I'm going to list some of the design decisions I've made along the way hoping that if I define them all it can help me actually finish the game.

### Consequences of giving a mario-like character a gun

* once you give mario a gun, all typical characters can be easily killed

* the focus of the game is split between platforming and shooting

* by default jumping looses its importance

* aiming may impair movement

* platforming loses its forced proximity. think mario having to jump on top of enemies

* camera design changes. do you aim where mario is pointing or where the camera is pointing?

* enemies in general become targets rather than obstacles

## Game Design Decision Records

There are three Pillars that extend from the Mario + Gun concept that I want to keep in mind to guide my design decisions:

1. Fast Expressive Movement

2. Overpowered Gun Combat that goes both ways

3. Combat Oriented platforming

So based on those, I'm going to list some decision records for my game. Think of [ADRS](https://adr.github.io/) but for games (Game Design Decision Records). I'm sure game designers have a better way to do this in their Game Design Documents but this will do for now. 

* GDDR 1: Protect normal enemies
  
  * context: normal encounters
  
  * given that mario-like enemies are normally killed in a single blow and 
  
  * given I'd like to keep that felling
  
  * normal enemies need some sort of protection like: walls, numbers (less fun in my opinion), environmental hazards for the player

* GDDR 2: Roguelike gameplay loop
  
  * given that I lack the skills to design fun linear levels, and through playtests and due to my own skillset I decided on the following loop
    
    - Enter Level
    * Enter Structure
      
      * Enter Room
        
        * Fight Enemies
        
        * Encounter Shops
      
      * Get Structure Rewards
        
        * Items
        
        * Movement Abilities
    
    * Fight boss
    
    * Go to next level

* GDDR 3: No ladders, yes portals
  * given that I don't want to code them and they are slow
  * gonna use portals instead because those are cool

* GDDR 4: Lethal combat
  
  * given that mario-like enemies are normally killed in a single blow and replayability is key for a roguelike like this
  
  * combat will be lethal high stakes
  
  * a bit like hotline miami but not so much. maybe dead in like 3 hits
  
  * ties a bit to GDDR 1 
  
  * will require escalating stakes as runs progress

* GDDR 5: Portals
  
  * i like them
  
  * will be used further as a gimmick after first level

* GDDR 6: Loot
  
  * game will have random loot
  
  * will help manage escalating combat lethality
  
  * extra movement abilities will have to be unlocked (not sure which ones yet)

* GDDR 7: Abilities to unlock
  
  * ```json
        "long_jump": "Crouch and jump forward to perform a powerful long jump.",
        "slide_jump": "Jump inmediately after and quickly reversing direction to do a slide jump.",
        "triple_jump": "Perform three consecutive jumps of increasing power.",
        "crouch_jump": "Jump while crouching to perform a powerful crouch jump.",
        "dive": "Jump just at the start of a stomp to dive forward while in the air.",
        "stomp": "Stomp on enemies from above.",
        "normal": "Basic movement ability.",
        "first_jump": "Perform your first jump.",
        "shoot": "Shoot your weapon.",
        "aim": "Aim your weapon.",
        "aim_air": "Aim your weapon while in the air.",
        "crouch": "Crouch down.",
        "wall_slide": "Slide down walls.",
        "wall_jump": "Jump off walls.",
        "kick": "Kick enemies.",
        "slide": "Slide on the ground."
    ```
  
  * these are the states i have implemented so far
  
  * TODO decide unlockable abilities

* GDDR 8: Boss fights
  
  * given that roguelikes usually have boss fights and they do give good, controlled, difficulty spikes
  
  * once 7 structures have been cleared in a level a boss fight event is triggered
  
  * will trigger a new special structure spawned
  
  * are gimmick based instead of just chipping away damage (inspired by mario)

* GDDR 9: Entering a structure (series of rooms)
  
  * given that distant enemies would spend resources such as memory and processing, and sniper enemies could feel unfair from far distances
  
  * structure enemies are spawned only when the player enters the structure
  
  * a wall appears around the structure so the player can't exit it until cleared
  
  * cleared means reaching the treasure room. enemies are only required to advance to the next room

* GDDR 10: Score system
  
  * given that enemies can be easily defeated without any movement or expressiveness
  
  * a score system will be in place with the following initial implementation
    
    * every kill starts a timer and a score multiplier at 1x
    
    * every next kill increments the multiplier
    
    * timer is faster while grounded
    
    * bouncing off an enemy increases the multiplier twofold
    
    * movements, kills and ability usage give points
      
      * kills: 500
      
      * movement and abilities: 100
  
  * Once a structure is finished, the score will determine how many rewards the treasure room will have

# Conclusion. Is this fun?

{{< video src="/videos/playtest.mp4" >}}

Yes it is. 

In all my playtests I strive to both maximize my multiplier, points and kill combos. So movement become this frenzy of shooting, long jumping into enemies, bullet-time aiming in the air, ground-pounding into long-jumps to get horizontal speed and more.

My development speed is severly impaired by having fun jumping, flipping and shooting enemies. I'm postponing graphics work way too much by having fun tweaking movement and fighting.
