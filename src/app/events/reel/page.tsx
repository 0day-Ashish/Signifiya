"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

export default function ReelRegistrationPage() {
  const router = useRouter();
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(false);
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
      setIsPrefilling(true);
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
        setIsPrefilling(false);
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

  if (isSessionPending || isPrefilling) {
    return (
      <div className="bg-zinc-950 min-h-screen flex items-center justify-center">
        <p className="text-white font-mono text-sm animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden">
        <div className="p-6 lg:p-10">
          {/* Header */}
          <Link
            href="/schedule/reel"
            className="inline-block w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-4"
          >
            ← BACK TO EVENT DETAILS
          </Link>

          <div className="mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest bg-purple-200 border border-purple-400 px-2 py-0.5 rounded">
              Non-Tech · Online
            </span>
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-black tracking-tighter text-black leading-none uppercase mb-1 ${gilton.className}`}
          >
            Reel Making
          </h1>
          <h2 className="text-2xl font-black tracking-tight text-purple-600 uppercase mb-1">
            Competition
          </h2>
          <p className="text-xs font-mono text-zinc-500 mb-6">
            Theme: SIGNIFIYA 2026 · 30 seconds · Instagram · Cash Prize ₹2,000
            · <span className="text-green-600 font-bold">FREE ENTRY</span>
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-10 gap-4"
              >
                <div className="text-6xl">🎉</div>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  You&apos;re Registered!
                </h3>
                <p className="text-zinc-600 text-sm max-w-sm">
                  Your entry for the Reel Making Competition has been recorded.
                  Create your 30-second reel on{" "}
                  <strong>SIGNIFIYA 2026</strong>, post it on Instagram, tag{" "}
                  <strong>@signifiya</strong> and{" "}
                  <strong>@phoenix_nipashree</strong>, then submit the link
                  before the deadline.
                </p>
                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 text-sm font-mono text-left w-full max-w-sm">
                  <p className="font-bold text-purple-700 mb-1">Prize 🏆</p>
                  <p>Cash Prize: ₹2,000</p>
                  <p>Feature on @signifiya Instagram</p>
                  <p>Collab with Adamas University page</p>
                </div>
                <Link href="/">
                  <Button className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-yellow-300 text-black font-bold">
                    RETURN HOME
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Rules banner */}
                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-3 text-xs text-purple-800 space-y-0.5">
                  <p className="font-bold">Rules at a glance</p>
                  <p>• 30-second reel · Theme: SIGNIFIYA 2026 · Posted on Instagram</p>
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

                {/* Leader Name */}
                <div>
                  <Label className={labelStyles}>
                    Team Leader Name <span className="text-red-500">*</span>
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

                {/* Contact Number */}
                <div>
                  <Label className={labelStyles}>
                    Team Leader Contact Number{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("leaderPhone")}
                    className={inputStyles}
                    placeholder="10-DIGIT MOBILE NUMBER"
                    inputMode="numeric"
                    maxLength={10}
                  />
                  {errors.leaderPhone && (
                    <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                      {errors.leaderPhone.message}
                    </p>
                  )}
                </div>

                {/* Institution Name */}
                <div>
                  <Label className={labelStyles}>
                    Institution Name <span className="text-red-500">*</span>
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

                {/* Department (optional) */}
                <div>
                  <Label className={labelStyles}>Department</Label>
                  <Input
                    {...register("department")}
                    className={inputStyles}
                    placeholder="e.g., CSE, MECHANICAL (optional)"
                  />
                </div>

                {/* Instagram ID */}
                <div>
                  <Label className={labelStyles}>
                    Instagram ID of Team Leader{" "}
                    <span className="text-red-500">*</span>
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

                {/* Reel Link (optional) */}
                <div>
                  <Label className={labelStyles}>
                    Link of the Reel{" "}
                    <span className="text-zinc-400 font-normal normal-case">
                      (optional — submit after posting)
                    </span>
                  </Label>
                  <Input
                    {...register("reelLink")}
                    className={inputStyles}
                    placeholder="https://www.instagram.com/reel/..."
                  />
                  {errors.reelLink && (
                    <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                      {errors.reelLink.message}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    You can register now and submit the reel link later via the
                    admin or by contacting coordinators.
                  </p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full border-2 border-black bg-purple-500 text-white font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting…" : "REGISTER NOW — FREE"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
