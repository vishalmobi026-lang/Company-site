import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLottie } from "lottie-react";
import successAnimation from "../Assets/Success.json";
import failAnimation from "../Assets/Fail.json";
import axios from "axios";

/* ================= TOAST (ALERT) COMPONENT ================= */

function Toast({ toast, removeToast }) {
  // Lottie configuration with specific animation control
  const lottieOptions = {
    animationData: toast.type === "success" ? successAnimation : failAnimation,
    loop: false,
    autoplay: true,
  };

  const { View } = useLottie(lottieOptions);

  const ringVariants = {
    animate: {
      scale: [1, 2.2],
      opacity: [0.6, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative w-[90vw] sm:w-[480px] max-w-lg rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-white border border-slate-100 p-12 flex flex-col items-center text-center pointer-events-auto overflow-hidden"
    >
      {/* BEACON EFFECT - Neutral Theme */}
      <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
        <motion.div 
          variants={ringVariants} 
          animate="animate" 
          className="absolute inset-0 rounded-full bg-slate-100/80" 
        />
        <motion.div 
          variants={ringVariants} 
          animate="animate" 
          transition={{ ...ringVariants.animate.transition, delay: 0.7 }} 
          className="absolute inset-0 rounded-full bg-slate-50/60" 
        />
        <div className="relative z-10 w-28 h-28 drop-shadow-md">
          {View}
        </div>
      </div>

      <h3 className={`text-3xl font-black mb-3 tracking-tight uppercase ${toast.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
        {toast.type === "success" ? "Success!" : "Submission Error"}
      </h3>
      <p className="text-slate-500 font-bold mb-10 text-base sm:text-lg leading-relaxed max-w-xs">
        {toast.message}
      </p>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => removeToast(toast.id)}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-200 text-sm tracking-widest uppercase"
      >
        DISMISS
      </motion.button>
    </motion.div>
  );
}

/* ================= TOAST CONTAINER ================= */

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-6">
      <AnimatePresence>
        {toasts.length > 0 && (
          <motion.div 
            key="overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md pointer-events-auto" 
          />
        )}
      </AnimatePresence>
      <div className="relative z-[110]">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} removeToast={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= MAIN CHAT WIDGET ================= */

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts([{ id, message, type }]);
    
    // Duration set to 4.5s to allow Lottie to finish and user to read
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (!form.email.trim()) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/contacts", form);

      addToast("Information received! We will be in touch shortly.", "success");
      setForm({ name: "", phone: "", email: "" });
      
      // Close the widget after the animation has had time to shine
      setTimeout(() => setOpen(false), 4000);
    } catch (err) {
      console.error(err);
      addToast("Connection failed. Please check your network.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* FLOAT BUTTON */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-indigo-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.4)] flex items-center justify-center text-2xl z-40"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {open ? "✕" : "💬"}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* CHAT FORM CARD */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-card"
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-8 sm:w-80 bg-white border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.18)] overflow-hidden z-40"
          >
            <div className="bg-indigo-600 px-6 py-8 text-white text-center">
              <h2 className="text-2xl font-black tracking-tight">Chat with us!</h2>
              <p className="text-indigo-100 text-sm mt-1 font-medium">We'll get back to you soon.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Revaldo" },
                { label: "Phone Number", name: "phone", type: "text", placeholder: "+1 234 567 890" },
                { label: "Email Address", name: "email", type: "email", placeholder: "revaldo@gmail.com" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                      {field.label}
                    </label>
                    {errors[field.name] && (
                      <motion.span 
                        initial={{ opacity: 0, x: 5 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-rose-500 text-[10px] font-black italic uppercase"
                      >
                        * Required
                      </motion.span>
                    )}
                  </div>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full p-4 bg-slate-50 border-2 rounded-2xl transition-all outline-none text-sm font-medium
                      ${errors[field.name] ? "border-rose-100 bg-rose-50/50" : "border-transparent focus:border-indigo-500 focus:bg-white"}`}
                  />
                </div>
              ))}

              <motion.button
                disabled={loading}
                whileHover={!loading ? { y: -2, scale: 1.02 } : {}}
                whileTap={!loading ? { y: 0, scale: 0.98 } : {}}
                type="submit"
                className={`w-full text-white font-extrabold py-4 rounded-2xl shadow-xl transition-all text-sm tracking-widest uppercase
                  ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`}
              >
                {loading ? "Processing..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}