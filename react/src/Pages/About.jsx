import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaBriefcase,
  FaCheckCircle,
  FaLaptopCode,
  FaRocket,
  FaUserGraduate,
} from "react-icons/fa";

const stats = [
  { name: "Learners Guided", value: "10K+" },
  { name: "Career Courses", value: "25+" },
  { name: "Live Projects", value: "100+" },
  { name: "Training Support", value: "3-6 Months" },
];

const values = [
  {
    icon: <FaLaptopCode />,
    title: "Practical Learning",
    text: "Students learn by building, practicing, and solving real problems.",
  },
  {
    icon: <FaBriefcase />,
    title: "Career Focus",
    text: "Training is shaped around job-ready skills and interview confidence.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Mentor Guidance",
    text: "Learners get guidance from trainers who understand industry needs.",
  },
];

const steps = [
  "Choose the right course",
  "Learn with guided practice",
  "Build live projects",
  "Prepare for career growth",
];

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative min-h-screen bg-slate-950 text-white py-14 sm:py-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[520px] h-[520px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-140px]"></div>
      <div className="absolute w-[420px] h-[420px] bg-cyan-400/30 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.75 }}
          className="text-center mb-12"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white px-5 py-2.5 text-sm font-bold text-cyan-700 shadow-md backdrop-blur-sm">
            <FaBookOpen />
            About G-TEC Education
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Building Skills That Build Careers
          </h1>

          <p className="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mt-5">
            We help students turn interest into ability through practical training, mentor support,
            and career-focused learning paths.
          </p>
        </motion.div>

        {/* ABOUT CONTENT */}
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-10 items-stretch mb-12">
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.75 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/5 p-5 sm:p-7 backdrop-blur-xl shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="students learning"
              className="h-72 w-full rounded-2xl object-cover"
            />

            <div className="mt-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-200 to-cyan-300 bg-clip-text text-transparent">
                Who We Are
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                G-TEC Education focuses on practical, structured training for students who want
                useful skills, stronger confidence, and better career direction.
              </p>

              <p className="text-gray-400 leading-relaxed">
                From IT and technical courses to business, design, accounting, and career guidance,
                our goal is to make learning clear, useful, and connected to real opportunities.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.75 }}
            className="rounded-3xl border border-slate-700 bg-white/5 p-5 sm:p-7 backdrop-blur-xl shadow-2xl"
          >
            <div className="mb-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
              <p className="text-sm text-cyan-200">Our approach</p>
              <h3 className="mt-2 text-2xl font-bold">
                Learn. Practice. Build. Grow.
              </h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Every student needs more than theory. Our training is designed to help learners
                understand concepts, apply them, and build confidence step by step.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-200">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="rounded-2xl border border-slate-700 bg-white/5 p-6 text-center backdrop-blur-xl shadow-lg"
            >
              <h3 className="text-3xl font-extrabold text-cyan-300">
                {stat.value}
              </h3>
              <p className="mt-2 text-gray-400 text-sm">{stat.name}</p>
            </motion.div>
          ))}
        </div>

        {/* VALUES */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.65, delay: index * 0.12 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="rounded-3xl border border-slate-700 bg-white/5 p-6 text-center backdrop-blur-xl shadow-xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-3xl border border-cyan-400/30 bg-white/5 backdrop-blur-xl shadow-2xl"
        >
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 p-6 sm:p-8">
            <div>
              <div className="mb-3 flex items-center gap-2 text-cyan-300">
                <FaRocket />
                <span className="font-semibold">Start with the right path</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold">
                Not sure which course fits you?
              </h2>

              <p className="mt-2 text-gray-400">
                Talk to our team and get guidance based on your goal, interest, and current skill level.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-500 px-7 py-3 font-semibold shadow-lg shadow-blue-900/30"
            >
              Contact Us
              <FaArrowRight />
            </motion.button>
          </div>
        </motion.div>
      </div>
      </section>

      {/* OUR MODEL SECTION WITH HERO2 STYLE */}
<section className="relative min-h-[85vh]  flex items-center justify-center overflow-hidden bg-white px-6 py-20 lg:py-0 text-slate-900">
  {/* Animated Grid */}
<div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>
  {/* Glow Orbs */}
 <div className="absolute w-[520px] h-[520px] bg-blue-300/30 blur-3xl rounded-full top-[-140px] left-[-140px]"></div>

<div className="absolute w-[420px] h-[420px] bg-cyan-300/30 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

  <div className="max-w-7xl w-full grid lg:grid-cols-2 items-center gap-12 lg:gap-16 relative z-10">

    {/* LEFT SIDE CONTENT */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white px-5 py-2.5 text-sm font-bold text-cyan-700 shadow-md backdrop-blur-sm">
  <FaCheckCircle className="text-cyan-500" />
  Our Model
</span>

      <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-500 bg-clip-text text-transparent">
        The G-TEC Learning Model
      </h2>

      <p className="text-slate-700 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
        Discover our interactive methodology and structural approach to career-focused education.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="rounded-xl border border-cyan-400/20 bg-white/5 px-5 py-4 backdrop-blur">
          <h4 className="text-cyan-600 font-bold mb-1">Practical Training</h4>
          <p className="text-sm text-slate-700">Hands-on real world learning modules.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h4 className="text-cyan-600 font-bold mb-1">Industry Focused</h4>
          <p className="text-sm text-slate-700">Career-oriented skill development programs.</p>
        </div>
      </div>
    </motion.div>

    {/* RIGHT SIDE VISUAL */}
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-cyan-400/30 blur-3xl rounded-[2rem]"></div>

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 shadow-2xl">

        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          <div className="text-xs text-slate-400">
            learning-model.jsx
          </div>
        </div>

        {/* Visualization Container */}
      <div className="relative min-h-[620px] flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,rgba(15,23,42,.98),rgba(30,41,59,.98)),linear-gradient(#334155_1px,transparent_1px),linear-gradient(90deg,#334155_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]">

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>

          <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">

  {/* TOP STATUS */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">
        Learning Ecosystem
      </p>

      <h3 className="mt-2 text-3xl font-black text-white">
        Student Growth System
      </h3>
    </div>

    <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>

      <span className="text-xs font-semibold text-cyan-200">
        Active Learning
      </span>
    </div>
  </div>

  {/* CENTER DASHBOARD */}
  <div className="grid grid-cols-2 gap-4">

    {/* CARD 1 */}
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300">
          Live Projects
        </h4>

        <div className="rounded-lg bg-cyan-400/10 px-2 py-1 text-xs font-bold text-cyan-300">
          100+
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "85%" }}
          transition={{ duration: 1.2 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
        />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Real-world implementation and portfolio building.
      </p>
    </motion.div>

    {/* CARD 2 */}
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300">
          Placement Support
        </h4>

        <div className="rounded-lg bg-emerald-400/10 px-2 py-1 text-xs font-bold text-emerald-300">
          Career
        </div>
      </div>

      <div className="mt-4 flex items-end gap-1 h-16">
        {[40, 70, 55, 90, 75].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-1 rounded-t-md bg-gradient-to-t from-cyan-500 to-blue-400"
          />
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Interview preparation and career guidance system.
      </p>
    </motion.div>

    {/* CARD 3 */}
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="col-span-2 rounded-2xl border border-slate-700 bg-slate-900/70 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-white">
            Learning Workflow
          </h4>

          <p className="mt-1 text-sm text-slate-400">
            Structured practical education pipeline
          </p>
        </div>

        <div className="text-cyan-300 text-2xl font-black">
          AI
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">

        {[
          "Learn",
          "Practice",
          "Projects",
          "Certification",
        ].map((item, i) => (
          <div key={item} className="flex items-center flex-1">

            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300"
              >
                {i + 1}
              </motion.div>

              <span className="mt-2 text-xs text-slate-300">
                {item}
              </span>
            </div>

            {i !== 3 && (
              <div className="mx-2 h-[2px] flex-1 bg-gradient-to-r from-cyan-400/40 to-blue-500/40"></div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  </div>

  {/* BOTTOM STATS */}
  <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-4 backdrop-blur-xl">

    <div>
      <p className="text-3xl font-black text-cyan-300">
        10K+
      </p>

      <span className="text-xs text-slate-400">
        Students Guided
      </span>
    </div>

    <div className="h-10 w-px bg-slate-700"></div>

    <div>
      <p className="text-3xl font-black text-cyan-300">
        25+
      </p>

      <span className="text-xs text-slate-400">
        Career Courses
      </span>
    </div>

    <div className="h-10 w-px bg-slate-700"></div>

    <div>
      <p className="text-3xl font-black text-cyan-300">
        100+
      </p>

      <span className="text-xs text-slate-400">
        Projects
      </span>
    </div>

  </div>
</div>
        </div>
      </div>
    </motion.div>
  </div>
</section>
    </>
  );
}
