"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrganizingMember, updateOrganizingMember, deleteOrganizingMember } from "../actions";

type OrganizingMember = { id: string; name: string; role: string; category: string; image: string | null; order: number };

export function OrganizingMemberForm({
  initial,
  edit,
}: {
  initial?: OrganizingMember[];
  edit?: OrganizingMember;
}) {
  const router = useRouter();
  const [name, setName] = useState(edit?.name ?? "");
  const [role, setRole] = useState(edit?.role ?? "");
  const [category, setCategory] = useState(edit?.category ?? "");
  const [image, setImage] = useState(edit?.image ?? "");
  const [order, setOrder] = useState(edit?.order ?? 0);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrganizingMember({ name, role, category, image: image || undefined, order });
      setName(""); setRole(""); setCategory(""); setImage(""); setOrder(0);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setLoading(true);
    try {
      await updateOrganizingMember(edit.id, { name, role, category, image: image || undefined, order });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!edit || !confirm("Delete this member?")) return;
    setLoading(true);
    try {
      await deleteOrganizingMember(edit.id);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (edit) {
    return (
      <form onSubmit={handleUpdate} className="flex flex-wrap items-end gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-32" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" required className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-36" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-28" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-40" />
        <button type="submit" disabled={loading} className="rounded bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">Update</button>
        <button type="button" onClick={handleDelete} disabled={loading} className="rounded bg-red-600/80 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">Delete</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-36" />
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" required className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-40" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-36" />
      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-48" />
      <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)} placeholder="Order" className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1.5 text-sm text-white w-20" />
      <button type="submit" disabled={loading} className="rounded bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">Add</button>
    </form>
  );
}
