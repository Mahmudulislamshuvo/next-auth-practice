# Next.js Auth.js (v5) বাংলা ডকুমেন্টেশন 🇧🇩

এই প্রজেক্টটি **Next.js 14 (App Router)** এবং **Auth.js v5** ব্যবহার করে তৈরি করা হয়েছে। নিচে ধাপে ধাপে এর সেটআপ এবং কনফিগারেশন বর্ণনা করা হলো।

---

## ১. প্রজেক্ট সেটআপ ও ইন্সটলেশন

প্রথমে প্রয়োজনীয় প্যাকেজগুলো ইন্সটল করে নিন:
```bash
npm install next-auth@beta mongodb mongoose @auth/mongodb-adapter
```

---

## ২. এনভায়রনমেন্ট ভেরিয়েবল (.env.local)

আপনার প্রজেক্টের রুটে একটি `.env.local` ফাইল তৈরি করুন এবং নিচের তথ্যগুলো দিন:
```env
AUTH_SECRET=your_secret_key # 'npx auth secret' দিয়ে জেনারেট করতে পারেন
MONGODB_URI=your_mongodb_connection_string

# Social Providers
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
```

---

## ৩. Auth.js কনফিগারেশন (`auth.js`)

প্রজেক্টের রুটে `auth.js` ফাইল তৈরি করে নিচের কোডটি ব্যবহার করুন। এখানে আমরা Credentials এবং Social Login (Google, GitHub) উভয়ই ব্যবহার করেছি:

```javascript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { userModel } from "./models/userSchema";
import { dbConnect } from "./lib/mongodb";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" }, // Credentials এর জন্য JWT প্রয়োজনীয়
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    GitHubProvider({ clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET }),
    Credentials({
      async authorize(credentials) {
        await dbConnect();
        const user = await userModel.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
          return user; // ইউজার অবজেক্ট রিটার্ন করলে লগইন সাকসেস হবে
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.image) session.user.image = token.image;
      return session;
    },
  },
});
```

---

## ৪. API রাউট সেটআপ (`app/api/auth/[...nextauth]/route.js`)

Auth.js হ্যান্ডলারগুলোকে এক্সপোর্ট করুন:
```javascript
export { GET, POST } from "@/auth";
```

---

## ৫. সাইন-ইন ফাংশনালিটি (Actions)

`actions/index.js` ফাইলে সার্ভার অ্যাকশন তৈরি করুন:
```javascript
"use server";
import { signIn } from "@/auth";

export async function handleCredentialsSignIn(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  return await signIn("credentials", { email, password, redirect: false });
}
```

---

## ৬. লগইন ফর্ম হ্যান্ডলিং (`components/LoginForm.js`)

ক্লায়েন্ট সাইড থেকে লগইন করার সময় `router.refresh()` ব্যবহার করা জরুরি যাতে নেভবার আপডেট হয়:

```javascript
"use client";
import { useRouter } from "next/navigation";
import { handleCredentialsSignIn } from "@/actions";

const LoginForm = () => {
  const router = useRouter();
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await handleCredentialsSignIn(formData);
    
    if (!response?.error) {
      router.push("/booking");
      router.refresh(); // এটি সার্ভার কম্পোনেন্ট (Navbar) আপডেট করবে
    }
  };
  return <form onSubmit={onSubmit}>...</form>;
};
```

---

## ৭. সেশন চেক করা (Navbar Example)

সার্ভার কম্পোনেন্টে লগইন স্ট্যাটাস চেক করা:

```javascript
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth(); // সার্ভার সাইড সেশন

  return (
    <nav>
      {session ? (
        <img src={session.user.image} alt="Profile" />
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
```

---

### গুরুত্বপূর্ণ টিপস:
- **`router.refresh()`**: লগইন বা লগআউটের পর সার্ভার কম্পোনেন্ট ডাটা আপডেট করতে এটি ব্যবহার করুন।
- **`callbacks`**: যদি ডেটাবেস থেকে এক্সট্রা ডাটা (যেমন: ইমেজ বা রোল) সেশনে পেতে চান, তবে `jwt` এবং `session` কলব্যাক অবশ্যই কনফিগার করতে হবে।
- **Middleware**: নির্দিষ্ট পেজ প্রটেক্ট করতে রুটে `middleware.js` ফাইল ব্যবহার করুন।
