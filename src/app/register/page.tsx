"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions";
import { getUserProfile } from "@/app/actions";

import VisitorCard from "@/components/Visitors-Pass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { APP_CONFIG } from "@/config/app.config";

const PASS_AMOUNTS = { single: APP_CONFIG.passPrices.single, dual: APP_CONFIG.passPrices.dual };
const PASS_LABELS = { single: APP_CONFIG.passTypeLabels.single, dual: APP_CONFIG.passTypeLabels.dual };

const formSchema = z.object({
  bookingId: z
    .string()
    .min(1, "Enter your Booking ID")
    .regex(/^SGF26-[A-Z0-9]{8}$/, "Invalid Booking ID format. Must be SGF26-XXXXXXXX (8 alphanumeric characters)"),
  passType: z.enum(["single", "dual"]),
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be 10 digits"),
  college: z.string().min(2, "Required"),
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(1, "Select state"),
  country: z.string().min(1, "Select country"),
  agreement: z.boolean().refine((val) => val === true, "Must accept terms"),
});

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [utrId, setUtrId] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPrefillLoading, setIsPrefillLoading] = useState(false);
  const [isBookingIdPrefilled, setIsBookingIdPrefilled] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in?callbackUrl=/register");
    }
  }, [session, isPending, router]);

  // Debugging session state
  console.log("Register Page - Session:", session, "IsPending:", isPending);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { agreement: false, bookingId: "", passType: "single" },
  });

  useEffect(() => {
    const prefillFromDb = async () => {
      if (isPending || !session?.user?.id) return;
      setIsPrefillLoading(true);
      try {
        const userProfile: any = await getUserProfile(session.user.id);
        const fullName = (userProfile?.name || session.user.name || "").trim();
        const [firstName = "", ...rest] = fullName.split(/\s+/);
        const lastName = rest.join(" ");

        if (userProfile?.bookingId) {
          setValue("bookingId", userProfile.bookingId, { shouldValidate: true });
          setIsBookingIdPrefilled(true);
        }
        if (firstName) {
          setValue("firstName", firstName, { shouldValidate: true });
        }
        if (lastName) {
          setValue("lastName", lastName, { shouldValidate: true });
        }
        if (session.user.email) {
          setValue("email", session.user.email, { shouldValidate: true });
        }
        if (userProfile?.mobileNo) {
          setValue("phone", String(userProfile.mobileNo).replace(/\D/g, "").slice(0, 10), {
            shouldValidate: true,
          });
        }
        if (userProfile?.collegeName) {
          setValue("college", userProfile.collegeName, { shouldValidate: true });
        }
      } finally {
        setIsPrefillLoading(false);
      }
    };

    prefillFromDb();
  }, [session, isPending, setValue]);
  
  // NOTE: isPending check MUST be AFTER hooks like useForm to avoid Render Error
  if (isPending) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-zinc-950">
         <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
  }

  const onSubmit = (data: FormData) => {
    setStep(2);
  };

  const calculateTotal = () => {
    const type = watch("passType") || "single";
    return PASS_AMOUNTS[type];
  };

  const handleConfirmRegister = async () => {
    const values = watch();
    if (!utrId || utrId.trim().length < 4) {
      setPayError("Please enter a valid Transaction ID / UTR.");
      return;
    }

    if (!session?.user?.id) {
      window.location.href = "/sign-in?callbackUrl=/register";
      return;
    }

    setPayError(null);
    setIsLoading(true);

    try {
      const { submitVisitorRegistration } = await import("@/app/actions");
      const res = await submitVisitorRegistration({
        bookingId: values.bookingId.trim(),
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        college: values.college,
        passType: values.passType || "single",
        sessionUserId: session.user.id,
        utrId: utrId.trim(),
      });

      if (!res.success) {
        setPayError(res.error || "Submission failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success
      setShowConfetti(true);
      setStep(3);
      setIsLoading(false);
    } catch (error: any) {
      setPayError(error?.message || "Something went wrong.");
      setIsLoading(false);
    }
  };

  // Neo-Brutalist Input Styles helper
  const inputStyles =
    "rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none";
  const labelStyles =
    "text-black font-bold uppercase text-xs tracking-wider mb-1 block";

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans overflow-x-hidden">
      {/* Main Card Container */}
      <div className="bg-white rounded-[2rem] w-full  border-4 border-black shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] overflow-hidden flex flex-col lg:flex-row min-h-[85vh]">
        {/* --- LEFT SIDE: FORM --- */}
        <div className="flex-1 flex flex-col p-6 lg:p-10 relative">
          {/* Header */}
          <div className="flex flex-col mb-8">
            <Link
              href="/"
              className="inline-block w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-6"
            >
              ← RETURN HOME
            </Link>

            <h1 className="text-3xl lg:text-6xl font-black tracking-tighter text-black leading-none uppercase">
              Visitor <br />{" "}
              <span className="text-purple-600">Registration.</span>
            </h1>

            {/* Retro Progress Bar */}
            <div className="mt-8 w-full h-6 border-2 border-black rounded-full p-1 bg-zinc-100">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                }}
                className="h-full bg-black rounded-full transition-all duration-500 ease-in-out relative"
              >
                {/* Striped Pattern Overlay */}
                <div
                  className="absolute inset-0 w-full h-full opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px)",
                  }}
                ></div>
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 font-mono text-xs font-bold">
              <span>DETAILS</span>
              <span>PAYMENT</span>
              <span>DONE</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Details Form */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className="bg-blue-100 border-2 border-black p-4 rounded-xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-bold text-sm">
                    👋 HEY THERE! FILL IN YOUR DETAILS TO GET STARTED.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label className={labelStyles}>Your Booking ID</Label>
                    <Input
                      {...register("bookingId")}
                      className={inputStyles}
                      placeholder="SGF26-XXXXXXXX"
                      readOnly={isBookingIdPrefilled}
                      onChange={(e) => {
                        if (isBookingIdPrefilled) return;
                        let value = e.target.value.toUpperCase();
                        // Remove any characters that aren't alphanumeric or hyphen
                        value = value.replace(/[^A-Z0-9-]/g, '');
                        // Ensure it starts with SGF26-
                        if (value && !value.startsWith('SGF26-')) {
                          if (value.startsWith('SGF26')) {
                            value = 'SGF26-' + value.slice(5).replace(/-/g, '');
                          } else if (value.length <= 5) {
                            value = 'SGF26-' + value.replace(/SGF26/g, '').replace(/-/g, '');
                          } else {
                            value = 'SGF26-' + value.replace(/SGF26-?/g, '').replace(/-/g, '').slice(0, 8);
                          }
                        }
                        // Limit to SGF26- + 8 characters
                        if (value.startsWith('SGF26-')) {
                          const suffix = value.slice(6).replace(/-/g, '').slice(0, 8);
                          value = 'SGF26-' + suffix;
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
                          <Link href="/profile" className="underline font-semibold text-zinc-700">Profile</Link>
                          {" and complete your details."}
                        </>
                      )}
                    </p>
                    {errors.bookingId && (
                      <p className="text-red-600 font-bold text-xs mt-1 bg-red-100 inline-block px-1 border border-red-600">
                        {errors.bookingId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className={labelStyles}>Select pass</Label>
                    <Select value={watch("passType") ?? "single"} onValueChange={(v) => setValue("passType", v as "single" | "dual")}>
                      <SelectTrigger className={inputStyles}>
                        <SelectValue placeholder="Select pass" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <SelectItem value="single">{APP_CONFIG.passTypeLabels.single} — ₹{APP_CONFIG.passPrices.single}</SelectItem>
                        <SelectItem value="dual">{APP_CONFIG.passTypeLabels.dual} — ₹{APP_CONFIG.passPrices.dual}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.passType && (
                      <p className="text-red-600 font-bold text-xs mt-1 bg-red-100 inline-block px-1 border border-red-600">
                        {errors.passType.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <Label className={labelStyles}>First Name</Label>
                      <Input
                        {...register("firstName")}
                        className={inputStyles}
                        placeholder="JOHN"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 font-bold text-xs mt-1 bg-red-100 inline-block px-1 border border-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <Label className={labelStyles}>Last Name</Label>
                      <Input
                        {...register("lastName")}
                        className={inputStyles}
                        placeholder="DOE"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className={labelStyles}>Email Address</Label>
                      <Input
                        {...register("email")}
                        type="email"
                        className={inputStyles}
                        placeholder="JOHN@EXAMPLE.COM"
                      />
                    </div>
                    <div>
                      <Label className={labelStyles}>Phone Number</Label>
                      <Input
                        {...register("phone")}
                        className={inputStyles}
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className={labelStyles}>College Name</Label>
                    <Input
                      {...register("college")}
                      className={inputStyles}
                      placeholder="INSTITUTE OF TECHNOLOGY"
                    />
                  </div>

                  <div>
                    <Label className={labelStyles}>Address</Label>
                    <Input
                      {...register("address")}
                      className={inputStyles}
                      placeholder="STREET, AREA"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <Label className={labelStyles}>City</Label>
                      <Input
                        {...register("city")}
                        className={inputStyles}
                        placeholder="CITY"
                      />
                    </div>

                    <div className="w-full flex gap-4 flex-1">
                      <div className="flex-1">
                        <Label className={labelStyles}>State</Label>
                        <Select onValueChange={(v) => setValue("state", v)}>
                          <SelectTrigger className={inputStyles}>
                            <SelectValue placeholder="SELECT" />
                          </SelectTrigger>
                          <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <SelectItem value="WB">WEST BENGAL</SelectItem>
                            <SelectItem value="OT">OTHER</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label className={labelStyles}>Country</Label>
                        <Select onValueChange={(v) => setValue("country", v)}>
                          <SelectTrigger className={inputStyles}>
                            <SelectValue placeholder="SELECT" />
                          </SelectTrigger>
                          <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <SelectItem value="IN">INDIA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center space-x-3 bg-zinc-50 p-3 rounded-lg border-2 border-dashed border-zinc-300 cursor-pointer">
                    <Checkbox
                      id="terms"
                      checked={watch("agreement")}
                      onCheckedChange={(v) => setValue("agreement", v === true)}
                      className="border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white w-5 h-5 rounded-md cursor-pointer"
                    />
                    <span className="text-zinc-700 font-bold text-xs uppercase select-none">
                      I accept the terms and conditions
                    </span>
                  </label>

                  <Button
                    type="submit"
                    className="w-full bg-black text-white font-black text-lg py-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_#8b5cf6] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#8b5cf6] hover:bg-zinc-900 transition-all active:shadow-none"
                  >
                    CONTINUE TO PAYMENT →
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: QR Code and UTR */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <button
                  onClick={() => setStep(1)}
                  className="text-zinc-500 font-bold text-xs uppercase hover:text-black mb-4 flex items-center gap-1"
                >
                  ← Edit Details
                </button>

                <div className="bg-zinc-100 border-2 border-black p-4 rounded-xl mb-6">
                  <p className="font-bold text-sm text-zinc-700">
                    PAYING FOR: {PASS_LABELS[watch("passType") || "single"]}
                  </p>
                  <p className="text-3xl font-black text-black mt-1">₹{calculateTotal()}</p>
                </div>

                <div className="flex flex-col items-center mb-6">
                   <div className="relative w-48 h-48 border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
                     <Image src="/qr.jpeg" alt="Payment QR Code" fill className="object-contain p-2" />
                   </div>
                   <p className="text-sm font-bold text-center text-zinc-600 max-w-xs">
                     Scan this QR code with any UPI app to pay.
                   </p>
                </div>

                <div className="space-y-4">
                   <div>
                     <Label className={labelStyles}>Enter Transaction / UTR ID</Label>
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

                   {!session?.user && (
                     <div className="bg-amber-100 border-2 border-amber-600 p-4 rounded-xl mb-4">
                       <p className="font-bold text-sm text-amber-900">Sign in required.</p>
                       <p className="text-xs text-amber-800 mt-1">Sign in to complete registration.</p>
                       <Link href="/sign-in?callbackUrl=/register" className="inline-block mt-2 text-sm font-bold text-amber-900 underline">Sign in →</Link>
                     </div>
                   )}

                   {payError && <p className="text-red-600 font-bold text-sm bg-red-50 p-2 border-l-4 border-red-600">{payError}</p>}

                   <Button
                     className="w-full bg-green-500 text-black font-black text-lg py-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 transition-all active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                     disabled={isLoading || !session?.user || !utrId}
                     onClick={handleConfirmRegister}
                   >
                     {isLoading ? "SUBMITTING..." : "SUBMIT PAYMENT DETAILS →"}
                   </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center text-center h-full"
              >
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50"></div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="relative w-28 h-28 bg-green-400 border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <span className="text-5xl">🎉</span>
                  </motion.div>
                </div>

                <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tighter mb-4 uppercase">
                  Thank You!
                </h2>

                <p className="text-zinc-800 font-bold text-lg mb-6 max-w-md mx-auto leading-relaxed">
                  Thank You for Registering. We will review and send your pass to your email soon.
                  <span className="block mt-2 text-zinc-600 font-medium text-base">
                    You can also check your <Link href="/profile" className="underline font-bold text-black">Profile</Link> section for ticket status.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-4">
                  <Link
                    href="/"
                    className="flex-1 bg-black text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-800 transition-all text-center"
                  >
                    RETURN HOME
                  </Link>
                  <Link
                    href="/profile"
                    className="flex-1 bg-white text-black font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50 transition-all text-center"
                  >
                    GO TO PROFILE
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT SIDE: VISUAL --- */}
        <div className="hidden lg:flex flex-1 bg-purple-100 relative items-center justify-center border-l-4 border-black p-8">
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center font-black text-2xl animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
            ★
          </div>

          {/* Image Frame */}
          <div className="relative w-[400px] h-[500px] bg-white p-4 border-4 border-black rounded-xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="relative w-full h-[85%] border-2 border-black rounded bg-zinc-800 overflow-hidden">
              <Image
                src="/portal.jpg"
                alt="Registration Visual"
                fill
                className="object-cover opacity-90 hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="h-[15%] flex items-center justify-between px-2 pt-2">
              <span className="font-black text-xl tracking-tighter">
                SIGNIFIYA'26
              </span>
              <span className="font-mono text-xs bg-black text-white px-2 py-1 rounded">
                EST. 2021
              </span>
            </div>
            {/* Tape Effect */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-red-500/80 rotate-1 border-l-2 border-r-2 border-transparent opacity-80 backdrop-blur-sm"></div>
          </div>

          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
