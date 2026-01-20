import { createAuthClient } from "better-auth/react";

// Prefer NEXT_PUBLIC_ so the client bundle has the URL. Fallback to BETTER_AUTH_URL at build.
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin)
      : process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
