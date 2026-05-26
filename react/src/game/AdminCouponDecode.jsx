import React, { useState } from 'react';
import { Percent, Trophy, AlertCircle, Gamepad2, User, Phone, BookOpen, Search, Loader2 } from 'lucide-react';

export default function AdminCouponDecoder() {
  const [inputCode, setInputCode] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    const code = inputCode.trim().toUpperCase();
    
    if (!code.startsWith("GTEC-")) {
      setResult({ valid: false, message: "Invalid Coupon Format. Must start with GTEC-" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Fetch all game scores from the backend
      const response = await fetch('https://company-site-jrbr.onrender.com/gamescores/all');
      const data = await response.json();


      // Find the specific user who owns this coupon code
      const foundStudent = data.find(student => student.couponCode === code);

      if (foundStudent) {
        // Determine the tier dynamically based on the exact correctAnswers count
        let level = "No Tier Offer";
        let discount = "0% Discount";
        
        let answers = foundStudent.correctAnswers;
        if ((answers === undefined || answers === null || answers === 0) && foundStudent.score > 0) {
          answers = Math.floor(foundStudent.score / 10);
        }

        let hits = `${answers} Pts`;

        if (answers >= 20) {
          level = "Max Tier Offer";
          discount = "7% Discount";
          hits = "20+ Pts";
        } else if (answers >= 10) {
          level = "High Tier Offer";
          discount = "5% Discount";
          hits = "10-19 Pts";
        } else if (answers >= 7) {
          level = "Mid Tier Offer";
          discount = "4% Discount";
          hits = "7-9 Pts";
        } else if (answers >= 5) {
          level = "Low Tier Offer";
          discount = "3% Discount";
          hits = "5-6 Pts";
        } else if (answers >= 3) {
          level = "Entry Tier Offer";
          discount = "2% Discount";
          hits = "3-4 Pts";
        } else {
          level = "Base Tier Offer";
          discount = "1% Discount";
          hits = "0-2 Pts";
        }

        setResult({ 
          valid: true, 
          name: foundStudent.name,
          phone: foundStudent.phone,
          course: foundStudent.course,
          score: foundStudent.score.toLocaleString(),
          hits, 
          level, 
          discount 
        });
      } else {
        setResult({ valid: false, message: "Coupon code not found in the database. It may be fake or expired." });
      }
    } catch (error) {
      console.error("Error fetching coupon data:", error);
      setResult({ valid: false, message: "Failed to connect to the server." });
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 pb-20 pt-32 sm:px-6 font-sans">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-300/30 blur-3xl rounded-full top-[-100px] left-[-100px] pointer-events-none"></div>
      <div className="absolute w-[350px] h-[350px] bg-cyan-300/30 blur-3xl rounded-full bottom-[-100px] right-[-100px] pointer-events-none"></div>

      <div className="mx-auto flex justify-center relative z-10">
        <div className="w-full max-w-lg bg-[#0d1326]/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.3)] p-8 relative overflow-hidden">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded-lg shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Nexus Decryptor</h2>
              <p className="text-blue-400/70 text-[10px] font-mono tracking-widest mt-1">SECURE_CHANNEL: ACTIVE</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 tracking-widest font-mono uppercase mb-0.5">Sys_Status</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]"></div> OPTIMAL
            </span>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          <div className="relative">
            <label className="text-[10px] text-blue-300/60 font-mono tracking-widest uppercase mb-2 block">Input Hash Signature</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="GTEC-XXXX-XXXX" 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="w-full bg-[#080d19] border border-blue-500/30 text-cyan-300 font-mono tracking-[0.2em] text-lg rounded-xl py-4 pl-4 pr-12 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all uppercase placeholder:text-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/50" size={20} />
            </div>
          </div>

          <button 
            onClick={handleVerify}
            disabled={isLoading || !inputCode.trim()}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30 text-sm tracking-widest uppercase font-mono"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {isLoading ? "Decoding..." : "Initialize Decode"}
          </button>
        </div>

        {result && (
          <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-500 ${result.valid ? 'bg-[#0a141d]/80 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'bg-[#1a0f14]/80 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)]'}`}>
            {result.valid ? (
              <div className="space-y-6">
                
                {/* Status Banner */}
                <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
                  <p className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase">
                    <CheckCircle size={14} className="text-emerald-500" /> Verified_Result
                  </p>
                  <span className="text-[9px] text-emerald-500/60 font-mono border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-950/20">AUTH_V2.0</span>
                </div>

                {/* Subject Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-1">Subject Identity</p>
                    <div className="flex items-center gap-3 text-white">
                      <User size={16} className="text-blue-400" />
                      <span className="font-bold text-2xl tracking-tight">{result.name}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-1">Comms Link</p>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone size={14} className="text-blue-400/70" />
                        <span className="font-mono text-xs">{result.phone}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-1">Designation</p>
                      <div className="flex items-center gap-2 text-slate-300">
                        <BookOpen size={14} className="text-blue-400/70" />
                        <span className="font-mono text-[10px] uppercase bg-blue-950/50 px-2 py-0.5 rounded text-blue-300 border border-blue-800/50">{result.course}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

                {/* Game Stats & Discount - Sci-fi Style */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#080c16] border border-emerald-500/20 rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></div>
                    <p className="text-[9px] text-emerald-500/70 font-mono tracking-widest uppercase mb-2">Total Solved</p>
                    <div className="flex items-end gap-1">
                      <span className="font-black text-2xl text-white leading-none">{result.score}</span>
                      <span className="text-[10px] text-emerald-400/80 font-mono mb-0.5 pb-0.5">PTS</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#060c18] border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent"></div>
                    <p className="text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase mb-1 flex items-center gap-1.5">
                      <Percent size={10} /> Grant Auth
                    </p>
                    <div className="flex items-end gap-1 relative z-10">
                      <span className="font-black text-3xl text-cyan-300 leading-none drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">{result.discount.replace(' Discount', '')}</span>
                      <span className="text-[10px] text-cyan-400/70 font-mono mb-1">%</span>
                    </div>
                    <p className="text-[8px] text-cyan-500/60 font-mono mt-1.5 opacity-80">TIER: {result.level.toUpperCase()}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex items-start gap-4 text-red-400">
                <div className="p-2 bg-red-950/40 rounded-lg border border-red-500/30 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">
                  <AlertCircle size={22} className="shrink-0 text-red-500" />
                </div>
                <div>
                  <p className="font-mono text-xs tracking-widest text-red-400 mb-1 font-bold uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">Access Denied</p>
                  <p className="text-xs text-red-300/70 leading-relaxed">{result.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
    </div>
  );
}

// Small helper component to keep icons consistent
function CheckCircle({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}