import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FaTrash,
  FaSearch,
  FaTrophy,
  FaPhone,
  FaTicketAlt,
  FaCalendarAlt,
  FaGamepad,
  FaPercentage,
  FaUser,
  FaBookOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentDots,
  FaSave
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://company-site-jrbr.onrender.com";

const reveal = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.05,
      ease: [0.21, 1.11, 0.81, 0.99],
    },
  }),
};

function Reveal({ children, index = 0, className = "" }) {
  return (
    <motion.div
      custom={index}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const getOffer = (scoreObj) => {
  // Use correctAnswers count directly if present, with backward-compatible fallback to points score division
  let answers = scoreObj.correctAnswers;
  if ((answers === undefined || answers === null || answers === 0) && scoreObj.score > 0) {
    answers = Math.floor(scoreObj.score / 10);
  }

  if (answers >= 20) return { label: "Max Tier", discount: "7% Discount", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (answers >= 10) return { label: "High Tier", discount: "5% Discount", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (answers >= 7) return { label: "Mid Tier", discount: "4% Discount", color: "bg-blue-100 text-blue-700 border-blue-200" };
  if (answers >= 5) return { label: "Low Tier", discount: "3% Discount", color: "bg-cyan-100 text-cyan-700 border-cyan-200" };
  if (answers >= 3) return { label: "Entry Tier", discount: "2% Discount", color: "bg-teal-100 text-teal-700 border-teal-200" };
  return { label: "Base Tier", discount: "1% Discount", color: "bg-slate-100 text-slate-600 border-slate-200" };
};

export default function AdminGameScores() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({}); // { [scoreId]: feedbackText }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
    },
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchScores();
    }
  }, [isAuthenticated]);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/gamescores/all`, authHeader);
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setScores(sorted);
      // Pre-populate feedbackMap with existing feedback
      const map = {};
      sorted.forEach(s => { map[s.id] = s.staff_feedback || ""; });
      setFeedbackMap(map);
    } catch (err) {
      console.error("Failed to fetch scores:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveFeedback = async (id) => {
    try {
      await axios.put(
        `${API}/gamescores/${id}/feedback`,
        { staff_feedback: feedbackMap[id] || "" },
        authHeader
      );
      setNotification({ type: "success", message: "Staff feedback saved successfully!" });
    } catch (err) {
      console.error("Failed to save feedback:", err);
      setNotification({ type: "error", message: "Failed to save feedback. Please try again." });
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API}/gamescores/${deleteTarget}`, authHeader);
      setScores(scores.filter((s) => s.id !== deleteTarget));
      setNotification({ type: "success", message: "Score record deleted successfully!" });
    } catch (err) {
      console.error("Failed to delete score:", err);
      if (err.response?.status === 404) {
        // If the record was already deleted or not found on the server, treat it as a success
        setScores(scores.filter((s) => s.id !== deleteTarget));
        setNotification({ type: "success", message: "Score record deleted successfully!" });
      } else {
        const errMsg = err.response?.data?.detail || "Failed to delete score record. Please try again.";
        setNotification({ type: "error", message: errMsg });
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredScores = scores.filter((s) => {
    const keyword = searchTerm.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(keyword) ||
      (s.couponCode || "").toLowerCase().includes(keyword) ||
      (s.course || "").toLowerCase().includes(keyword)
    );
  });

  if (!isAuthenticated) {
    return <div className="py-20 text-center text-gray-500 font-bold">Access Denied. Please Login.</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 pb-20 pt-32 sm:px-6">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-300/30 blur-3xl rounded-full top-[-100px] left-[-100px] pointer-events-none"></div>
      <div className="absolute w-[350px] h-[350px] bg-cyan-300/30 blur-3xl rounded-full bottom-[-100px] right-[-100px] pointer-events-none"></div>

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <Reveal>
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-50/50">
                <FaTrophy className="text-blue-600 text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scholarship Results</h1>
                <p className="text-slate-500 font-medium mt-1">Manage game performance & scholarship coupons</p>
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, code, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-600"
              />
            </div>
          </div>
        </Reveal>

        {!loading && filteredScores.length === 0 ? (
          <Reveal>
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-[2.5rem] p-20 text-center shadow-2xl shadow-blue-900/5">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGamepad className="text-slate-200 text-5xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No records found</h3>
              <p className="text-slate-400 mt-2">Try adjusting your search filters</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredScores.map((score, index) => {
                const offer = getOffer(score);
                return (
                  <Reveal key={score.id} index={index}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                        {/* Student Main Info */}
                        <div className="flex items-start gap-5">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-400 border border-slate-200">
                              {(score.name || "S").charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                              <FaUser className="text-blue-500 text-xs" />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-black text-slate-800 tracking-tight">{score.name}</h3>
                              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100 flex items-center gap-1.5">
                                <FaBookOpen size={10} /> {score.course}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm font-semibold text-slate-500">
                              <span className="flex items-center gap-2">
                                <FaPhone className="text-slate-300" /> {score.phone}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaCalendarAlt className="text-slate-300" />
                                {score.created_at ? score.created_at : "Recent"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Result Stats */}
                        <div className="flex flex-wrap items-center gap-4 lg:gap-8 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coupon Code</span>
                            <span className="font-mono text-lg font-black text-blue-600 flex items-center gap-2">
                              <FaTicketAlt size={16} className="text-blue-400" /> {score.couponCode}
                            </span>
                          </div>

                          <div className="w-px h-10 bg-slate-200 hidden sm:block" />

                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Score</span>
                            <span className="text-lg font-black text-slate-800 flex items-center gap-2">
                              <FaTrophy size={16} className="text-amber-500" /> {score.score.toLocaleString()}
                            </span>
                          </div>

                          <div className="w-px h-10 bg-slate-200 hidden sm:block" />

                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reward Tier</span>
                            <span className={`text-sm font-black px-3 py-1 rounded-lg border flex items-center gap-2 ${offer.color}`}>
                              {offer.discount}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {user?.user?.role === "admin" && (
                          <div className="flex items-center gap-2 self-end lg:self-center">
                            <button
                              onClick={() => handleDelete(score.id)}
                              className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 p-4 rounded-2xl transition-all border border-slate-100 hover:border-red-100 active:scale-95 group/btn"
                            >
                              <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        )}

                      </div>

                      {/* Staff Feedback Section */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FaCommentDots className="text-blue-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Staff Feedback</span>
                          </div>
                          <button
                            onClick={() => saveFeedback(score.id)}
                            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tight text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <FaSave size={10} /> Save
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Add internal notes or feedback about this scholarship result..."
                          value={feedbackMap[score.id] ?? (score.staff_feedback || "")}
                          onChange={(e) =>
                            setFeedbackMap((prev) => ({ ...prev, [score.id]: e.target.value }))
                          }
                          className="w-full resize-none rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300"
                        />
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Custom Framer Motion Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl shadow-blue-900/10 border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4">
                  <FaExclamationTriangle />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Delete Score Record</h3>
                <p className="text-slate-500 mb-8">
                  Are you sure you want to permanently delete this score? This action cannot be undone.
                </p>
                <div className="flex items-center gap-4 w-full">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Motion Toast Notifications */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-full max-w-sm px-4">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 pointer-events-auto backdrop-blur-md ${notification.type === "success"
                  ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                  : "bg-red-50/95 border-red-200 text-red-800"
                }`}
            >
              <div className="mt-0.5">
                {notification.type === "success" ? (
                  <FaCheckCircle className="text-emerald-500 text-xl" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-xl" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">
                  {notification.type === "success" ? "Success" : "Error"}
                </p>
                <p className="text-xs mt-1 leading-snug font-medium opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <FaTimesCircle size={14} className="opacity-60" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
