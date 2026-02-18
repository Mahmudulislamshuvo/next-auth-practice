import { handleSignOut } from "@/actions";

const DoSignOut = () => {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        SignOut
      </button>
    </form>
  );
};

export default DoSignOut;
