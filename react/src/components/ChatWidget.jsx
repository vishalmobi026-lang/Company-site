import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLottie } from "lottie-react";
import successAnimation from "../Assets/Success.json";
import failAnimation from "../Assets/Fail.json";
import axios from "axios";

/* ================= CHAT ICON ================= */

function ChatBadgeIcon({ open }) {
  if (open) {
    return (
      <motion.span
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-bold text-blue-900 transition hover:text-cyan-200  "
      >
        x
      </motion.span>
    );
  }

  return (
    <motion.svg
      initial={{ scale: 0.75, opacity: 0, y: 4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.75, opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      viewBox="0 0 64 64"
      className="relative z-10 h-8 w-8 drop-shadow-lg"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 13C20.4 13 11 20.7 11 30.2C11 35.7 14.2 40.6 19.2 43.8L17.4 51L25.8 46.8C27.8 47.3 29.8 47.6 32 47.6C43.6 47.6 53 39.8 53 30.2C53 20.7 43.6 13 32 13Z"
        fill="white"
      />

      <path
        d="M22 28.5H42"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M22 36H35"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ================= TOAST COMPONENT ================= */

function Toast({ toast, removeToast }) {
  const lottieOptions = {
    animationData: toast.type === "success" ? successAnimation : failAnimation,
    loop: false,
    autoplay: true,
  };

  const { View } = useLottie(lottieOptions);

  const ringVariants = {
    animate: {
      scale: [1, 2.2],
      opacity: [0.45, 0],
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
      className="relative w-[90vw] sm:w-[440px] max-w-lg rounded-[2rem] shadow-[0_35px_90px_-25px_rgba(0,0,0,0.35)] bg-white border border-cyan-100 p-10 flex flex-col items-center text-center pointer-events-auto overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-500" />

      <div className="relative w-32 h-32 mb-5 flex items-center justify-center">
        <motion.div
          variants={ringVariants}
          animate="animate"
          className="absolute inset-0 rounded-full bg-cyan-100"
        />

        <motion.div
          variants={ringVariants}
          animate="animate"
          transition={{ ...ringVariants.animate.transition, delay: 0.7 }}
          className="absolute inset-0 rounded-full bg-blue-100"
        />

        <div className="relative z-10 w-24 h-24 drop-shadow-md">{View}</div>
      </div>

      <h3
        className={`text-2xl font-black mb-3 tracking-tight uppercase ${toast.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
      >
        {toast.type === "success" ? "Success!" : "Submission Error"}
      </h3>

      <p className="text-slate-500 font-semibold mb-8 text-base leading-relaxed max-w-xs">
        {toast.message}
      </p>

      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => removeToast(toast.id)}
        className="w-full bg-[#07132f] text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 text-sm tracking-widest uppercase"
      >
        Dismiss
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
            className="absolute inset-0 bg-[#020817]/75 backdrop-blur-md pointer-events-auto"
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
  const [bottomOffset, setBottomOffset] = useState(24);
  const chatRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const MARGIN_DESKTOP = 16; // extra gap above footer
    const MARGIN_MOBILE = 8;
    const BASE = 24;  // default bottom (px)

    const update = () => {
      const footer = document.querySelector("footer");
      if (!footer) { setBottomOffset(BASE); return; }

      const isMobile = window.innerWidth < 640;
      const rect = footer.getBoundingClientRect();
      const overlap = window.innerHeight - rect.top;

      if (overlap > 0) {
        setBottomOffset(isMobile ? overlap + MARGIN_MOBILE : BASE + overlap + MARGIN_DESKTOP);
      } else {
        setBottomOffset(BASE);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts([{ id, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (!form.email.trim()) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await axios.post("https://company-site-jrbr.onrender.com/contacts", form);

      addToast("Information received! We will be in touch shortly.", "success");
      setForm({ name: "", phone: "", email: "" });

      setTimeout(() => setOpen(false), 4000);
    } catch (err) {
      console.error(err);
      addToast("Connection failed. Please check your network.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800" ref={chatRef}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* FLOATING MOTION CHAT POSITION */}
      <div
        className="fixed z-40 right-0 sm:right-6"
        style={{
          bottom: bottomOffset,
          transition: "bottom 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div
          className={`h-24 w-24 flex items-center justify-center transition-transform duration-[2000ms] ease-out ${!open ? 'translate-x-[45%] hover:-translate-x-4 sm:translate-x-0 sm:hover:translate-x-0' : '-translate-x-4 sm:translate-x-0'}`}
        >
          {!open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-[78px] w-[78px] rounded-full border border-cyan-300/80"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-[66px] w-[66px] rounded-full border border-blue-300/80 border-dashed"
              />

              <motion.div
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.35, 0, 0.35],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute h-[74px] w-[74px] rounded-full bg-cyan-300/30"
              />

              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -left-8 hidden sm:block rounded-full border border-cyan-300/40 bg-[#07132f]/95 px-4 py-2 shadow-xl backdrop-blur-md"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-100">
                  Need Help?
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-1 -right-8 hidden sm:block rounded-full border border-blue-200 bg-white px-4 py-2 shadow-xl"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                  Enquiry
                </p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-6 top-5 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]"
              />

              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-7 left-6 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(165,243,252,0.9)]"
              />
            </motion.div>
          )}

          <motion.button
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            aria-label={open ? "Close chat form" : "Open chat form"}
            className="relative z-10 h-[25px] w-[25px] rounded-[1.35rem] via-blue-600 to-blue-900 text-white shadow-[0_18px_40px_rgba(37,99,235,0.45)] ring-[3px] ring-white/80 flex items-center justify-center overflow-hidden"
          >
            <span className="absolute inset-[4px] rounded-[1.1rem] border border-white/30" />

            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_30%),linear-gradient(135deg,transparent,rgba(255,255,255,0.18))]" />

            <motion.span
              animate={{ x: ["-130%", "140%"] }}
              transition={{
                duration: 2.9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 w-8 rotate-12 bg-white/30 blur-sm"
            />

            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 2.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <AnimatePresence mode="wait">
                <ChatBadgeIcon open={open} />
              </AnimatePresence>
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* CHAT FORM CARD */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-card"
            initial={{
              opacity: 0,
              y: 42,
              scale: 0.94,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed right-4 left-4 sm:left-auto sm:right-8 sm:w-[350px] z-40 overflow-hidden rounded-[1.6rem] border border-white/70 bg-white shadow-[0_30px_80px_-24px_rgba(2,8,23,0.45)]"
            style={{
              bottom: bottomOffset + 88,
              transition: "bottom 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <div className="relative overflow-hidden bg-[#07132f] px-6 py-6 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.38),transparent_38%),linear-gradient(135deg,rgba(37,99,235,0.45),transparent_55%)]" />

              <motion.div
                animate={{ x: ["-25%", "115%"] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 h-full w-20 rotate-12 bg-white/10 blur-xl"
              />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100">
                  G-TEC Support
                </div>

                <h2 className="text-2xl font-black tracking-tight">
                  Start your enquiry
                </h2>

                <p className="mt-1 text-sm font-medium leading-relaxed text-blue-100">
                  Share your details and our team will contact you soon.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {[
                {
                  label: "Full Name",
                  name: "name",
                  type: "text",
                  placeholder: "Enter your name",
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  type: "text",
                  placeholder: "+91 75980 98675",
                },
                {
                  label: "Email Address",
                  name: "email",
                  type: "email",
                  placeholder: "you@example.com",
                },
              ].map((field) => (
                <div key={field.name}>
                  <div className="mb-1.5 flex items-center justify-between px-1">
                    <label className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                      {field.label}
                    </label>

                    {errors[field.name] && (
                      <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-black uppercase text-rose-500"
                      >
                        Required
                      </motion.span>
                    )}
                  </div>

                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full rounded-2xl border-2 px-4 py-3.5 text-sm font-semibold outline-none transition-all placeholder:text-slate-400 ${errors[field.name]
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-slate-100 bg-slate-50 focus:border-cyan-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                      }`}
                  />
                </div>
              ))}

              <motion.button
                disabled={loading}
                whileHover={!loading ? { y: -2, scale: 1.01 } : {}}
                whileTap={!loading ? { y: 0, scale: 0.98 } : {}}
                type="submit"
                className={`w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all ${loading
                    ? "cursor-not-allowed bg-slate-300 shadow-none"
                    : "bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 shadow-blue-200 hover:shadow-blue-300"
                  }`}
              >
                {loading ? "Processing..." : "Send Enquiry"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
