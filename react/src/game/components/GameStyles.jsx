import React from "react";

export default function GameStyles() {
  return (
    <>
      <style jsx="true">{`
        .nebula-glow-1 {
          animation: driftGlowOne 20s ease-in-out infinite;
        }
        .nebula-glow-2 {
          animation: driftGlowTwo 25s ease-in-out infinite;
        }
        @keyframes driftGlowOne {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: translate(-45%, -55%) scale(1.2) rotate(180deg); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0.7; }
        }
        @keyframes driftGlowTwo {
          0% { transform: scale(1) translate(0, 0); opacity: 0.6; }
          50% { transform: scale(1.15) translate(-15px, -20px); opacity: 0.8; }
          100% { transform: scale(1) translate(0, 0); opacity: 0.6; }
        }
        @keyframes heartPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 3px rgba(239,68,68,0.5)); }
          100% { transform: scale(1.2); filter: drop-shadow(0 0 8px rgba(239,68,68,0.9)); }
        }
        @keyframes hudScan {
          0% { box-shadow: 0 0 40px rgba(34,211,238,0.25); }
          50% { box-shadow: 0 0 50px rgba(34,211,238,0.4); }
          100% { box-shadow: 0 0 40px rgba(34,211,238,0.25); }
        }
        .starfield-1 {
          background-image: 
            radial-gradient(1px 1px at 25px 45px, #fff, transparent),
            radial-gradient(1.5px 1.5px at 80px 120px, #fff, transparent),
            radial-gradient(1px 1px at 140px 180px, #fff, transparent),
            radial-gradient(1px 1px at 200px 30px, #fff, transparent),
            radial-gradient(1.5px 1.5px at 240px 220px, #fff, transparent),
            radial-gradient(1px 1px at 290px 100px, #fff, transparent);
          background-size: 300px 300px;
          animation: moveStarsSlow 25s linear infinite;
          will-change: background-position;
          transform: translateZ(0);
        }
        .starfield-2 {
          background-image: 
            radial-gradient(1.5px 1.5px at 40px 90px, #fff, transparent),
            radial-gradient(2px 2px at 110px 40px, rgba(34,211,238,0.8), transparent),
            radial-gradient(1.5px 1.5px at 170px 210px, #fff, transparent),
            radial-gradient(2px 2px at 220px 130px, rgba(147,51,234,0.6), transparent),
            radial-gradient(1.5px 1.5px at 280px 60px, #fff, transparent);
          background-size: 320px 320px;
          animation: moveStarsMedium 15s linear infinite;
          will-change: background-position;
          transform: translateZ(0);
        }
        .starfield-3 {
          background-image: 
            radial-gradient(2px 2px at 15px 150px, #fff, transparent),
            radial-gradient(2.5px 2.5px at 95px 85px, #fff, transparent),
            radial-gradient(2px 2px at 180px 20px, #fff, transparent),
            radial-gradient(3px 3px at 230px 260px, rgba(255,255,255,0.9), transparent);
          background-size: 280px 280px;
          animation: moveStarsFast 8s linear infinite;
          will-change: background-position;
          transform: translateZ(0);
        }
        @keyframes moveStarsSlow {
          from { background-position: 0 0; }
          to { background-position: 0 300px; }
        }
        @keyframes moveStarsMedium {
          from { background-position: 0 0; }
          to { background-position: 0 320px; }
        }
        @keyframes moveStarsFast {
          from { background-position: 0 0; }
          to { background-position: 0 280px; }
        }
        @keyframes slideDown {
          from { background-position: 0 0; }
          to { background-position: 0 120px; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .scanline-horizontal {
          background: linear-gradient(to bottom, transparent, rgba(34,211,238,0.2), transparent);
          background-size: 100% 4px;
          animation: scan-v 4s linear infinite;
          will-change: background-position;
          transform: translateZ(0);
        }
        .scanline-vertical {
          background: linear-gradient(to right, transparent, rgba(34,211,238,0.4), transparent);
          background-size: 4px 100%;
          animation: scan-h 8s linear infinite;
          will-change: background-position;
          transform: translateZ(0);
        }
        @keyframes scan-v {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 100%; }
        }
        @keyframes scan-h {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </>
  );
}
