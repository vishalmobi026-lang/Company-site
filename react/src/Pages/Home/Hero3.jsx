import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero3() {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative h-[calc(100vh-120px)] flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10 z-10">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-blue-900 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
            >
              Why Students Choose Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-gray-300 text-lg md:text-xl mb-6"
            >
              We don’t just teach theory — we focus on real-world skills that companies actually need.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-xl md:text-2xl font-semibold text-gray-200 mb-8"
            >
              Learn. Build. Get Hired.
            </motion.h2>

            <div className="space-y-3 mb-8 text-gray-300">
              {[
                "Hands-on real-world projects",
                "Industry expert mentors",
                "Placement & interview support",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.45 + index * 0.15 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sky-400">✔</span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/courses")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-500 transition duration-300 shadow-lg"
            >
              Explore Courses
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="absolute inset-0 bg-cyan-300/20 blur-2xl rounded-2xl"></div>

            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur border border-gray-700 rounded-2xl p-6 w-[420px] relative z-10 transition duration-500"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Hero3;
