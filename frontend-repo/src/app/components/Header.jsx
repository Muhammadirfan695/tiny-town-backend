"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, LogOut, User, Lock } from "lucide-react"; 

import { logoutAction } from "@/redux/actions/authActions";
import Link from "next/link";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction(router));
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex-grow"></div>

     <div className="relative">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="...">
          <span className="font-semibold text-gray-700">{user?.firstName || 'Admin'}</span>
          <ChevronDown size={20} className="text-gray-500" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-10 border">
            <div className="p-2">
              <Link href="/dashboard/profile" className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                <User size={16} className="text-gray-500" />
                <span>My Profile</span>
              </Link>
              <Link href="/dashboard/change-password" className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                <Lock size={16} className="text-gray-500" />
                <span>Change Password</span>
              </Link>
              
              <div className="border-t my-1"></div> 

              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                <LogOut size={16} className="text-gray-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
