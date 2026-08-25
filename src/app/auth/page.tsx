import type { Metadata } from "next";
import AuthFormWrapper from "./AuthForm";

export const metadata: Metadata = {
  title: "Sign In | The Dutchman",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthFormWrapper />;
}
