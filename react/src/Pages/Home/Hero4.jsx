import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Lottie, { useLottie } from "lottie-react";
import touchAnimation from "../../assets/touch.json";
import { motion } from "framer-motion";
import axios from "axios";

function Hero4() {
  const { View } = useLottie({
    animationData: touchAnimation,
    loop: true,
    autoplay: true,
  });

  const [offer, setOffer] = useState("Standard");
  const [pricing, setPricing] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axios.get("http://localhost:8000/pricing");
        const pricingMap = {};
        res.data.forEach(item => {
          pricingMap[item.course_name] = item;
        });
        setPricing(pricingMap);
      } catch (err) {
        console.error("Failed to fetch pricing", err);
      }
    };
    fetchPricing();
  }, []);

  const getPrice = (courseName, type) => {
    const course = pricing[courseName];
    if (!course) {
        // Fallback to hardcoded defaults if backend fails
        const defaults = {
            "Full Stack": { standard_price: "14,999", offer_price: "9,999" },
            "MERN Stack": { standard_price: "19,999", offer_price: "12,999" },
            "Python": { standard_price: "11,999", offer_price: "7,999" }
        };
        return type === "Offer" ? defaults[courseName].offer_price : defaults[courseName].standard_price;
    }
    return type === "Offer" ? course.offer_price : course.standard_price;
  };

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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">
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
            className="mb-12 inline-flex bg-gray-100 border border-gray-300 rounded-full p-1"
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
            className="w-14 sm:w-16 md:w-20 mx-auto translate-x-14 sm:translate-x-16 md:translate-x-14 -translate-y-24 sm:-translate-y-28 md:-translate-y-28 -mb-7 sm:-mb-8 md:-mb-9 pointer-events-none"
          >
            {View}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 -mt-26">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-gray-200 transition shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">Full Stack</h2>
              <p className="text-gray-500 mb-6">
                Frontend + Backend development
              </p>

              <motion.h3
                key={`fullstack-${offer}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold mb-6"
              >
                ₹{getPrice("Full Stack", offer)}
              </motion.h3>

              <button
                onClick={() => navigate("/enroll")}
                className="w-full py-3 rounded-lg mb-6 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Enroll Now
              </button>

              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> HTML, CSS, JS
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> React + Backend
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1.05 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ scale: 1.08 }}
              className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-xl"
            >
              <h2 className="text-xl font-semibold mb-4">MERN Stack</h2>

              <motion.h3
                key={`mern-${offer}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold mb-6"
              >
                ₹{getPrice("MERN Stack", offer)}
              </motion.h3>

              <button
                onClick={() => navigate("/enroll")}
                className="w-full py-3 rounded-lg mb-6 bg-gradient-to-r from-blue-900 to-blue-500 text-white hover:scale-105 transition"
              >
                Enroll Now
              </button>

              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> MongoDB
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> React
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> Node
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-gray-200 transition shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">Python</h2>

              <motion.h3
                key={`python-${offer}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold mb-6"
              >
                ₹{getPrice("Python", offer)}
              </motion.h3>

              <button
                onClick={() => navigate("/enroll")}
                className="w-full py-3 rounded-lg mb-6 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Enroll Now
              </button>

              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> Python Basics
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-blue-600" /> AI Basics
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero4;
