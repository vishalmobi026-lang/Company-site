import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, ArrowRight, ShieldAlert, Sparkles, Copy, CheckCircle2, Clock,
  ChevronLeft, ChevronRight, Heart, Zap, Bomb,
  User, Phone, BookOpen, BrainCircuit, X, Loader2,
  ChevronDown, AlertCircle, Rocket, Gamepad2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_CATEGORY_MAP = {
  "IT / Technical": 18,
  "IT / Non-Technical": 9,
  "Designing": 25,
  "Accounting": 19,
  "Civil": 17
};


const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};



const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: smoothEase }
  }
};

/* ================= NEON STRIKE GAME COMPONENT ================= */

export default function NeonStrikeGame({ onClose }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("intro");
  const [score, setScore] = useState(0);
  const [playerLane, setPlayerLane] = useState(1);
  const [entities, setEntities] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [shake, setShake] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ name: "", countryCode: "+91", phone: "", course: "" });
  const [formError, setFormError] = useState("");
  const [isFetchingQs, setIsFetchingQs] = useState(false);

  const stateRef = useRef({
    lane: 1, score: 0, lives: 3, combo: 1,
    speed: 0.35,
    entities: [], flashTimer: 0, frame: 0,
    questions: [], qIndex: 0, isQuestionActive: false,
    spawnTimer: 30, correctCount: 0
  });

  const gameLoopRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/countries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          console.warn("API did not return an array for countries, using empty fallback.");
          setCountries([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
        setCountries([]);
      });
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const addFloatingText = (text, color, lane) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color, lane }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1000);
  };

  const copyToClipboard = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: digitsOnly });
  };

  const submitForm = async () => {

    if (!formData.course) {
      return setFormError("Please select a target course.")
    }

    setFormError("")
    setIsFetchingQs(true)

    let finalQuestions = []

    try {

      // FETCH QUESTIONS FROM YOUR FASTAPI
      const response = await fetch(
        `http://localhost:8000/questions?topic=${encodeURIComponent(formData.course)}`
      )

      finalQuestions = await response.json()

      // IF DATABASE EMPTY OR ERROR → AUTO GENERATE
      if (!Array.isArray(finalQuestions) || finalQuestions.length === 0) {

        await fetch(
          `http://localhost:8000/generate-ai-questions?topic=${encodeURIComponent(formData.course)}`
        )

        // FETCH AGAIN
        const retryResponse = await fetch(
          `http://localhost:8000/questions?topic=${encodeURIComponent(formData.course)}`
        )

        finalQuestions = await retryResponse.json()
      }

      // STILL EMPTY
      if (!Array.isArray(finalQuestions) || finalQuestions.length === 0) {

        setFormError("No questions available or generation failed.")

        setIsFetchingQs(false)

        return
      }

      startGame(finalQuestions)

    } catch (error) {

      console.error(error)

      setFormError("Failed to load questions.")

    } finally {

      setIsFetchingQs(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" && stateRef.current.lane > 0) movePlayer(-1);
      if (e.key === "ArrowRight" && stateRef.current.lane < 2) movePlayer(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const movePlayer = (direction) => {
    const newLane = stateRef.current.lane + direction;
    if (newLane >= 0 && newLane <= 2) {
      stateRef.current.lane = newLane;
      setPlayerLane(newLane);
    }
  };

  const startGame = (questionsToPlay) => {
    setGameState("playing");
    setScore(0); setLives(3); setCombo(1); setEntities([]);

    setCurrentQuestion(questionsToPlay[0].q);

    stateRef.current = {
      lane: 1, score: 0, lives: 3, combo: 1, speed: 0.35, entities: [],
      flashTimer: 0, frame: 0, questions: questionsToPlay, qIndex: 0,
      isQuestionActive: false, spawnTimer: 166, correctCount: 0
    };

    setCorrectCount(0);

    setPlayerLane(1);
    gameLoopRef.current = setInterval(gameTick, 30);
  };

  const gameTick = () => {
    const state = stateRef.current;
    state.frame += 1;

    if (state.frame % 300 === 0) state.speed += 0.015;
    if (state.flashTimer > 0) state.flashTimer -= 30;

    if (!state.isQuestionActive) {
      if (state.spawnTimer > 0) {
        state.spawnTimer--;
      } else {
        if (state.qIndex >= state.questions.length) state.qIndex = 0;

        const qData = state.questions[state.qIndex];
        state.isQuestionActive = true;

        const laneOrder = [0, 1, 2];
        const selectedOptions = [];
        selectedOptions.push({ text: qData.options[qData.correct], isCorrect: true });

        const incorrects = qData.options.filter((_, i) => i !== qData.correct);
        selectedOptions.push({ text: incorrects[0] || "None", isCorrect: false });
        selectedOptions.push({ text: incorrects[1] || "All", isCorrect: false });

        selectedOptions.sort(() => Math.random() - 0.5);

        selectedOptions.forEach((opt, index) => {
          state.entities.push({
            id: Date.now() + Math.random(),
            lane: laneOrder[index],
            top: -10,
            text: opt.text,
            isCorrect: opt.isCorrect,
            revealed: false
          });
        });
      }
    }

    let hitWrong = false;
    let waveCompleted = false;

    state.entities = state.entities.map(ent => ({ ...ent, top: ent.top + state.speed }))
      .filter(ent => {
        const inHitbox = ent.top > 75 && ent.top < 90 && ent.lane === state.lane;

        if (inHitbox && !ent.revealed) {
          ent.revealed = true;
          waveCompleted = true;

          if (ent.isCorrect) {
            state.correctCount += 1;
            const pts = 10; // 10 points per correct answer
            state.score += pts;
            state.combo = Math.min(state.combo + 1, 10);
            setCombo(state.combo);
            setCorrectCount(state.correctCount);
            addFloatingText(`+${pts}`, "text-green-400", state.lane);
          } else {
            hitWrong = true;
            addFloatingText("WRONG", "text-red-500", state.lane);
          }
        }
        return ent.top < 120;
      });

    if (waveCompleted) {
      setTimeout(() => {
        state.entities = [];
        state.isQuestionActive = false;
        state.qIndex++;

        if (state.qIndex >= state.questions.length) state.qIndex = 0;
        setCurrentQuestion(state.questions[state.qIndex].q);

        state.spawnTimer = 166;
      }, 800);
    }

    if (hitWrong) {
      triggerShake();
      state.lives -= 1;
      state.combo = 1;
      state.flashTimer = 2000;

      setLives(state.lives);
      setCombo(state.combo);

      if (state.lives <= 0) {
        endGame();
        return;
      }
    }

    if (state.frame % 3 === 0) {
      setScore(state.score);
      setEntities([...state.entities]);
    }
  };

  const endGame = async () => {
    clearInterval(gameLoopRef.current);

    const finalScore = stateRef.current.score;
    let prefix = "B2";
    if (finalScore > 10000) prefix = "X9";
    else if (finalScore > 5000) prefix = "V7";

    const code = `GTEC-${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const count = stateRef.current.correctCount;
    const calculatedDiscount = count >= 20 ? 7 : count >= 10 ? 5 : count >= 7 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : 1;

    setCouponCode(code);
    setDiscount(calculatedDiscount);
    setGameState("result");

    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    try {
      await fetch("http://localhost:8000/gamescores/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: fullPhoneNumber,
          course: formData.course,
          score: finalScore,
          couponCode: code,
          discount: calculatedDiscount,
          correctAnswers: count
        })
      });
    } catch (error) { console.error("Failed to save score:", error); }

  };

  const handleExit = () => {
    clearInterval(gameLoopRef.current);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center font-sans overflow-hidden select-none w-full h-full transition-colors duration-500 ${gameState === "playing"
        ? "bg-gradient-to-br from-[#0a0514] via-[#11092e] to-[#0a1930]"
        : "bg-slate-950/40 backdrop-blur-sm"
      }`}>

      {gameState === "playing" ? (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none nebula-glow-1"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none nebula-glow-2"></div>
        </>
      ) : (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        </>
      )}

      {gameState !== "playing" && (
        <button onClick={handleExit} className="absolute top-4 right-4 md:top-6 md:right-6 z-[100000] bg-white/95 hover:bg-red-50 text-slate-400 hover:text-red-500 p-3 rounded-full border border-blue-100 shadow-xl transition-all duration-500 active:scale-95">
          <X size={24} />
        </button>
      )}

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="w-full h-full relative z-10 flex flex-col justify-start md:justify-center max-w-[1920px] mx-auto overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence mode="wait">

          {/* ----- 1. INTRO SCREEN ----- */}
          {gameState === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="min-h-[100svh] w-full flex flex-col items-center justify-start md:justify-center p-4 py-16 md:p-10 relative"
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

          {/* ----- 2. FORM SCREEN ----- */}
          {gameState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 1, ease: smoothEase }}
              className="w-full max-w-5xl my-16 md:my-auto mx-auto bg-[#0b1021]/80 backdrop-blur-2xl p-5 sm:p-8 md:p-12 rounded-[2.5rem] border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] relative overflow-hidden"
            >
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
                      <div className="flex gap-3 relative">
                        <div className="relative w-[35%] shrink-0 group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                            <Phone className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={18} />
                          </div>
                          <select
                            value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                            className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-10 pr-8 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out appearance-none text-sm md:text-base font-semibold cursor-pointer relative z-10 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          >
                            <option value="+91">IN (+91)</option>
                            {Array.isArray(countries) && countries.map((c) => <option key={c.id} value={`+${c.phonecode}`}>{c.id} (+{c.phonecode})</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20">
                            <ChevronDown className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={16} />
                          </div>
                        </div>

                        <input
                          type="text" placeholder="Phone Number" value={formData.phone} onChange={handlePhoneChange} maxLength={formData.countryCode === "+91" ? 10 : 15}
                          className="w-[65%] bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 px-5 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out font-mono tracking-wider text-base md:text-lg placeholder:text-cyan-600/50 placeholder:font-sans font-semibold shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
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
                          {[
                            "IT / Technical",
                            "IT / Non-Technical",
                            "Designing",
                            "Accounting",
                            "Civil"
                          ].map((c) => (
                            <option key={c} value={c} className="text-slate-900 bg-white">
                              {c}
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

          {/* ----- 3. GAMEPLAY HUD ----- */}
          {gameState === "playing" && (
            <motion.div key="playing" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className="flex flex-col h-full w-full relative">
              <div className="absolute top-0 left-0 w-full z-[100] pointer-events-none p-4 md:p-6 flex justify-between items-start">
                <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto">
                  <div className="relative overflow-hidden flex flex-col gap-1.5 bg-[#050917]/90 backdrop-blur-md p-4 rounded-3xl border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-500 max-w-[200px]">
                    {/* Glowing Tech Corners */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400/60"></div>
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400/60"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400/60"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400/60"></div>

                    {/* Pulsing indicator */}
                    <div className="absolute top-2 right-4 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"></span>
                      <span className="font-mono text-[7px] text-cyan-400/60 tracking-wider">HUD_v3</span>
                    </div>

                    <p className="font-mono text-[8px] text-cyan-400/70 font-black uppercase tracking-[0.25em] mb-0.5">Telemetry Score</p>
                    <div className="font-black font-mono text-2xl md:text-3xl text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] flex items-baseline gap-1.5 leading-none">
                      {score.toLocaleString()} <span className="text-[10px] text-cyan-400 font-bold tracking-widest font-sans uppercase">PTS</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyan-400/20">
                      <span className="font-mono text-[7px] text-slate-400 font-bold uppercase tracking-widest">Shields</span>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Heart key={i} size={13} className={i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-[heartPulse_1.5s_infinite_alternate]" : "text-white/20"} style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-black font-mono text-sm md:text-lg flex items-center gap-2 shadow-xl backdrop-blur-md transition-all duration-500 ease-out ${combo > 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-black/40 text-white/50 border border-white/10'}`}>
                    <Zap size={18} className={combo > 1 ? "fill-yellow-400" : ""} /> x{combo}
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-start w-1/2 max-w-2xl mt-1">
                  <AnimatePresence mode="wait">
                    {currentQuestion && (
                      <motion.div
                        initial={{ y: -20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} transition={{ duration: 0.5, ease: smoothEase }}
                        className="bg-[#050917]/95 backdrop-blur-xl border-2 border-cyan-400/80 rounded-3xl p-5 text-center shadow-[0_0_40px_rgba(34,211,238,0.3)] w-full relative overflow-hidden animate-[hudScan_10s_linear_infinite]"
                      >
                        {/* Glowing corner brackets */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

                        {/* Faint Grid Scanline Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_96%,rgba(34,211,238,0.08)_96%)] bg-[length:100%_8px] opacity-40 pointer-events-none"></div>

                        {/* Telemetry info in tiny fonts */}
                        <div className="absolute top-2 left-6 font-mono text-[8px] text-cyan-400/60 uppercase tracking-widest">Target Node ID: GTEC_98</div>
                        <div className="absolute top-2 right-6 font-mono text-[8px] text-cyan-400/60 uppercase tracking-widest">Link Rate: 99.8%</div>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 opacity-60"></div>
                        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          <Sparkles size={12} className="text-cyan-400" /> Target Acquired
                        </p>
                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight mt-2 px-4 select-text">{currentQuestion}</h3>
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

              <div className="md:hidden absolute top-[120px] left-1/2 -translate-x-1/2 w-[92%] z-[90] pointer-events-none">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div
                      initial={{ y: -20, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(5px)" }} transition={{ duration: 0.5, ease: smoothEase }}
                      className="bg-[#050917]/95 backdrop-blur-xl border-2 border-cyan-400/80 rounded-2xl p-4 text-center shadow-[0_0_30px_rgba(34,211,238,0.25)] relative overflow-hidden"
                    >
                      {/* Glowing corner brackets */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80"></div>

                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 opacity-60"></div>
                      <p className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <Sparkles size={10} /> Target Acquired
                      </p>
                      <h3 className="text-base font-black text-white leading-snug mt-1 px-2 select-text">{currentQuestion}</h3>
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
                          <div className="relative overflow-hidden bg-[#050917]/95 border-2 border-cyan-400/70 p-3 md:p-6 rounded-2xl text-white font-bold text-center shadow-[0_0_30px_rgba(34,211,238,0.25)] backdrop-blur-md flex items-center justify-center min-h-[60px] md:min-h-[100px] w-full break-words transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.45)]">
                            {/* Futuristic Tech Corner Brackets */}
                            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80"></div>
                            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80"></div>
                            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80"></div>
                            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80"></div>

                            {/* Faint Scanline Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,45,0)_95%,rgba(34,211,238,0.15)_95%)] bg-[length:100%_6px] opacity-35 pointer-events-none"></div>

                            <span className="relative z-10 text-[10px] leading-tight sm:text-xs md:text-lg md:leading-snug bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent drop-shadow-sm select-text">{ent.text}</span>
                          </div>
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
                      className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
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

                  <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
                    <ChevronLeft size={44} className="text-cyan-500 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:-translate-x-2 transition-all duration-300" />
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

                  <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
                    <div className="flex flex-col items-end text-right">
                      <span className="hidden md:block text-[10px] text-cyan-500/50 font-mono font-bold uppercase tracking-widest group-hover:text-cyan-400/80 transition-colors">System Override</span>
                      <span className="hidden md:block text-cyan-500/80 font-mono font-black tracking-[0.2em] uppercase text-sm group-hover:text-cyan-300 transition-colors">Starboard</span>
                    </div>
                    <ChevronRight size={44} className="text-cyan-500 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] group-hover:translate-x-2 transition-all duration-300" />
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

          {/* ----- 4. RESULT SCREEN ----- */}
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
                      <p className="font-mono text-[11px] text-zinc-400">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
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
                  Transaction_Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
        }
        .starfield-3 {
          background-image: 
            radial-gradient(2px 2px at 15px 150px, #fff, transparent),
            radial-gradient(2.5px 2.5px at 95px 85px, #fff, transparent),
            radial-gradient(2px 2px at 180px 20px, #fff, transparent),
            radial-gradient(3px 3px at 230px 260px, rgba(255,255,255,0.9), transparent);
          background-size: 280px 280px;
          animation: moveStarsFast 8s linear infinite;
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
        }
        .scanline-vertical {
          background: linear-gradient(to right, transparent, rgba(34,211,238,0.4), transparent);
          background-size: 4px 100%;
          animation: scan-h 8s linear infinite;
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
    </div>
  );
}
