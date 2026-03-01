import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAvailableGenreSeeds } from "@/lib/spotify";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const genres = await getAvailableGenreSeeds(session.accessToken);
    return NextResponse.json({ genres });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
