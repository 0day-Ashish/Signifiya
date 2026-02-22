"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localFont from "next/font/local";

const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
import EventCard from "@/components/Events-Pass";
import {
  createEventRazorpayOrder,
  verifyEventRazorpayPayment,
} from "@/app/actions";
import { APP_CONFIG } from "@/config/app.config";
import { getUserProfile } from "@/app/actions";
import RegistrationComingSoon from "@/components/RegistrationComingSoon";

const REGISTRATION_OPEN_DATE = new Date("2026-02-23T00:00:00");

// ... (Configuration Data remains the same) ...
const eventsList = [
  {
    id: "cpl",
    name: "Coding Premier League",
    price: 280,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-purple-100",
  },
  {
    id: "hack",
    name: `Hackathon ${APP_CONFIG.event.year}`,
    price: 300,
    type: "Team (2-4)",
    date: "March 27-28",
    color: "bg-yellow-100",
  },
  {
    id: "circuit",
    name: "Circuitronics",
    price: 299,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-yellow-100",
  },
  {
    id: "tower",
    name: "Tower Making",
    price: 280,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-blue-100",
  },
  {
    id: "refab",
    name: "RE-FAB (Waste to Wealth)",
    price: 280,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-green-100",
  },
  {
    id: "path",
    name: "Path Follower",
    price: 219,
    type: "Team (3)",
    date: "March 27-28",
    color: "bg-red-100",
  },
  {
    id: "design",
    name: "Dil Se Design",
    price: 219,
    type: "Team (3)",
    date: "March 27-28",
    color: "bg-pink-100",
  },
  {
    id: "bridge",
    name: "Bridge Building",
    price: 280,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-orange-100",
  },
  {
    id: "lathe",
    name: "Lathe War",
    price: 219,
    type: "Team (3)",
    date: "March 27-28",
    color: "bg-indigo-100",
  },
  {
    id: "robo",
    name: "Robo Terrain (Robo Soccer)",
    price: 219,
    type: "Team (3)",
    date: "March 27-28",
    color: "bg-teal-100",
  },
  {
    id: "dance",
    name: "Dance Battle",
    price: 200,
    type: "Solo/Group (1-7)",
    date: "March 27-28",
    color: "bg-fuchsia-100",
  },
  {
    id: "rap",
    name: "Rap Battle",
    price: 149,
    type: "Team (1-4)",
    date: "March 27-28",
    color: "bg-fuchsia-100",
  },
  {
    id: "gaming",
    name: "Valorant Tournament",
    price: 499,
    type: "Team (5)",
    date: "March 27-28",
    color: "bg-gray-100",
  },
  {
    id: "bgmi",
    name: "BGMI",
    price: 399,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-gray-100",
  },
  {
    id: "treasure",
    name: "Treasure Hunt",
    price: 300,
    type: "Team (3)",
    date: "March 27-28",
    color: "bg-gray-100",
  },
  {
    id: "arm",
    name: "Arm Wrestling",
    price: 100,
    type: "Solo",
    date: "March 27-28",
    color: "bg-gray-100",
  },
  {
    id: "freefire",
    name: "Free Fire",
    price: 399,
    type: "Team (4)",
    date: "March 27-28",
    color: "bg-gray-100",
  },
  {
    id: "efootball",
    name: "E-Football Tournament",
    price: 149,
    type: "Solo",
    date: "March 27-28",
    color: "bg-gray-100",
  },
  {
    id: "powerdeal",
    name: "Power Deal",
    price: 149,
    type: "Team (3)",
    date: "March 27-28",
    color: "bg-cyan-100",
  },
];

