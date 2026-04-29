import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Lottie from "lottie-react";
import touchAnimation from "../assets/touch.json";
import { motion } from "framer-motion";
function Home() {
  const [offer, setOffer] = useState("Standard");
  const navigate = useNavigate();

  return (
    <div>

      {/* 🔥 FIRST HERO - UPGRADED */}
<section className="relative h-[calc(100vh-120px)] flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6">

  {/* 🔹 Background Grid */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

  {/* 🔹 Glow Effects */}
  <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
  <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

  <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10 z-10">

    {/* 🔹 LEFT CONTENT */}
    <div className="max-w-xl">

      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
        Welcome to G-TEC Education
      </h1>

      <p className="text-gray-300 text-lg md:text-xl mb-6">
        Learn industry-ready skills with expert guidance and real-world projects.<br />
        Build your future with modern courses designed for career success.
      </p>

      <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-8">
        Your journey to success starts here.
      </h2>

      {/* 🔹 BUTTONS */}
      <div className="flex gap-4 flex-wrap">

        <button
          onClick={() => navigate("/enroll")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition duration-300 shadow-lg"
        >
          Enroll Now
        </button>

        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-3 rounded-xl border border-purple-400 hover:bg-purple-500 hover:text-white transition duration-300"
        >
          See Courses
        </button>

      </div>
    </div>

    {/* 🔹 RIGHT IMAGE */}
    <div className="hidden md:block relative">

      {/* glow behind image */}
      <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-xl"></div>

      <img
        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
        alt="learning"
        className="w-[420px] rounded-xl shadow-2xl relative z-10 hover:scale-105 transition duration-500"
      />
    </div>

  </div>
</section>

    {/* 🔥 HERO 2 (LIGHT / PREMIUM) */}
<section className="relative h-screen flex items-center justify-center overflow-hidden bg-white px-6">

  {/* 🔹 Light Grid Background */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

  {/* 🔹 Soft Glow */}
  <div className="absolute w-[400px] h-[400px] bg-purple-300/30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
  <div className="absolute w-[350px] h-[350px] bg-blue-300/30 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

  <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">

    {/* 🔹 TEXT */}
    <div className="max-w-xl">

      <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        G-TEC Education
      </h2>

      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
        Transform your future with cutting-edge skills and real-world knowledge.<br />
        We don’t just teach — we build careers that last.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 mb-8">
        Learn Smart. Grow Fast. Succeed Globally.
      </h3>

      <button
        onClick={() => navigate("/courses")}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition duration-300 shadow-lg"
      >
        Explore Courses
      </button>
    </div>
    {/* 🔹 VIDEO */}
    <div className="w-full md:w-[450px] relative">

      {/* glow behind video */}
      <div className="absolute inset-0 bg-purple-300/30 blur-2xl rounded-2xl"></div>

      <video
        src="/videos/G-tech.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[380px] object-cover rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition duration-500"
      ></video>
    </div>

  </div>
</section>
{/* 🔥 HERO 3 - VALUE SECTION (SAME STYLE, DIFFERENT CONTENT) */}
<section className="relative h-[calc(100vh-120px)] flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6">

  {/* 🔹 Background Grid */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

  {/* 🔹 Glow Effects */}
  <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
  <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

  <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10 z-10">

    {/* 🔹 LEFT CONTENT */}
    <div className="max-w-xl">

      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
        Why Students Choose Us
      </h1>

      <p className="text-gray-300 text-lg md:text-xl mb-6">
        We don’t just teach theory — we focus on real-world skills that companies actually need.
      </p>

      <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-8">
        Learn. Build. Get Hired.
      </h2>

      {/* 🔹 FEATURES LIST */}
      <div className="space-y-3 mb-8 text-gray-300">

        <div className="flex items-center gap-2">
          <span className="text-purple-400">✔</span>
          <span>Hands-on real-world projects</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-blue-400">✔</span>
          <span>Industry expert mentors</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-cyan-400">✔</span>
          <span>Placement & interview support</span>
        </div>

      </div>

      {/* 🔹 BUTTON */}
      <button
        onClick={() => navigate("/courses")}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition duration-300 shadow-lg"
      >
        Explore Courses
      </button>

    </div>

    {/* 🔹 RIGHT SIDE (CARD INSTEAD OF IMAGE) */}
    <div className="hidden md:block relative">

      {/* glow */}
      <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-2xl"></div>

      <div className="bg-white/5 backdrop-blur border border-gray-700 rounded-2xl p-6 w-[420px] relative z-10 hover:scale-105 transition duration-500">

        <h3 className="text-xl font-semibold mb-4">Program Highlights</h3>

        <ul className="space-y-3 text-gray-300 text-sm">
          <li>• Full Stack Development</li>
          <li>• MERN Stack Training</li>
          <li>• Python & AI Basics</li>
          <li>• Live Project Deployment</li>
        </ul>

        <div className="mt-6 text-sm text-gray-400">
          Duration: 3–6 Months
        </div>

      </div>

    </div>

  </div>
</section>
    {/* 🔥 HERO 3 (PRICING - LIGHT VERSION) */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white text-gray-900 px-6 py-16">

  {/* 🔹 Light Grid Background */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

  {/* 🔹 Soft Glow */}
  <div className="absolute w-[400px] h-[400px] bg-purple-300/30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
  <div className="absolute w-[350px] h-[350px] bg-blue-300/30 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

  <div className="max-w-7xl w-full text-center relative z-10">

    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
      Start Your Career With Confidence
    </h1>

    <p className="text-gray-600 text-lg mb-6">
      Gain real-world experience and industry knowledge with our expertly designed programs.
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mb-10">
      Upgrade your skills. Unlock opportunities.
    </h2>

    {/* 🔹 OFFER TOGGLE */}
    <div className="mb-12 inline-flex bg-gray-100 border border-gray-300 rounded-full p-1">
      <button
        onClick={() => setOffer("Standard")}
        className={`px-6 py-2 rounded-full transition ${
          offer === "Standard"
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            : "text-gray-700"
        }`}
      >
        Standard
      </button>

      <button
        onClick={() => setOffer("Offer")}
        className={`px-6 py-2 rounded-full transition ${
          offer === "Offer"
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            : "text-gray-700"
        }`}
      >
        Offer
      </button>
    </div>

    {/* 🔹 CARDS */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* FULL STACK */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-gray-200 hover:scale-105 transition shadow-md">
        <h2 className="text-xl font-semibold mb-4">Full Stack</h2>
        <p className="text-gray-500 mb-6">Frontend + Backend development</p>
        <h3 className="text-3xl font-bold mb-6">
          ₹{offer === "Offer" ? "9,999" : "14,999"}
        </h3>
        <button
          onClick={() => navigate("/enroll")}
          className="w-full py-3 rounded-lg mb-6 bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Enroll Now
        </button>
        <ul className="space-y-2 text-left text-sm">
          <li><FaCheck /> HTML, CSS, JS</li>
          <li><FaCheck /> React + Backend</li>
        </ul>
      </div>

      {/* MERN (highlight) */}
      <div className="bg-white rounded-2xl p-8 border-2 border-purple-500 scale-105 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">MERN Stack</h2>
        <h3 className="text-3xl font-bold mb-6">
          ₹{offer === "Offer" ? "12,999" : "19,999"}
        </h3>
        <button
          onClick={() => navigate("/enroll")}
          className="w-full py-3 rounded-lg mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition"
        >
          Enroll Now
        </button>
        <ul className="space-y-2 text-left text-sm">
          <li><FaCheck /> MongoDB</li>
          <li><FaCheck /> React</li>
          <li><FaCheck /> Node</li>
        </ul>
      </div>

      {/* PYTHON */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-gray-200 hover:scale-105 transition shadow-md">
        <h2 className="text-xl font-semibold mb-4">Python</h2>
        <h3 className="text-3xl font-bold mb-6">
          ₹{offer === "Offer" ? "7,999" : "11,999"}
        </h3>
        <button
          onClick={() => navigate("/enroll")}
          className="w-full py-3 rounded-lg mb-6 bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Enroll Now
        </button>
        <ul className="space-y-2 text-left text-sm">
          <li><FaCheck /> Python Basics</li>
          <li><FaCheck /> AI Basics</li>
        </ul>
      </div>

    </div>

  </div>
</section>
      {/* 🔥 HERO 4 - UPGRADED */}
<section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6">

  {/* 🔹 Background Grid */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

  {/* 🔹 Glow Effect */}
  <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
  <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

  <div className="max-w-5xl text-center z-10">

    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
      Learn From Experts
    </h1>

    <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
      Our courses are designed by industry professionals to give you real-world skills.
    </p>

    <h2 className="text-xl md:text-2xl font-semibold mb-8 text-gray-200">
      Knowledge that builds careers.
    </h2>

   
  

  </div>
</section>
    </div>
  );
}

export default Home;