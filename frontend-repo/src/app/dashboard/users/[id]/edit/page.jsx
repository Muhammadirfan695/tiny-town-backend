"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  getUserByIdAction,
  updateUserAction,
} from "@/redux/actions/adminActions";
import withAuth from "@/authentication/withAuth";

function EditUserPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams(); 
  const { id: userId } = params; 

  const { user: adminUser } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Manager");

  useEffect(() => {
    if (userId && adminUser?.token) {
      const fetchUserData = async () => {
        const userData = await dispatch(
          getUserByIdAction(userId, adminUser.token)
        );
        if (userData) {
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setEmail(userData.email || "");
          setRole(userData.Roles?.[0]?.name || "Manager");
        }
      };
      fetchUserData();
    }
  }, [userId, adminUser, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { firstName, lastName, email, role };
    if (adminUser?.token) {
      dispatch(updateUserAction(userId, updatedData, adminUser.token, router));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit User</h1>
          <Link
            href="/dashboard/users"
            className="text-blue-600 hover:underline"
          >
            &larr; Back to Users List
          </Link>
        </div>

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
              onChange={(e) => setFirstName(e.target.value)}
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
              onChange={(e) => setLastName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#344F1F] text-white py-2.5 rounded-lg transition-colors hover:bg-[#2a3f19] disabled:bg-gray-400"
          >
            {loading ? "Updating User..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditUserPage, { roles: ['Admin'] });

