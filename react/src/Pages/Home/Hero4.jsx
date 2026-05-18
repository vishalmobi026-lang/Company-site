import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Lottie, { useLottie } from "lottie-react";
import touchAnimation from "../../Assets/touch.json";
import { motion } from "framer-motion";
import axios from "axios";

function Hero4() {
  const { View } = useLottie({
    animationData: touchAnimation,
    loop: true,
    autoplay: true,
  });

  const [offer, setOffer] = useState("Standard");
  const [pricing, setPricing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axios.get("http://localhost:8000/pricing");
        setPricing(res.data);
      } catch (err) {
        console.error("Failed to fetch pricing", err);
      }
    };
    fetchPricing();
  }, []);


  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white text-gray-900 px-6 py-16">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

        <div className="absolute w-[400px] h-[400px] bg-blue-300/30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[350px] h-[350px] bg-blue-300/30 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

        <div className="max-w-7xl w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent pb-2 leading-tight">
              Start Your Career With Confidence
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              Gain real-world experience and industry knowledge with our expertly designed programs.
            </p>

            <h2 className="text-xl font-semibold text-gray-700 mb-10">
              Upgrade your skills. Unlock opportunities.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-6 inline-flex bg-gray-100 border border-gray-300 rounded-full p-1"
          >
            <button
              onClick={() => setOffer("Standard")}
              className={`px-6 py-2 rounded-full transition ${
                offer === "Standard"
                  ? "bg-gradient-to-r from-blue-900 to-blue-500 text-white"
                  : "text-gray-700"
              }`}
            >
              Standard
            </button>

            <button
              onClick={() => setOffer("Offer")}
              className={`px-6 py-2 rounded-full transition ${
                offer === "Offer"
                  ? "bg-gradient-to-r from-blue-900 to-blue-500 text-white"
                  : "text-gray-700"
              }`}
            >
              Offer
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            animate={{ scale: [1, 1.06, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-14 sm:w-16 md:w-20 mx-auto translate-x-14 sm:translate-x-16 md:translate-x-14 -translate-y-20 sm:-translate-y-24 md:-translate-y-24 -mb-5 sm:-mb-6 md:-mb-7 pointer-events-none"
          >
            {View}
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 -mt-8">
            {(() => {
                const featured = pricing.filter(p => p.is_featured);
                const nonFeatured = pricing.filter(p => !p.is_featured);
                let display = [];
                
                if (featured.length === 1) {
                    display = [nonFeatured[0], featured[0], nonFeatured[1]];
                } else if (featured.length === 2) {
                    display = [featured[0], nonFeatured[0], featured[1]];
                } else {
                    display = [...featured, ...nonFeatured].slice(0, 3);
                }
                
                return display.filter(item => item).map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative bg-white border-2 p-8 rounded-[2rem] transition-all duration-500 shadow-xl shadow-slate-200/40 ${
                          item.is_featured ? "ring-8 ring-blue-50/50 border-blue-600" : "border-slate-100"
                        }`}
                        style={{ borderColor: item.is_featured ? '#2563eb' : '#f1f5f9' }}
                        whileHover={{ scale: 1.03, y: -5 }}
                    >
                        {item.tag && (
                            <div 
                                style={{ backgroundColor: '#2563eb' }}
                                className="text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4"
                            >
                                {item.tag}
                            </div>
                        )}
                        <h2 className="text-xl font-bold mb-2 text-slate-900">{item.course_name}</h2>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                            Master {item.course_name} with industry-expert training.
                        </p>

                        <motion.h3
                            key={`${item.course_name}-${offer}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-4xl font-black mb-6 text-blue-900"
                        >
                            ₹{offer === "Offer" ? item.offer_price : item.standard_price}
                        </motion.h3>

                        <button
                            onClick={() => navigate("/enroll", { state: { course: item.course_name } })}
                            style={{ 
                                background: item.is_featured 
                                    ? `linear-gradient(to right, ${item.accent_color || '#1e3a8a'}, ${item.accent_color || '#2563eb'}dd)` 
                                    : '#0f172a' 
                            }}
                            className="w-full py-4 rounded-xl mb-6 font-bold transition-all duration-300 shadow-md text-white hover:opacity-90"
                        >
                            Enroll Now
                        </button>

                        <ul className="space-y-3 text-left">
                            {(item.features || "").split(",").filter(f => f.trim()).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <div className="bg-blue-500/10 p-1 rounded-full">
                                        <FaCheck className="text-blue-600 text-[10px]" /> 
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))
            })()}
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero4;