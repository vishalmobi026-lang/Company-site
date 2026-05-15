import React, { useState, useContext } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import LottieLib from "lottie-react";
const Lottie = LottieLib.default ?? LottieLib;
import shareAnimation from "../Assets/Share.json";
import failAnimation from "../Assets/Fail.json";

function SubmitAlert({ type, onClose }) {
  const success = type === "success";

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative w-full max-w-md p-6 text-center"
          >
            <div className="mx-auto mb-4 w-64 h-64">
              <Lottie
                animationData={success ? shareAnimation : failAnimation}
                loop={!success}
                onComplete={() => {
                  if (success) onClose();
                }}
                autoplay={true}
              />
            </div>

            <h2
              className={`mb-3 text-4xl font-black uppercase tracking-tight ${
                success ? "text-cyan-400" : "text-rose-500"
              }`}
            >
              {success ? "Message Sent!" : "Submission Failed"}
            </h2>

            <p className="mx-auto mb-8 max-w-sm text-lg font-medium leading-relaxed text-slate-300">
              {success
                ? "Your inquiry has been received. Our team will get back to you soon."
                : "We could not send your message. Please check your connection and try again."}
            </p>

            {!success && (
              <div className="relative flex w-full items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.04, y: -3, boxShadow: "0 0 48px 10px rgba(239,68,68,0.55)" }}
                  whileTap={{ scale: 0.95, boxShadow: "0 0 20px 4px rgba(239,68,68,0.8)" }}
                  onClick={onClose}
                  className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-rose-700 via-red-500 to-orange-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-red-900/50"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.9, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Try Again
                  </span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const { isAuthenticated, addContact } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- ENHANCED VALIDATION ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!form.subject) {
      alert("Please select a subject.");
      return;
    }
    if (!form.message.trim()) {
      alert("Please enter your message.");
      return;
    }

    try {
      // Build contact object for API
      const contactData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      };

      // Call Backend API
      const response = await fetch("http://localhost:8000/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // ALSO save to Professional Inquiries as requested
      await fetch("http://localhost:8000/professional-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      setSubmitStatus("success");

      setForm({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    }
  };

  const contactInfo = [
    {
      title: "Visit Center",
      text: "NIYAS ARCADE, opp. of MOSQUE, Azhagiyamandapam, 629167",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Call Directly",
      text: "+91 75980 98675",
      icon: <FaPhoneAlt />,
    },
    {
      title: "Open Days",
      text: "Monday - Saturday",
      icon: <FaClock />,
    },
  ];

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-10 sm:py-12 px-4 sm:px-6 overflow-hidden">
      <SubmitAlert
        type={submitStatus}
        onClose={() => setSubmitStatus(null)}
      />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-160px]"></div>
      <div className="absolute w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-140px] right-[-140px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-7"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
            <FaCheckCircle />
            Free career guidance
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Talk To Our Team
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
            Ask about courses, admissions, timing, fees, or the best learning path for your career goal.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8 items-stretch">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -45, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-slate-700 bg-white/5 p-5 sm:p-6 backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                <p className="text-sm text-cyan-200">Response support</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold">
                  We’ll help you choose the right course.
                </h2>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Share your interest and our team will guide you with suitable training options.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-3 text-cyan-300 min-w-0">
                  <FaEnvelope className="shrink-0" />
                  <span className="font-semibold text-sm break-all">
                    azhagiyamandapam.tn@gteceducation.com
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 45, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl border border-slate-700 bg-white/5 p-5 sm:p-6 backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute -top-4 right-5 rounded-full border border-cyan-400/40 bg-slate-950 px-4 py-2 text-xs text-cyan-200 shadow-lg">
              Usually replies soon
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-cyan-300 bg-clip-text text-transparent">
              Send a Message
            </h2>

            <p className="text-gray-400 mb-5 text-sm sm:text-base">
              Fill this form and we’ll get back to you with course details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3.5">
                <input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition"
                />

                <input
                  name="email"
                  placeholder="Personal Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition"
                />
              </div>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition"
              >
                <option value="">Select Subject</option>
                <option value="Course Inquiry">Course Inquiry</option>
                <option value="Admission">Admission</option>
                <option value="Fees Details">Fees Details</option>
                <option value="Career Guidance">Career Guidance</option>
              </select>

              <textarea
                name="message"
                placeholder="Tell us what you want to learn..."
                rows="4"
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition resize-none"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-500 transition duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 font-semibold"
              >
                Send Message
                <FaPaperPlane />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
