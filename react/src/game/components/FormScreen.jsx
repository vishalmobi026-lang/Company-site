import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft, Gamepad2, GraduationCap, XCircle, ArrowRight, ShieldCheck, Zap, Copy, Sparkles, User, Phone, ChevronDown, BookOpen, AlertCircle, Loader2, Rocket } from "lucide-react";

const smoothEase = [0.16, 1, 0.3, 1];
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 40, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };

export default function FormScreen({ ctx }) {
  const { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML } = ctx;
  return (
    <>
          {gameState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 1, ease: smoothEase }}
              className="w-full max-w-5xl my-8 md:my-auto mx-auto bg-[#0b1021]/80 backdrop-blur-2xl p-5 sm:p-8 md:p-12 rounded-[2.5rem] border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] relative"
            >
              {/* Back Button */}
              <button 
                onClick={() => setGameState("intro")} 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-white/5 hover:bg-cyan-900/30 text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] text-xs font-bold uppercase tracking-wider z-50 group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
              </button>

              {/* Inset Border Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-cyan-400/10 pointer-events-none z-20" />

              <div className="absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      <Sparkles size={14} /> Security Clearance
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-md">Pilot Registration</h2>
                    <p className="text-cyan-100/60 text-sm md:text-base font-semibold leading-relaxed">
                      Authenticate your credentials to generate your secure scholarship pass and enter the arena.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-5">
                    {/* Full Name Input Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-cyan-200/50 font-bold uppercase tracking-wider pl-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Full Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                          <User className="text-cyan-600 group-focus-within:text-cyan-400 group-focus-within:-translate-y-0.5 transition-all duration-300 ease-out" size={20} />
                        </div>
                        <input
                          type="text" placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-12 pr-4 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out text-base placeholder:text-cyan-600/50 font-semibold shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        />
                      </div>
                    </div>

                    {/* Phone Number Input Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-cyan-200/50 font-bold uppercase tracking-wider pl-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Contact Number</label>
                      <div className="flex gap-2 sm:gap-3 relative">
                        <div className="relative w-[42%] sm:w-[35%] shrink-0 group">
                          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none z-20">
                            <Phone className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={16} />
                          </div>
                          <select
                            value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                            className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-8 sm:pl-10 pr-6 sm:pr-8 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out appearance-none text-xs sm:text-base font-semibold cursor-pointer relative z-10 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          >
                            <option value="+91">IN (+91)</option>
                            {Array.isArray(countries) && countries.map((c) => <option key={c.id} value={`+${c.phonecode}`}>{c.id} (+{c.phonecode})</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none z-20">
                            <ChevronDown className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={16} />
                          </div>
                        </div>

                        <input
                          type="text" placeholder="Phone Number" value={formData.phone} onChange={handlePhoneChange} maxLength={formData.countryCode === "+91" ? 10 : 15}
                          className="w-[58%] sm:w-[65%] bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 px-3 sm:px-5 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out font-mono tracking-wider text-sm sm:text-lg placeholder:text-cyan-600/50 placeholder:font-sans font-semibold shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        />
                      </div>
                    </div>

                    {/* Course Selection Input Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-cyan-200/50 font-bold uppercase tracking-wider pl-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Target Sector</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                          <BookOpen className="text-cyan-600 group-focus-within:text-cyan-400 group-focus-within:-translate-y-0.5 transition-all duration-300 ease-out" size={20} />
                        </div>
                        <select
                          value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-12 pr-10 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out appearance-none text-base md:text-lg font-semibold cursor-pointer relative z-10 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        >
                          <option value="" disabled className="text-slate-400">Select Target Sector</option>
                          {categories.map((c) => (
                            <option key={c.id || c.name} value={c.name} className="text-slate-900 bg-white">
                              {c.name}
                            </option>
                          ))}                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-20">
                          <ChevronDown className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={20} />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {formError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex items-center gap-3 text-red-700 text-sm font-bold bg-red-50 py-3 px-4 rounded-xl border border-red-100">
                      <AlertCircle size={18} className="text-red-500 shrink-0" />
                      <p>{formError}</p>
                    </motion.div>
                  )}

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitForm} disabled={isFetchingQs}
                    className="group relative w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black py-4 md:py-5 rounded-2xl shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_-5px_rgba(34,211,238,0.6)] transition-all duration-300 text-base md:text-lg uppercase tracking-widest flex justify-center items-center gap-3 border border-cyan-400/50 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <span className="relative z-10 flex items-center gap-3 font-extrabold">
                      {isFetchingQs ? <><Loader2 className="animate-spin text-white" size={20} /> Calibrating...</> : <><Rocket size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 ease-out text-white" /> Ready to Launch</>}
                    </span>
                  </motion.button>
                </motion.div>

                {/* Ultimate 3D Gyro HUD Graphic Card */}
                <div className="hidden lg:flex flex-col items-center justify-center relative border-l border-slate-100 pl-16 py-8">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-cyan-500/5 to-transparent blur-[60px] rounded-full pointer-events-none" />

                  {/* Tech Coordinates HUD Markers */}
                  <div className="absolute top-0 left-16 font-mono text-[9px] text-slate-400/80 font-bold uppercase tracking-widest">SEC_LOCK: ACTIVE</div>
                  <div className="absolute bottom-0 right-0 font-mono text-[9px] text-slate-400/80 font-bold uppercase tracking-widest">COORDS: 42.99 // 88.01</div>

                  <motion.div
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center justify-center w-full max-w-[320px]"
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center scale-95 mt-2" style={{ perspective: "1000px" }}>

                      {/* Telemetry coordinate guides */}
                      <div className="absolute top-0 right-0 font-mono text-[8px] text-slate-400/60 uppercase tracking-widest">ALT: 1042.8M</div>
                      <div className="absolute bottom-0 left-0 font-mono text-[8px] text-slate-400/60 uppercase tracking-widest">HDG: 042.89°</div>

                      {/* OUTER HUD BRACKETS */}
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute w-56 h-56 border-[1px] border-slate-200 rounded-full pointer-events-none"
                        style={{ borderStyle: "dashed", borderDasharray: "20 40" }}
                      />

                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute w-48 h-48 border-[2px] border-blue-500/20 rounded-full pointer-events-none"
                        style={{ borderStyle: "dashed", borderDasharray: "10 50" }}
                      />

                      {/* 3D GYROSCOPIC RINGS */}
                      <motion.div
                        animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)] pointer-events-none"
                        style={{ transformStyle: "preserve-3d" }}
                      />

                      <motion.div
                        animate={{ rotateX: -360, rotateY: -360, rotateZ: 180 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 rounded-full border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)] pointer-events-none"
                        style={{ transformStyle: "preserve-3d" }}
                      />

                      {/* FLOATING DATA FRAGMENTS */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            rotate: [0, 360],
                            scale: [0.5, 1.5, 0.5],
                            opacity: [0, 0.8, 0]
                          }}
                          transition={{
                            duration: 3 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "linear"
                          }}
                          className="absolute w-1 h-6 bg-blue-500/40 blur-[1px] origin-[0_90px] pointer-events-none"
                          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                        />
                      ))}

                      {/* CENTRAL ENERGY CORE */}
                      <motion.div
                        animate={{
                          rotate: 45,
                          scale: [1, 1.15, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20 w-16 h-16 bg-gradient-to-tr from-blue-900 to-blue-600 rounded-xl shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-white/40 flex items-center justify-center overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 blur-sm mix-blend-overlay" />
                        <motion.div
                          animate={{ rotate: -90 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border border-white/40 rounded-sm"
                        />
                      </motion.div>

                      {/* PULSING BACKGROUND GLOW */}
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"
                      />
                    </div>

                    <div className="mt-8 relative group cursor-default">
                      <div className="absolute inset-0 bg-blue-500/5 blur-md rounded-full transition-colors duration-500" />
                      <div className="relative px-6 py-2 border border-blue-100 bg-blue-50/50 backdrop-blur-xl rounded-full flex items-center gap-2 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,1)]" />
                        <span className="text-blue-600 font-mono text-[10px] font-bold uppercase tracking-widest">System Calibrated</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

    </>
  );
}
