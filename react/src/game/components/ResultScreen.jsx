import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Gamepad2, GraduationCap, XCircle, ArrowRight, ShieldCheck, ShieldAlert, Zap, Copy, X } from "lucide-react";

const smoothEase = [0.16, 1, 0.3, 1];

export default function ResultScreen({ ctx }) {
  const { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML } = ctx;
  
  const hashSignature = React.useMemo(() => Math.random().toString(36).substring(2, 10).toUpperCase(), []);
  const transactionHash = React.useMemo(() => Math.random().toString(36).substring(2, 15).toUpperCase(), []);

  return (
    <>
          {gameState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="text-center px-4 w-full max-w-5xl mx-auto relative z-20"
            >
              <div className="mb-4 relative">
                <motion.h2
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    textShadow: ["0 0 10px rgba(34,211,238,0)", "0 0 20px rgba(34,211,238,0.5)", "0 0 10px rgba(34,211,238,0)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-white text-[10px] font-black uppercase tracking-[0.5em] mb-1"
                >
                  Post-Assessment Telemetry
                </motion.h2>
                <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch perspective-1000">

                {/* LEFT: CANDIDATE INFO */}
                <motion.div
                  initial={{ x: -30, opacity: 0, rotateY: -5 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.8, ease: smoothEase }}
                  whileHover={{ scale: 1.01 }}
                  className="md:col-span-7 bg-[#0b132b]/60 backdrop-blur-3xl border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 text-left flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  {/* TECH DECORATIONS */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-2xl" />
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-2xl" />
                    <div className="absolute inset-0 scanline-vertical opacity-[0.03]" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.1)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 to-transparent" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 border-2 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center"
                        >
                          <div className="w-1 h-4 bg-cyan-500/40 rounded-full" />
                        </motion.div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-cyan-500/40 text-[10px] font-black uppercase tracking-[0.3em] font-mono">Neural_Link: Established</p>
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Verified_Result</span>
                          </div>
                          <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest italic">{formData.course}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-cyan-500/30 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Subject Identity</h3>
                    <p className="text-3xl md:text-4xl font-black text-white tracking-tighter truncate leading-tight">
                      {formData.name}
                    </p>
                  </div>

                  <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-10">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                            className="w-1.5 h-6 bg-cyan-500/30 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-none">Global_Score_Registry: ACTIVE</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] text-cyan-500/50 uppercase tracking-[0.2em]">Hash_Signature</p>
                      <p className="font-mono text-[11px] text-zinc-400">{hashSignature}</p>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT: STATS STACK */}
                <div className="md:col-span-5 flex flex-col gap-8">
                  {/* DISCOUNT CARD */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex-1 bg-gradient-to-br from-indigo-900/40 to-blue-900/20 backdrop-blur-3xl border border-cyan-400/30 rounded-[2rem] p-6 text-left relative overflow-hidden group shadow-lg"
                  >
                    {/* ANIMATED GLOW BACKGROUND */}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute top-0 right-0 w-48 h-48 bg-cyan-400 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                          <Zap size={12} className="fill-cyan-400" /> Scholarship Grant
                        </p>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                          {discount}
                        </span>
                        <span className="text-xl font-black text-cyan-400 italic">%</span>
                      </div>
                      <p className="text-zinc-500 text-[8px] font-black mt-1 uppercase tracking-[0.2em] border-l-2 border-cyan-500 pl-2">Grant Authorized</p>
                    </div>
                  </motion.div>

                  {/* SOLVED CARD */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-[#0b132b]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 text-left relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-1/4 translate-y-1/4" />

                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Total Solved</p>
                        <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic flex items-baseline gap-1 leading-none">
                          {correctCount} <span className="text-[9px] text-cyan-500/50 not-italic uppercase tracking-widest font-mono font-bold">PTS</span>
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 bg-blue-500/5 scanline-horizontal" />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-8 h-8 bg-blue-500/20 rounded-full blur-sm"
                        />
                        <div className="w-2 h-2 bg-blue-400 rounded-full relative z-10 shadow-[0_0_10px_#60a5fa]" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="md:col-span-12 bg-white rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-2xl border-[4px] border-black"
                >
                  {/* LUXURY DECORATIONS */}
                  <div className="absolute top-6 right-6 flex gap-2 opacity-10">
                    <div className="w-12 h-1 bg-black rounded-full" />
                    <div className="w-6 h-1 bg-black rounded-full" />
                  </div>

                  {/* SIGNATURE TECH STRIPE */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-b from-cyan-500 via-blue-600 to-indigo-800" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-black text-[9px] font-black uppercase tracking-[0.2em]">
                        <ShieldAlert size={12} className="text-cyan-600" /> SECURE VOUCHER
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-black">
                          SCHOLARSHIP <br />
                          <span className="text-cyan-600 italic">GRANT</span> VOUCHER
                        </h3>
                      </div>
                      <div className="pt-4 border-t border-zinc-100 max-w-xs">
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.1em] leading-tight">
                          Valid for institutional grant allocation.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                      <div
                        onClick={copyToClipboard}
                        className="bg-zinc-50 border-4 border-double border-zinc-200 rounded-[2rem] p-6 md:p-8 cursor-pointer group/code transition-all hover:border-cyan-500/30 hover:bg-white w-full md:min-w-[320px] relative text-center md:text-right"
                      >
                        <p className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.3em] mb-2">Access Key</p>
                        <div className="text-4xl md:text-6xl font-mono font-black tracking-tighter text-black leading-none break-all">
                          {couponCode || "GTEC-SCORE-XXXX"}
                        </div>

                        <div className="mt-6 flex justify-center md:justify-end items-center gap-3">
                          <div className="w-12 h-1.5 bg-cyan-500/10 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-1/2 h-full bg-cyan-500"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={copyToClipboard}
                        className="group/btn relative h-14 w-full md:w-[300px] bg-black text-white rounded-[1.2rem] font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden shadow-lg active:scale-95 flex items-center justify-center gap-3 transition-all"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-3">
                          {copied ? <><CheckCircle2 size={16} className="text-cyan-400" /> COPIED</> : <><Copy size={16} /> COPY CODE</>}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-3xl">
                  {/* SYSTEM INTEGRITY BAR */}
                  <div className="hidden lg:flex items-center gap-4 px-6 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [8, 16, 8] }}
                          transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                          className="w-1 bg-cyan-500/40 rounded-full"
                        />
                      ))}
                    </div>
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] flex-1 text-left">
                      System Integrity: <span className="text-cyan-500/80">Optimal</span>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-600">
                      SEC_AUTH_v2.0
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.05, color: "#ffffff" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGameState("form")}
                      className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 px-6 py-3 border border-transparent hover:border-zinc-800 rounded-xl transition-all"
                    >
                      <X size={14} /> Reset
                    </motion.button>

                    <div className="w-px h-6 bg-zinc-800"></div>

                    <motion.button
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 30px rgba(37, 99, 235, 0.3)",
                        backgroundColor: "#2563eb"
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExit}
                      className="group bg-blue-600 text-white px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center gap-4"
                    >
                      Exit Game
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* FOOTER HASH */}
                <div className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest opacity-50">
                  Transaction_Hash: {transactionHash}
                </div>
              </div>
            </motion.div>
          )}
    </>
  );
}
