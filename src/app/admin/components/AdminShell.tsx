"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

type NavItem = { href: string; label: string };

export default function AdminShell({
  nav,
  userEmail,
  children,
}: {
  nav: NavItem[];
  userEmail: string | null | undefined;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  const asideContent = (
    <>
      <div className="p-4 border-b-2 border-black bg-[#deb3fa]">
        <Link
          href="/admin"
          className={`flex items-center gap-2 ${gilton.className}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="relative w-8 h-8">
            <Image src="/logo2.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-black text-lg uppercase tracking-tight text-black">
            Admin
          </span>
        </Link>
        <p className={`text-xs text-black/60 mt-1 truncate ${softura.className}`}>{userEmail || ""}</p>
      </div>
      <nav className="flex-1 p-3 overflow-auto bg-zinc-900">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-bold mb-1 transition-all ${softura.className} ${
              isActive(href)
                ? "bg-[#deb3fa] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border-2 border-transparent"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t-2 border-zinc-800 bg-zinc-900">
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className={`block px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-[#deb3fa] hover:text-black border-2 border-transparent hover:border-black transition-all ${softura.className}`}
        >
          ← Back to site
        </Link>
      </div>
    </>
  );

  return (
    <div className="admin-panel min-h-screen flex flex-col md:flex-row bg-black">
      {/* Mobile: top bar with hamburger */}
      <header className="md:hidden shrink-0 sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[#deb3fa] border-b-2 border-black">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-black hover:bg-black/10 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className={`font-black text-sm uppercase tracking-tight text-black truncate ${gilton.className}`}>
          Signifiya Admin
        </span>
        <Link
          href="/"
          className={`text-xs font-bold text-black/70 hover:text-black ${softura.className}`}
        >
          Back
        </Link>
      </header>

      {/* Mobile: backdrop when drawer open */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/70"
          aria-label="Close menu"
        />
      )}

      {/* Mobile: slide-over drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-zinc-900 border-r-2 border-black flex flex-col transform transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {asideContent}
      </aside>

      {/* Desktop: static sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r-2 border-zinc-800 bg-zinc-900">
        {asideContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-0 overflow-auto p-4 sm:p-5 md:p-6 lg:p-8 bg-zinc-950">
        {children}
      </main>
    </div>
  );
}
