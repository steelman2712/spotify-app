# Spotify Playlist Builder — Plan

## Overview
A Next.js web application that integrates with Spotify's Web API to let users
build playlists filtered by language, tempo, danceability, and genre.  The app
uses Spotify OAuth 2.0 for authentication and the Recommendations + Audio
Features endpoints to find tracks that match the selected criteria, then saves
the result as a real Spotify playlist in the user's account.

---

## Tech Stack
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, API routes, easy Spotify OAuth flow |
| Language | TypeScript | Type-safety for Spotify API response shapes |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent UI |
| Auth | Spotify OAuth 2.0 (PKCE) via `next-auth` | Secure, well-documented |
| State | React `useState` / `useReducer` | Lightweight; no external store needed |
| HTTP | Native `fetch` | No extra dependency |

---

## Features

### F-1  Spotify Authentication
Users log in with their Spotify account via OAuth 2.0 so the app can call the
Spotify Web API on their behalf.

**Acceptance Criteria**
- [ ] A "Login with Spotify" button is shown to unauthenticated users.
- [ ] Clicking the button redirects to Spotify's authorization page requesting
      scopes: `playlist-modify-public`, `playlist-modify-private`,
      `user-read-private`, `user-read-email`.
- [ ] After granting consent the user is redirected back to the app and sees
      their Spotify display name + avatar in the header.
- [ ] A "Log out" control clears the session and returns the user to the login
      screen.
- [ ] Access tokens are refreshed automatically before expiry; the user never
      sees a "token expired" error during an active session.

---

### F-2  Language Filter
Users can restrict the song search to a specific spoken language.

**Background:** Spotify's API does not expose a `language` field directly.  The
app implements language filtering by:
1. Mapping common languages to associated Spotify genre seeds and known
   locale/market codes (e.g., "Spanish" → genres `latin`, `reggaeton`,
   market `ES`).
2. Running a text search with a language-hinting query term (e.g., appending
   `lang:es` or a representative phrase) and post-filtering results.
3. For languages without strong genre associations, offering a free-text
   keyword search (e.g., an artist or song title in that language) as a seed.

**Acceptance Criteria**
- [ ] A searchable dropdown lists at least 15 languages: English, Spanish,
      French, Portuguese, German, Italian, Japanese, Korean, Chinese (Mandarin),
      Hindi, Arabic, Turkish, Russian, Swedish, Dutch.
- [ ] Selecting a language updates the Spotify search/recommendation parameters
      automatically.
- [ ] The UI clearly communicates that language matching is best-effort (tooltip
      or info banner).
- [ ] Changing the language clears any previously loaded track preview list.

---

### F-3  Tempo Filter
Users can specify a target tempo (BPM) range.

**Acceptance Criteria**
- [ ] A dual-handle range slider lets users set a minimum and maximum BPM
      (global range: 40–200 BPM).
- [ ] Default range is 80–140 BPM.
- [ ] Current min/max values are displayed numerically next to the slider.
- [ ] The slider respects the constraint min ≤ max at all times.
- [ ] Tracks returned in the preview list all have `tempo` values within the
      selected range (verified via Spotify Audio Features endpoint).

---

### F-4  Danceability Filter
Users can specify a minimum danceability score.

**Acceptance Criteria**
- [ ] A single-handle slider lets users set a minimum danceability (0.0–1.0).
- [ ] Default value is 0.5.
- [ ] The current value is displayed as a percentage (e.g., "50%") next to the
      slider.
- [ ] Tracks returned all have `danceability ≥` the selected minimum.
- [ ] A descriptive label maps values to human-friendly labels:
      0.0–0.33 → "Low", 0.34–0.66 → "Medium", 0.67–1.0 → "High".

---

### F-5  Genre Filter
Users can select one or more genre seeds to guide recommendations.

**Acceptance Criteria**
- [ ] A multi-select dropdown is populated by calling
      `GET /recommendations/available-genre-seeds` from the Spotify API.
- [ ] Users can select 1–5 genres (Spotify API limit for seed genres).
- [ ] When a language is selected (F-2), genres associated with that language
      are highlighted as suggested.
- [ ] Deselecting all genres is allowed; the app then relies on other seeds.
- [ ] The current genre selection is summarised as chips/tags below the
      dropdown.

---

### F-6  Track Preview List
Before saving, users can preview the tracks that match their filters.

