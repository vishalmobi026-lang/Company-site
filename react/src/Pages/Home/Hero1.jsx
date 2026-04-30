import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero1() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.14,
        delayChildren: 0.15,
      },
    },
  };

  const leftItem = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 80, scale: 0.94 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <section className="relative h-[calc(100vh-120px)] flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

        <div className="absolute w-[550px] h-[550px] bg-blue-500/25 blur-3xl rounded-full top-[-130px] left-[-120px]"></div>
        <div className="absolute w-[420px] h-[420px] bg-cyan-400/25 blur-3xl rounded-full bottom-[-120px] right-[-100px]"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-7xl w-full grid md:grid-cols-2 items-center gap-14 relative z-10"
        >
          <motion.div variants={containerVariants} className="max-w-2xl">
            <motion.div
              variants={leftItem}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-300"></span>
              Career-focused IT training
            </motion.div>

            <motion.h1
              variants={leftItem}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text text-transparent"
            >
              Welcome to
              <br />
              G-TEC Education
            </motion.h1>

            <motion.p
              variants={leftItem}
              className="text-gray-300 text-lg md:text-xl mb-6 leading-relaxed"
            >
              Learn industry-ready skills with expert guidance and real-world projects.
              <br />
              Build your future with modern courses designed for career success.
            </motion.p>

            <motion.h2
              variants={leftItem}
              className="text-xl md:text-2xl font-semibold text-gray-200 mb-8"
            >
              Your journey to success starts here.
            </motion.h2>

            <motion.div variants={leftItem} className="flex gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate("/enroll")}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-500 shadow-lg shadow-blue-900/30"
              >
                Enroll Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate("/courses")}
                className="px-7 py-3 rounded-xl border border-cyan-400/70 bg-white/5 text-cyan-100 backdrop-blur hover:bg-cyan-400 hover:text-slate-950 transition duration-300"
              >
                See Courses
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={imageVariants}
            className="hidden md:block relative"
          >
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                alt="learning"
                className="w-[520px] h-[390px] object-cover rounded-2xl shadow-2xl border border-white/10"
              />

              <div className="absolute -top-6 -left-6 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl shadow-xl">
                <p className="text-sm text-cyan-200">Students Trained</p>
                <h3 className="text-3xl font-bold">10K+</h3>
              </div>

              <div className="absolute -bottom-6 -right-6 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 backdrop-blur-xl shadow-xl">
                <p className="text-sm text-gray-300">Career Courses</p>
                <h3 className="text-3xl font-bold text-cyan-300">25+</h3>
              </div>

              <div className="absolute top-1/2 -right-10 -translate-y-1/2 rounded-2xl border border-cyan-300/30 bg-blue-950/80 px-4 py-3 backdrop-blur-xl shadow-xl">
                <p className="text-sm text-gray-300">Live Projects</p>
                <h3 className="text-2xl font-bold text-blue-300">100+</h3>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default Hero1;
