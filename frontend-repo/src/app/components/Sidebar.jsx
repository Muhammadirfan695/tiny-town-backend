"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FiGrid, FiUsers } from "react-icons/fi";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FiGrid,
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: FiUsers,
      requiredRole: "Admin",
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-20 items-center justify-center border-b px-6">
        <Link href="/dashboard">
          <Image
            src="/Group 36708.svg"
            alt="Localbites Logo"
            width={140}
            height={35}
            priority
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-2 p-4">
          {/* <p className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">
                        Menu
                    </p> */}
          {navLinks.map((link) => {
            if (link.requiredRole && user?.role !== link.requiredRole) {
              return null;
            }

            const isActive =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 transition-colors
                                    ${
                                      isActive
                                        ? "bg-[#344F1F] font-bold text-white" 
                                        : "text-gray-600 hover:bg-gray-100" 
                                    }`}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
