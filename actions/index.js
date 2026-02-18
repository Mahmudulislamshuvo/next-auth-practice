"use server";

import { signOut, signIn } from "@/auth";

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function handleSigIn() {
  await signIn("google", { redirectTo: "/booking" });
}

export async function handleGitHubSignIn() {
  await signIn("github", { redirectTo: "/booking" });
}
