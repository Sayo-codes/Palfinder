import React from "react";
import { useAgeGate } from "../../hooks/useAgeGate";
import AgeGateModal from "./AgeGateModal";

interface AgeGateProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the entire app. Shows the AgeGateModal until the user verifies.
 * isVerified === null means "still reading localStorage" — render nothing
 * to prevent a flash of either the modal or the blocked content.
 */
export default function AgeGateProvider({ children }: AgeGateProviderProps) {
  const { isVerified, verify } = useAgeGate();

  // Hydration guard — avoid SSR mismatch
  if (isVerified === null) return null;

  return (
    <>
      {/* Always render children so the page hydrates in the background */}
      {children}

      {/* Overlay the modal on top if not yet verified */}
      {!isVerified && <AgeGateModal onVerify={verify} />}
    </>
  );
}
