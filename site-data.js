/*
  EDIT THIS FILE TO ADD THE FINAL 27 DRIVERS.
  Supported image types: PNG, JPG, WEBP, SVG and animated GIF.
  - image: large transparent driver art
  - avatar: thumbnail used in the four-slot selector
  - backgroundImage: large faded image behind the driver (can be the same image)
  - skill.icon: small skill image or GIF
*/

const baseDrivers = [
  {
    name: "CHASSEY BLUE",
    vehicle: "RATTLER",
    tagline: "Precision hunter with a nine-shot grid barrage.",
    description: "A disciplined road warrior built around control, positioning and the Gridlock special weapon.",
    image: "assets/characters/chassey-blue.svg",
    avatar: "assets/characters/chassey-blue.svg",
    backgroundImage: "assets/characters/chassey-blue.svg",
    accent: "#e2392a",
    accent2: "#13c9ee",
    accent3: "#281d7d",
    skills: [
      { title: "GRIDLOCK", text: "Launches a 3×3 wall of energy projectiles.", icon: "assets/tutorial/lock-on.svg" },
      { title: "TACTICAL CONTROL", text: "Locks lanes and punishes predictable movement.", icon: "assets/tutorial/combat-tips.svg" }
    ]
  },
  {
    name: "SID BURN",
    vehicle: "MANTA",
    tagline: "Calls down fire from above.",
    description: "Sid Burn brings explosive area pressure with the Breath of Fire special and aggressive hit-and-run driving.",
    image: "assets/characters/sid-burn.svg",
    avatar: "assets/characters/sid-burn.svg",
    backgroundImage: "assets/characters/sid-burn.svg",
    accent: "#ef4d24",
    accent2: "#ffd038",
    accent3: "#8a1f33",
    skills: [
      { title: "BREATH OF FIRE", text: "Three fire strikes descend on the target zone.", icon: "assets/tutorial/specials.svg" },
      { title: "BURNING PRESSURE", text: "Forces enemies to abandon safe positions.", icon: "assets/tutorial/survival.svg" }
    ]
  },
  {
    name: "BEEZWAX",
    vehicle: "STAG PICKUP",
    tagline: "Unleashes a relentless guided swarm.",
    description: "A wild specialist whose Gamma Swarm surrounds targets, lifts them and strikes repeatedly before dispersing.",
    image: "assets/characters/beezwax.svg",
    avatar: "assets/characters/beezwax.svg",
    backgroundImage: "assets/characters/beezwax.svg",
    accent: "#f2ad19",
    accent2: "#42d16c",
    accent3: "#7b3421",
    skills: [
      { title: "GAMMA SWARM", text: "Sends a moving formation of sixteen attacking bees.", icon: "assets/tutorial/lock-on.svg" },
      { title: "AIRBORNE TRAP", text: "Disrupts movement while the swarm keeps attacking.", icon: "assets/tutorial/specials.svg" }
    ]
  },
  {
    name: "MOLO",
    vehicle: "SCHOOL BUS",
    tagline: "Heavy armor. Heavy impact.",
    description: "Molo turns every road into a demolition lane, trading agility for durability and brutal close-range power.",
    image: "assets/characters/molo.svg",
    avatar: "assets/characters/molo.svg",
    backgroundImage: "assets/characters/molo.svg",
    accent: "#f09018",
    accent2: "#ffd94a",
    accent3: "#4b2734",
    skills: [
      { title: "HEAVY ASSAULT", text: "Controls space with mass and explosive force.", icon: "assets/tutorial/weapons.svg" },
      { title: "ARMORED PUSH", text: "Survives punishment while closing the distance.", icon: "assets/tutorial/survival.svg" }
    ]
  },
  {
    name: "BOOGIE",
    vehicle: "LEPRECHAUN",
    tagline: "Fast tricks and unpredictable angles.",
    description: "Boogie is built for evasive players who prefer speed, flanking and sudden special-weapon attacks.",
    image: "assets/characters/boogie.svg",
    avatar: "assets/characters/boogie.svg",
    backgroundImage: "assets/characters/boogie.svg",
    accent: "#24b85b",
    accent2: "#d6ee32",
    accent3: "#153f74",
    skills: [
      { title: "LUCKY STRIKE", text: "A disruptive special designed for quick openings.", icon: "assets/tutorial/specials.svg" },
      { title: "HIGH AVOIDANCE", text: "Escapes danger and re-enters from a new angle.", icon: "assets/tutorial/movement.svg" }
    ]
  },
  {
    name: "Y THE ALIEN",
    vehicle: "LUXO SAUCER",
    tagline: "Alien technology dominates the arena.",
    description: "An unusual combatant with futuristic control, strange weapons and a silhouette unlike any other vehicle.",
    image: "assets/characters/y-the-alien.svg",
    avatar: "assets/characters/y-the-alien.svg",
    backgroundImage: "assets/characters/y-the-alien.svg",
    accent: "#00b9d9",
    accent2: "#9bffef",
    accent3: "#412b82",
    skills: [
      { title: "ALIEN TECH", text: "Uses advanced energy systems and unusual trajectories.", icon: "assets/tutorial/upgrades.svg" },
      { title: "HOVER CONTROL", text: "Maintains pressure with unconventional movement.", icon: "assets/tutorial/movement.svg" }
    ]
  },
  {
    name: "HOUSTON 3",
    vehicle: "PALOMINO",
    tagline: "A balanced fighter for every battlefield.",
    description: "Houston 3 combines dependable handling, direct firepower and the flexibility to adapt to changing fights.",
    image: "assets/characters/houston-3.svg",
    avatar: "assets/characters/houston-3.svg",
    backgroundImage: "assets/characters/houston-3.svg",
    accent: "#1a76d2",
    accent2: "#6de8ff",
    accent3: "#74255c",
    skills: [
      { title: "BALANCED LOADOUT", text: "Reliable speed, armor and weapon response.", icon: "assets/tutorial/weapons.svg" },
      { title: "FRONTLINE READY", text: "Comfortable in both attack and defense.", icon: "assets/tutorial/combat-tips.svg" }
    ]
  },
  {
    name: "CONVOY",
    vehicle: "MOTH TRUCK",
    tagline: "Long-range punishment on wheels.",
    description: "Convoy specializes in target tracking and heavy projectile pressure through the Steelbelter launcher.",
    image: "assets/characters/convoy.svg",
    avatar: "assets/characters/convoy.svg",
    backgroundImage: "assets/characters/convoy.svg",
    accent: "#ed5424",
    accent2: "#f8c63e",
    accent3: "#19486e",
    skills: [
      { title: "STEELBELTER", text: "A powerful tracking projectile built for direct impact.", icon: "assets/tutorial/lock-on.svg" },
      { title: "HEAVY KNOCKBACK", text: "Explosions throw enemies away from the hit direction.", icon: "assets/tutorial/weapons.svg" }
    ]
  }
];

