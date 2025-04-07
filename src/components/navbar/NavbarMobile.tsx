import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  BookIcon,
  Building2Icon,
  ChevronDownCircle,
  DoorOpenIcon,
  HomeIcon,
  MenuIcon,
  NewspaperIcon,
  PencilIcon,
  UserCircle,
  UserCircle2Icon,
  UserIcon,
  Users2Icon,
  Wallet2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export default function NavbarMobile({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) {
  const router = useRouter();

  const navs = [
    {
      name: "Dashboard",
      href: `/main/dashboard`,
      icon: <HomeIcon />,
    },
    {
      name: "Pengguna",
      href: `/main/customer`,
      icon: <UserIcon />,
    },
    {
      name: "Iklan",
      href: `/main/ads/waiting`,
      icon: <Building2Icon />,
    },
    session?.role !== "admin" && {
      name: "Kategori",
      href: `/main/category`,
      icon: <BookIcon />,
    },
    // {
    //     name: "Pembayaran",
    //     href: `/main/payment`,
    //     icon: <Wallet2Icon />
    // },
    {
      name: "Laporan",
      href: `/main/report`,
      icon: <NewspaperIcon />,
    },
    session?.role !== "admin" && {
      name: "Akses",
      href: `/main/user`,
      icon: <Users2Icon />,
    },
    session?.role !== "admin" && {
      name: "Mitra",
      href: `/main/partner`,
      icon: <UserCircle2Icon />,
    },
  ];
  return (
    <div className="overflow-hidden">
      {/* Topbar */}
      <div className="bg-green-600 w-full h-14 flex items-center px-2">
        <Menu>
          <MenuButton
            className={"flex gap-2 items-center justify-between w-full"}
          >
            <Image
              alt="logo"
              src={"/images/tokotitoh.png"}
              layout="relative"
              width={300}
              height={300}
              className="w-10 h-10"
            />
            <p className="text-white text-xl">TOKOTITOH</p>
            <MenuIcon color="white" className="w-7" />
          </MenuButton>
          <Transition
            enter="transition ease-out duration-75"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <MenuItems
              anchor="bottom end"
              className="w-full mt-5 min-h-screen origin-top-right rounded-xl border border-white/5 bg-white p-1 text-white [--anchor-gap:var(--spacing-1)] focus:outline-none"
            >
              {navs?.map((v: any) => (
                <MenuItem key={v?.name}>
                  <button
                    type="button"
                    className={
                      router?.pathname?.includes(v?.href)
                        ? "group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-green-600 text-white"
                        : `group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-white ${
                            v?.name == "Logout" ? "text-red-500" : "text-black"
                          }`
                    }
                    onClick={() => {
                      router.push(v?.href);
                    }}
                  >
                    {v?.icon}
                    {v?.name}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <div className="flex">
        <main className="container mt-5 px-5 h-full w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
