"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileAction } from "@/redux/actions/userActions";
import withAuth from "@/authentication/withAuth";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [editedFirstName, setEditedFirstName] = useState(null);
  const [editedLastName, setEditedLastName] = useState(null);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const firstName = editedFirstName ?? user.firstName ?? "";
  const lastName = editedLastName ?? user.lastName ?? "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = { firstName, lastName };
    if (user.token) {
      dispatch(updateProfileAction(profileData, user.token));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#344F1F] text-white py-2.5 rounded-lg transition-colors hover:bg-[#2a3f19] disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
