"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";

const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

export function SearchBox({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialSearch);

  const handleSearch = (term: string) => {
    setValue(term);
    startTransition(() => {
      const sp = new URLSearchParams(window.location.search);
      if (term) sp.set("search", term);
      else sp.delete("search");
      sp.set("page", "1");
      router.replace(`/admin/attendees?${sp.toString()}`);
    });
  };

  return (
    <input
      type="text"
      placeholder="Search by name or email..."
      value={value}
      onChange={(e) => handleSearch(e.target.value)}
      className={`w-full max-w-md px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#deb3fa] ${softura.className}`}
    />
  );
}
