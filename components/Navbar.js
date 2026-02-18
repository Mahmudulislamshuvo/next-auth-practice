import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, auth } from "@/auth";
import DosignIn from "./signIn";
import DoSignOut from "./DoSignOut";

export default async function Navbar() {
  const session = await auth();

  console.log(session);

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          My App
        </Link>

        {/* Mobile menu button */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <DoSignOut />
          ) : (
            <>
              <DosignIn />
            </>
          )}

          {/* Profile Image/Avatar */}
          <div className="ml-4 relative">
            <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
              <Image
                className="h-8 w-8 rounded-full"
                src={
                  session?.user?.image || "https://www.gravatar.com/avatar?d=mp&s=200"
                }
                alt="User Avatar"
                width={32}
                height={32}
              />
            </button>
            {/* Dropdown menu can be added here later */}
          </div>
        </div>
      </div>
    </nav>
  );
}
