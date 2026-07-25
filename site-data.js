/*
  ==============================================================
  VIGILANTE 8 WEBSITE DATA
  ==============================================================
  This is the main file you edit when adding characters.

  IMAGE SUPPORT:
  - Character art: PNG / JPG / WEBP / GIF
  - Feature media: PNG / JPG / WEBP / GIF
  - A GIF works automatically: just use its file path below.
*/

window.V8_SITE_DATA = {
  characters: [
    {
      name: "CHASSEY BLUE",
      vehicle: "RATTLER",
      subtitle: "THE FIRST STRIKE",
      description: "A fast, aggressive fighter built around pressure, mobility and precise special-weapon timing. Replace this sample text with the official character and vehicle story.",
      accent: "#ff3d21",
      accent2: "#ffc400",
      art: "assets/characters/chassey-blue.svg",
      skills: [
        { icon: "01", title: "GRIDLOCK", text: "Nine-shot special weapon with a wide impact pattern." },
        { icon: "02", title: "FAST RESPONSE", text: "Designed for quick repositioning and sustained pressure." }
      ]
    },
    {
      name: "SID BURN",
      vehicle: "'69 MANTA",
      subtitle: "BREATH OF FIRE",
      description: "A classic Vigilante with a destructive special attack and a bold playstyle. Replace this sample description with your final character biography.",
      accent: "#7d2cff",
      accent2: "#22d3ee",
      art: "assets/characters/sid-burn.svg",
      skills: [
        { icon: "01", title: "BREATH OF FIRE", text: "Calls down a dangerous sequence of fiery attacks." },
        { icon: "02", title: "CLASSIC MUSCLE", text: "Strong presence, balanced weight and dependable armor." }
      ]
    },
    {
      name: "BEEZWAX",
      vehicle: "STAG PICKUP",
      subtitle: "GAMMA SWARM",
      description: "A relentless hunter who overwhelms enemies with a living swarm. The large character image can be PNG, WEBP or an animated GIF.",
      accent: "#ffc400",
      accent2: "#ff4d00",
      art: "assets/characters/beezwax.svg",
      skills: [
        { icon: "01", title: "GAMMA SWARM", text: "Releases a swarm that tracks and repeatedly attacks a target." },
        { icon: "02", title: "HEAVY PICKUP", text: "Stable handling with a strong combat silhouette." }
      ]
    },
    {
      name: "MOLO",
      vehicle: "SCHOOL BUS",
      subtitle: "HEAVY CHAOS",
      description: "A huge target with a huge personality. This character entry is ready for a portrait, transparent full-body render or looping animated GIF.",
      accent: "#00a8ff",
      accent2: "#7a5cff",
      art: "assets/characters/molo.svg",
      skills: [
        { icon: "01", title: "HEAVY IMPACT", text: "Uses size and weight to dominate close-range encounters." },
        { icon: "02", title: "ARMORED FRAME", text: "Built to absorb punishment and keep moving." }
      ]
    },
    {
      name: "BOOGIE",
      vehicle: "LEPRECHAUN",
      subtitle: "TRICKSTER DRIVER",
      description: "A strange and unpredictable combatant. Add the final story, allegiance, statistics and special-weapon details whenever they are ready.",
      accent: "#18c37e",
      accent2: "#d7ff38",
      art: "assets/characters/boogie.svg",
      skills: [
        { icon: "01", title: "LUCKY STRIKE", text: "A special weapon built around surprise and disruption." },
        { icon: "02", title: "QUICK ESCAPE", text: "Compact form helps with rapid changes of direction." }
      ]
    },
    {
      name: "Y THE ALIEN",
      vehicle: "LUXO SAUCER",
      subtitle: "OUT OF THIS WORLD",
      description: "An unusual vehicle and an even more unusual driver. The character slider supports any number of entries and builds the right-side portrait list automatically.",
      accent: "#00d7ff",
      accent2: "#ff2bd6",
      art: "assets/characters/y-the-alien.svg",
      skills: [
        { icon: "01", title: "ALIEN TECH", text: "Unconventional movement and a unique visual identity." },
        { icon: "02", title: "LUXO SAUCER", text: "A futuristic silhouette unlike any other vehicle." }
      ]
    }
  ],

  features: [
    {
      title: "NEW GAME MODES",
      text: "Custom modes, team rules, survival systems and new ways to play.",
      media: "assets/features/new-modes.svg"
    },
    {
      title: "ORIGINAL VEHICLES",
      text: "Vehicles from the first game are ported into the Unity project.",
      media: "assets/features/legacy-vehicles.svg"
    },
    {
      title: "SPECIAL WEAPONS",
      text: "Custom visuals, sound, damage behavior and faithful weapon mechanics.",
      media: "assets/features/special-weapons.svg"
    },
    {
      title: "ONLINE COMBAT",
      text: "Expanded multiplayer systems and modes built around Photon networking.",
      media: "assets/features/online-combat.svg"
    },
    {
      title: "CUSTOM HUD SYSTEMS",
      text: "Modern and legacy interface options with new weapon and vehicle displays.",
      media: "assets/features/hud-systems.svg"
    },
    {
      title: "ONGOING UPDATES",
      text: "New vehicles, fixes, balancing, effects, audio and quality improvements.",
      media: "assets/features/ongoing-updates.svg"
    }
  ]
};
