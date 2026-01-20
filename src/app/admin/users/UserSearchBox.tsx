"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserSuggestions } from "../actions";

type Suggestion = { id: string; name: string; email: string };

export function UserSearchBox({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const fetchSuggestions = useCallback(async (q: string) => {
    const t = q.trim();
    if (t.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    setActiveIndex(-1);
    try {
      const list = await getUserSuggestions(t);
      setSuggestions(list);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const t = query.trim();
    if (t.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function runSearch(term: string) {
    const s = term.trim();
    setOpen(false);
    setSuggestions([]);
    if (s) router.push(`/admin/users?search=${encodeURIComponent(s)}`);
    else router.push("/admin/users");
  }

  function onSelect(s: Suggestion) {
    setQuery(s.name);
    runSearch(s.name);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") { runSearch(query); e.preventDefault(); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) onSelect(suggestions[activeIndex]);
      else runSearch(query);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative flex flex-wrap gap-2 items-center max-w-xl">
      <div className="relative flex-1 min-w-[200px]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden">
            {loading ? (
              <div className="px-3 py-4 text-sm text-zinc-400">Loading…</div>
            ) : suggestions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-zinc-500">No matching users</div>
            ) : (
              <ul className="max-h-60 overflow-y-auto py-1">
                {suggestions.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(s)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        i === activeIndex ? "bg-violet-600/30 text-white" : "text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      <span className="font-medium">{s.name}</span>
                      <span className="text-zinc-500 ml-2 truncate">{s.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => runSearch(query)}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
      >
        Search
      </button>
      {initialSearch ? (
        <Link
          href="/admin/users"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Clear
        </Link>
      ) : null}
    </div>
  );
}
