import localFont from "next/font/local";
import Image from "next/image";
import FadeIn from "./FadeIn";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

export default function About() {
  return (
    <section className="w-full bg-black pt-3 flex flex-col gap-3">
        {/* About Signifiya Section */}
        <div className="flex flex-col lg:flex-row gap-3">
            {/* About Text Section */}
            <div className="flex-1 lg:flex-[1.5] bg-[#f3e5f5] rounded-[2.5rem] sm:p-12 relative overflow-hidden flex flex-col justify-center min-h-[400px] group">
                {/* Decorative Smiley Face */}
                <div className="absolute top-8 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-[#FCD34D] rounded-full border-2 border-black flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Eyes */}
                        <div className="absolute top-3.5 left-3 sm:top-5 sm:left-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full transition-all duration-300 group-hover:h-2 sm:group-hover:h-3"></div>
                        <div className="absolute top-3.5 right-3 sm:top-5 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full transition-all duration-300 group-hover:h-2 sm:group-hover:h-3"></div>
                        {/* Smile */}
                        <div className="absolute bottom-3 sm:bottom-4 w-6 h-3 sm:w-8 sm:h-4 border-b-[3px] sm:border-b-4 border-black rounded-b-full transition-all duration-300 group-hover:w-5 sm:group-hover:w-6 group-hover:border-b-[5px] sm:group-hover:border-b-[6px]"></div>
                    </div>
                </div>

                <div className="z-10 relative">
                    <FadeIn>
                        <h2 className={`text-2xl sm:text-5xl md:text-6xl text-black leading-[0.9] tracking-tight mb-6 sm:mb-8 uppercase text-left ml-4 sm:ml-0 ${gilton.className}`}>
                            About <span className="italic">Signifiya&apos;26</span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={200}>
                        <p className={`text-black text-left text-base sm:text-xl md:text-2xl font-medium leading-relaxed max-w-lg sm:max-w-xl mx-4 sm:mx-0 ${softura.className}`}>
                            Signifiya is not just an event; it&apos;s an experience. We bring together the brightest minds, the boldest creators, and the most passionate individuals for a celebration of innovation, art, and culture.
                        </p>
                        <div className="mt-8">
                             <a href="/register" className={`inline-block bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-transparent hover:bg-[#deb3fa] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ml-5 sm:ml-0 uppercase font-bold text-xs sm:text-sm tracking-wider cursor-none ${softura.className}`}>
                                Get Visitor&apos;s Pass
                            </a>
                            <p className={`text-black text-xs font-medium mt-2 max-w-xs ml-6 sm:ml-0 ${softura.className} opacity-70`}>
                                * Students participating in any Signifiya event do not need a visitor&apos;s pass.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Image Placeholder Section */}
            <div className="flex-1 bg-white rounded-[2.5rem] relative overflow-hidden flex items-center justify-center min-h-[400px] border-4 border-black">
                 <Image
                    src="/about.jpg"
                    alt="About Signifiya"
                    fill
                    className="object-cover"
                 />
            </div>
        </div>

        {/* About SOET Section - Reversed Layout */}
        <div className="flex flex-col lg:flex-row gap-3">
            {/* Image Placeholder Section (Left) */}
            <div className="flex-1 bg-white rounded-[2.5rem] relative overflow-hidden flex items-center justify-center min-h-[400px] border-4 border-black">
                 <Image
                    src="/soet-au.jpeg"
                    alt="About Signifiya"
                    fill
                    className="object-cover"
                 />
            </div>

            {/* About SOET Text Section (Right) */}
            <div className="flex-1 lg:flex-[1.5] bg-[#E0F2FE] rounded-[2.5rem] sm:p-12 relative overflow-hidden flex flex-col justify-center min-h-[400px] group">
                {/* Decorative Star Icon instead of Smiley */}
                <div className="absolute top-8 left-8 w-12 h-12 sm:w-16 sm:h-16 bg-[#FF6B6B] rounded-full border-2 border-black flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black transition-all duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>

                <div className="z-10 relative flex flex-col items-end text-right">
                    <FadeIn>
                        <h2 className={`text-3xl sm:text-5xl md:text-6xl text-black leading-[0.9] mr-5 sm:mr-0 sm:mt-0 tracking-tight mb-6 sm:mb-8 uppercase ${gilton.className}`}>
                            About <span className="italic">SOET</span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={200}>
                        <p className={`text-black text-right text-base sm:text-xl md:text-2xl font-medium leading-relaxed max-w-xl mr-4 sm:mr-0 ${softura.className}`}>
                            The School of Engineering and Technology stands as a beacon of technical excellence, fostering innovation and shaping the future engineers who will build tomorrow's world.
                        </p>
                    </FadeIn>
                </div>
            </div>
        </div>
    </section>
  );
}
