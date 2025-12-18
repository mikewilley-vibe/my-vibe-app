### /api/scores

The `/api/scores` endpoint powers the ScoresBanner and returns a curated list of live, upcoming, and recent games.

**Query params**
- `preset=live` (default): Live games + near-term upcoming/recent across NFL, NCAAF, and NCAAM.
- `preset=nfl`: NFL Sunday slate (date auto-overridden to the next Sunday).
- `preset=ncaa`: NCAA games (NCAAM + NCAAF).
- `date=YYYY-MM-DD` (optional): Overrides the scoreboard date for all leagues (except NFL preset).

**Refresh behavior**
- The ScoresBanner fetches `/api/scores` on load and auto-refreshes every 30 seconds.
- UVA games (NCAAM + NCAAF) are pinned to the front when present.