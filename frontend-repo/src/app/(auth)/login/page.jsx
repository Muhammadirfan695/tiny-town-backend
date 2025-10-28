"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  loginAction,
  requestMagicLinkAction,
} from "@/redux/actions/authActions";

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading } = useSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    const credentials = { email, password };
    dispatch(loginAction(credentials, router));
  };

  const handleMagicLink = (e) => {
    e.preventDefault();
    dispatch(requestMagicLinkAction(email));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Image
            src="/Group 36708.svg"
            alt="Localbites Logo"
            width={180}
            height={45}
            priority
          />
        </div>
        <h2 className="text-center text-3xl font-bold text-[#344F1F] mb-8">
          Sign In
        </h2>

        {authMode === "password" && (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email/Phone
              </label>
              <input
                type="email"
                placeholder="Ex: abc@example.com/Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Your Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-black hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#344F1F] hover:bg-[#283e18] text-white font-semibold py-3 rounded-xl transition-colors duration-200 disabled:bg-gray-400"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </form>
        )}

        {authMode === "magic" && (
          <form onSubmit={handleMagicLink} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email to get a magic link"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#344F1F] hover:bg-[#283e18] text-white font-semibold py-3 rounded-xl transition-colors duration-200 disabled:bg-gray-400"
            >
              {loading ? "Sending Link..." : "Send Magic Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() =>
              setAuthMode(authMode === "password" ? "magic" : "password")
            }
            className="text-sm text-orange-500 hover:underline font-semibold"
          >
            {authMode === "password"
              ? "Sign in with a Magic Link"
              : "Sign in with Password"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-orange-500 hover:underline font-semibold"
            >
              Sign up!
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