const placeholderArt = [
  "assets/characters/chassey-blue.svg",
  "assets/characters/sid-burn.svg",
  "assets/characters/beezwax.svg",
  "assets/characters/molo.svg",
  "assets/characters/boogie.svg",
  "assets/characters/houston-3.svg",
  "assets/characters/convoy.svg",
  "assets/characters/y-the-alien.svg"
];

const palettes = [
  ["#d43432", "#22c7e8", "#342278"],
  ["#d79019", "#ffe34a", "#733a1e"],
  ["#7937c8", "#ff55d8", "#1d477d"],
  ["#1597b6", "#7ef4e2", "#242b73"],
  ["#b7285d", "#ff9b39", "#3a216f"],
  ["#2a9d57", "#e7dc36", "#174d6c"]
];

const placeholderDrivers = Array.from({ length: 19 }, (_, itemIndex) => {
  const slot = itemIndex + 9;
  const art = placeholderArt[itemIndex % placeholderArt.length];
  const palette = palettes[itemIndex % palettes.length];
  return {
    name: `DRIVER SLOT ${String(slot).padStart(2, "0")}`,
    vehicle: `VEHICLE SLOT ${String(slot).padStart(2, "0")}`,
    tagline: "Replace this placeholder with the final driver, vehicle and special-weapon information.",
    description: "This is one of the 27 prepared driver slots. Edit its name, vehicle, description, images, colors and skill information inside site-data.js.",
    image: art,
    avatar: art,
    backgroundImage: art,
    accent: palette[0],
    accent2: palette[1],
    accent3: palette[2],
    skills: [
      { title: "SPECIAL WEAPON", text: "Add the first skill or special-weapon description here.", icon: "assets/tutorial/specials.svg" },
      { title: "DRIVER ADVANTAGE", text: "Add the second skill or gameplay advantage here.", icon: "assets/tutorial/combat-tips.svg" }
    ]
  };
});

