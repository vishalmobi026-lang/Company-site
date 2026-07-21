import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Gamepad2, GraduationCap, XCircle, ArrowRight, ShieldCheck, Zap, Copy, Heart, Sparkles, Bomb, ChevronLeft, X } from "lucide-react";

const smoothEase = [0.16, 1, 0.3, 1];

export default function PlayingScreen({ ctx }) {
  const { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML, stateRef } = ctx;
  return (
    <>
          {gameState === "playing" && (
            <motion.div key="playing" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className="flex flex-col h-full w-full relative">
              <div className="absolute top-0 left-0 w-full z-[100] pointer-events-none p-3 md:p-6 flex justify-between items-start">
                <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto">
                  <div className="relative overflow-hidden flex flex-col gap-1 md:gap-1.5 bg-[#050917]/90 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-500 min-w-[130px] md:max-w-[200px]">
                    {/* Glowing Tech Corners */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400/60"></div>
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400/60"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400/60"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400/60"></div>

                    {/* Pulsing indicator */}
                    <div className="absolute top-1.5 md:top-2 right-2 md:right-4 flex items-center gap-1">
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"></span>
                      <span className="font-mono text-[6px] md:text-[7px] text-cyan-400/60 tracking-wider">HUD_v3</span>
                    </div>

                    <p className="font-mono text-[7px] md:text-[8px] text-cyan-400/70 font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-0 md:mb-0.5">Telemetry Score</p>
                    <div className="font-black font-mono text-xl md:text-3xl text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] flex items-baseline gap-1 md:gap-1.5 leading-none mt-0.5 md:mt-0">
                      {score.toLocaleString()} <span className="text-[9px] md:text-[10px] text-cyan-400 font-bold tracking-widest font-sans uppercase">PTS</span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-cyan-400/20">
                      <span className="font-mono text-[6px] md:text-[7px] text-slate-400 font-bold uppercase tracking-widest">Shields</span>
                      <div className="flex gap-0.5 md:gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Heart key={i} size={11} className={i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-[heartPulse_1.5s_infinite_alternate] md:w-[13px] md:h-[13px]" : "text-white/20 md:w-[13px] md:h-[13px]"} style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`w-fit px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl font-black font-mono text-xs md:text-lg flex items-center gap-1.5 md:gap-2 shadow-xl backdrop-blur-md transition-all duration-500 ease-out ${combo > 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-black/40 text-white/50 border border-white/10'}`}>
                    <Zap size={14} className={`md:w-[18px] md:h-[18px] ${combo > 1 ? "fill-yellow-400" : ""}`} /> x{combo}
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-start w-1/2 max-w-2xl mt-1">
                  <AnimatePresence mode="wait">
                    {currentQuestion && (
                      <motion.div
                        initial={{ y: -20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} transition={{ duration: 0.5, ease: smoothEase }}
                        className="relative w-[90%] max-w-3xl mx-auto"
                      >
                        {/* Floating Question Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2d1b4e] border border-[#58358c] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(88,53,140,0.8)] z-10">
                          <Sparkles size={10} className="text-[#a855f7]" /> QUESTION
                        </div>

                        {/* Main Purple Capsule Container */}
                        <div className="bg-gradient-to-r from-[#170f2d] via-[#241342] to-[#170f2d] backdrop-blur-xl border border-[#4c2878] rounded-[3rem] py-6 px-10 text-center shadow-[0_0_40px_rgba(76,40,120,0.6)] w-full relative overflow-hidden">
                          {/* Inner Top Purple Glow */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50"></div>
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight mt-1 px-4 select-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{currentQuestion}</h3>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pointer-events-auto">
                  <button onClick={handleExit} className="bg-white/10 hover:bg-red-500/80 text-white p-2.5 md:p-3 rounded-full backdrop-blur-md transition-all duration-500 border border-white/20 shadow-lg">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="md:hidden absolute top-[135px] left-1/2 -translate-x-1/2 w-[94%] sm:w-[90%] z-[90] pointer-events-none">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div
                      initial={{ y: -20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} transition={{ duration: 0.5, ease: smoothEase }}
                      className="relative w-full"
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#2d1b4e] border border-[#58358c] text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(88,53,140,0.8)] z-10">
                        <Sparkles size={8} className="text-[#a855f7]" /> QUESTION
                      </div>

                      <div className="bg-gradient-to-r from-[#170f2d] via-[#241342] to-[#170f2d] backdrop-blur-xl border border-[#4c2878] rounded-[2rem] py-4 px-6 text-center shadow-[0_0_30px_rgba(76,40,120,0.6)] w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50"></div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-snug mt-1 px-1 select-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{currentQuestion}</h3>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1 w-full overflow-hidden" style={{ perspective: '1200px' }}>
                {/* Deep Space Parallax Starfields */}
                <div className="absolute inset-0 starfield-1 opacity-30 pointer-events-none"></div>
                <div className="absolute inset-0 starfield-2 opacity-50 pointer-events-none"></div>
                <div className="absolute inset-0 starfield-3 opacity-75 pointer-events-none"></div>

                <div
                  className="absolute bottom-0 w-full h-[250%]"
                  style={{
                    transform: 'rotateX(60deg)',
                    transformOrigin: 'bottom center',
                    transformStyle: 'preserve-3d',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
                  }}
                >
                  {/* Sleek Digital Grid Layer (Perspective Movement lines) */}
                  <div className="absolute inset-0 opacity-40">
                    {/* Thin sliding horizontal neon lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_97%,rgba(34,211,238,0.45)_97%)] bg-[length:100%_120px] animate-[slideDown_0.6s_linear_infinite]"></div>
                  </div>

                  {/* Glowing Laser Lane Separators */}
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-80">
                    <div className="w-[1.5px] md:w-[2.5px] h-full bg-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.9)] transition-all duration-500"></div>
                    <div className="w-[1.5px] md:w-[2.5px] h-full bg-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.9)] transition-all duration-500"></div>
                  </div>
                </div>

                <div className="absolute inset-0 z-[60] pointer-events-none">
                  {entities.map(ent => {
                    const progress = ent.top / 100;
                    let xPos = 50;
                    if (ent.lane === 0) xPos = 50 - (18 + progress * 24);
                    if (ent.lane === 2) xPos = 50 + (18 + progress * 24);
                    const scale = 0.6 + (progress * 0.4);

                    return (
                      <div key={ent.id}
                        className="absolute flex flex-col items-center justify-center pointer-events-auto"
                        style={{
                          left: `${xPos}%`,
                          top: `${ent.top}%`,
                          transform: `translate(-50%, -50%) scale(${scale})`,
                          zIndex: Math.floor(ent.top),
                          width: '25%'
                        }}>

                        {!ent.revealed && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36 flex items-center justify-center transition-transform hover:scale-110 duration-300">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                              <defs>
                                <radialGradient id="asteroidGrad" cx="35%" cy="35%" r="65%">
                                  <stop offset="0%" stopColor="#4a5568" />
                                  <stop offset="60%" stopColor="#1e293b" />
                                  <stop offset="100%" stopColor="#0f172a" />
                                </radialGradient>
                                <filter id="craterShadow">
                                  <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.7" />
                                </filter>
                                <filter id="asteroidHighlight">
                                  <feDropShadow dx="-2" dy="-2" stdDeviation="2" floodColor="#cbd5e1" floodOpacity="0.2" />
                                </filter>
                              </defs>
                              
                              {/* Irregular Asteroid Shape */}
                              <path d="M50 2 C70 4, 90 20, 96 45 C100 70, 85 92, 55 97 C25 99, 4 75, 2 50 C0 25, 20 4, 50 2 Z" fill="url(#asteroidGrad)" filter="url(#asteroidHighlight)" />
                              
                              {/* Craters */}
                              <circle cx="28" cy="35" r="10" fill="#0f172a" filter="url(#craterShadow)" opacity="0.8" />
                              <circle cx="32" cy="30" r="4" fill="#020617" opacity="0.5" />

                              <circle cx="75" cy="55" r="14" fill="#0f172a" filter="url(#craterShadow)" opacity="0.7" />
                              <circle cx="70" cy="52" r="6" fill="#020617" opacity="0.4" />

                              <circle cx="45" cy="82" r="8" fill="#0f172a" filter="url(#craterShadow)" opacity="0.8" />
                              <circle cx="80" cy="25" r="6" fill="#0f172a" filter="url(#craterShadow)" opacity="0.6" />
                              <circle cx="18" cy="65" r="7" fill="#0f172a" filter="url(#craterShadow)" opacity="0.7" />
                            </svg>
                        {!ent.revealed && (
                          <span className="relative z-10 text-[9px] sm:text-xs md:text-base font-black text-white text-center px-2 sm:px-4 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                            {ent.text}
                          </span>
                        )}

                        {ent.revealed ? (
                          ent.isCorrect ? (
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,1)] border-4 border-white animate-pulse">
                              <CheckCircle2 size={32} className="text-white" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,1)] border-4 border-yellow-400">
                              <Bomb size={32} className="text-yellow-300" />
                            </div>
                          )
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {floatingTexts.map(ft => {
                    let xPos = 50;
                    if (ft.lane === 0) xPos = 16.66;
                    if (ft.lane === 2) xPos = 83.33;
                    return (
                      <motion.div key={ft.id}
                        initial={{ opacity: 1, y: '70%', scale: 0.5 }}
                        animate={{ opacity: 0, y: '10%', scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: smoothEase }}
                        className={`absolute flex justify-center text-3xl md:text-6xl font-black ${ft.color} drop-shadow-[0_0_20px_currentColor] z-50 text-center pointer-events-none`}
                        style={{ left: `${xPos}%`, transform: 'translateX(-50%)', width: '100%' }}>
                        {ft.text}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                <div className="absolute bottom-20 md:bottom-12 w-1/3 flex justify-center z-[80]" style={{ left: `${playerLane * 33.33}%`, transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <div className={`w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center transition-all duration-300 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] ${stateRef.current.flashTimer > 0 ? 'opacity-30' : 'opacity-100'}`}>
                    {/* CUSTOM NEON SHIP */}
                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                        rotateX: [10, 25, 10]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ willChange: "transform", transform: "translateZ(0)" }}
                      className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 flex items-center justify-center"
                    >
                      {/* SHIP BODY - PROFESSIONAL DESIGN */}
                      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-10 drop-shadow-[0_15px_25px_rgba(34,211,238,0.4)]">
                        <defs>
                          <linearGradient id="bodyBase" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#020617" />
                          </linearGradient>
                          <linearGradient id="accentCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#0369a1" />
                          </linearGradient>
                          <linearGradient id="cockpitVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#cffafe" />
                            <stop offset="40%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#082f49" />
                          </linearGradient>
                          <filter id="neonCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.7" />
                          </filter>
                        </defs>

                        {/* Left Engine Pod */}
                        <path d="M20 80 L30 40 L35 40 L40 80 L35 100 L25 100 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                        <path d="M25 70 L30 45 L32 45 L35 70 Z" fill="url(#accentCyan)" opacity="0.7" />

                        {/* Right Engine Pod */}
                        <path d="M100 80 L90 40 L85 40 L80 80 L85 100 L95 100 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                        <path d="M95 70 L90 45 L88 45 L85 70 Z" fill="url(#accentCyan)" opacity="0.7" />

                        {/* Main Wings */}
                        <path d="M15 85 L45 50 L60 40 L75 50 L105 85 L95 95 L75 75 L60 80 L45 75 L25 95 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.4" filter="url(#dropShadow)" />

                        {/* Main Fuselage */}
                        <path d="M45 90 L60 5 L75 90 L65 105 L55 105 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />

                        {/* Fuselage Accents */}
                        <path d="M50 80 L60 15 L70 80 L60 90 Z" fill="#334155" />
                        <path d="M55 70 L60 25 L65 70 Z" fill="url(#accentCyan)" opacity="0.4" />

                        {/* Cockpit Canopy */}
                        <path d="M54 55 Q60 30 66 55 L64 65 Q60 70 56 65 Z" fill="url(#cockpitVisor)" />
                        <path d="M56 65 Q60 70 64 65 L62 60 L58 60 Z" fill="#22d3ee" opacity="0.5" filter="url(#neonCoreGlow)" />

                        {/* Center Energy Core */}
                        <circle cx="60" cy="75" r="5" fill="#fff" filter="url(#neonCoreGlow)" />
                        <circle cx="60" cy="75" r="2" fill="#cffafe" />

                        {/* Neon Trims */}
                        <path d="M45 90 L60 5 L75 90" fill="none" stroke="#22d3ee" strokeWidth="2" strokeOpacity="0.9" filter="url(#neonCoreGlow)" />
                        <path d="M60 5 L60 25" fill="none" stroke="#fff" strokeWidth="1" opacity="0.9" />

                        {/* Wing Tip Glows */}
                        <line x1="15" y1="85" x2="25" y2="95" stroke="#22d3ee" strokeWidth="2" filter="url(#neonCoreGlow)" />
                        <line x1="105" y1="85" x2="95" y2="95" stroke="#22d3ee" strokeWidth="2" filter="url(#neonCoreGlow)" />
                      </svg>


                      {/* MAIN THRUSTER GLOW */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                          y: [0, 4, 0]
                        }}
                        transition={{
                          duration: 0.08,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                        className="absolute bottom-[-10px] w-14 h-28 bg-gradient-to-t from-cyan-400 via-blue-500/50 to-transparent blur-xl rounded-full z-0"
                      />

                      {/* SIDE THRUSTER GLOWS */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], y: [0, 2, 0] }}
                        transition={{ duration: 0.12, repeat: Infinity, ease: "linear", delay: 0.05 }}
                        className="absolute bottom-2 left-4 w-6 h-16 bg-gradient-to-t from-cyan-300 via-blue-500/40 to-transparent blur-md rounded-full z-0"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], y: [0, 2, 0] }}
                        transition={{ duration: 0.12, repeat: Infinity, ease: "linear", delay: 0.05 }}
                        className="absolute bottom-2 right-4 w-6 h-16 bg-gradient-to-t from-cyan-300 via-blue-500/40 to-transparent blur-md rounded-full z-0"
                      />

                      {/* ENGINE SPARKS */}
                      <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, 15, 30] }}
                        transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
                        className="absolute bottom-0 w-1.5 h-6 bg-white blur-[1px] rounded-full z-0"
                      />
                      <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, 20, 35] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                        className="absolute bottom-0 left-6 w-1 h-4 bg-cyan-200 blur-[1px] rounded-full z-0"
                      />
                      <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, 20, 35] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: 0.3 }}
                        className="absolute bottom-0 right-6 w-1 h-4 bg-cyan-200 blur-[1px] rounded-full z-0"
                      />

                    </motion.div>
                  </div>
                </div>
              </div>

              {/* DIRECTIONAL CONTROLS - PROFESSIONAL HUD UI */}
              <div className="flex gap-4 md:gap-8 p-4 md:p-6 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent backdrop-blur-xl z-[100] h-28 md:h-36 border-t border-cyan-500/20 relative shadow-[0_-20px_40px_rgba(34,211,238,0.05)] justify-center">
                {/* Decorative Tech Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]"></div>

                {/* Left Thrust Button */}
                <button
                  onPointerDown={() => movePlayer(-1)}
                  className="relative flex-1 max-w-[350px] h-full bg-slate-900/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl flex items-center justify-center active:scale-95 transition-all duration-300 hover:bg-cyan-950/60 hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-cyan-300 to-blue-600 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_20px_#22d3ee] transition-all duration-300" />

                  <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 md:gap-4">
                    <ChevronLeft size={32} className="text-cyan-500 md:w-11 md:h-11 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:-translate-x-2 transition-all duration-300" />
                    <div className="flex flex-col items-start text-left">
                      <span className="hidden md:block text-[10px] text-cyan-500/50 font-mono font-bold uppercase tracking-widest group-hover:text-cyan-400/80 transition-colors">System Override</span>
                      <span className="hidden md:block text-cyan-500/80 font-mono font-black tracking-[0.2em] uppercase text-sm group-hover:text-cyan-300 transition-colors">Port Thrust</span>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </button>

                {/* Right Thrust Button */}
                <button
                  onPointerDown={() => movePlayer(1)}
                  className="relative flex-1 max-w-[350px] h-full bg-slate-900/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl flex items-center justify-center active:scale-95 transition-all duration-300 hover:bg-cyan-950/60 hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute right-0 top-0 w-1.5 h-full bg-gradient-to-b from-cyan-300 to-blue-600 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_20px_#22d3ee] transition-all duration-300" />

                  <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 md:gap-4">
                    <div className="flex flex-col items-end text-right">
                      <span className="hidden md:block text-[10px] text-cyan-500/50 font-mono font-bold uppercase tracking-widest group-hover:text-cyan-400/80 transition-colors">System Override</span>
                      <span className="hidden md:block text-cyan-500/80 font-mono font-black tracking-[0.2em] uppercase text-sm group-hover:text-cyan-300 transition-colors">Starboard</span>
                    </div>
                    <ChevronRight size={32} className="text-cyan-500 md:w-11 md:h-11 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  <div className="absolute top-3 left-3 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

    </>
  );
}
