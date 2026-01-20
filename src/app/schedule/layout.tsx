export const revalidate = 300; // ISR: revalidate at most every 5 minutes

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