window.V8_SITE_DATA = {
  drivers: [...baseDrivers, ...placeholderDrivers],
  maps: [
    {
      name: "OIL FIELDS",
      location: "SOUTHWEST INDUSTRIAL ZONE",
      description: "Pumpjacks, pipelines and blazing refinery lights create an open industrial battlefield.",
      image: "assets/maps/oil-fields.svg",
      accent: "#ff7a16",
      highlightTitle: "WIDE ROUTES / LONG SIGHTLINES",
      highlightText: "Use the refinery structures as cover and watch the exposed center lanes.",
      stats: [{ label: "SIZE", value: "LARGE" }, { label: "STYLE", value: "OPEN" }, { label: "HAZARD", value: "FIRE" }]
    },
    {
      name: "CASINO CITY",
      location: "DOWNTOWN ENTERTAINMENT DISTRICT",
      description: "Neon towers, casino signs and tight urban routes create a fast battlefield full of ambush points.",
      image: "assets/maps/casino-city.svg",
      accent: "#ff3e62",
      highlightTitle: "TIGHT CORNERS / VERTICAL COVER",
      highlightText: "Break line of sight between towers, then attack through the illuminated side streets.",
      stats: [{ label: "SIZE", value: "MEDIUM" }, { label: "STYLE", value: "URBAN" }, { label: "HAZARD", value: "TRAFFIC" }]
    },
    {
      name: "WINTER WASTELAND",
      location: "NORTHERN MOUNTAIN PASS",
      description: "Frozen roads, deep snow banks and slippery ice lanes reward controlled driving and careful positioning.",
      image: "assets/maps/winter-wasteland.svg",
      accent: "#73d9ff",
      highlightTitle: "LOW GRIP / LONG DESCENTS",
      highlightText: "Manage speed on the ice and use the snow banks to redirect incoming attacks.",
      stats: [{ label: "SIZE", value: "LARGE" }, { label: "STYLE", value: "SNOW" }, { label: "HAZARD", value: "ICE" }]
    },
    {
      name: "BAYOU",
      location: "SOUTHERN FLOODLAND",
      description: "Swamp water, wooden bridges and hidden routes turn every chase into a dangerous close-range fight.",
      image: "assets/maps/bayou.svg",
      accent: "#9ecb4f",
      highlightTitle: "HIDDEN PATHS / NARROW BRIDGES",
      highlightText: "Use the vegetation to hide your approach and avoid getting trapped over open water.",
      stats: [{ label: "SIZE", value: "MEDIUM" }, { label: "STYLE", value: "SWAMP" }, { label: "HAZARD", value: "WATER" }]
    },
    {
      name: "DESERT RUN",
      location: "RED CANYON HIGHWAY",
      description: "Open dunes, canyon walls and high-speed straights create a battlefield built for pursuit and long attacks.",
      image: "assets/maps/desert-run.svg",
      accent: "#ffb02e",
      highlightTitle: "HIGH SPEED / LIMITED COVER",
      highlightText: "Control the canyon entrances and never remain exposed in the center of the dunes.",
      stats: [{ label: "SIZE", value: "XL" }, { label: "STYLE", value: "DESERT" }, { label: "HAZARD", value: "CLIFFS" }]
    },
    {
      name: "STEEL MILL",
      location: "HEAVY INDUSTRY COMPLEX",
      description: "Furnaces, rail tracks and massive machines create a dense combat maze with brutal environmental threats.",
      image: "assets/maps/steel-mill.svg",
      accent: "#ff5b28",
      highlightTitle: "HEAVY COVER / HOT ZONES",
      highlightText: "Fight between machinery, but stay clear of the open furnace and active rail lanes.",
      stats: [{ label: "SIZE", value: "MEDIUM" }, { label: "STYLE", value: "INDUSTRIAL" }, { label: "HAZARD", value: "FURNACE" }]
    },
    {
      name: "SPACEPORT",
      location: "EXPERIMENTAL LAUNCH FACILITY",
      description: "Launch pads, aircraft hangars and alien technology create an unusual arena with broad open platforms.",
      image: "assets/maps/spaceport.svg",
      accent: "#5ee8ff",
      highlightTitle: "OPEN PLATFORMS / TECH COVER",
      highlightText: "Use hangars to reset fights before crossing the exposed launch-pad areas.",
      stats: [{ label: "SIZE", value: "LARGE" }, { label: "STYLE", value: "FUTURE" }, { label: "HAZARD", value: "LAUNCH" }]
    },
    {
      name: "SECRET BASE",
      location: "CLASSIFIED MILITARY SECTOR",
      description: "Restricted tunnels, military compounds and hidden chambers form a tactical battlefield full of secrets.",
      image: "assets/maps/secret-base.svg",
      accent: "#e75030",
      highlightTitle: "TUNNELS / SECRET ROUTES",
      highlightText: "Search for alternate entrances and use the underground passages to escape target locks.",
      stats: [{ label: "SIZE", value: "LARGE" }, { label: "STYLE", value: "BASE" }, { label: "HAZARD", value: "SECURITY" }]
    }
  ],
  tutorial: {
    beginner: [
      { title: "Movement", image: "assets/tutorial/movement.svg" },
      { title: "Weapons", image: "assets/tutorial/weapons.svg" },
      { title: "Lock-On", image: "assets/tutorial/lock-on.svg" }
    ],
    advanced: [
      { title: "Team Play", image: "assets/tutorial/team-play.svg" },
      { title: "Special Weapons", image: "assets/tutorial/specials.svg" },
      { title: "Survival", image: "assets/tutorial/survival.svg" }
    ],
    master: [
      { title: "Upgrades", image: "assets/tutorial/upgrades.svg" },
      { title: "Combat Tips", image: "assets/tutorial/combat-tips.svg" }
    ]
  }
};