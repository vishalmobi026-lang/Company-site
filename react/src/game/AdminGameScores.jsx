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
  FaBookOpen
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API = "http://localhost:8000";

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

const getOffer = (score) => {
  if (score > 10000) return { label: "Top Tier", discount: "20% Discount", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (score > 5000) return { label: "Mid Tier", discount: "10% Discount", color: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Base Tier", discount: "5% Discount", color: "bg-slate-100 text-slate-600 border-slate-200" };
};

export default function AdminGameScores() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      setScores(res.data.sort((a, b) => b.id - a.id)); // Newest first
    } catch (err) {
      console.error("Failed to fetch scores:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this score record?")) return;
    try {
      await axios.delete(`${API}/gamescores/${id}`, authHeader);
      setScores(scores.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete score:", err);
      alert("Error deleting record");
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
    <div className="relative min-h-screen bg-[#f8fafc] px-4 pb-20 pt-32 sm:px-6">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400/5 blur-[100px] rounded-full -z-10" />

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <Reveal>
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-50">
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
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-600"
              />
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Secure Records...</p>
          </div>
        ) : filteredScores.length === 0 ? (
          <Reveal>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center shadow-2xl shadow-blue-900/5">
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
                const offer = getOffer(score.score);
                return (
                  <Reveal key={score.id} index={index}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
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
                              <FaPercentage size={12} /> {offer.discount}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end lg:self-center">
                          <button
                            onClick={() => handleDelete(score.id)}
                            className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 p-4 rounded-2xl transition-all border border-slate-100 hover:border-red-100 active:scale-95 group/btn"
                          >
                            <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
