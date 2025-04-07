import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import Button from "../Button";
import { ChevronLeft } from "lucide-react";

export default function AdsTabs({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    // Ensures this only runs on the client
    setCurrentPath(router.pathname);
  }, [router.pathname]);
  const tabs = [
    {
      name: "Menunggu Persetujuan",
      href: `/main/ads/waiting`,
      active: "waiting",
    },
    {
      name: "Disetujui",
      href: `/main/ads/approved`,
      active: "approved",
    },
    {
      name: "Ditolak",
      href: `/main/ads/rejected`,
      active: "rejected",
    },
  ];
  return (
    <div>
      <div className="bg-white shadow-lg rounded w-full p-4 h-full">
        <h5 className="font-semibold text-xl">Iklan</h5>
      </div>
      <div className="flex gap-2 lg:flex-wrap flex-nowrap lg:overflow-x-hidden overflow-x-auto mt-5">
        {tabs.map((tab) => {
          const isActive = currentPath?.includes(tab.active) ?? false; // only client-side
          return (
            <button
              key={tab.name}
              type="button"
              className={
                isActive
                  ? "p-2 bg-blue-500 text-white rounded w-[200px]"
                  : "p-2 bg-blue-300 hover:bg-blue-500 text-white rounded w-[200px] duration-200 transition-all"
              }
              onClick={() => router.push(tab.href, tab.href, { scroll: false })}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
