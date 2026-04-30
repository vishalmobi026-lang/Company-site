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
    <section className="relative min-h-screen bg-slate-950 text-white py-14 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[520px] h-[520px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-140px]"></div>
      <div className="absolute w-[420px] h-[420px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.75 }}
          className="text-center mb-12"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
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
            className="relative overflow-hidden rounded-3xl border border-slate-700 bg-white/5 p-5 sm:p-7 backdrop-blur-xl shadow-2xl"
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
  );
}
