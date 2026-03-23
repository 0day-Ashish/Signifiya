"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile } from "@/app/actions";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../../public/fonts/GiltonRegular.otf" });

const formSchema = z.object({
  teamName: z.string().min(2, "Team Name is required"),
  leaderName: z.string().min(2, "Leader Name is required"),
  leaderPhone: z.string().regex(/^[0-9]{10}$/, "Must be 10 digits"),
  institutionName: z.string().min(2, "Institution Name is required"),
  department: z.string().optional(),
  instagramId: z
    .string()
    .min(1, "Instagram ID is required")
    .regex(/^@?[\w.]+$/, "Enter a valid Instagram username"),
  reelLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || /^https?:\/\/.+/.test(val.trim()),
      { message: "Must be a valid URL" },
    ),
});

type ReelFormData = z.infer<typeof formSchema>;

const inputStyles =
  "rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none";
const labelStyles =
  "text-black font-bold uppercase text-xs tracking-wider mb-1 block";

function ReelRegistrationContent() {
  const router = useRouter();
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefillLoading, setIsPrefillLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leaderEmail, setLeaderEmail] = useState("");
  const [bookingId, setBookingId] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReelFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      leaderName: "",
      leaderPhone: "",
      institutionName: "",
      department: "",
      instagramId: "",
      reelLink: "",
    },
  });

  // Auth guard
  useEffect(() => {
    if (!isSessionPending && !sessionData) {
      router.push("/sign-in?callbackUrl=/events/reel");
    }
  }, [sessionData, isSessionPending, router]);

  // Prefill from profile
  useEffect(() => {
    const prefill = async () => {
      if (isSessionPending || !sessionData?.user?.id) return;
      setIsPrefillLoading(true);
      try {
        const profile: any = await getUserProfile(sessionData.user.id);
        if (!profile) return;
        if (profile.bookingId) setBookingId(profile.bookingId);
        if (sessionData.user.email) setLeaderEmail(sessionData.user.email);
        if (profile.name) setValue("leaderName", profile.name);
        else if (sessionData.user.name) setValue("leaderName", sessionData.user.name);
        if (profile.mobileNo)
          setValue(
            "leaderPhone",
            String(profile.mobileNo).replace(/\D/g, "").slice(0, 10),
          );
        if (profile.collegeName) setValue("institutionName", profile.collegeName);
      } finally {
        setIsPrefillLoading(false);
      }
    };
    prefill();
  }, [sessionData, isSessionPending, setValue]);

  const onSubmit = async (vals: ReelFormData) => {
    if (!bookingId) {
      toast.error("Booking ID not loaded yet. Please wait a moment.");
      return;
    }
    setIsLoading(true);
    try {
      const { submitReelRegistration } = await import("@/app/actions");
      const res = await submitReelRegistration({
        teamName: vals.teamName,
        leaderName: vals.leaderName,
        leaderPhone: vals.leaderPhone,
        leaderEmail,
        instagramId: vals.instagramId.startsWith("@")
          ? vals.instagramId
          : `@${vals.instagramId}`,
        institutionName: vals.institutionName,
        department: vals.department,
        reelLink: vals.reelLink,
        leaderBookingId: bookingId,
        clientType: "web",
      });

      if (!res.success) {
        toast.error(res.error || "Registration failed. Please try again.");
        return;
      }
      setSubmitted(true);
      toast.success("Registered successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSessionPending || isPrefillLoading) {
    return (
      <div className="bg-zinc-950 h-screen flex items-center justify-center">
        <p className="text-white font-mono text-sm animate-pulse">Loading…</p>
      </div>
    );
  }

  const progress = submitted ? "100%" : "50%";

  return (
    <div className="bg-zinc-950 h-screen max-h-screen flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden">
      <div className="bg-white rounded-[2rem] w-full max-w-full h-full max-h-full overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col p-6 lg:p-10 relative overflow-hidden min-h-0">
          <div className="flex flex-col mb-6">
            <Link
              href="/"
              className="inline-block w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-4"
            >
              ← RETURN HOME
            </Link>

            <h1
              className={`text-4xl lg:text-5xl font-black tracking-tighter text-black leading-none uppercase ${gilton.className}`}
            >
              Reel Making <span className="text-purple-600">Competition.</span>
            </h1>

            <div className="mt-8 w-full max-w-full h-6 border-2 border-black rounded-full p-1 bg-zinc-100 mb-2 overflow-hidden box-border">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: progress }}
                className="h-full bg-black rounded-full transition-all duration-500 ease-in-out relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 w-full h-full opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px)",
                  }}
                ></div>
              </motion.div>
            </div>

            <div className="flex justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span className={!submitted ? "text-black" : ""}>Details</span>
              <span className={submitted ? "text-black" : ""}>Done</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 pr-2 custom-scrollbar overflow-y-auto">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="bg-[#4caf50] text-white p-6 rounded-4xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2
                      className={`text-4xl font-black uppercase mb-2 ${gilton.className}`}
                    >
                      You&apos;re Registered!
                    </h2>
                    <p className="font-medium text-white/90">
                      Your entry for the Reel Making Competition has been
                      recorded.
                    </p>
                    <p className="text-sm mt-2 opacity-80">
                      Create your reel, post on Instagram, and tag{" "}
                      <strong>@signifiya</strong> &amp;{" "}
                      <strong>@phoenix_nipashree</strong>.
                    </p>
                  </div>

                  <div className="bg-purple-50 border-2 border-black rounded-xl p-4 text-sm font-mono text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-bold text-purple-700 mb-2 uppercase text-xs tracking-wider">
                      Prize Details 🏆
                    </p>
                    <p>
                      • Cash Prize: <strong>₹2,000</strong>
                    </p>
                    <p>
                      • Feature on <strong>@signifiya</strong> Instagram
                    </p>
                    <p>• Collaboration with Adamas University page</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
                    <Button
                      onClick={() => router.push("/profile")}
                      className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-none hover:translate-y-[2px]"
                    >
                      GO TO PROFILE
                    </Button>
                    <Button
                      onClick={() => router.push("/")}
                      variant="outline"
                      className="w-full sm:w-auto bg-white px-8 py-4 rounded-xl font-bold border-2 border-black"
                    >
                      RETURN HOME
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="bg-purple-100 border-2 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-bold text-xs uppercase">
                      Registration — Free Entry · No Payment Required
                    </p>
                  </div>

                  {/* Rules glance */}
                  <div className="bg-zinc-50 border-2 border-black rounded-xl p-3 text-xs text-zinc-700 space-y-0.5">
                    <p className="font-bold uppercase tracking-wide mb-1">
                      Rules at a glance
                    </p>
                    <p>
                      • 30-second reel · Theme: SIGNIFIYA 2026 · Post on
                      Instagram
                    </p>
                    <p>
                      • Tag <strong>@signifiya</strong> and{" "}
                      <strong>@phoenix_nipashree</strong> in your post
                    </p>
                    <p>• Original content only · Deadline: 25th March</p>
                  </div>

                  {/* Team Name */}
                  <div>
                    <Label className={labelStyles}>
                      Team Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("teamName")}
                      className={inputStyles}
                      placeholder="YOUR TEAM NAME"
                    />
                    {errors.teamName && (
                      <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                        {errors.teamName.message}
                      </p>
                    )}
                  </div>

                  {/* Leader Name + Institution Name */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <Label className={labelStyles}>
                        Team Leader Name{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("leaderName")}
                        className={inputStyles}
                        placeholder="FULL NAME"
                      />
                      {errors.leaderName && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.leaderName.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <Label className={labelStyles}>
                        Institution Name{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("institutionName")}
                        className={inputStyles}
                        placeholder="ADAMAS UNIVERSITY"
                      />
                      {errors.institutionName && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.institutionName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Number + Department */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={labelStyles}>
                        Contact Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("leaderPhone")}
                        className={inputStyles}
                        placeholder="10-DIGIT NUMBER"
                        inputMode="numeric"
                        maxLength={10}
                      />
                      {errors.leaderPhone && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.leaderPhone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className={labelStyles}>Department</Label>
                      <Input
                        {...register("department")}
                        className={inputStyles}
                        placeholder="e.g., CSE (optional)"
                      />
                    </div>
                  </div>

                  {/* Instagram ID + Reel Link */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={labelStyles}>
                        Instagram ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("instagramId")}
                        className={inputStyles}
                        placeholder="@yourusername"
                      />
                      {errors.instagramId && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.instagramId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className={labelStyles}>
                        Reel Link{" "}
                        <span className="text-zinc-400 font-normal normal-case text-[10px]">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        {...register("reelLink")}
                        className={inputStyles}
                        placeholder="instagram.com/reel/..."
                      />
                      {errors.reelLink && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.reelLink.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-[2px_2px_0px_0px_#a855f7] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Submitting…" : "REGISTER NOW — FREE →"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden lg:flex flex-1 bg-purple-100 relative items-center justify-center border-l-4 border-black p-8 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 border-4 border-black rounded-none rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400 border-4 border-black rounded-full animate-bounce shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10"></div>
          <div className="absolute top-1/2 right-16 w-10 h-10 bg-pink-400 border-4 border-black rotate-45 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10"></div>
          <div className="relative w-[420px] h-[580px] bg-white border-4 border-black rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-zinc-900 relative border-b-4 border-black overflow-hidden">
              <Image
                src="https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/gallery/gallery-13.jpeg"
                alt="Reel Making Competition"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-mono text-xs text-purple-400">
                  /// REEL_SUBMISSION_OPEN
                </p>
                <h2 className="text-3xl font-black tracking-tighter">
                  CREATE.
                  <br />
                  POST.
                  <br />
                  WIN.
                </h2>
              </div>
            </div>
            <div className="h-1/3 p-6 flex flex-col justify-between bg-white relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>
              <div className="relative z-10">
                <p className="font-bold text-xl uppercase mb-1">
                  Reel Making Competition
                </p>
                <p className="text-sm text-zinc-600">
                  30-second reel · Theme SIGNIFIYA 2026 · Cash Prize ₹2,000
                </p>
              </div>
              <div className="flex gap-2 relative z-10">
                <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded">
                  FREE
                </span>
                <span className="px-3 py-1 bg-white border-2 border-black text-black text-xs font-bold rounded">
                  ONLINE
                </span>
                <span className="px-3 py-1 bg-purple-500 text-white border-2 border-black text-xs font-bold rounded">
                  ₹2,000 PRIZE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-zinc-950 h-screen flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

export default function ReelRegistrationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReelRegistrationContent />
    </Suspense>
  );
}
