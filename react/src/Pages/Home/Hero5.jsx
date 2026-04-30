import { motion } from "framer-motion";
import {
  FaCheck,
  FaUserTie,
  FaLaptopCode,
  FaCertificate,
  FaStar,
  FaRocket,
  FaCode,
} from "react-icons/fa";

function Hero5() {
  const highlights = [
    {
      icon: <FaUserTie />,
      title: "Expert Mentors",
      text: "Learn from trainers who understand real industry work.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Live Projects",
      text: "Practice with tasks that feel close to real company projects.",
    },
    {
      icon: <FaCertificate />,
      title: "Career Support",
      text: "Get interview guidance, portfolio help, and direction.",
    },
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6 py-16">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

        <div className="absolute w-[560px] h-[560px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-140px]"></div>
        <div className="absolute w-[460px] h-[460px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-130px] right-[-120px]"></div>
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl w-full text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
              <FaCheck className="text-cyan-300" />
              Built for career-ready learning
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Learn From Experts
            </h1>

            <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-3xl mx-auto leading-relaxed">
              Real skills, guided practice, and mentor support that help students move from learning to building with confidence.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mb-10 text-gray-200">
              Knowledge that builds careers.
            </h2>
          </motion.div>

          <div className="relative mb-12">
            <div className="absolute left-1/2 top-1/2 h-[220px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"></div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 55,
                    rotateX: 10,
                    scale: 0.94,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -12, scale: 1.04 }}
                  className="group bg-white/5 backdrop-blur-xl border border-slate-700 rounded-2xl p-7 shadow-xl hover:border-cyan-400/50 transition"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl text-cyan-300 border border-cyan-400/30 group-hover:bg-cyan-400 group-hover:text-slate-950 transition">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-xl shadow-2xl"
          >
            <div className="grid md:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="p-6 md:p-7 text-center md:text-left">
                <div className="mb-3 flex justify-center md:justify-start text-cyan-300 gap-1 text-lg">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Trusted by learners who want practical career growth
                </h3>

                <p className="text-sm md:text-base text-gray-400 mt-2">
                  Real mentors, real projects, and guidance that keeps you moving forward.
                </p>
              </div>

              <div className="grid grid-cols-2 border-t md:border-t-0 md:border-l border-slate-700">
                <div className="p-6">
                  <FaRocket className="mx-auto mb-3 text-2xl text-cyan-300" />
                  <h4 className="text-3xl font-extrabold text-cyan-300">3-6</h4>
                  <p className="text-sm text-gray-400">Months</p>
                </div>

                <div className="p-6 border-l border-slate-700">
                  <FaCode className="mx-auto mb-3 text-2xl text-cyan-300" />
                  <h4 className="text-3xl font-extrabold text-cyan-300">100%</h4>
                  <p className="text-sm text-gray-400">Practical</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default Hero5;
