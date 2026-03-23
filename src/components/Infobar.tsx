import Link from "next/link";

export default function Infobar() {
  const marqueeText = (
    <span className="text-black font-bold mx-4 uppercase tracking-wider text-xs flex items-center gap-2">
      SIGNIFIYA'26 IS HERE:{" "}
      <span className="line-through text-gray-500">REGISTRATIONS</span>
      &nbsp; Are
      <span className="bg-red-600 text-white px-2 py-0.5 rounded shadow font-extrabold animate-pulse ml-1 mr-1">CLOSED</span>
      ! &nbsp;|&nbsp; Don't miss out on the biggest fest of the year! &nbsp;|&nbsp; SIGNIFIYA'26 IS HERE:{" "}
    </span>
  );

  return (
    <div className="w-full bg-[#deb3fa] py-2 overflow-hidden flex border-b-4 border-red-600 shadow-md">
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
