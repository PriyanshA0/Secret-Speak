import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-4 py-8">
      <SignIn />
    </main>
  );
}