**Acceptance Criteria**
- [ ] Clicking a "Find Tracks" button triggers the Spotify Recommendations API
      call using the active filter state (language-mapped genres + seeds, target
      tempo midpoint, min danceability, selected genres).
- [ ] Up to 50 tracks are returned and displayed in a scrollable list.
- [ ] Each track card shows: album art thumbnail, track name, artist(s), album
      name, BPM, danceability score, and a 30-second preview player (if
      available from Spotify).
- [ ] Users can remove individual tracks from the list before saving.
- [ ] A loading skeleton is shown while the API call is in-flight.
- [ ] If the API returns no results, a friendly empty-state message is shown
      with suggestions to broaden the filters.

---

### F-7  Playlist Creation
Users can save the filtered tracks as a new Spotify playlist.

**Acceptance Criteria**
- [ ] A "Create Playlist" button is enabled once at least one track is in the
      preview list.
- [ ] Clicking it opens a modal asking for:
  - Playlist name (required, max 100 chars).
  - Optional description (max 300 chars).
  - Public / Private toggle (default: private).
- [ ] Submitting the modal calls `POST /users/{user_id}/playlists` followed by
      `POST /playlists/{playlist_id}/tracks`.
- [ ] On success, a confirmation toast is shown with a deep-link button "Open in
      Spotify" that opens the playlist in the Spotify app or web player.
- [ ] On API error, the modal stays open with an error message; no partial
      playlist is left in an ambiguous state.
- [ ] The playlist creation flow is idempotent: submitting twice is blocked
      while the first request is in-flight.

---

### F-8  Filter Presets (Stretch Goal)
Users can save and reload filter combinations.

**Acceptance Criteria**
- [ ] A "Save Preset" button stores the current filter state in
      `localStorage` under a user-chosen name.
- [ ] Saved presets appear in a "Load Preset" dropdown.
- [ ] Loading a preset instantly restores all filter values.
- [ ] Presets can be deleted individually.

---

## Data Flow

```
User selects filters (Language, BPM, Danceability, Genre)
        │
        ▼
[Next.js API Route] /api/spotify/recommendations
        │  ─ maps language → genre seeds + market
        │  ─ computes target_tempo = (min+max)/2
        │  ─ passes min_danceability, seed_genres
        ▼
Spotify Recommendations API  →  list of track IDs
        │
        ▼
[Next.js API Route] /api/spotify/audio-features?ids=...
        │  ─ fetches actual BPM + danceability for each track
        │  ─ post-filters to enforce exact BPM range
        ▼
Track Preview List rendered in browser
        │
        ▼
User edits list → clicks "Create Playlist"
        │
        ▼
[Next.js API Route] /api/spotify/playlists  (POST)
        │  ─ creates playlist, adds tracks
        ▼
Success toast with Spotify deep-link
```

---

## Project Structure

```
spotify-app/
├── app/
│   ├── layout.tsx            # Root layout, SessionProvider
│   ├── page.tsx              # Home: login screen or filter UI
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth Spotify provider
│   │   └── spotify/
│   │       ├── recommendations/route.ts  # GET recommendations
│   │       ├── audio-features/route.ts   # GET audio features
│   │       └── playlists/route.ts        # POST create playlist + add tracks
├── components/
│   ├── FilterPanel.tsx        # Language, BPM, Danceability, Genre controls
│   ├── TrackList.tsx          # Scrollable preview list
│   ├── TrackCard.tsx          # Individual track row
│   ├── CreatePlaylistModal.tsx
│   ├── AudioPreview.tsx       # 30-sec preview player
│   └── Header.tsx             # User avatar, logout
├── lib/
│   ├── spotify.ts             # Typed wrappers for Spotify API calls
│   ├── languageMap.ts         # Language → genre seeds + market mapping
│   └── types.ts               # Shared TypeScript interfaces
├── hooks/
│   ├── useFilters.ts          # Filter state management
│   └── useSpotifyTracks.ts    # Data fetching hook
├── .env.local.example         # Required env var template
├── PLAN.md                    # This file
└── README.md                  # Setup & usage instructions
```

---

## Environment Variables

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

---

## Out of Scope (v1)
- Collaborative playlists (multiple users editing simultaneously).
- Lyrics-based language detection.
- Integration with music services other than Spotify.
- Mobile native app; responsive web only.
