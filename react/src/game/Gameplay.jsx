import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, ArrowRight, ShieldAlert, Sparkles, Copy, CheckCircle2,
  ChevronLeft, ChevronRight, Heart, Zap, Bomb,
  User, Phone, BookOpen, BrainCircuit, X, Loader2,
  ChevronDown, AlertCircle, Rocket, Gamepad2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ALL_QUESTIONS } from "./questions";

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
    if (formData.name.trim().length < 3) return setFormError("Name must be at least 3 characters.");
    if (formData.countryCode === "+91" && formData.phone.length !== 10) return setFormError("Indian phone numbers must be exactly 10 digits.");
    if (formData.countryCode !== "+91" && formData.phone.length < 6) return setFormError("Please enter a valid phone number.");
    if (!formData.course) return setFormError("Please select a target course.");

    setFormError("");
    setIsFetchingQs(true);

    let finalQuestions = [];

    try {
      // Use the expanded local question bank (100 questions per field)
      const localPool = ALL_QUESTIONS[formData.course] || ALL_QUESTIONS["IT / Technical"];
      
      // Randomize the questions
      finalQuestions = [...localPool].sort(() => Math.random() - 0.5);
      
      // Shuffle options for each question to increase variety
      finalQuestions = finalQuestions.map(item => {
        const optionsWithIndex = item.options.map((opt, idx) => ({ text: opt, isCorrect: idx === item.correct }));
        const shuffledOptions = [...optionsWithIndex].sort(() => Math.random() - 0.5);
        const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);
        
        return {
          q: item.q,
          options: shuffledOptions.map(o => o.text),
          correct: newCorrectIndex
        };
      });

    } catch (error) {
      console.error("Error setting up questions:", error);
      // Minimal fallback
      finalQuestions = [{ q: "Error loading questions. Restart?", options: ["Restart", "Exit", "Retry"], correct: 0 }];
    }

    setIsFetchingQs(false);
    startGame(finalQuestions);
  };

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
      isQuestionActive: false, spawnTimer: 30, correctCount: 0
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

        state.spawnTimer = 70;
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
    const calculatedDiscount = count >= 20 ? 7 : count >= 10 ? 5 : count >= 7 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : count >= 1 ? 1 : 0;
    
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
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-[#0a0514] via-[#11092e] to-[#0a1930] flex items-center justify-center font-sans overflow-hidden select-none w-full h-full">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      {gameState !== "playing" && (
        <button onClick={handleExit} className="absolute top-4 right-4 md:top-6 md:right-6 z-[100000] bg-white/10 hover:bg-red-500/80 text-white p-3 rounded-full backdrop-blur-md transition-all duration-500 border border-white/20 shadow-lg">
          <X size={24} />
        </button>
      )}

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="w-full h-full relative z-10 flex flex-col justify-center max-w-[1920px] mx-auto"
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
              className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 cyber-grid opacity-20 z-0" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1)_0%,transparent_60%)] z-0" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: smoothEase }}
                className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-stretch"
              >
                {/* LEFT PANEL: TITLE */}
                <motion.div
                  whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                  className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden relative group"
                >
                  <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="absolute top-0 right-0 p-6 opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
                    <span className="font-mono text-[10px] text-cyan-300 tracking-widest uppercase">SYS_REF: G-TEC_BRAIN_V3</span>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    >
                      <BrainCircuit size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    </motion.div>

                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="space-y-3"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                        <ShieldAlert size={14} /> Security Clearance: Level 1
                      </div>
                      <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1.1] uppercase tracking-tighter">
                        KNOWLEDGE <br /> 
                        <motion.span 
                          animate={{ 
                            opacity: [1, 0.8, 1, 0.9, 1],
                            textShadow: [
                              "0 0 20px rgba(34,211,238,0.4)",
                              "0 0 40px rgba(34,211,238,0.7)",
                              "0 0 20px rgba(34,211,238,0.4)"
                            ],
                            x: [0, -1, 1, -0.5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 1] }}
                          className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 italic inline-block mt-2"
                        >
                          COMMAND
                        </motion.span>
                      </h1>
                    </motion.div>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-slate-400 font-mono text-sm leading-relaxed border-l-2 border-cyan-500/50 pl-5 relative z-10 bg-black/20 p-4 rounded-r-2xl backdrop-blur-sm"
                  >
                    <span className="text-cyan-400 font-bold">Establish neural handshake.</span> <br />
                    Target: 100% Scholarship Grant Allocation.
                  </motion.p>
                </motion.div>

                {/* RIGHT PANEL: DIRECTIVES */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}
                  className="lg:w-[450px] bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative flex flex-col justify-between"
                >
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/10">
                      <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-3">
                        <Sparkles className="text-cyan-400" size={24} /> Directives
                      </h3>
                      <div className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> LIVE
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { label: "01_LIMIT", text: "One session attempt per verified UID." },
                        { label: "02_TIMER", text: "Sixty-second response window per node." },
                        { label: "03_CRED", text: "Identity verification mandatory for grant." },
                        { label: "04_DATA", text: "System logs IP and attempt metadata." }
                      ].map((item, idx) => (
                        <div key={idx} className="group flex gap-4 items-start">
                          <div className="mt-1 text-[10px] font-mono text-cyan-500/70 group-hover:text-cyan-400 transition-colors">[{item.label.split('_')[0]}]</div>
                          <div>
                            <p className="text-[10px] text-cyan-500 font-mono mb-0.5 opacity-60 group-hover:opacity-100 transition-opacity">{item.label}</p>
                            <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 space-y-5">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setGameState("form")}
                      className="group relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 md:py-5 rounded-2xl transition-all duration-500 ease-out shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_10px_40px_rgba(34,211,238,0.4)] text-lg uppercase tracking-widest flex justify-center items-center gap-3 border border-cyan-400/50 overflow-hidden hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="relative z-10 flex items-center gap-3">
                        Initialize System <ArrowRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 ease-out" />
                      </span>
                    </motion.button>
                    <p className="text-[10px] text-slate-500 text-center font-mono uppercase tracking-[0.2em]">Authorized Access Only // Port_8080</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ----- 2. FORM SCREEN ----- */}
          {gameState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: smoothEase }}
              className="w-full max-w-5xl mx-auto bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none"
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                  <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                      <Sparkles size={14} className="animate-pulse" /> Security Clearance
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Pilot Registration</h2>
                    <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                      Authenticate your credentials to generate your secure scholarship pass and enter the arena.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-5">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={20} />
                      </div>
                      <input
                        type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 pl-12 pr-4 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out text-base placeholder:text-slate-500 font-medium shadow-inner"
                      />
                    </div>

                    <div className="flex gap-3 relative">
                      <div className="relative w-[35%] shrink-0 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={18} />
                        </div>
                        <select
                          value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="w-full bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 pl-10 pr-8 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out appearance-none text-sm md:text-base font-medium shadow-inner cursor-pointer"
                        >
                          <option value="+91">IN (+91)</option>
                          {Array.isArray(countries) && countries.map((c) => <option key={c.id} value={`+${c.phonecode}`}>{c.id} (+{c.phonecode})</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={16} />
                        </div>
                      </div>

                      <input
                        type="text" placeholder="Phone Number" value={formData.phone} onChange={handlePhoneChange} maxLength={formData.countryCode === "+91" ? 10 : 15}
                        className="w-[65%] bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 px-5 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out font-mono tracking-wider text-base md:text-lg placeholder:text-slate-500 placeholder:font-sans font-medium shadow-inner"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BookOpen className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={20} />
                      </div>
                      <select
                        value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full bg-slate-900/40 border border-slate-700/50 text-white rounded-2xl py-4 pl-12 pr-10 hover:bg-slate-800/40 focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all duration-500 ease-out appearance-none text-base md:text-lg font-medium shadow-inner cursor-pointer"
                      >
                        <option value="" disabled>Select Target Sector</option>
                        {Object.keys(ALL_QUESTIONS).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronDown className="text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-500 ease-out" size={20} />
                      </div>
                    </div>
                  </motion.div>

                  {formError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex items-center gap-3 text-red-300 text-sm font-bold bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20 backdrop-blur-md">
                      <AlertCircle size={18} className="text-red-400 shrink-0" />
                      <p>{formError}</p>
                    </motion.div>
                  )}

                  <motion.button
                    variants={itemVariants}
                    whileTap={{ scale: 0.97 }}
                    onClick={submitForm} disabled={isFetchingQs}
                    className="group relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 md:py-5 rounded-2xl transition-all duration-500 ease-out shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_10px_40px_rgba(34,211,238,0.4)] text-lg uppercase tracking-widest flex justify-center items-center gap-3 border border-cyan-400/50 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      {isFetchingQs ? <><Loader2 className="animate-spin" size={22} /> Calibrating...</> : <><Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 ease-out" /> Ready to Launch</>}
                    </span>
                  </motion.button>
                </motion.div>

                <div className="hidden lg:flex flex-col items-center justify-center relative border-l border-white/5 pl-16 py-8">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-blue-500/5 to-transparent blur-[60px] rounded-full pointer-events-none"></div>

                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center justify-center w-full max-w-[320px]"
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center scale-95 mt-2" style={{ perspective: "1000px" }}>
                      
                      {/* OUTER HUD BRACKETS */}
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute w-56 h-56 border-[1px] border-cyan-500/20 rounded-full pointer-events-none"
                        style={{ borderStyle: "dashed", borderDasharray: "20 40" }}
                      />

                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute w-48 h-48 border-[2px] border-blue-500/30 rounded-full pointer-events-none"
                        style={{ borderStyle: "dashed", borderDasharray: "10 50" }}
                      />

                      {/* 3D GYROSCOPIC RINGS */}
                      <motion.div
                        animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none"
                        style={{ transformStyle: "preserve-3d" }}
                      />

                      <motion.div
                        animate={{ rotateX: -360, rotateY: -360, rotateZ: 180 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 rounded-full border-2 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)] pointer-events-none"
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
                          className="absolute w-1 h-6 bg-cyan-400/60 blur-[1px] origin-[0_90px] pointer-events-none"
                          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                        />
                      ))}

                      {/* CENTRAL ENERGY CORE */}
                      <motion.div
                        animate={{ 
                          rotate: 45,
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20 w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.8)] border-2 border-white/40 flex items-center justify-center overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 blur-sm mix-blend-overlay" />
                        <motion.div 
                          animate={{ rotate: -90 }} 
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border border-white/50 rounded-sm"
                        />
                      </motion.div>

                      {/* PULSING BACKGROUND GLOW */}
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"
                      />
                    </div>

                    <div className="mt-8 relative group cursor-default">
                      <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full transition-colors duration-500"></div>
                      <div className="relative px-6 py-2 border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                        <span className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest">System Calibrated</span>
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
                  <div className="flex flex-col gap-1 bg-black/60 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 shadow-xl transition-all duration-500">
                    <div className="font-black font-mono text-2xl md:text-4xl text-white drop-shadow-md flex items-baseline gap-2 leading-none">
                      {score.toLocaleString()} <span className="text-xs md:text-sm text-cyan-400 hidden sm:inline">PTS</span>
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      {[...Array(3)].map((_, i) => (
                        <Heart key={i} size={18} className={i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-white/20"} />
                      ))}
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
                        className="bg-[#0b132b]/90 backdrop-blur-xl border border-cyan-500/60 rounded-2xl p-4 text-center shadow-[0_15px_30px_rgba(34,211,238,0.15)] w-full relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"></div>
                        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center justify-center gap-2">
                          <Sparkles size={12} /> Target Acquired
                        </p>
                        <h3 className="text-lg md:text-xl font-black text-white leading-tight">{currentQuestion}</h3>
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
                      className="bg-[#0b132b]/95 backdrop-blur-xl border border-cyan-500/60 rounded-2xl p-3 text-center shadow-[0_10px_30px_rgba(34,211,238,0.2)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"></div>
                      <p className="text-cyan-400 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                        <Sparkles size={10} /> Target Acquired
                      </p>
                      <h3 className="text-sm font-black text-white leading-snug">{currentQuestion}</h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1 w-full overflow-hidden" style={{ perspective: '1200px' }}>
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
                  <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.2)_50%)] bg-[length:100%_120px] animate-[slideDown_0.6s_linear_infinite]"></div>
                  </div>
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-80">
                    <div className="w-3 md:w-5 h-full bg-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.9)] transition-all duration-500"></div>
                    <div className="w-3 md:w-5 h-full bg-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.9)] transition-all duration-500"></div>
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
                          <div className="bg-[#0b132b]/95 border-2 border-cyan-400 p-2 md:p-4 rounded-xl md:rounded-2xl text-white font-bold text-center shadow-[0_10px_20px_rgba(34,211,238,0.4)] backdrop-blur-md flex items-center justify-center min-h-[50px] md:min-h-[90px] w-full break-words transition-all duration-300">
                            <span className="text-[10px] leading-tight sm:text-xs md:text-lg md:leading-snug">{ent.text}</span>
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
                      {[1,2,3,4,5].map(i => (
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
