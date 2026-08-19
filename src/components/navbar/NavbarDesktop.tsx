import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { deleteCookie } from "cookies-next";
import {
  BookIcon,
  Building2Icon,
  ChevronDown,
  DoorOpenIcon,
  HomeIcon,
  LogOut,
  NewspaperIcon,
  UserCircle2Icon,
  UserIcon,
  Users2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

const navs = (role: string) =>
  [
    {
      name: "Dashboard",
      href: "/main/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Pengguna",
      href: "/main/customer",
      icon: UserIcon,
    },
    {
      name: "Iklan",
      href: "/main/ads/waiting",
      icon: Building2Icon,
    },
    role !== "admin" && {
      name: "Kategori",
      href: "/main/category",
      icon: BookIcon,
    },
    {
      name: "Laporan",
      href: "/main/report",
      icon: NewspaperIcon,
    },
    role !== "admin" && {
      name: "Akses",
      href: "/main/user",
      icon: Users2Icon,
    },
    role !== "admin" && {
      name: "Mitra",
      href: "/main/partner",
      icon: UserCircle2Icon,
    },
  ].filter(Boolean) as { name: string; href: string; icon: any }[];

export default function NavbarDesktop({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  const router = useRouter();
  const items = navs(session?.role);

  const handleLogout = () => {
    deleteCookie("session");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1e3a5f] flex flex-col z-30">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
          <Image
            alt="logo"
            src="/images/tokonyang.png"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span className="text-white font-bold text-lg tracking-tight">
            TOKONYANG
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {items.map((v) => {
            const Icon = v.icon;
            const active = router.pathname.includes(v.href);
            return (
              <button
                key={v.name}
                type="button"
                onClick={() => router.push(v.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                  ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{v.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer - logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div />
          <Menu>
            <MenuButton className="flex items-center gap-2 rounded-lg hover:bg-gray-50 px-3 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center text-sm font-semibold">
                {session?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {session?.name || "Admin"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <MenuItems className="absolute right-6 mt-2 w-48 origin-top-right rounded-xl bg-white border border-gray-200 shadow-lg py-1 focus:outline-none">
                <MenuItem>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <DoorOpenIcon className="w-4 h-4" />
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
