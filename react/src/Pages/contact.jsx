import React, { useState, useContext } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const { isAuthenticated, addContact } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill name, email and phone.");
      return;
    }

    // Build contact object
    const contact = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      createdAt: new Date().toISOString(),
    };

    if (isAuthenticated) {
      // Persist to authenticated user's contacts via AuthContext
      addContact(contact);
      alert("Message sent and contact saved to your account.");
    } else {
      // Guest flow: save locally and inform user to login to persist
      const guestKey = "guest_contacts";
      const existing = JSON.parse(localStorage.getItem(guestKey) || "[]");
      existing.push(contact);
      localStorage.setItem(guestKey, JSON.stringify(existing));
      alert("Message sent. Saved locally — login to persist to your account.");
    }

    // Reset form
    setForm({
      name: "",
      email: "",
      subject: "",
      phone: "",
      message: "",
    });
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
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
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

                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition"
                />
              </div>

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
