"use client";

import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { uploadAvatar, updateUserProfile, getUserProfile } from "@/app/actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

const rampart = localFont({ src: "../../../public/fonts/RampartOne-Regular.ttf" });
const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });

// Skeleton Loader Component
function SkeletonInput() {
  return (
    <div className="w-full bg-gray-200 border-2 border-black rounded-lg p-3 h-[48px] relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent skeleton-shimmer"
      />
    </div>
  );
}

export default function Profile() {
  const [session, setSession] = useState<any>(null);
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQrForPassId, setShowQrForPassId] = useState<string | null>(null);
  const [showEventPassDetail, setShowEventPassDetail] = useState<{ id: string; teamName: string; eventName: string; eventDate: string | Date | null; status: string; qrCode?: string | null; leaderBookingId?: string | null; leaderName?: string; members?: { name: string }[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-defined Avatars
  const AVATARS = [
    "/avatar1.jpg",
    "/avatar2.jpg",
    "/avatar3.jpg",
    "/avatar4.jpg",
    "/avatar5.jpg",
    "/avatar6.jpg",
    "/avatar7.jpg",
    "/avatar8.jpg"
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    collegeName: "",
    mobileNo: "",
  });
  
  const [events, setEvents] = useState<any[]>([]);
  const [passes, setPasses] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingIdCopied, setBookingIdCopied] = useState(false);

  const { data: sessionData } = authClient.useSession();

  const copyBookingId = () => {
    if (!bookingId) return;
    navigator.clipboard.writeText(bookingId).then(() => {
      setBookingIdCopied(true);
      setTimeout(() => setBookingIdCopied(false), 2000);
    });
  };

  // Scroll logic for navbar
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isAtTop = currentScrollY < 100;
      const isDesktop = window.innerWidth >= 640; // sm breakpoint

      // Only show nav links on scroll up for desktop screens
      if (isDesktop) {
        if (isAtTop) {
          setShowNavLinks(false);
        } else if (isScrollingUp) {
          setShowNavLinks(true);
        } else {
          setShowNavLinks(false);
        }
      } else {
        // On mobile, keep nav links closed (controlled by button click in Navbar)
        setShowNavLinks(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load initial session and fetch full profile from DB
  useEffect(() => {
    const loadProfile = async () => {
        if (sessionData?.user) {
            setLoading(true);
            setSession(sessionData);
            // Initialize form with session data first
            setFormData(prev => ({
                ...prev,
                name: sessionData.user.name || "",
            }));

            // Fetch extra fields from DB
            const userProfile: any = await getUserProfile(sessionData.user.id);
            if (userProfile) {
                setFormData(prev => ({
                    ...prev,
                    name: userProfile.name || prev.name,
                    gender: userProfile.gender || "",
                    collegeName: userProfile.collegeName || "",
                    mobileNo: userProfile.mobileNo || "",
                }));
                setBookingId(userProfile.bookingId ?? null);
                if (userProfile.registeredEventTeams) setEvents(userProfile.registeredEventTeams);
                if (userProfile.generatedPasses) setPasses(userProfile.generatedPasses);

                // Also update session image if DB has newer one
                if (userProfile.image && userProfile.image !== sessionData.user.image) {
                     setSession((s: any) => ({
                         ...s,
                         user: { ...s.user, image: userProfile.image }
                     }));
                }
            }
            setLoading(false);
        } else {
            setLoading(false);
        }
    };
    loadProfile();
  }, [sessionData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    try {
        const result = await updateUserProfile(session.user.id, formData);
        if (result.success) {
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
            
            // Update local session name if changed
            if (formData.name !== session.user.name) {
                 setSession((s: any) => ({
                     ...s,
                     user: { ...s.user, name: formData.name }
                 }));
            }
        } else {
            throw new Error(result.error);
        }
    } catch (e: any) {
        alert("Failed to update profile: " + e.message);
    } finally {
        setSaving(false);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setShowAvatarModal(false);
    
    // Update in DB immediately
    if (session?.user?.id) {
        await updateUserProfile(session.user.id, { image: avatarUrl });
    }

    // Update local state
    if (session && session.user) {
        setSession((s: any) => ({
            ...s,
            user: {
                ...s.user,
                image: avatarUrl
            }
        }));
    }
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploading(true);
    const file = event.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const result = await uploadAvatar(formDataUpload);
      if (!result.success || !result.url) throw new Error(result.error || "Upload failed");
      
      await handleAvatarSelect(result.url); // Use same logic to update profile
      alert('Avatar uploaded successfully!');
    } catch (error: any) {
      alert('Error uploading: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}} />
    <div className="min-h-screen flex flex-col bg-black">
      
      {/* Event Pass Detail Modal (View on registered event) */}
      {showEventPassDetail && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white p-6 sm:p-8 rounded-4xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 items-center max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center w-full">
              <h2 className={`text-xl text-black ${gilton.className}`}>Event Pass</h2>
              <button
                onClick={() => setShowEventPassDetail(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-red-200 hover:bg-red-300 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="w-full space-y-4">
              <div>
                <p className={`text-xs font-bold uppercase text-zinc-500 ${softura.className}`}>Event</p>
                <p className={`font-bold text-black ${softura.className}`}>{showEventPassDetail.eventName}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase text-zinc-500 ${softura.className}`}>Team</p>
                <p className={`font-bold text-black ${softura.className}`}>{showEventPassDetail.teamName}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase text-zinc-500 ${softura.className}`}>Booking ID</p>
                <p className={`font-mono font-bold text-black ${softura.className}`}>{showEventPassDetail.leaderBookingId || "—"}</p>
              </div>
            </div>
            <div className="aspect-square w-48 h-48 bg-white border-2 border-black rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(showEventPassDetail.qrCode || showEventPassDetail.id)}`}
                alt="Event pass QR"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-full space-y-3 border-t-2 border-zinc-200 pt-4">
              <div>
                <p className={`text-xs font-bold uppercase text-zinc-500 ${softura.className}`}>Team lead</p>
                <p className={`font-medium text-black ${softura.className}`}>{showEventPassDetail.leaderName || "—"}</p>
              </div>
              {showEventPassDetail.members && showEventPassDetail.members.length > 0 && (
                <div>
                  <p className={`text-xs font-bold uppercase text-zinc-500 ${softura.className}`}>Team members</p>
                  <ul className={`mt-1 space-y-1 font-medium text-black ${softura.className}`}>
                    {showEventPassDetail.members.map((m, i) => (
                      <li key={i}>{m.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pass QR Modal */}
      {showQrForPassId && (() => {
        const p = passes.find((x: { id: string }) => x.id === showQrForPassId);
        if (!p) return null;
        const qrData = p.qrCode || p.id;
        return (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white p-6 sm:p-8 rounded-4xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 items-center max-w-sm w-full">
              <div className="flex justify-between items-center w-full">
                <h2 className={`text-xl text-black ${gilton.className}`}>My Pass</h2>
                <button
                  onClick={() => setShowQrForPassId(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black bg-red-200 hover:bg-red-300 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="aspect-square w-48 h-48 bg-white border-2 border-black rounded-xl flex items-center justify-center overflow-hidden">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`} alt="Pass QR" className="w-full h-full object-contain" />
              </div>
              <p className={`font-bold text-black uppercase ${softura.className}`}>{p.type}</p>
              {(p.userBookingId || p.bookingId) && <p className={`text-sm font-mono text-zinc-600 ${softura.className}`}>Booking ID: {p.userBookingId || p.bookingId}</p>}
              <p className={`text-sm text-gray-600 ${softura.className}`}>Valid until: {new Date(p.validUntil).toLocaleDateString()}</p>
            </div>
          </div>
        );
      })()}

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-70 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-4xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 items-center max-w-2xl w-full my-4 sm:my-0 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center w-full">
                <h2 className={`text-3xl text-black text-center ${gilton.className}`}>
                Choose Avatar
                </h2>
                <button 
                    onClick={() => setShowAvatarModal(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black transition-colors bg-red-300 z-50 relative cursor-none"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div className="w-full flex flex-col gap-4 min-h-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                    {AVATARS.map((avatar, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAvatarSelect(avatar)}
                        className="aspect-square bg-[#deb3fa] rounded-2xl border-2 border-black overflow-hidden relative hover:scale-105 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group cursor-none"
                    >
                        <Image 
                            src={avatar} 
                            alt={`Avatar ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                        {session?.user?.image === avatar && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="bg-green-500 text-white p-2 rounded-full border-2 border-black">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </button>
                ))}
                </div>
            </div>
          </div>
        </div>
      )}

      
      
      <Navbar 
        showNavLinks={showNavLinks}
        session={session}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
      />

      {/* Back Button */}
      <Link 
        href="/"
        className="fixed top-16 -mt-7 left-8 sm:left-11 z-50 ml-4 sm:ml-0 sm:mt-20 w-9 h-9 sm:w-12 sm:h-12 bg-white text-black rounded-full border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95 cursor-none"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </Link>

      {/* Success Toast */}
      <div className={`fixed top-24 right-8 z-50 transition-all duration-500 transform ${showSuccessToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="bg-[#4caf50] text-white px-6 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
                <h4 className={`font-bold text-lg ${softura.className} tracking-widest`}>Success!</h4>
                <p className={`font-bold text-xs ${softura.className}`}>Profile Saved</p>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-3">
        <main className="w-full h-full min-h-[calc(100vh-6rem)] bg-[#f3e5f5] rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-start relative p-4 sm:p-8 md:p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2 sm:mt-0">
            
            <div className="w-full max-w-4xl flex flex-col gap-8 sm:gap-12 mt-20 sm:mt-16">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className={`text-6xl text-black uppercase ${gilton.className}`}>
                        Your Profile
                    </h1>
                    <p className={`text-xl text-gray-600 font-medium ${softura.className}`}>
                        Manage your account settings and preferences.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-4xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                    {/* Lottie Background Animation */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40">
                         <div className="w-[800px] h-[800px]">
                            <DotLottieReact
                              src="https://lottie.host/ac3bacfa-158a-4442-ac68-b799a0c574cd/Aapj1forUL.lottie"
                              loop
                              autoplay
                            />
                         </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4 relative z-10">
                        <div className="w-32 h-32 bg-[#deb3fa] rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                            {session?.user?.image ? (
                                <Image 
                                    src={session.user.image} 
                                    alt="Profile" 
                                    fill 
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-5xl font-bold text-black">
                                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowAvatarModal(true)}
                            className={`text-sm font-bold text-black underline hover:text-[#9c27b0] cursor-none ${softura.className}`}
                        >
                            Change Avatar
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 w-full flex flex-col gap-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className={`font-bold text-black uppercase text-sm ${softura.className} cursor-none`}>Full Name</label>
                                {loading ? (
                                    <SkeletonInput />
                                ) : (
                                    <input 
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-none ${softura.className}`}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className={`font-bold text-black uppercase text-sm ${softura.className} cursor-none`}>Email Address</label>
                                {loading ? (
                                    <SkeletonInput />
                                ) : (
                                    <div className={`w-full bg-gray-100 border-2 border-black rounded-lg p-3 text-gray-500 font-medium cursor-not-allowed select-none ${softura.className}`}>
                                        {session?.user?.email || "Loading..."}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className={`font-bold text-black uppercase text-sm ${softura.className} cursor-none`}>Booking ID</label>
                                {loading ? (
                                    <SkeletonInput />
                                ) : (
                                    <div className="flex items-center gap-2 w-full bg-gray-100 border-2 border-black rounded-lg pr-1">
                                        <span className={`flex-1 min-w-0 p-3 text-gray-600 font-mono font-medium truncate ${softura.className}`} title={bookingId || undefined}>
                                            {bookingId || "—"}
                                        </span>
                                        {bookingId && (
                                            <button
                                                type="button"
                                                onClick={copyBookingId}
                                                className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-md border-2 border-black bg-white hover:bg-[#deb3fa] transition-colors ${softura.className}`}
                                                title="Copy"
                                            >
                                                {bookingIdCopied ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 relative">
                                <label className={`font-bold text-black uppercase text-sm ${softura.className} cursor-none`}>Gender</label>
                                {loading ? (
                                    <SkeletonInput />
                                ) : (
                                    <div className="relative">
                                        <select 
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none relative z-10 cursor-none ${softura.className}`}
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Others</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M6 9l6 6 6-6"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                             <div className="flex flex-col gap-2">
                                <label className={`font-bold text-black uppercase text-sm ${softura.className} cursor-none`}>Mobile No.</label>
                                {loading ? (
                                    <SkeletonInput />
                                ) : (
                                    <input 
                                        type="tel"
                                        name="mobileNo"
                                        value={formData.mobileNo}
                                        onChange={handleInputChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-none ${softura.className}`}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                             <label className={`font-bold text-black uppercase text-sm ${softura.className} cursor-none`}>College Name</label>
                             {loading ? (
                                 <SkeletonInput />
                             ) : (
                                 <input 
                                    type="text"
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your college name"
                                    className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-none ${softura.className}`}
                                 />
                             )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mt-4">
                            <button 
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className={`bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider border-2 border-transparent hover:bg-[#deb3fa] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-none w-full sm:w-auto ${softura.className}`}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <div className="w-full sm:flex-1 sm:max-w-md">
                                <p className={`text-xs sm:text-sm text-gray-600 font-medium ${softura.className}`}>
                                    <span className="font-bold text-black">Note:</span> Please complete your profile before registering for events or purchasing visitor passes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events & Passes Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Registered Events */}
                    <div className="bg-white rounded-4xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 h-full">
                        <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                             <div className="w-10 h-10 bg-[#deb3fa] border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                             </div>
                             <h2 className={`text-2xl text-black uppercase ${gilton.className}`}>Registered Events</h2>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-4">
                             {events.length > 0 ? (
                                 events.map((ev: { id: string; teamName: string; eventName: string; eventDate: string | Date | null; status: string; qrCode?: string | null; leaderBookingId?: string | null; leaderName?: string; members?: { name: string }[] }) => (
                                     <div key={ev.id} className="bg-gray-100 border-2 border-black rounded-xl p-4 flex justify-between items-center hover:bg-[#f3e5f5] transition-colors">
                                         <div>
                                            <h3 className={`font-bold text-black uppercase ${softura.className}`}>{ev.eventName}</h3>
                                            <p className={`text-xs text-gray-600 font-medium ${softura.className}`}>
                                              {ev.teamName}{ev.eventDate ? ` · ${new Date(ev.eventDate).toLocaleDateString()}` : ""}
                                            </p>
                                            <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${ev.status === "verified" ? "bg-green-200 text-green-800" : ev.status === "rejected" ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"} ${softura.className}`}>{ev.status}</span>
                                         </div>
                                         <button type="button" onClick={() => setShowEventPassDetail(ev)} className={`bg-black text-white text-xs px-3 py-1 rounded-full font-bold uppercase hover:bg-gray-800 transition-colors ${softura.className}`}>View</button>
                                     </div>
                                 ))
                             ) : (
                                 <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-8 opacity-60">
                                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                     </svg>
                                     <p className={`font-bold text-black text-lg ${softura.className}`}>No Events Found</p>
                                     <p className={`text-sm text-gray-600 font-medium max-w-[200px] ${softura.className}`}>You&apos;ve not registered for any event yet.</p>
                                     <Link href="/" className={`mt-2 text-sm font-bold text-[#9c27b0] underline hover:text-black ${softura.className}`}>Register for events →</Link>
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* Generated Passes */}
                    <div className="bg-white rounded-4xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 h-full">
                        <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                             <div className="w-10 h-10 bg-[#deb3fa] border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                             </div>
                             <h2 className={`text-2xl text-black uppercase ${gilton.className}`}>My Passes</h2>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-4">
                             {passes.length > 0 ? (
                                 passes.map((pass) => (
                                     <div key={pass.id} className="bg-gray-100 border-2 border-black rounded-xl p-4 flex justify-between items-center hover:bg-[#f3e5f5] transition-colors">
                                         <div>
                                            <h3 className={`font-bold text-black uppercase ${softura.className}`}>{pass.type}</h3>
                                            {(pass.userBookingId || pass.bookingId) && <p className={`text-xs text-zinc-500 font-mono ${softura.className}`}>Booking ID: {pass.userBookingId || pass.bookingId}</p>}
                                            <p className={`text-xs text-gray-600 font-medium ${softura.className}`}>Valid until: {new Date(pass.validUntil).toLocaleDateString()}</p>
                                         </div>
                                         <button type="button" onClick={() => setShowQrForPassId(pass.id)} className={`bg-black text-white text-xs px-3 py-1 rounded-full font-bold uppercase hover:bg-gray-800 transition-colors ${softura.className}`}>Show QR</button>
                                     </div>
                                 ))
                             ) : (
                                 <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-8 opacity-60">
                                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                     </svg>
                                     <p className={`font-bold text-black text-lg ${softura.className}`}>No Passes Found</p>
                                     <p className={`text-sm text-gray-600 font-medium max-w-[200px] ${softura.className}`}>You&apos;ve not generated any passes yet.</p>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>

        </main>
      </div>
      <Footer />
    </div>
    </>
  );
}
