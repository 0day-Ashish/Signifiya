import { getSession, requireAdmin } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import ScanClient from "./ScanClient";

export default async function ScanPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/scan");
  }

  const admin = await requireAdmin();
  if (!admin) {
    redirect("/");
  }

  return <ScanClient mode="home" />;
}
