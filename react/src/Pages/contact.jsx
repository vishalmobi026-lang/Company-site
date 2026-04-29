import { useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully!");
  };

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-16 px-6 overflow-hidden">

      {/* 🔹 GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>

      {/* 🔹 GLOW EFFECTS */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 relative z-10">

        {/* 🔥 LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Have Any Questions?
          </h2>

          <p className="text-gray-400 mb-8">
            Get free counseling and choose the right path for your career growth.
          </p>

          {/* ADDRESS */}
          <div className="bg-white/5 backdrop-blur border border-gray-700 p-5 rounded-xl flex gap-4 mb-5 hover:scale-105 transition">
            <FaMapMarkerAlt className="text-purple-400 text-xl" />
            <div>
              <h4 className="font-semibold">Address</h4>
              <p className="text-sm text-gray-400">Azhagiyamandapam</p>
            </div>
          </div>

          {/* PHONE */}
          <div className="bg-white/5 backdrop-blur border border-gray-700 p-5 rounded-xl flex gap-4 mb-5 hover:scale-105 transition">
            <FaPhoneAlt className="text-blue-400 text-xl" />
            <div>
              <h4 className="font-semibold">Phone</h4>
              <p className="text-sm text-gray-400">+91 75980 98675</p>
            </div>
          </div>

          {/* HOURS */}
          <div className="bg-white/5 backdrop-blur border border-gray-700 p-5 rounded-xl flex gap-4 hover:scale-105 transition">
            <FaClock className="text-cyan-400 text-xl" />
            <div>
              <h4 className="font-semibold">Working Hours</h4>
              <p className="text-sm text-gray-400">Mon - Sat</p>
            </div>
          </div>
        </motion.div>

        {/* 🔥 RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur border border-gray-700 p-8 rounded-2xl shadow-lg"
        >

          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="p-3 rounded bg-black/30 border border-gray-600 focus:border-purple-400 outline-none"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="p-3 rounded bg-black/30 border border-gray-600 focus:border-purple-400 outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="p-3 rounded bg-black/30 border border-gray-600 focus:border-purple-400 outline-none"
              >
                <option>Select Subject</option>
                <option>Course Inquiry</option>
                <option>Admission</option>
              </select>

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="p-3 rounded bg-black/30 border border-gray-600 focus:border-purple-400 outline-none"
              />
            </div>

            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 rounded bg-black/30 border border-gray-600 focus:border-purple-400 outline-none"
            />

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition duration-300 shadow-lg">
              Send Message
            </button>

          </form>
        </motion.div>

      </div>
    </section>
  );
}

export default Contact;