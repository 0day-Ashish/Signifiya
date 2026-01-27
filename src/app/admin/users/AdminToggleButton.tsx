"use client";

import { useState } from "react";
import { promoteUserToAdmin, removeAdminAccess } from "../actions";
import { toast } from "sonner";

export function AdminToggleButton({ userId, isAdmin, userEmail }: { userId: string; isAdmin: boolean; userEmail: string }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = isAdmin
        ? await removeAdminAccess(userId)
        : await promoteUserToAdmin(userId);

      if (result.success) {
        toast.success(isAdmin ? "Admin access removed" : "User promoted to admin");
        window.location.reload();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
        isAdmin
          ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
          : "bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? "..." : isAdmin ? "Remove Admin" : "Make Admin"}
    </button>
  );
}
