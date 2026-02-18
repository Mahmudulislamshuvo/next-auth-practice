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

export async function handleCredentialsSignIn(formData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    return response;
  } catch (error) {
    throw error;
  }
}
