"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/redux/actions/authActions";
import withAuth from "@/authentication/withAuth";

function ChangePasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordData = { currentPassword, password, confirmPassword };
    dispatch(changePasswordAction(passwordData, user.token, router));
  };

  return (
    <div className="flex flex-col items-center justify-start pt-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Change Password</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <div>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              // required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#344F1F] text-white py-2.5 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(ChangePasswordPage);
