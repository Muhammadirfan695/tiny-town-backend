"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  getAllUsersAction,
  deleteUserAction,
} from "@/redux/actions/adminActions";
import withAuth from "@/authentication/withAuth";
import ConfirmationModal from "@/app/components/common/ConfirmationModal";
import Pagination from "@/app/components/common/Pagination";
import Loader from "@/app/components/common/Loader";

function UsersListPage() {
  const dispatch = useDispatch();

  const { user: loggedInUser } = useSelector((state) => state.auth);

  const { users, loading, currentPage, totalPages } = useSelector(
    (state) => state.users
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (loggedInUser?.token) {
      dispatch(getAllUsersAction(loggedInUser.token, currentPage));
    }
  }, [dispatch, loggedInUser, currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      if (loggedInUser?.token) {
        dispatch(getAllUsersAction(loggedInUser.token, page));
      }
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete && loggedInUser?.token) {
      dispatch(deleteUserAction(userToDelete, loggedInUser.token));
    }
    setIsModalOpen(false);
    setUserToDelete(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => user.id !== loggedInUser?.id)
    : [];

  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="12" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        {loggedInUser?.role === "Admin" && (
          <Link
            href="/dashboard/users/create"
            className="bg-[#344F1F] text-white px-4 py-2 rounded-lg hover:bg-[#2a3f19] transition-colors"
          >
            + Create User
          </Link>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left font-semibold text-gray-600">
                Name
              </th>
              <th className="p-4 text-left font-semibold text-gray-600">
                Email
              </th>
              <th className="p-4 text-left font-semibold text-gray-600">
                Role
              </th>
              <th className="p-4 text-left font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.Roles?.[0]?.name || "N/A"}</td>
                  <td className="p-4 flex gap-4 items-center">
                    {loggedInUser?.role === "Admin" && (
                      <>
                        <Link
                          href={`/dashboard/users/${user.id}/edit`}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No other users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}

export default withAuth(UsersListPage, { roles: ["Admin"] });
