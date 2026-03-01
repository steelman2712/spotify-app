import { auth } from "@/auth";
import { signIn } from "next-auth/react";
import Header from "@/components/Header";
import AppShell from "@/components/AppShell";
import LoginScreen from "@/components/LoginScreen";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Header session={session} />
      {session ? <AppShell session={session} /> : <LoginScreen />}
    </>
  );
}
