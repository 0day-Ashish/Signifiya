"use client";
import Link from "next/link";
import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

const SPONSOR_LOGO_FILES = [
    "arun.png",
    "axis.jpeg",
    "burgerking.png",
    "the-wall.png",
    "Domino.png",
    "jawa.jpeg",
    "nikon.png",
    "Redbull.png",
    "edu.webp",
];

const toSponsorName = (filename: string) => {
    const base = filename.replace(/\.[^/.]+$/, "");
    return base
        .replace(/[-_]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const SPONSORS = SPONSOR_LOGO_FILES.map((file, index) => ({
    id: index + 1,
    name: toSponsorName(file),
    logo: `/logos/${file}`,
}));

export default function Sponsors() {
    return (
        <section id="sponsors" className="w-full bg-black ">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col gap-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <FadeIn>
                    <div className="flex flex-col gap-4 text-center">
                        <h2 className={`text-5xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}>
                            Current <span className="italic">Sponsors</span>
                        </h2>
                        <p className={`text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}>
                            Powered by the best in the industry.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={200}>
                    <div className="w-full flex items-center justify-center flex-col gap-8">
                        <div className="mt-2 max-w-4xl grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                            {SPONSORS.map((sponsor) => (
                                <div
                                    key={sponsor.id}
                                    className="h-24 rounded-xl  flex items-center justify-center"
                                >
                                    <Image
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        width={160}
                                        height={80}
                                        className="max-h-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
         

                {/* Community Partners Section */}
                <FadeIn delay={300}>
                    <div className="flex flex-col gap-8 mt-12 pt-8 border-t-4 border-black">
                        <h3 className={`text-4xl sm:text-5xl text-black uppercase text-center ${gilton.className}`}>
                            Community <span className="italic">Partners</span>
                        </h3>

                        {/* Horizontal Logo Layout */}
                        <div className="flex flex-row flex-wrap items-center justify-center gap-12 py-4">
                            {/* CSI Logo */}
                            <Image
                                src="/csi.avif"
                                alt="CSI - Computer Society of India"
                                width={200}
                                height={90}
                                className="h-20 w-auto object-contain"
                            />

                            {/* ACM Logo */}
                            <Image
                                src="/acmlogo.png"
                                alt="ACM - Association for Computing Machinery"
                                width={250}
                                height={100}
                                className="h-30 w-auto object-contain"
                            />

                            {/* Cerkle Logo */}
                            <Image
                                src="/cerkle.avif"
                                alt="Cerkle"
                                width={200}
                                height={90}
                                className="h-20 w-auto object-contain"
                            />
                        </div>
                    </div>
                </FadeIn>

                {/* Become a Sponsor Button */}
                <div className="flex justify-center mt-8">
                    <Link href="/sponsors">
                        <button className={`bg-black text-white px-8 py-3 rounded-full border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase font-bold text-lg tracking-wider ${softura.className}`}>
                            Become a Sponsor
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
