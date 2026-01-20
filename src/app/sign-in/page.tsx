"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import Link from "next/link";

const softura = localFont({ src: "../../../public/fonts/Softura-Demo.otf" });
const gilton = localFont({ src: "../../../public/fonts/GiltonRegular.otf" });

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await authClient.signUp.email({
          email,
          password,
          name,
        }, {
          onSuccess: () => {
             router.push("/");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          }
        });
      } else {
        await authClient.signIn.email({
          email,
          password,
        }, {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#deb3fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
            <Link href="/" className={`text-black font-bold hover:underline ${softura.className}`}>← Back</Link>
            <h1 className={`${gilton.className} text-4xl text-black text-center`}>
            {isSignUp ? "Sign Up" : "Sign In"}
            </h1>
            <div className="w-10"></div> {/* Spacer */}
        </div>
        

        {error && (
          <div className={`bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold ${softura.className}`}>
            {error}
          </div>
        )}

        {/* Social Logins */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/", 
              });
            }}
            className={`w-full bg-white text-black font-bold py-3 rounded-full border-2 border-black hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${softura.className}`}
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={async () => {
               await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
              });
            }}
            className={`w-full bg-white text-black font-bold py-3 rounded-full border-2 border-black hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${softura.className}`}
          >
            {/* GitHub Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black"></div>
            </div>
            <div className={`relative bg-white px-4 text-sm font-bold text-black uppercase ${softura.className}`}>
                OR
            </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label className={`font-bold text-black uppercase text-sm ${softura.className}`}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${softura.className}`}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className={`font-bold text-black uppercase text-sm ${softura.className}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${softura.className}`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={`font-bold text-black uppercase text-sm ${softura.className}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white border-2 border-black rounded-lg p-3 text-black placeholder-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${softura.className}`}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full bg-black text-white font-bold text-lg py-3 rounded-full border-2 border-transparent hover:bg-[#9c27b0] hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${softura.className}`}
          >
            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
            }}
            className={`text-black font-bold hover:text-[#9c27b0] underline decoration-2 underline-offset-4 ${softura.className}`}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
