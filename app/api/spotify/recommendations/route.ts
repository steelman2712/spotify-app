import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getRecommendations,
  getAudioFeatures,
} from "@/lib/spotify";
import { getLanguageByCode } from "@/lib/languageMap";
import { TrackWithFeatures } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const languageCode = searchParams.get("language") ?? "en";
  const tempoMin = Number(searchParams.get("tempoMin") ?? 80);
  const tempoMax = Number(searchParams.get("tempoMax") ?? 140);
  const danceabilityMin = Number(searchParams.get("danceabilityMin") ?? 0.5);
  const genresParam = searchParams.get("genres") ?? "";

  const langConfig = getLanguageByCode(languageCode);
  const market = langConfig?.market ?? "US";

  // Merge user-selected genres with language defaults (max 5 total)
  const userGenres = genresParam ? genresParam.split(",").filter(Boolean) : [];
  const langGenres = langConfig?.genreSeeds ?? [];
  const seedGenres = [
    ...new Set([...userGenres, ...langGenres]),
  ].slice(0, 5);

  if (seedGenres.length === 0) {
    return NextResponse.json({ error: "No genre seeds available" }, { status: 400 });
  }

  try {
    const tracks = await getRecommendations(session.accessToken, {
      seedGenres,
      market,
      minTempo: tempoMin,
      maxTempo: tempoMax,
      targetTempo: Math.round((tempoMin + tempoMax) / 2),
      minDanceability: danceabilityMin,
      limit: 50,
    });

    if (tracks.length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const features = await getAudioFeatures(
      session.accessToken,
      tracks.map((t) => t.id)
    );

    const featureMap = new Map(features.map((f) => [f.id, f]));

    const combined: TrackWithFeatures[] = tracks
      .filter((t) => featureMap.has(t.id))
      .map((t) => ({ ...t, features: featureMap.get(t.id)! }))
      // Post-filter: enforce exact BPM range (Spotify hints may not be exact)
      .filter(
        (t) => t.features.tempo >= tempoMin && t.features.tempo <= tempoMax
      )
      // Post-filter: enforce min danceability
      .filter((t) => t.features.danceability >= danceabilityMin);

    return NextResponse.json({ tracks: combined });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
