export const revalidate = 300; // ISR: revalidate at most every 5 minutes

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
