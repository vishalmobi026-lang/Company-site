import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IntroScreen from "./components/IntroScreen";
import FormScreen from "./components/FormScreen";
import PlayingScreen from "./components/PlayingScreen";
import ResultScreen from "./components/ResultScreen";
import GameStyles from "./components/GameStyles";
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
  const [categories, setCategories] = useState([]);
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
    fetch("https://company-site-jrbr.onrender.com/api/countries")
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

    fetch("https://company-site-jrbr.onrender.com/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // Lock body scroll when overlay is open and cleanup game loop on unmount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
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
        `https://company-site-jrbr.onrender.com/questions?topic=${encodeURIComponent(formData.course)}`
      )

      finalQuestions = await response.json()

      // IF DATABASE EMPTY OR ERROR → AUTO GENERATE
      if (!Array.isArray(finalQuestions) || finalQuestions.length === 0) {

        await fetch(
          `https://company-site-jrbr.onrender.com/generate-ai-questions?topic=${encodeURIComponent(formData.course)}`
        )

        // FETCH AGAIN
        const retryResponse = await fetch(
          `https://company-site-jrbr.onrender.com/questions?topic=${encodeURIComponent(formData.course)}`
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

  const handleKeyDown = (e) => {
    if (gameState !== "playing") return;
    if (e.key === "ArrowLeft" && stateRef.current.lane > 0) movePlayer(-1);
    if (e.key === "ArrowRight" && stateRef.current.lane < 2) movePlayer(1);
  };

  useEffect(() => {
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
      isQuestionActive: false, spawnTimer: 50, correctCount: 0,
      isEnded: false
    };

    setCorrectCount(0);

    setPlayerLane(1);
    
    const loop = (time) => {
      if (stateRef.current.isEnded) return;
      const state = stateRef.current;
      if (!state.lastTick) state.lastTick = time;
      const delta = time - state.lastTick;
      
      if (delta >= 30) {
        gameTick();
        state.lastTick = time - (delta % 30);
      }
      if (!stateRef.current.isEnded) {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };
    gameLoopRef.current = requestAnimationFrame(loop);
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

        state.spawnTimer = 50;
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
    if (stateRef.current.isEnded) return;
    stateRef.current.isEnded = true;
    cancelAnimationFrame(gameLoopRef.current);

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
      await fetch("https://company-site-jrbr.onrender.com/gamescores/add", {
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
    cancelAnimationFrame(gameLoopRef.current);
    onClose();
  };

  const ctx = { gameState, score, playerLane, entities, currentQuestion, floatingTexts, lives, combo, shake, couponCode, copied, correctCount, discount, countries, categories, formData, formError, isFetchingQs, setGameState, setScore, setPlayerLane, setEntities, setCurrentQuestion, setFloatingTexts, setLives, setCombo, setShake, setCouponCode, setCopied, setCorrectCount, setDiscount, setCountries, setCategories, setFormData, setFormError, setIsFetchingQs, triggerShake, addFloatingText, copyToClipboard, handlePhoneChange, submitForm, handleKeyDown, movePlayer, startGame, gameTick, endGame, handleExit, decodeHTML, stateRef };

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center font-sans select-none w-full h-full transition-colors duration-500 ${gameState === "playing" 
        ? "bg-slate-900 overflow-hidden" 
        : "bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <IntroScreen ctx={ctx} />
      <FormScreen ctx={ctx} />
      <PlayingScreen ctx={ctx} />
      <ResultScreen ctx={ctx} />
      <GameStyles />
    </div>
  );
}
