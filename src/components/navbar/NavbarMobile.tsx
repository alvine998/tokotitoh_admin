import { deleteCookie } from "cookies-next";
import {
  BookIcon,
  Building2Icon,
  DoorOpenIcon,
  HomeIcon,
  MenuIcon,
  NewspaperIcon,
  UserCircle2Icon,
  UserIcon,
  Users2Icon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";

const navs = (role: string) =>
  [
    { name: "Dashboard", href: "/main/dashboard", icon: HomeIcon },
    { name: "Pengguna", href: "/main/customer", icon: UserIcon },
    { name: "Iklan", href: "/main/ads/waiting", icon: Building2Icon },
    role !== "admin" && {
      name: "Kategori",
      href: "/main/category",
      icon: BookIcon,
    },
    { name: "Laporan", href: "/main/report", icon: NewspaperIcon },
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

export default function NavbarMobile({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = navs(session?.role);

  const handleLogout = () => {
    deleteCookie("session");
    router.push("/");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image
            alt="logo"
            src="/images/tokotitoh.png"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-base font-bold text-gray-900 tracking-tight">
            TOKOTITOH
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </header>

      {/* Slide-over drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-30 transition-opacity duration-200"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-green-700 z-40 flex flex-col">
            {/* Brand */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-green-600/50">
              <div className="flex items-center gap-3">
                <Image
                  alt="logo"
                  src="/images/tokotitoh.png"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-white font-bold text-base tracking-tight">
                  TOKOTITOH
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-green-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
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
                    onClick={() => {
                      router.push(v.href);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                      ${
                        active
                          ? "bg-white/15 text-white"
                          : "text-green-100 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{v.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-green-600/50">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-200 hover:bg-white/10 hover:text-white transition-colors duration-150"
              >
                <DoorOpenIcon className="w-[18px] h-[18px] shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Page content */}
      <main className="p-4">{children}</main>
    </div>
  );
}
