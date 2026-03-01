import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPlaylist, addTracksToPlaylist } from "@/lib/spotify";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session?.spotifyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, isPublic, trackUris } = body as {
    name: string;
    description: string;
    isPublic: boolean;
    trackUris: string[];
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: "Playlist name is required" }, { status: 400 });
  }
  if (!Array.isArray(trackUris) || trackUris.length === 0) {
    return NextResponse.json({ error: "No tracks provided" }, { status: 400 });
  }

  try {
    const playlist = await createPlaylist(
      session.accessToken,
      session.spotifyId,
      name.trim(),
      description ?? "",
      isPublic ?? false
    );

    await addTracksToPlaylist(
      session.accessToken,
      playlist.id,
      trackUris
    );

    return NextResponse.json({
      id: playlist.id,
      spotifyUrl: playlist.external_urls.spotify,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
