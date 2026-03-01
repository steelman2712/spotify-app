# Spotify Playlist Builder

A Next.js web app that lets you build Spotify playlists filtered by **language**, **tempo (BPM)**, **danceability**, and **genre**.

## Features

- **Spotify OAuth** — secure login via Spotify with automatic token refresh
- **Language filter** — target 15+ languages via Spotify genre seeds + market codes
- **Tempo filter** — dual BPM range slider (40–200 BPM), post-verified with Audio Features API
- **Danceability filter** — minimum danceability slider with Low/Medium/High labels
- **Genre filter** — multi-select from Spotify's full genre seed list (max 5)
- **Track preview** — 30-second audio previews with a progress bar per track
- **Playlist creation** — save to your Spotify account with name, description, and visibility
- **Filter presets** — save and reload filter combinations via localStorage

## Setup

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/api/auth/callback/spotify` as a **Redirect URI**
4. Copy your **Client ID** and **Client Secret**

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/
    auth/[...nextauth]/   # NextAuth Spotify OAuth handler
    spotify/
      recommendations/   # GET — fetch & filter tracks
      genre-seeds/       # GET — available Spotify genres
      playlists/         # POST — create playlist + add tracks
  layout.tsx
  page.tsx               # Server component: auth check → AppShell or LoginScreen

components/
  AppShell.tsx           # Main client layout (filters + track list)
  Header.tsx             # Nav bar with user avatar and logout
  FilterPanel.tsx        # Language, BPM, danceability, genre controls
  TrackList.tsx          # Scrollable track results with action buttons
  TrackCard.tsx          # Individual track row with stats and preview
  AudioPreview.tsx       # 30-sec audio player with progress bar
  CreatePlaylistModal.tsx# Name / description / visibility form
  PresetsPanel.tsx       # Save / load / delete filter presets
  LoginScreen.tsx        # Unauthenticated landing page

hooks/
  useFilters.ts          # Filter state with defaults
  useSpotifyTracks.ts    # Data fetching + track removal

lib/
  spotify.ts             # Typed Spotify API wrappers
  languageMap.ts         # Language → genre seeds + market mapping
  types.ts               # Shared TypeScript interfaces
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **NextAuth v5** (Spotify provider)
- Spotify Web API: Recommendations, Audio Features, Playlists

## Notes

- Language filtering is best-effort — Spotify has no native language field.
  The app targets associated genre seeds and market codes.
- Spotify's Recommendations API requires at least one genre seed.
- Audio features are fetched after recommendations to post-filter exact BPM range.
