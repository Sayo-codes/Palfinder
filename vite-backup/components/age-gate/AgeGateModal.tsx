import React, { useState } from "react";

interface AgeGateModalProps {
  onVerify: () => void;
}

/**
 * Full-screen age verification modal.
 * Blocks all content until the user confirms they are 18+.
 * Design: dark luxury — deep black bg, rose/crimson accents, refined typography.
 */
export default function AgeGateModal({ onVerify }: AgeGateModalProps) {
  const [checked, setChecked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleContinue = () => {
    if (!checked) return;
    setIsExiting(true);
    // Small delay so the fade-out animation plays before unmount
    setTimeout(() => {
      onVerify();
    }, 500);
  };

  return (
    <div
      className={`age-gate-overlay ${isExiting ? "age-gate-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      {/* Noise texture overlay for depth */}
      <div className="age-gate-noise" aria-hidden="true" />

      {/* Ambient glow blobs */}
      <div className="age-gate-glow age-gate-glow--left" aria-hidden="true" />
      <div className="age-gate-glow age-gate-glow--right" aria-hidden="true" />

      {/* Card */}
      <div className="age-gate-card">
        {/* Logo / Brand mark */}
        <div className="age-gate-brand">
          <span className="age-gate-brand__icon" aria-hidden="true">◈</span>
          <span className="age-gate-brand__name">Pal Finder</span>
        </div>

        {/* Warning badge */}
        <div className="age-gate-badge" aria-label="Adults only content warning">
          <span>🔞</span>
          <span>Adults Only</span>
        </div>

        {/* Heading */}
        <h1 id="age-gate-title" className="age-gate-title">
          Age Verification
          <span className="age-gate-title__line" aria-hidden="true" />
        </h1>

        {/* Body copy */}
        <p className="age-gate-body">
          This website contains adult content intended for mature audiences.
          By entering, you confirm that you are{" "}
          <strong>18 years of age or older</strong> and consent to viewing
          adult-oriented material.
        </p>

        {/* Legal note */}
        <p className="age-gate-legal">
          Access is prohibited where such content is illegal in your jurisdiction.
          You are responsible for complying with your local laws.
        </p>

        {/* Checkbox */}
        <label className="age-gate-checkbox-label" htmlFor="age-confirm">
          <div className="age-gate-checkbox-wrapper">
            <input
              id="age-confirm"
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="age-gate-checkbox-input"
              aria-required="true"
            />
            <div
              className={`age-gate-checkbox-custom ${checked ? "age-gate-checkbox-custom--checked" : ""}`}
              aria-hidden="true"
            >
              {checked && (
                <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 5L4.5 8.5L11 1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="age-gate-checkbox-text">
            I confirm that I am <strong>18 years or older</strong> and agree to
            the terms of service
          </span>
        </label>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          disabled={!checked}
          className={`age-gate-btn ${checked ? "age-gate-btn--active" : "age-gate-btn--disabled"}`}
          aria-disabled={!checked}
        >
          <span className="age-gate-btn__text">Continue as Anonymous</span>
          <span className="age-gate-btn__arrow" aria-hidden="true">→</span>
        </button>

        {/* Footer */}
        <p className="age-gate-footer">
          By entering you accept our{" "}
          <a href="/terms" className="age-gate-link">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="age-gate-link">Privacy Policy</a>
        </p>
      </div>

      {/* Embedded styles — scoped, no Tailwind dependency for the modal itself */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .age-gate-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: #050507;
          animation: ageFadeIn 0.6s ease forwards;
          overflow-y: auto;
        }

        @keyframes ageFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .age-gate-exit {
          animation: ageFadeOut 0.5s ease forwards !important;
        }

        @keyframes ageFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* Noise texture */
        .age-gate-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        /* Ambient glows */
        .age-gate-glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.18;
        }
        .age-gate-glow--left {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #7b1f3a 0%, transparent 70%);
          top: -100px; left: -150px;
        }
        .age-gate-glow--right {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #1a0a2e 0%, transparent 70%);
          bottom: -80px; right: -100px;
        }

        /* Card */
        .age-gate-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          background: linear-gradient(160deg, #0f0f13 0%, #0a0a0e 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow:
            0 0 0 1px rgba(180, 50, 80, 0.08),
            0 40px 80px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.06);
          animation: ageCardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
          margin: auto;
        }

        @keyframes ageCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Brand */
        .age-gate-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
          font-family: 'DM Sans', sans-serif;
        }
        .age-gate-brand__icon {
          font-size: 1.25rem;
          color: #c0395a;
          line-height: 1;
        }
        .age-gate-brand__name {
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        /* Badge */
        .age-gate-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(192, 57, 90, 0.12);
          border: 1px solid rgba(192, 57, 90, 0.3);
          color: #e06080;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          margin-bottom: 1.25rem;
        }

        /* Title */
        .age-gate-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 6vw, 2.8rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
          position: relative;
        }
        .age-gate-title__line {
          display: block;
          width: 3rem;
          height: 2px;
          background: linear-gradient(90deg, #c0395a, transparent);
          margin-top: 0.75rem;
          border-radius: 2px;
        }

        /* Body */
        .age-gate-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
          margin: 1.25rem 0 0;
        }
        .age-gate-body strong {
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        /* Legal */
        .age-gate-legal {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.28);
          line-height: 1.55;
          margin: 0.75rem 0 1.75rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          border-left: 2px solid rgba(192, 57, 90, 0.25);
          border-radius: 0 6px 6px 0;
        }

        /* Checkbox */
        .age-gate-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          transition: border-color 0.2s, background 0.2s;
        }
        .age-gate-checkbox-label:hover {
          border-color: rgba(192, 57, 90, 0.3);
          background: rgba(192, 57, 90, 0.04);
        }
        .age-gate-checkbox-wrapper {
          flex-shrink: 0;
          margin-top: 1px;
        }
        .age-gate-checkbox-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .age-gate-checkbox-custom {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: white;
        }
        .age-gate-checkbox-custom--checked {
          background: linear-gradient(135deg, #c0395a, #8b1a35);
          border-color: #c0395a;
          box-shadow: 0 0 12px rgba(192,57,90,0.4);
        }
        .age-gate-checkbox-custom svg {
          width: 12px;
          height: 10px;
        }
        .age-gate-checkbox-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
          user-select: none;
        }
        .age-gate-checkbox-text strong {
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        /* Button */
        .age-gate-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.95rem 1.5rem;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          margin-bottom: 1.25rem;
        }
        .age-gate-btn--disabled {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.2);
          cursor: not-allowed;
        }
        .age-gate-btn--active {
          background: linear-gradient(135deg, #c0395a 0%, #8b1a35 100%);
          color: #ffffff;
          box-shadow: 0 4px 24px rgba(192,57,90,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
        .age-gate-btn--active:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(192,57,90,0.5), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
        .age-gate-btn--active:active {
          transform: translateY(0);
        }
        .age-gate-btn__arrow {
          font-size: 1.1rem;
          transition: transform 0.2s;
        }
        .age-gate-btn--active:hover .age-gate-btn__arrow {
          transform: translateX(3px);
        }

        /* Footer */
        .age-gate-footer {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.22);
          text-align: center;
          line-height: 1.5;
        }
        .age-gate-link {
          color: rgba(192,57,90,0.7);
          text-decoration: none;
          transition: color 0.2s;
        }
        .age-gate-link:hover {
          color: #c0395a;
          text-decoration: underline;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .age-gate-card {
            padding: 2rem 1.5rem;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}
