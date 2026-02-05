import { SignOutButton } from "./auth/SignOutButton";

export default function Home() {
  return (
    <main>
      hello world
      <SignOutButton className="bg-red-500 px-6 py-2 rounded-lg text-neutral-200 text-sm" />
    </main>
  );
}
