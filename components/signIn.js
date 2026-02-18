import { handleSignOut } from "@/actions";
import Link from "next/link";

const DosignIn = () => {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Register
      </Link>
    </div>
  );
};

export default DosignIn;
