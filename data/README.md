# TOR2025 Race Data

This directory contains local copies of the race data from the BeeBee timing system.

## Current Setup

**The data is now embedded directly in `data-tor330.js` and `data-tor450.js`** at the root of the project, so the app can be opened directly in a browser without needing a web server. Users can toggle between TOR330 and TOR450 races using the buttons in the header.

The JSON files in this directory are kept as backups and for reference.

## Data Sources

Downloaded on: September 30, 2025

### TOR330 Files (Race 1034):

1. **iscritti_1034.json** (635KB)
   - Source: https://beebeeassets.beebeeboard.com/rankings/statics/iscritti_1034.json
   - Contains: Participant registration data (bib numbers, names, categories, sex, countries)

2. **classifiche_1034.json** (7.9MB)
   - Source: https://beebeeassets.beebeeboard.com/rankings/classifiche/1034.json
   - Contains: Race results and timing data (checkpoint times, positions, race times)

3. **avanzati_1034.json** (51KB)
   - Source: https://beebeeassets.beebeeboard.com/rankings/statics/avanzati_1034.json
   - Contains: Checkpoint definitions (names, elevations, distances)

### TOR450 Files (Race 1135):

1. **iscritti_1135.json** (110KB)
   - Source: https://beebeeassets.beebeeboard.com/rankings/statics/iscritti_1135.json
   - Contains: Participant registration data (bib numbers, names, categories, sex, countries)

2. **classifiche_1135.json** (912KB)
   - Source: https://beebeeassets.beebeeboard.com/rankings/classifiche/1135.json
   - Contains: Race results and timing data (checkpoint times, positions, race times)

3. **avanzati_1135.json** (41KB)
   - Source: https://beebeeassets.beebeeboard.com/rankings/statics/avanzati_1135.json
   - Contains: Checkpoint definitions (names, elevations, distances)

## Why Local Copies?

These files are stored locally to:
- Ensure data availability if the remote API is removed or changes
- Improve loading performance
- Allow offline development and viewing
- Preserve the race data as a historical record

## Updating Data

To refresh the data from the API endpoints, run:

### TOR330 (Race 1034):
```bash
cd data
curl -s 'https://beebeeassets.beebeeboard.com/rankings/statics/iscritti_1034.json' -o iscritti_1034.json
curl -s 'https://beebeeassets.beebeeboard.com/rankings/classifiche/1034.json' -o classifiche_1034.json
curl -s 'https://beebeeassets.beebeeboard.com/rankings/statics/avanzati_1034.json' -o avanzati_1034.json
```

### TOR450 (Race 1135):
```bash
cd data
curl -s 'https://beebeeassets.beebeeboard.com/rankings/statics/iscritti_1135.json' -o iscritti_1135.json
curl -s 'https://beebeeassets.beebeeboard.com/rankings/classifiche/1135.json' -o classifiche_1135.json
curl -s 'https://beebeeassets.beebeeboard.com/rankings/statics/avanzati_1135.json' -o avanzati_1135.json
```
