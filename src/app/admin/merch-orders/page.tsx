"use client";

import { useState, useEffect, useCallback } from "react";
import localFont from "next/font/local";
import {
  getMerchOrders,
  getMerchOrderStats,
  updateMerchOrderStatus,
  exportMerchOrdersCsv,
} from "../actions";
import { CsvDownloadButton } from "../components/CsvDownloadButton";

const gilton = localFont({ src: "../../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../../public/fonts/Softura-Demo.otf" });

const STATUS_OPTIONS = ["pending", "confirmed", "collect"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-300 text-yellow-900 border-yellow-500",
  confirmed: "bg-blue-300 text-blue-900 border-blue-500",
  collect: "bg-green-300 text-green-900 border-green-500",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  collect: "Collect on Event Day",
};

export default function MerchOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [orderRes, statsRes] = await Promise.all([
        getMerchOrders({
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
          status: statusFilter || undefined,
        }),
        getMerchOrderStats(),
      ]);
      setOrders(orderRes.orders);
      setTotal(orderRes.total);
      setStats(statsRes);
    } catch (e) {
      console.error("Failed to load merch orders:", e);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const res = await updateMerchOrderStatus(orderId, newStatus);
    if (res.success) {
      await fetchData();
    }
    setUpdatingId(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1
          className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white ${gilton.className}`}
        >
          Merch Orders
        </h1>
        <div className="flex gap-2">
          <CsvDownloadButton fetchCsv={exportMerchOrdersCsv} filename="merch-orders.csv" label="⬇ CSV" />
          <button
            onClick={fetchData}
            className={`px-4 py-2 bg-[#deb3fa] text-black border-2 border-black rounded-lg font-bold text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ${softura.className}`}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            bg: "bg-[#deb3fa]",
            text: "text-black",
          },
          {
            label: "Pending",
            value: stats.pendingOrders,
            bg: "bg-yellow-300",
            text: "text-black",
          },
          {
            label: "Confirmed",
            value: stats.confirmedOrders,
            bg: "bg-blue-300",
            text: "text-black",
          },
          {
            label: "Revenue (₹)",
            value: Number(stats.totalRevenue).toLocaleString("en-IN"),
            bg: "bg-green-400",
            text: "text-black",
          },
        ].map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border-2 border-black p-4 ${c.bg} ${c.text} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${softura.className}`}
            >
              {c.label}
            </p>
            <p className={`text-2xl font-black mt-0.5 ${gilton.className}`}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setStatusFilter("");
            setPage(0);
          }}
          className={`px-3 py-1.5 rounded-full border-2 border-black text-xs font-bold uppercase tracking-wider transition-all ${
            !statusFilter
              ? "bg-white text-black shadow-inner"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          } ${softura.className}`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(0);
            }}
            className={`px-3 py-1.5 rounded-full border-2 border-black text-xs font-bold uppercase tracking-wider transition-all ${
              statusFilter === s
                ? `${STATUS_COLORS[s]}`
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            } ${softura.className}`}
          >
            {STATUS_LABELS[s] || s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 text-center">
          <p className={`text-zinc-500 text-lg ${softura.className}`}>
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800 text-zinc-300">
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider ${softura.className}`}
                >
                  Order #
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider ${softura.className}`}
                >
                  Customer
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider hidden md:table-cell ${softura.className}`}
                >
                  Item
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider hidden lg:table-cell ${softura.className}`}
                >
                  Size/Color
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider ${softura.className}`}
                >
                  Amount
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider hidden md:table-cell ${softura.className}`}
                >
                  UTR
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider hidden lg:table-cell ${softura.className}`}
                >
                  Referral
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider ${softura.className}`}
                >
                  Status
                </th>
                <th
                  className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider hidden sm:table-cell ${softura.className}`}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={o.id}
                  className={`${idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"} border-t border-zinc-800`}
                >
                  <td
                    className={`px-3 py-3 font-mono font-bold text-[#deb3fa] text-xs ${softura.className}`}
                  >
                    {o.orderNumber}
                  </td>
                  <td className="px-3 py-3">
                    <p
                      className={`font-bold text-white text-xs ${softura.className}`}
                    >
                      {o.name}
                    </p>
                    <p
                      className={`text-zinc-500 text-[10px] ${softura.className}`}
                    >
                      {o.email}
                    </p>
                    <p
                      className={`text-zinc-500 text-[10px] ${softura.className}`}
                    >
                      {o.phone}
                    </p>
                  </td>
                  <td
                    className={`px-3 py-3 text-zinc-300 hidden md:table-cell ${softura.className}`}
                  >
                    {o.merchItemName}
                    {o.quantity > 1 && (
                      <span className="text-zinc-500 text-xs">
                        {" "}
                        ×{o.quantity}
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-3 py-3 text-zinc-400 hidden lg:table-cell ${softura.className}`}
                  >
                    {[o.size, o.color].filter(Boolean).join(" / ") || "—"}
                  </td>
                  <td
                    className={`px-3 py-3 font-bold text-white ${softura.className}`}
                  >
                    ₹{o.totalAmount}
                    {o.discountApplied && (
                      <span className="block text-[10px] text-green-400 font-normal">
                        −₹{o.discountAmount} referral
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-3 py-3 font-mono text-zinc-400 text-xs hidden md:table-cell ${softura.className}`}
                  >
                    {o.utrId || "—"}
                  </td>
                  <td
                    className={`px-3 py-3 font-mono text-xs hidden lg:table-cell ${softura.className}`}
                  >
                    {o.referralBookingId ? (
                      <span className="text-green-400">
                        {o.referralBookingId}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border-2 cursor-pointer outline-none ${STATUS_COLORS[o.status] || "bg-zinc-700 text-zinc-300"} ${updatingId === o.id ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s] || s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    className={`px-3 py-3 text-zinc-500 text-xs hidden sm:table-cell ${softura.className}`}
                  >
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`px-4 py-2 bg-zinc-800 text-white border-2 border-black rounded-lg font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed ${softura.className}`}
          >
            ← Prev
          </button>
          <span className={`text-sm text-zinc-400 ${softura.className}`}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className={`px-4 py-2 bg-zinc-800 text-white border-2 border-black rounded-lg font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed ${softura.className}`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
