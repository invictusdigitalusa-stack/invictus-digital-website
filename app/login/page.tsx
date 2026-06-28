import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Invictus OS",
  description: "Sign in to Invictus OS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-12 text-white">
      <LoginForm />
    </main>
  );
}
