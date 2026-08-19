import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";

export default function AdsTabs({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const tabs = [
    { name: "Menunggu Persetujuan", href: "/main/ads/waiting", active: "waiting" },
    { name: "Disetujui", href: "/main/ads/approved", active: "approved" },
    { name: "Ditolak", href: "/main/ads/rejected", active: "rejected" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Iklan</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola dan verifikasi iklan yang masuk.</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentPath?.includes(tab.active) ?? false;
          return (
            <button
              key={tab.name}
              type="button"
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 -mb-px
                ${isActive
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => router.push(tab.href, tab.href, { scroll: false })}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
