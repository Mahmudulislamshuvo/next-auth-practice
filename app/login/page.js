import GitHubSignInButton from "@/components/GithubSignInButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <LoginForm />

        {/* --- Google Sign-in Divider --- */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-100 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>
          <div className="mt-6">
            <GitHubSignInButton />
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            register for a new account
          </Link>
        </div>
      </div>
    </div>
  );
}
