import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero2() {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-6 py-20 lg:py-0">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

        <div className="absolute w-[400px] h-[400px] bg-blue-300/30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[350px] h-[350px] bg-cyan-300/30 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

        <div className="max-w-7xl w-full grid lg:grid-cols-2 items-center gap-12 lg:gap-16 relative z-10">
          {/* 🔹 VIDEO INSIDE CODING SCREEN */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1 mt-6 lg:mt-0"
          >
            <div className="absolute inset-0 bg-blue-300/40 blur-2xl rounded-2xl"></div>

            <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>

                <div className="text-xs text-slate-400">
                  training-preview.jsx
                </div>
              </div>

              <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[58px_1fr] bg-slate-950">
                <div className="select-none border-r border-slate-800 bg-slate-900/70 py-4 text-right text-xs leading-7 text-slate-500">
                  <div className="pr-2 sm:pr-3">01</div>
                  <div className="pr-2 sm:pr-3">02</div>
                  <div className="pr-2 sm:pr-3">03</div>
                  <div className="pr-2 sm:pr-3">04</div>
                  <div className="pr-2 sm:pr-3">05</div>
                  <div className="pr-2 sm:pr-3">06</div>
                  <div className="pr-2 sm:pr-3">07</div>
                  <div className="pr-2 sm:pr-3">08</div>
                  <div className="pr-2 sm:pr-3">09</div>
                  <div className="pr-2 sm:pr-3 hidden sm:block">10</div>
                  <div className="pr-2 sm:pr-3 hidden sm:block">11</div>
                  <div className="pr-2 sm:pr-3 hidden sm:block">12</div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="mb-3 font-mono text-xs sm:text-sm text-slate-300">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-cyan-300">career</span>{" "}
                    <span className="text-white">=</span>{" "}
                    <span className="text-green-300">"G-TEC"</span>
                    <span className="text-white">;</span>
                  </div>

                  <motion.video
                    src="/videos/G-tech.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    className="h-[250px] sm:h-[380px] w-full rounded-xl object-cover"
                  ></motion.video>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 🔹 TEXT RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl order-1 lg:order-2"
          >
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent"
            >
              G-TEC Education
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 text-lg mb-6 leading-relaxed"
            >
              Transform your future with cutting-edge skills and real-world knowledge.
              <br className="hidden md:block" />
              We don’t just teach — we build careers that last.
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl font-semibold text-gray-800 mb-8"
            >
              Learn Smart. Grow Fast. Succeed Globally.
            </motion.h3>

            <motion.button
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/courses")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-500 text-white shadow-lg"
            >
              Explore Courses
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Hero2;
