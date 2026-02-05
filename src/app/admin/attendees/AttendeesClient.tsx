"use client";

import { useState, Fragment } from "react";
import localFont from "next/font/local";
import { AttendeeItem } from "../actions";

const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

export function AttendeesClient({ attendees }: { attendees: AttendeeItem[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-xl border-2 border-black bg-zinc-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-800 bg-[#deb3fa]">
              <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Name</th>
              <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Role</th>
              <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Detail</th>
              <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Last Verified</th>
              <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>Email</th>
              <th className={`px-4 py-3 font-bold text-black ${softura.className}`}>College</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => {
              const isExpanded = expandedIds.has(a.id);
              const hasMembers = a.teamMembers && a.teamMembers.length > 0;
              const hasMultipleAttendance = a.attendance.length > 1; // e.g. Dual Pass or just multiple scans
              const canExpand = hasMembers || hasMultipleAttendance;

              return (
                <Fragment key={a.id}>
                  <tr
                    className={`border-b border-zinc-800/50 transition-colors ${canExpand ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/50"}`}
                    onClick={() => canExpand && toggleExpand(a.id)}
                  >
                    <td className={`px-4 py-3 text-white font-medium ${softura.className}`}>
                      <div className="flex items-center gap-2">
                        {canExpand && (
                          <span className="text-zinc-500 text-xs">{isExpanded ? "▼" : "▶"}</span>
                        )}
                        {a.name}
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${softura.className}`}>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${a.role === "Visitor" ? "bg-emerald-500/20 text-emerald-400" :
                        a.role === "Team Leader" ? "bg-amber-500/20 text-amber-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                        {a.role}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-zinc-300 text-xs ${softura.className}`}>{a.detail}</td>
                    <td className={`px-4 py-3 text-zinc-300 font-mono text-xs ${softura.className}`}>
                      {new Date(a.lastAttendedAt).toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-zinc-400 text-xs ${softura.className}`}>{a.email || "—"}</td>
                    <td className={`px-4 py-3 text-zinc-400 text-xs ${softura.className}`}>{a.college || "—"}</td>
                  </tr>

                  {isExpanded && hasMembers && a.teamMembers!.map(m => (
                    <tr key={m.id} className="bg-zinc-800/30 border-b border-zinc-800/30">
                      <td className={`px-4 py-2 pl-10 text-white/80 text-sm ${softura.className}`}>
                        └ {m.name}
                      </td>
                      <td className={`px-4 py-2 text-xs text-zinc-500 ${softura.className}`}>Team Member</td>
                      <td className="px-4 py-2"></td>
                      <td className={`px-4 py-2 text-zinc-500 font-mono text-xs ${softura.className}`}>
                        {new Date(m.attendedAt).toLocaleString()}
                      </td>
                      <td className={`px-4 py-2 text-zinc-500 text-xs ${softura.className}`}>{m.email}</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  ))}

                  {isExpanded && hasMultipleAttendance && !hasMembers && a.attendance.map((rec, idx) => (
                    <tr key={`${a.id}-att-${idx}`} className="bg-zinc-800/30 border-b border-zinc-800/30">
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                      <td className={`px-4 py-2 text-zinc-400 text-xs ${softura.className} text-right`}>{rec.label}:</td>
                      <td className={`px-4 py-2 text-zinc-400 font-mono text-xs ${softura.className}`}>
                        {new Date(rec.date).toLocaleString()}
                      </td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {attendees.length === 0 && (
        <div className={`py-12 text-center text-zinc-500 ${softura.className}`}>No verified attendees found.</div>
      )}
    </div>
  );
}
