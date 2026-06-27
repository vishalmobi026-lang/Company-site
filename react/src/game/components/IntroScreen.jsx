import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Gamepad2, GraduationCap, XCircle, ArrowRight, ShieldCheck, Zap, Copy } from "lucide-react";

export default function IntroScreen({ ctx }) {
  const { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML } = ctx;
  return (
    <>
          {gameState === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="w-full flex flex-col items-center justify-start md:justify-center p-4 py-16 md:p-10 relative"
            >
              <div className="absolute inset-0 cyber-grid opacity-20 z-0" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1)_0%,transparent_60%)] z-0" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: smoothEase }}
                className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-stretch"
              >
                {/* LEFT PANEL: TITLE CARD */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.005 }}
                  className="flex-1 bg-[#0b1021]/80 backdrop-blur-2xl border border-cyan-500/20 p-6 md:p-12 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] flex flex-col justify-between overflow-hidden relative group transition-all duration-500 hover:shadow-[0_0_80px_-15px_rgba(34,211,238,0.25)] hover:border-cyan-400/40"
                >
                  {/* Inset Border Glow */}
                  <div className="absolute inset-0 rounded-[2.5rem] border border-cyan-400/10 pointer-events-none z-20" />

                  {/* Rotating Mesh Glow */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,rgba(6,182,212,0.03)_50%,transparent_100%)] blur-[80px] rounded-full pointer-events-none"
                  />

                  <div className="absolute top-0 right-0 p-8 opacity-65 flex items-center gap-2 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,1)]" />
                    <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase font-bold">SYS_REF: G-TEC_BRAIN_V3</span>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 bg-cyan-950/50 border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    >
                      <BrainCircuit size={40} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    </motion.div>

                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <ShieldAlert size={14} /> Security Clearance: Level 1
                      </div>
                      <h1 className="text-4xl md:text-7xl lg:text-[4.5rem] font-black text-white leading-[1.05] uppercase tracking-tighter drop-shadow-md">
                        KNOWLEDGE <br />
                        <motion.span
                          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                          style={{ backgroundSize: "200% auto" }}
                          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-500 italic inline-block mt-2"
                        >
                          COMMAND
                        </motion.span>
                      </h1>
                    </div>
                  </div>

                  {/* Ultimate System Diagnostics Logger Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-12 relative z-10 bg-[#060b18]/60 border border-cyan-500/20 p-5 rounded-2xl flex flex-col gap-3 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <span className="font-mono text-[9px] text-cyan-200/60 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Connection Status
                      </span>
                      <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">Handshake Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] text-cyan-200/50 font-bold font-sans uppercase">Handshake target</div>
                        <div className="text-sm font-black text-white tracking-tight flex items-center gap-1 mt-0.5">
                          100% Grant <span className="text-[9px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">SECURED</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-cyan-200/50 font-bold font-sans uppercase">Server Node</div>
                        <div className="text-sm font-bold text-cyan-100 font-mono tracking-wider mt-0.5">AP-SOUTH_GATE_1</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-cyan-200/60 font-semibold leading-relaxed border-t border-cyan-500/20 pt-2 flex items-center justify-between">
                      <span>System diagnostics: <span className="text-emerald-400 font-bold">Stable</span></span>
                      <span className="text-[9px] font-mono text-cyan-200/50">Ping: 12ms</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* RIGHT PANEL: DIRECTIVES */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}
                  className="lg:w-[450px] bg-[#0b1021]/80 backdrop-blur-2xl border border-cyan-500/20 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] relative flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-[2.5rem] border border-cyan-400/10 pointer-events-none z-20" />

                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent shadow-[0_0_10px_rgba(37,99,235,0.1)] z-20 pointer-events-none"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-cyan-500/20">
                      <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-3">
                        <Sparkles className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" size={24} /> Directives
                      </h3>
                      <div className="text-[10px] bg-emerald-950/50 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                      </div>
                    </div>

                    {/* Elastic Hover-Physics List */}
                    <div className="space-y-4">
                      {[
                        { label: "01_LIMIT", text: "One session attempt per verified UID.", icon: <User size={14} className="text-cyan-400" /> },
                        { label: "02_TIMER", text: "Sixty-second response window per node.", icon: <Clock size={14} className="text-cyan-400" /> },
                        { label: "03_CRED", text: "Identity verification mandatory for grant.", icon: <ShieldAlert size={14} className="text-cyan-400" /> },
                        { label: "04_DATA", text: "System logs IP and attempt metadata.", icon: <BookOpen size={14} className="text-cyan-400" /> }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 6, scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="group flex gap-4 items-center bg-[#131b31]/60 hover:bg-cyan-900/30 border border-cyan-500/10 hover:border-cyan-400/40 p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] cursor-default"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#060b18] border border-cyan-500/20 group-hover:border-cyan-400/80 shadow-sm flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] text-cyan-400 font-mono font-black uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{item.label}</p>
                              <span className="text-[9px] text-cyan-200/40 font-mono font-bold">[{item.label.split('_')[0]}]</span>
                            </div>
                            <p className="text-slate-300 text-xs md:text-sm font-semibold group-hover:text-white transition-colors mt-0.5 leading-snug">{item.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 space-y-5 relative z-10">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGameState("form")}
                      className="group relative w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black py-4 md:py-5 rounded-2xl shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_-5px_rgba(34,211,238,0.6)] transition-all duration-300 text-base md:text-lg uppercase tracking-widest flex justify-center items-center gap-3 border border-cyan-400/50 overflow-hidden"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative z-10 flex items-center gap-3 font-extrabold">
                        Initialize System <ArrowRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300 ease-out" />
                      </span>
                    </motion.button>
                    <p className="text-[10px] text-slate-400 text-center font-mono uppercase tracking-[0.2em] font-bold">Authorized Access Only // Port_8080</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

    </>
  );
}
