import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-full bg-[#deb3fa] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="inline-block w-3 h-3 rounded-full bg-[#deb3fa] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="inline-block w-3 h-3 rounded-full bg-[#deb3fa] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <p
        className={`text-sm font-bold uppercase tracking-wider text-zinc-500 ${gilton.className}`}
      >
        Loading…
      </p>
    </div>
  );
}