const formSchema = z.object({
  teamName: z.string().min(2, "Team Name is required"),
  leaderName: z.string().min(2, "Leader Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be 10 digits"),
  college: z.string().min(2, "Required"),
  bookingId: z
    .string()
    .min(1, "Enter your Booking ID")
    .regex(
      /^SGF26-[A-Z0-9]{8}$/,
      "Invalid Booking ID format. Must be SGF26-XXXXXXXX (8 alphanumeric characters)",
    ),
  selectedEvents: z.array(z.string()).min(1, "Select one event").max(1),
  members: z
    .array(
      z.object({
        name: z.string().optional(),
        college: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const inputStyles =
  "rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none";
const labelStyles =
  "text-black font-bold uppercase text-xs tracking-wider mb-1 block";

import { useRouter } from "next/navigation";

/** Returns the currently active event discount (if any) based on current time */
function getActiveEventDiscount() {
  const now = new Date();
  for (const d of APP_CONFIG.eventDiscounts) {
    const start = new Date(d.start);
    const end = new Date(start.getTime() + d.durationHours * 60 * 60 * 1000);
    if (now >= start && now < end) {
      return {
        discountPercent: d.discountPercent,
        label: d.label,
        endsAt: end,
      };
    }
  }
  return null;
}

/** Apply active discount to a price, returning { original, discounted, hasDiscount } */
function getDiscountedPrice(
  price: number,
  discount: ReturnType<typeof getActiveEventDiscount>,
) {
  if (!discount)
    return { original: price, discounted: price, hasDiscount: false };
  const discounted = Math.round(price * (1 - discount.discountPercent / 100));
  return { original: price, discounted, hasDiscount: true };
}

export default function EventRegistration() {
  const router = useRouter();
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();
  const eventListRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefillLoading, setIsPrefillLoading] = useState(false);
  const [isBookingIdPrefilled, setIsBookingIdPrefilled] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [utrId, setUtrId] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [activeDiscount, setActiveDiscount] =
    useState<ReturnType<typeof getActiveEventDiscount>>(null);
  const [discountTimeLeft, setDiscountTimeLeft] = useState("");
  const [createdEventPass, setCreatedEventPass] = useState<{
    teamLeadName: string;
    eventName: string;
    bookingId: string;
    teamName: string;
    eventTime: string;
    qrCode: string;
    members?: { name: string }[];
  } | null>(null);

  const {
    register,
    // REMOVED: handleSubmit (not needed for manual step navigation)
    trigger, // ADDED: trigger for manual partial validation
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingId: "",
      selectedEvents: [],
      members: [{ name: "", college: "", phone: "", email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const selectedEventIds = watch("selectedEvents");

  // Check for active discount and keep countdown
  useEffect(() => {
    const tick = () => {
      const d = getActiveEventDiscount();
      setActiveDiscount(d);
      if (d) {
        const diff = d.endsAt.getTime() - Date.now();
        if (diff <= 0) {
          setDiscountTimeLeft("");
          return;
        }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setDiscountTimeLeft(`${h > 0 ? `${h}h ` : ""}${m}m ${s}s`);
      } else {
        setDiscountTimeLeft("");
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const discount = getActiveEventDiscount();
    const total = selectedEventIds.reduce((sum, eventId) => {
      const event = eventsList.find((e) => e.id === eventId);
      if (!event) return sum;
      const { discounted } = getDiscountedPrice(event.price, discount);
      return sum + discounted;
    }, 0);
    setTotalCost(total);
  }, [selectedEventIds, activeDiscount]);

  useEffect(() => {
    const prefillFromDb = async () => {
      if (isSessionPending || !sessionData?.user?.id) return;
      setIsPrefillLoading(true);
      try {
        const userProfile: any = await getUserProfile(sessionData.user.id);
        if (!userProfile) return;

        if (userProfile.bookingId) {
          setValue("bookingId", userProfile.bookingId, {
            shouldValidate: true,
          });
          setIsBookingIdPrefilled(true);
        }
        if (userProfile.name) {
          setValue("leaderName", userProfile.name, { shouldValidate: true });
        } else if (sessionData.user.name) {
          setValue("leaderName", sessionData.user.name, {
            shouldValidate: true,
          });
        }
        if (sessionData.user.email) {
          setValue("email", sessionData.user.email, { shouldValidate: true });
        }
        if (userProfile.mobileNo) {
          setValue(
            "phone",
            String(userProfile.mobileNo).replace(/\D/g, "").slice(0, 10),
            {
              shouldValidate: true,
            },
          );
        }
        if (userProfile.collegeName) {
          setValue("college", userProfile.collegeName, {
            shouldValidate: true,
          });
        }
      } finally {
        setIsPrefillLoading(false);
      }
    };

    prefillFromDb();
  }, [sessionData, isSessionPending, setValue]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (step === 4 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // --- FIXED NAVIGATION HANDLERS ---

  const onSubmitStep1 = async () => {
    const isValid = await trigger([
      "teamName",
      "leaderName",
      "email",
      "phone",
      "college",
      "bookingId",
    ]);

    if (isValid) {
      setStep(2);
      toast.success("Leader details saved!");
    } else {
      toast.error("Please fill in all required fields.", {
        description: "Check the red highlighted fields.",
      });
    }
  };

  const onSubmitStep2 = async () => {
    // 1. Trigger validation ONLY for selectedEvents
    const isValid = await trigger("selectedEvents");

    if (isValid) {
      setStep(3);
    } else {
      toast.warning("No event selected!", {
        description: "You must choose one event to proceed.",
      });
    }
  };

  const onSubmitStep3 = async () => {
    // Optional: Validate members if you want strictly non-empty names
    const isValid = await trigger("members");
    if (isValid) {
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    if (!utrId || utrId.length < 4) {
      setPayError("Please enter a valid UTR ID");
      return;
    }

    setIsLoading(true);
    setPayError(null);
    const vals = watch();
    const eventId = vals.selectedEvents?.[0];
    const ev = eventsList.find((e) => e.id === eventId);

    try {
      const { submitEventRegistrationManual } = await import("@/app/actions");
      const res = await submitEventRegistrationManual({
        teamName: vals.teamName,
        leaderName: vals.leaderName,
        leaderEmail: vals.email,
        leaderPhone: vals.phone,
        college: vals.college,
        bookingId: vals.bookingId,
        eventName: ev?.name || "",
        eventPrice: ev?.price || 0,
        members: (vals.members || []).map((m) => ({
          name: m?.name,
          college: m?.college,
          phone: m?.phone,
          email: m?.email,
        })),
        totalAmount: totalCost,
        utrId: utrId.trim(),
      });

      if (!res.success) {
        setPayError(res.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setStep(5);
      toast.success("Registration Successful!", {
        description: "Verified manually by admin.",
      });
    } catch (error: any) {
      setPayError(error?.message || "Something went wrong.");
      setIsLoading(false);
    }
  };

  const toggleEvent = (id: string) => {
    const current = watch("selectedEvents");
    if (current.includes(id)) {
      setValue("selectedEvents", []);
    } else {
      setValue("selectedEvents", [id]);
    }
  };

  const handleEventListWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = eventListRef.current;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    el.scrollTop += e.deltaY;
  };

  if (new Date() < REGISTRATION_OPEN_DATE) {
    return <RegistrationComingSoon type="event" />;
  }

  return (
    <div className="bg-zinc-950 h-screen max-h-screen flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden">
      <div className="bg-white rounded-[2rem] w-full max-w-full h-full max-h-full overflow-hidden flex flex-col lg:flex-row min-h-[85vh]">
        <div className="flex-1 flex flex-col p-6 lg:p-10 relative overflow-hidden">
          <div className="flex flex-col mb-6">
            <Link
              href="/"
              className="inline-block w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-4"
            >
              ← RETURN HOME
            </Link>

            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-black leading-none uppercase">
              Event <span className="text-purple-600">Registration.</span>
            </h1>

            <div className="mt-8 w-full max-w-full h-6 border-2 border-black rounded-full p-1 bg-zinc-100 mb-2 overflow-hidden box-border">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${step * 25}%` }}
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
              <span className={step === 1 ? "text-black" : ""}>Leader</span>
              <span className={step === 2 ? "text-black" : ""}>Events</span>
              <span className={step === 3 ? "text-black" : ""}>Team</span>
              <span className={step === 4 ? "text-black" : ""}>Pay</span>
            </div>
          </div>

          <div
            className={`flex-1 pr-2 custom-scrollbar ${step === 2 ? "overflow-y-hidden" : "overflow-y-auto"}`}
          >
            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="bg-purple-100 border-2 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-bold text-xs uppercase">
                      Step 1/4: Team Leader Details
                    </p>
                  </div>

                  <div className="w-full">
                    <Label className={labelStyles}>Team Name</Label>
                    <Input
                      {...register("teamName")}
                      className={inputStyles}
                      placeholder="CODE WARRIORS"
                    />
                    {errors.teamName && (
                      <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                        {errors.teamName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <Label className={labelStyles}>Leader Name</Label>
                      <Input
                        {...register("leaderName")}
                        className={inputStyles}
                        placeholder="JANE DOE"
                      />
                      {errors.leaderName && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.leaderName.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <Label className={labelStyles}>College</Label>
                      <Input
                        {...register("college")}
                        className={inputStyles}
                        placeholder="ADAMAS UNIVERSITY"
                      />
                      {errors.college && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.college.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className={labelStyles}>Email</Label>
                      <Input
                        {...register("email")}
                        className={inputStyles}
                        placeholder="EMAIL@COLLEGE.EDU"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className={labelStyles}>Phone</Label>
                      <Input
                        {...register("phone")}
                        className={inputStyles}
                        placeholder="9876543210"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className={labelStyles}>Booking ID</Label>
                    <Input
                      {...register("bookingId")}
                      className={inputStyles}
                      placeholder="SGF26-XXXXXXXX"
                      readOnly={isBookingIdPrefilled}
                      onChange={(e) => {
                        if (isBookingIdPrefilled) return;
                        let value = e.target.value.toUpperCase();
                        // Remove any characters that aren't alphanumeric or hyphen
                        value = value.replace(/[^A-Z0-9-]/g, "");
                        // Ensure it starts with SGF26-
                        if (value && !value.startsWith("SGF26-")) {
                          if (value.startsWith("SGF26")) {
                            value = "SGF26-" + value.slice(5).replace(/-/g, "");
                          } else if (value.length <= 5) {
                            value =
                              "SGF26-" +
                              value.replace(/SGF26/g, "").replace(/-/g, "");
                          } else {
                            value =
                              "SGF26-" +
                              value
                                .replace(/SGF26-?/g, "")
                                .replace(/-/g, "")
                                .slice(0, 8);
                          }
                        }
                        // Limit to SGF26- + 8 characters
                        if (value.startsWith("SGF26-")) {
                          const suffix = value
                            .slice(6)
                            .replace(/-/g, "")
                            .slice(0, 8);
                          value = "SGF26-" + suffix;
                        }
                        setValue("bookingId", value, { shouldValidate: true });
                      }}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      {isPrefillLoading
                        ? "Loading Booking ID from database..."
                        : "Booking ID auto-fills from your profile. If missing, visit "}
                      {!isPrefillLoading && (
                        <>
                          <Link
                            href="/profile"
                            className="underline font-semibold text-zinc-700"
                          >
                            Profile
                          </Link>
                          {" and complete your details."}
                        </>
                      )}
                    </p>
                    {errors.bookingId && (
                      <p className="text-red-500 text-xs font-bold mt-1 bg-red-50 p-1 border border-red-200 inline-block">
                        {errors.bookingId.message}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={onSubmitStep1}
                    className="w-full bg-black text-white font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-[2px_2px_0px_0px_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mt-4"
                  >
                    NEXT: SELECT EVENT →
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                  onWheelCapture={handleEventListWheel}
                >
                  <p className="font-bold text-xs uppercase text-zinc-500">
                    Step 2/4: Select Event
                  </p>
                  {activeDiscount && (
                    <div className="bg-green-100 border-2 border-green-600 rounded-xl p-3 flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <span className="font-black text-green-800 text-sm uppercase">
                          {activeDiscount.label}
                        </span>
                      </div>
                      {discountTimeLeft && (
                        <span className="font-mono font-bold text-green-700 text-xs bg-green-200 px-2 py-1 rounded-lg">
                          Ends in {discountTimeLeft}
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    ref={eventListRef}
                    className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                  >
                    {eventsList.map((ev) => {
                      const isSelected = selectedEventIds.includes(ev.id);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => toggleEvent(ev.id)}
                          className={`cursor-none border-2 p-4 rounded-xl transition-all relative overflow-hidden ${
                            isSelected
                              ? "border-black bg-[#deb3fa] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                              : "border-zinc-300 bg-white hover:border-zinc-400"
                          }`}
                        >
                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <h3
                                className={`font-black text-lg uppercase ${isSelected ? "text-black" : "text-zinc-400"}`}
                              >
                                {ev.name}
                              </h3>
                              <p
                                className={`text-xs font-bold mt-1 ${isSelected ? "text-black/70" : "text-zinc-300"}`}
                              >
                                {ev.date}
                              </p>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs font-bold border-2 ${isSelected ? "bg-black text-white border-black" : "bg-zinc-100 text-zinc-400 border-zinc-200"}`}
                            >
                              {(() => {
                                const { original, discounted, hasDiscount } =
                                  getDiscountedPrice(ev.price, activeDiscount);
                                return hasDiscount ? (
                                  <span className="flex items-center gap-1">
                                    <span className="line-through opacity-60">
                                      ₹{original}
                                    </span>
                                    <span className="text-green-500">
                                      ₹{discounted}
                                    </span>
                                  </span>
                                ) : (
                                  <span>₹{original}</span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 bg-white border-2 border-black font-bold py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={onSubmitStep2}
                      className="flex-[2] bg-black text-white font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-[2px_2px_0px_0px_#a855f7] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      NEXT: ADD TEAM →
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="font-bold text-xs uppercase text-zinc-500">
                    Step 3/4: Add Team Members (Optional)
                  </p>

                  <div className="bg-amber-100 border-2 border-amber-400 p-3 rounded-xl mb-4">
                    <p className="text-amber-800 text-xs font-bold">
                      {" "}
                      Note: Team leader is automatically included. Add other
                      members here.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
                      >
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500 border-2 border-black rounded-full text-white hover:bg-red-600 transition-colors z-10"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        <h4 className="font-bold text-xs uppercase mb-3 text-zinc-400">
                          Member {index + 1}
                        </h4>
                        <div className="grid gap-3">
                          <Input
                            {...register(`members.${index}.name`)}
                            className={inputStyles}
                            placeholder="Name"
                          />
                          <Input
                            {...register(`members.${index}.college`)}
                            className={inputStyles}
                            placeholder="College"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              {...register(`members.${index}.email`)}
                              className={inputStyles}
                              placeholder="Email"
                            />
                            <Input
                              {...register(`members.${index}.phone`)}
                              className={inputStyles}
                              placeholder="Phone"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={() =>
                      append({ name: "", college: "", email: "", phone: "" })
                    }
                    className="w-full bg-white text-black font-bold py-4 rounded-xl border-2 border-dashed border-zinc-400 hover:border-black hover:bg-zinc-50 transition-all uppercase"
                  >
                    + Add Member
                  </Button>

                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1 bg-white border-2 border-black font-bold py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={() => setStep(4)} // To Payment
                      className="flex-[2] bg-black text-white font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-[2px_2px_0px_0px_#a855f7] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      NEXT: PAYMENT →
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-red-100 border-2 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                    <p className="font-bold text-xs uppercase">
                      Step 4/4: Secure Payment
                    </p>
                    <p className="text-red-600 font-bold text-xs animate-pulse">
                      EXP: {formatTime(timeLeft)}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-4 rounded-xl font-mono text-sm relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                    <h3 className="text-center font-bold border-b-2 border-dashed border-black pb-2 mb-2">
                      RECEIPT SUMMARY
                    </h3>
                    {selectedEventIds.map((id) => {
                      const ev = eventsList.find((e) => e.id === id);
                      if (!ev) return null;
                      const { original, discounted, hasDiscount } =
                        getDiscountedPrice(ev.price, activeDiscount);
                      return (
                        <div key={id} className="flex justify-between mb-1">
                          <span>{ev.name}</span>
                          {hasDiscount ? (
                            <span className="flex items-center gap-1">
                              <span className="line-through opacity-50">
                                ₹{original}
                              </span>
                              <span className="text-green-600 font-bold">
                                ₹{discounted}
                              </span>
                            </span>
                          ) : (
                            <span>₹{ev.price}</span>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-between border-t-2 border-black pt-2 mt-2 font-black text-lg">
                      <span>TOTAL</span>
                      {activeDiscount ? (
                        <span className="flex items-center gap-2">
                          <span className="line-through opacity-40 text-sm">
                            ₹
                            {selectedEventIds.reduce(
                              (s, id) =>
                                s +
                                (eventsList.find((e) => e.id === id)?.price ||
                                  0),
                              0,
                            )}
                          </span>
                          <span className="text-green-600">₹{totalCost}</span>
                        </span>
                      ) : (
                        <span>₹{totalCost}</span>
                      )}
                    </div>
                    {activeDiscount && (
                      <p className="text-[10px] text-green-600 font-bold text-right mt-1">
                        {activeDiscount.label} applied!
                      </p>
                    )}
                  </div>

                  {payError && (
                    <div className="bg-red-100 border-2 border-red-600 p-3 rounded-xl">
                      <p className="text-red-600 font-bold text-sm">
                        {payError}
                      </p>
                    </div>
                  )}

                  <div className="bg-zinc-100 border-2 border-black p-4 rounded-xl text-center">
                    <p className="font-bold text-sm text-zinc-700 mb-2">
                      Total Amount:{" "}
                      {activeDiscount ? (
                        <>
                          <span className="line-through opacity-40">
                            ₹
                            {selectedEventIds.reduce(
                              (s, id) =>
                                s +
                                (eventsList.find((e) => e.id === id)?.price ||
                                  0),
                              0,
                            )}
                          </span>{" "}
                          <span className="text-green-600">₹{totalCost}</span>
                        </>
                      ) : (
                        <>₹{totalCost}</>
                      )}
                    </p>

                    <div className="relative w-48 h-48 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 bg-white">
                      <Image
                        src="/qrcode.png"
                        alt="Payment QR Code"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <p className="text-xs font-bold text-zinc-600">
                      Scan to pay via UPI
                    </p>
                  </div>

                  <div>
                    <Label className={labelStyles}>
                      Enter Transaction / UTR ID
                    </Label>
                    <Input
                      value={utrId}
                      onChange={(e) => setUtrId(e.target.value)}
                      className={inputStyles}
                      placeholder="Enter 12-digit UTR ID"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Usually starts with banking ref no. or 'UPI...'
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep(3)}
                      variant="outline"
                      className="flex-1 bg-white border-2 border-black font-bold py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={handleFinalSubmit}
                      disabled={isLoading || !utrId || utrId.length < 4}
                      className="flex-[2] bg-green-500 text-black font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-60"
                    >
                      {isLoading ? "VERIFYING…" : "SUBMIT PAYMENT DETAILS →"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="bg-[#4caf50] text-white p-6 rounded-4xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2
                      className={`text-4xl font-black uppercase mb-2 ${gilton.className}`}
                    >
                      Registration Successful!
                    </h2>
                    <p className="font-medium text-white/90">
                      Your team registration is pending verification.
                    </p>
                    <p className="text-sm mt-2 opacity-80">
                      Check your profile for the event pass once approved.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
                    <Button
                      onClick={() => router.push("/profile")}
                      className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-none hover:translate-y-[2px]"
                    >
                      GO TO PROFILE
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="w-full sm:w-auto bg-white px-8 py-4 rounded-xl font-bold border-2 border-black"
                    >
                      REGISTER ANOTHER
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT SIDE: VISUALS (Unchanged) --- */}
        <div className="hidden lg:flex flex-1 bg-teal-100 relative items-center justify-center border-l-4 border-black p-8 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 border-4 border-black rounded-none rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-orange-500 border-4 border-black rounded-full animate-bounce shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10"></div>
          <div className="relative w-[420px] h-[580px] bg-white border-4 border-black rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] flex flex-col overflow-hidden group">
            <div className="h-2/3 bg-zinc-900 relative border-b-4 border-black overflow-hidden">
              <Image
                src="/event-reg-bg.jpg"
                alt="Event"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-mono text-xs text-green-400">
                  /// TEAM_ACCESS_GRANTED
                </p>
                <h2 className="text-3xl font-black tracking-tighter">
                  BUILD.
                  <br />
                  BREAK.
                  <br />
                  CREATE.
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
                  {APP_CONFIG.event.fullName}
                </p>
                <p className="text-sm text-zinc-600">
                  Secure your spot in the ultimate tech showdown. Limited slots
                  available.
                </p>
              </div>
              <div className="flex gap-2 relative z-10">
                <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded">
                  TECH
                </span>
                <span className="px-3 py-1 bg-white border-2 border-black text-black text-xs font-bold rounded">
                  FUN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
