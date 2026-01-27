import Link from "next/link";

export default function Infobar() {
  const marqueeText = (
    <span className="text-black font-bold mx-4 uppercase tracking-wider text-xs">
      SIGNIFIYA'26 IS HERE:{" "}
      <Link href="/events" className="underline  cursor-pointer">
        REGISTRATIONS
      </Link>
      . LIVE NOW.
    </span>
  );

  return (
    <div className="w-full bg-[#deb3fa] py-2 overflow-hidden flex">
      <div className="animate-marquee whitespace-nowrap flex min-w-full">
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {/* Duplicate for seamless scrolling */}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
        {marqueeText}
      </div>
    </div>
  );
}
