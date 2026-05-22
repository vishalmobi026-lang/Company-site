import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Gamepad2, Zap } from "lucide-react";
import NeonStrikeGame from "./Gameplay";

export default function GameWidget() {
  const [open, setOpen] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);

  useEffect(() => {
    const MARGIN_DESKTOP = 16;
    const MARGIN_MOBILE = 0;
    const BASE = 24;

    const update = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setBottomOffset(BASE);
        return;
      }
      
      const isMobile = window.innerWidth < 640;
      const rect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - rect.top;
      
      if (overlap > 0) {
        setBottomOffset(isMobile ? overlap + MARGIN_MOBILE : BASE + overlap + MARGIN_DESKTOP);
      } else {
        setBottomOffset(BASE);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* FLOATING TRIGGER (LEFT SIDE) - SCALED DOWN CYBER STYLE */}
      <div
        className="fixed z-40 left-0 sm:left-10"
        style={{
          bottom: bottomOffset + 10,
          transition: "bottom 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className={`h-36 w-36 flex items-center justify-center transition-transform duration-[2000ms] ease-out ${!open ? '-translate-x-[45%] hover:translate-x-2 sm:translate-x-0 sm:hover:translate-x-0' : 'translate-x-2 sm:translate-x-0'}`}
        >
        {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative w-full h-full flex items-center justify-center cursor-pointer group"
          >

            {/* FLOATING PARTICLES */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -40, 0],
                  x: [0, (i % 2 === 0 ? 20 : -20), 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${40 + (i * 8)}%`
                }}
              />
            ))}

            {/* 1. OUTER ORBITING RING (SCALED DOWN) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute h-32 w-32 rounded-full border border-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            />

            {/* SCANNER SWEEP EFFECT */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute h-32 w-32 rounded-full border-t border-cyan-400/20 opacity-40"
              style={{ filter: "blur(1px)" }}
            />

            {/* 2. INNER ORBITING RING WITH BADGES (SCALED DOWN) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute h-28 w-28 rounded-full border border-dashed border-cyan-400/20 flex items-center justify-center"
            >
              {/* ORBITING BADGE 1: SCHOLARSHIP */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -left-4 bg-[#07132f]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-1.5 px-2 shadow-2xl flex flex-col items-center gap-0.5 min-w-[60px]"
              >
                <Trophy size={10} className="text-cyan-400" />
                <span className="text-[7px] font-black uppercase tracking-widest text-white/80">Scholarship</span>
              </motion.div>

              {/* ORBITING BADGE 2: PLAY & WIN */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -right-4 bg-[#07132f]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-1.5 px-2 shadow-2xl flex flex-col items-center gap-0.5 min-w-[60px]"
              >
                <Zap size={10} className="text-yellow-400" />
                <span className="text-[7px] font-black uppercase tracking-widest text-white/80">Play & Win</span>
              </motion.div>

              {/* TINY PULSING ORB */}
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-0 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]"
              />
            </motion.div>

            {/* 3. CENTRAL PREMIUM SQUIRCLE BUTTON (SCALED DOWN) */}
            <motion.button
              onClick={() => setOpen(true)}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { rotate: { duration: 0.5, repeat: Infinity } }
              }}
              whileTap={{ scale: 0.9 }}
              className="relative z-10 h-16 w-16 rounded-[1.6rem] bg-[#07132f] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden"
            >
              {/* CYBER GRID TEXTURE */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

              {/* GLITCH EFFECT ON HOVER */}
              <motion.div
                className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100"
                animate={{
                  x: [-2, 2, -1, 0],
                  y: [1, -1, 0, 0],
                }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />

              {/* SCANNING LASER LINE */}
              <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-30"
              />

              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-transparent"
              />

              <div className="relative z-20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                <Gamepad2 size={30} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              </div>

              {/* AMBIENT GLOW */}
              <motion.div
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute inset-0 bg-cyan-500/10 blur-xl"
              />

              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
            </motion.button>


          </motion.div>
        )}


        </div>
      </div>

      {/* GAME OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100000] overflow-hidden bg-black"
          >
            <NeonStrikeGame onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
