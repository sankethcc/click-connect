"use client";

import React, { useState, useEffect } from "react";
import { Gift, X, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRIZES = [
  { code: "WELCOME20", label: "20% OFF", angle: 22.5 },
  { code: "SAVE10", label: "10% OFF", angle: 67.5 },
  { code: "WELCOME20", label: "20% OFF", angle: 112.5 },
  { code: "SAVE10", label: "10% OFF", angle: 157.5 },
  { code: "WELCOME20", label: "20% OFF", angle: 202.5 },
  { code: "SAVE10", label: "10% OFF", angle: 247.5 },
  { code: "WELCOME20", label: "20% OFF", angle: 292.5 },
  { code: "SAVE10", label: "10% OFF", angle: 337.5 },
];

export default function SpinWheel() {
  const [hasSpun, setHasSpun] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState<any[]>([]);

  // Check if already spun on mount
  useEffect(() => {
    const spun = localStorage.getItem("click_connect_spun");
    if (!spun) {
      setHasSpun(false);
    }
  }, []);

  if (hasSpun && !isOpen) return null;

  const triggerConfetti = () => {
    const colors = ["#008080", "#ff7f00", "#6366f1", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];
    const particles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90%
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      duration: Math.random() * 2 + 1.5,
    }));
    setConfetti(particles);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Pick a random prize index
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const targetPrize = PRIZES[prizeIndex];

    // Calculate rotation: 5 full spins (1800 deg) plus slice adjustment
    // Since spin starts pointing up, the winning slice will be at 270 degrees relative to rotation
    // We adjust rotation to align the slice with the top pointer
    const sliceAngle = 360 / PRIZES.length;
    const targetAngle = 360 - (prizeIndex * sliceAngle) - (sliceAngle / 2);
    const targetRotation = 1800 + targetAngle;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(targetPrize);
      localStorage.setItem("click_connect_spun", "true");
      setHasSpun(true);
      triggerConfetti();
    }, 4000); // match transition duration
  };

  const handleCopy = () => {
    if (!wonPrize) return;
    navigator.clipboard.writeText(wonPrize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Gift Box Button */}
      <AnimatePresence>
        {!isOpen && !hasSpun && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-primary to-indigo-500 text-white shadow-xl hover:scale-110 active:scale-95 cursor-pointer transition-transform group"
            aria-label="Open spin wheel coupon popup"
          >
            <Gift className="h-6 w-6 animate-bounce" />
            <span className="absolute left-full ml-3 px-2 py-1 rounded bg-popover border border-border text-foreground text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
              Win Promo Code!
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSpinning) setIsOpen(false);
              }}
              className="fixed inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-background border border-border/80 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden glass z-10 flex flex-col items-center gap-6"
            >
              {/* Confetti Animation Elements */}
              {confetti.map((particle) => (
                <div
                  key={particle.id}
                  className="confetti-particle pointer-events-none"
                  style={{
                    left: `${particle.x}%`,
                    top: `-10px`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    borderRadius: "50%",
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${particle.duration}s`,
                  }}
                />
              ))}

              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fall {
                  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(75vh) rotate(720deg); opacity: 0; }
                }
                .confetti-particle {
                  position: absolute;
                  animation-name: fall;
                  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                  animation-fill-mode: forwards;
                }
              ` }} />

              {/* Close Button */}
              {!isSpinning && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              {/* Title Header */}
              <div>
                <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight text-foreground">
                  Spin to Win Discount!
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Try your luck and win up to 20% discount on your entire shopping cart.
                </p>
              </div>

              {/* Spin Wheel Visual Element */}
              <div className="relative my-4 select-none">
                {/* Pointer Arrow */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary border-2 border-background shadow-md rotate-45 z-20 rounded-tl-full rounded-br-sm" />

                {/* The Wheel */}
                <svg
                  className="w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full border-4 border-foreground/15 shadow-xl bg-card"
                  viewBox="0 0 200 200"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? "transform 4s cubic-bezier(0.1, 0.8, 0.2, 1)" : "none",
                  }}
                >
                  {/* Segment 1: Teal */}
                  <path d="M 100 100 L 100 0 A 100 100 0 0 1 170.71 29.29 Z" fill="#0d9488" />
                  {/* Segment 2: Orange */}
                  <path d="M 100 100 L 170.71 29.29 A 100 100 0 0 1 200 100 Z" fill="#ea580c" />
                  {/* Segment 3: Indigo */}
                  <path d="M 100 100 L 200 100 A 100 100 0 0 1 170.71 170.71 Z" fill="#4f46e5" />
                  {/* Segment 4: Amber */}
                  <path d="M 100 100 L 170.71 170.71 A 100 100 0 0 1 100 200 Z" fill="#d97706" />
                  {/* Segment 5: Emerald */}
                  <path d="M 100 100 L 100 200 A 100 100 0 0 1 29.29 170.71 Z" fill="#059669" />
                  {/* Segment 6: Pink */}
                  <path d="M 100 100 L 29.29 170.71 A 100 100 0 0 1 0 100 Z" fill="#db2777" />
                  {/* Segment 7: Purple */}
                  <path d="M 100 100 L 0 100 A 100 100 0 0 1 29.29 29.29 Z" fill="#7c3aed" />
                  {/* Segment 8: Rose */}
                  <path d="M 100 100 L 29.29 29.29 A 100 100 0 0 1 100 0 Z" fill="#e11d48" />

                  {/* Texts rotated to sectors */}
                  {PRIZES.map((prize, idx) => (
                    <text
                      key={idx}
                      x="100"
                      y="40"
                      transform={`rotate(${prize.angle}, 100, 100)`}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {prize.label}
                    </text>
                  ))}

                  {/* Wheel Center Button */}
                  <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" />
                </svg>

                {/* Spin CTA Button */}
                {!wonPrize && (
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-linear-to-tr from-primary to-indigo-500 text-white font-black text-xs shadow-md border-2 border-background hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-80 transition-transform cursor-pointer flex items-center justify-center select-none z-30"
                  >
                    {isSpinning ? "SPIN" : "GO!"}
                  </button>
                )}
              </div>

              {/* Won Announcement Section */}
              <AnimatePresence>
                {wonPrize && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="w-full space-y-4 pt-4 border-t border-border/40"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        Congratulations!
                      </span>
                      <h4 className="font-extrabold text-lg text-foreground mt-0.5">
                        You Won {wonPrize.label}!
                      </h4>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 max-w-xs mx-auto">
                      <code className="text-base font-extrabold text-emerald-600 dark:text-emerald-500 select-all pl-2">
                        {wonPrize.code}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-xl transition-all"
                        aria-label="Copy coupon code"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 h-10 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-sm"
                    >
                      Use Coupon Now
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
