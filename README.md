# Milemarker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/GAD2412/makefun-gta6-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/GAD2412/makefun-gta6-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline field guide and platinum route for all 55 Grand Theft Auto VI trophies on PS5. The checklist pairs each official description with practical steps, a timing note and named sources. A four-stage roadmap highlights the Chapter 1 meditation window and shows which activities you can group on the way to 100%.

## Run it

Open `app/index.html` directly in desktop Chrome, or serve the same files locally with Node 22.18 or later.

```sh
node serve.ts
```

Open `http://localhost:8080`. The guide ships with its fonts, original coastal illustration and trophy data. Following a source link opens the external reference in a separate tab.

## Track a playthrough

Select a trophy to open its notes. Tick its checkbox when the console awards it. Hide spoilers conceals unearned story and PSN-hidden entries in the checklist, search, route and printout. The missable filter shows the reported Chapter 1 risk. The route planner lets you pin a stage and open its trophy list.

Progress stays in this browser. Export a JSON backup before switching browsers, moving between the file and server versions, or clearing site data. Import restores the earned list, spoiler preference and pinned stage. The original starter's exported list of trophy names also works. If the browser blocks storage, Export still works for the current session. Progress tools includes a copyable summary and a printable guide.

## Sources and timing

Names, descriptions and grades retain the competition starter's wording. Each guide links to its individual PS5 record and the walkthrough or video supporting its advice. The 28 hidden flags correspond to Exophase's secret entries. Two uncertain unlocks carry explicit notes in the guide. Research checked 19 November 2026. [PS5 list](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) · [PowerPyx walkthrough](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/)

## Design observations

In the provisional leading entries on 19 November, Leonida Ledger made the relationship between a checked row and its open guide easy to see. Its roadmap cover showed one full stage. Leonida Trophy Guide kept sources beside its advice, although the citations were small at thumbnail size. Leonida Platinum Tracker made filters and spoiler protection prominent, with less of the list visible below them. Milemarker uses an original causeway illustration, field-note typography and compact filters. On narrow screens, the selected guide opens below its row. [Competition feed](https://make.fun/bounty/gta6-trophy-guide-01#feed)

## Competition hand-in

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

This verifies the offline catalogue against the JSON file, copies the static app and screenshots and writes the kit dossier. The four screenshots are browser renders of a sample checklist. The starter and application code carry the MIT license. Barlow and Barlow Condensed carry the SIL Open Font License included alongside each font.

Entered on [make.fun](https://make.fun/bounty/gta6-trophy-guide-01).
