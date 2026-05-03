import { useState, useEffect } from "react";

const AGE_GATE_KEY = "pal_finder_age_verified";

/**
 * Custom hook to manage the age gate state.
 * Reads from localStorage on mount; persists confirmation on verify.
 */
export function useAgeGate() {
  // null = "not yet checked" (avoids flash), true/false = resolved
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AGE_GATE_KEY);
      setIsVerified(stored === "true");
    } catch {
      // SSR or privacy mode — default to unverified
      setIsVerified(false);
    }
  }, []);

  const verify = () => {
    try {
      localStorage.setItem(AGE_GATE_KEY, "true");
    } catch {
      // Silently continue if storage is unavailable
    }
    setIsVerified(true);
  };

  return { isVerified, verify };
}
