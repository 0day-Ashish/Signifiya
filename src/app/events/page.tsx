"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropzone, DropzoneContent } from "@/components/ui/dropzone";
import EventCard from "@/components/Events-Pass";
import { registerEventTeam } from "@/app/actions";

// ... (Configuration Data remains the same) ...
const eventsList = [
  {
    id: "cpl",
    name: "Coding Premier League",
    price: 150,
    type: "Team (1-3)",
    color: "bg-purple-100",
  },
  {
    id: "hack",
    name: "Hackathon 2026",
    price: 300,
    type: "Team (2-4)",
    color: "bg-yellow-100",
  },
  {
    id: "robo",
    name: "Robo Wars",
    price: 200,
    type: "Team (2-5)",
    color: "bg-red-100",
  },
  {
    id: "design",
    name: "Dil Se Design",
    price: 100,
    type: "Solo",
    color: "bg-blue-100",
  },
  {
    id: "gaming",
    name: "Valorant Tournament",
    price: 500,
    type: "Team (5)",
    color: "bg-green-100",
  },
  {
    id: "quiz",
    name: "Tech Quiz",
    price: 50,
    type: "Team (2)",
    color: "bg-orange-100",
  },
];

const formSchema = z.object({
  teamName: z.string().min(2, "Team Name is required"),
  leaderName: z.string().min(2, "Leader Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be 10 digits"),
  college: z.string().min(2, "Required"),
  bookingId: z.string().min(8, "Enter your Booking ID").max(20),
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

export default function EventRegistration() {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(900);
  const [files, setFiles] = useState<File[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
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

  useEffect(() => {
    const total = selectedEventIds.reduce((sum, eventId) => {
      const event = eventsList.find((e) => e.id === eventId);
      return sum + (event ? event.price : 0);
    }, 0);
    setTotalCost(total);
  }, [selectedEventIds]);

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
    if (!files || files.length === 0) {
      toast.error("Payment proof missing!", {
        description: "Please upload a screenshot of your payment.",
      });
      return;
    }
    setIsLoading(true);
    const vals = watch();
    const eventId = vals.selectedEvents?.[0];
    const ev = eventsList.find((e) => e.id === eventId);
    const res = await registerEventTeam({
      teamName: vals.teamName,
      leaderName: vals.leaderName,
      leaderEmail: vals.email,
      leaderPhone: vals.phone,
      college: vals.college,
      bookingId: vals.bookingId,
      eventName: ev?.name || "",
      eventPrice: ev?.price || 0,
      members: (vals.members || []).map((m) => ({ name: m?.name, college: m?.college, phone: m?.phone, email: m?.email })),
      totalAmount: totalCost,
      paymentProofUrl: null,
    });
    setIsLoading(false);
    if (!res.success) {
      toast.error(res.error || "Registration failed.");
      return;
    }
    if (res.pass) setCreatedEventPass(res.pass);
    setStep(5);
    toast.success("Registration Successful!", { description: "Welcome to Signifiya 2026." });
  };

  const toggleEvent = (id: string) => {
    const current = watch("selectedEvents");
    if (current.includes(id)) {
      setValue("selectedEvents", []);
    } else {
      setValue("selectedEvents", [id]);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans overflow-x-hidden">
      <div className="bg-white rounded-[2rem] w-full max-w-full overflow-hidden flex flex-col lg:flex-row min-h-[85vh]">
        <div className="flex-1 flex flex-col p-6 lg:p-10 relative">
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

            <div className="mt-8 w-full h-6 border-2 border-black rounded-full p-1 bg-zinc-100 mb-2">
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

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              {/* --- STEP 1: LEADER INFO --- */}
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
                    />
                    <p className="text-xs text-zinc-500 mt-1">Find it in <Link href="/profile" className="underline font-semibold text-zinc-700">Profile</Link>. Sign in and visit Profile first if you don&apos;t have one.</p>
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

              {/* --- STEP 2: EVENT SELECTION --- */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-yellow-100 border-2 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                    <p className="font-bold text-xs uppercase">
                      Step 2/4: Choose Your Battles
                    </p>
                    <p className="font-black text-sm">TOTAL: ₹{totalCost}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eventsList.map((event) => {
                      const isSelected = selectedEventIds.includes(event.id);
                      const isDisabled = selectedEventIds.length >= 1 && !isSelected;
                      return (
                        <div
                          key={event.id}
                          onClick={() => !isDisabled && toggleEvent(event.id)}
                          className={`
                                    relative p-4 rounded-xl border-2 border-black transition-all duration-200
                                    ${isDisabled ? "cursor-not-allowed opacity-50 bg-zinc-100" : "cursor-pointer"}
                                    ${isSelected ? `${event.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0` : isDisabled ? "" : "bg-white hover:bg-zinc-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"}
                                `}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div
                              className={`w-5 h-5 border-2 border-black rounded flex items-center justify-center ${isSelected ? "bg-black" : "bg-white"}`}
                            >
                              {isSelected && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                            <span className="font-mono text-xs font-bold bg-white border border-black px-2 py-0.5 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              ₹{event.price}
                            </span>
                          </div>
                          <h3 className="font-black text-lg leading-tight uppercase">
                            {event.name}
                          </h3>
                          <p className="text-xs font-medium text-zinc-600 mt-1">
                            {event.type}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {errors.selectedEvents && (
                    <p className="text-red-500 font-bold text-center bg-red-100 border border-red-500 p-2 rounded">
                      {errors.selectedEvents.message}
                    </p>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 bg-white border-2 border-black font-bold py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      BACK
                    </Button>
                    {/* UPDATED: Manual Submission */}
                    <Button
                      onClick={onSubmitStep2}
                      className="flex-2 bg-black text-white font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#eab308] hover:shadow-[2px_2px_0px_0px_#eab308] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      NEXT: TEAM DETAILS →
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 3 & 4 remain mostly the same, ensuring buttons use onClick={onSubmitStepX} --- */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  {/* ... (UI matches Step 3 provided previously) ... */}
                  <div className="bg-blue-100 border-2 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-bold text-xs uppercase">
                      Step 3/4: Add Team Members
                    </p>
                  </div>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 bg-zinc-50 border-2 border-black rounded-xl relative group"
                      >
                        <div className="absolute -top-3 left-4 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                          MEMBER {index + 1}
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute -top-3 -right-2 bg-red-500 text-white w-6 h-6 rounded-full border-2 border-black flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110"
                          >
                            ×
                          </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className={labelStyles}>Full Name</Label>
                            <Input
                              {...register(`members.${index}.name` as const)}
                              className={inputStyles}
                              placeholder="Name"
                            />
                            {errors.members?.[index]?.name && (
                              <p className="text-red-500 text-xs font-bold mt-1">{errors.members[index]?.name?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className={labelStyles}>College Name</Label>
                            <Input
                              {...register(`members.${index}.college` as const)}
                              className={inputStyles}
                              placeholder="College"
                            />
                            {errors.members?.[index]?.college && (
                              <p className="text-red-500 text-xs font-bold mt-1">{errors.members[index]?.college?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className={labelStyles}>Phone</Label>
                            <Input
                              {...register(`members.${index}.phone` as const)}
                              className={inputStyles}
                              placeholder="9876543210"
                            />
                            {errors.members?.[index]?.phone && (
                              <p className="text-red-500 text-xs font-bold mt-1">{errors.members[index]?.phone?.message}</p>
                            )}
                          </div>
                          <div>
                            <Label className={labelStyles}>Email</Label>
                            <Input
                              {...register(`members.${index}.email` as const)}
                              type="email"
                              className={inputStyles}
                              placeholder="email@example.com"
                            />
                            {errors.members?.[index]?.email && (
                              <p className="text-red-500 text-xs font-bold mt-1">{errors.members[index]?.email?.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ name: "", college: "", phone: "", email: "" })}
                    className="w-full py-3 border-2 border-dashed border-black rounded-xl font-bold uppercase text-zinc-500 hover:bg-zinc-100 hover:text-black transition-colors"
                  >
                    + Add Another Member
                  </button>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1 bg-white border-2 border-black font-bold py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={onSubmitStep3}
                      className="flex-[2] bg-black text-white font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#3b82f6] hover:shadow-[2px_2px_0px_0px_#3b82f6] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      PROCEED TO PAY →
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
                  {/* Receipt Summary */}
                  <div className="bg-white border-2 border-black p-4 rounded-xl font-mono text-sm relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                    <h3 className="text-center font-bold border-b-2 border-dashed border-black pb-2 mb-2">
                      RECEIPT SUMMARY
                    </h3>
                    {selectedEventIds.map((id) => {
                      const ev = eventsList.find((e) => e.id === id);
                      return (
                        <div key={id} className="flex justify-between mb-1">
                          <span>{ev?.name}</span>
                          <span>₹{ev?.price}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between border-t-2 border-black pt-2 mt-2 font-black text-lg">
                      <span>TOTAL</span>
                      <span>₹{totalCost}</span>
                    </div>
                  </div>
                  {/* QR and Upload */}
                  <div className="border-4 border-black p-4 rounded-2xl bg-zinc-50 flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-bold mb-2 uppercase">Scan UPI QR</p>
                    <div className="bg-white p-2 border-2 border-black rounded-lg mb-4">
                      <Image src="/qr.svg" alt="QR" width={150} height={150} />
                    </div>
                    <Dropzone
                      onDrop={(f) => {
                        setFiles(f);
                        toast.success("Screenshot uploaded!");
                      }}
                    >
                      <div className="w-full border-2 border-dashed border-zinc-400 p-4 rounded-lg text-center cursor-pointer hover:bg-white hover:border-black transition-all">
                        <p className="font-bold text-xs text-zinc-600">
                          UPLOAD SCREENSHOT
                        </p>
                      </div>
                      <DropzoneContent />
                    </Dropzone>
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
                      disabled={isLoading}
                      className="flex-[2] bg-green-500 text-black font-bold py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      {isLoading ? "VERIFYING..." : "CONFIRM & REGISTER"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-6 py-6"
                >
                  <div className="w-20 h-20 bg-green-400 border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase">Registration Successful!</h2>
                  {createdEventPass && (
                    <div className="w-full max-w-[400px]">
                      <EventCard
                        teamLeadName={createdEventPass.teamLeadName}
                        eventName={createdEventPass.eventName}
                        bookingId={createdEventPass.bookingId}
                        teamName={createdEventPass.teamName}
                        eventTime={createdEventPass.eventTime}
                        qrCode={createdEventPass.qrCode}
                        members={createdEventPass.members}
                        embedded
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="mt-4 bg-black text-white font-bold px-8 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-1 transition-all"
                  >
                    BACK TO HOME
                  </Button>
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
                  Signifiya 2026
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
