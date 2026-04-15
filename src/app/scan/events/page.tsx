import { getSession, requireAdmin } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import ScanClient from "../ScanClient";

export default async function ScanEventsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/scan/events");
  }

  const admin = await requireAdmin();
  if (!admin) {
    redirect("/");
  }

  return <ScanClient mode="events" />;
}
