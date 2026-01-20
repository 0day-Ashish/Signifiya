"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const asideContent = (
    <>
      <div className="p-4 border-b border-zinc-800">
        <Link
          href="/admin"
          className="font-black text-lg uppercase tracking-tight text-white"
          onClick={() => setSidebarOpen(false)}
        >
          Signifiya Admin
        </Link>
        <p className="text-xs text-zinc-500 mt-1 truncate">{userEmail || ""}</p>
      </div>
      <nav className="flex-1 p-2 overflow-auto">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-zinc-800">
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          ← Back to site
        </Link>
      </div>
    </>
  );

  return (
    <div className="admin-panel min-h-screen flex flex-col md:flex-row bg-zinc-950">
      {/* Mobile: top bar with hamburger */}
      <header className="md:hidden shrink-0 sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-zinc-900 border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-black text-sm uppercase tracking-tight text-white truncate">Signifiya Admin</span>
        <Link
          href="/"
          className="text-xs font-medium text-zinc-500 hover:text-zinc-300"
        >
          Back
        </Link>
      </header>

      {/* Mobile: backdrop when drawer open */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          aria-label="Close menu"
        />
      )}

      {/* Mobile: slide-over drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {asideContent}
      </aside>

      {/* Desktop: static sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
        {asideContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-0 overflow-auto p-4 sm:p-5 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
