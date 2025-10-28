"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { forgotPasswordAction } from "@/redux/actions/authActions";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordAction(email, router));
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
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email address to receive an OTP to reset your password.
        </p>
        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your registered email"
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
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </main>
  );
}
