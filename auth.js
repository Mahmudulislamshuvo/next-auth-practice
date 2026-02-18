import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import clientPromise from "@/lib/mongo-clientPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import { userModel } from "./models/userSchema";
import { dbConnect } from "./lib/mongodb";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In a real app, you would verify credentials against a database
        if (credentials === null) return null;
        await dbConnect();

        const { email, password } = credentials;
        try {
          const user = await userModel.findOne({ email: email });

          if (user) {
            const isMatch = user.password === password;
            if (isMatch) {
              return user;
            } else {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("No user found with this email");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
});
