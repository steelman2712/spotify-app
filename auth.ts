import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
].join(" ");

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: { scope: SCOPES },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.spotifyId = account.providerAccountId;
      }

      // Refresh token if expired
      if (
        token.expiresAt &&
        typeof token.expiresAt === "number" &&
        Date.now() / 1000 > token.expiresAt - 60
      ) {
        try {
          const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
              ).toString("base64")}`,
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });
          const refreshed = await res.json();
          if (res.ok) {
            token.accessToken = refreshed.access_token;
            token.expiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;
            if (refreshed.refresh_token) {
              token.refreshToken = refreshed.refresh_token;
            }
          }
        } catch {
          // Keep existing token on failure; page will prompt re-login if needed
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.spotifyId = token.spotifyId as string;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    accessToken: string;
    spotifyId: string;
  }
}
