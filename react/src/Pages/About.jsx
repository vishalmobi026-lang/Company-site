import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { name: "Offices", value: "12+" },
  { name: "Employees", value: "300+" },
  { name: "Projects", value: "120+" },
  { name: "Experience", value: "5 Years" },
];

const team = [
  {
    name: "John Doe",
    role: "CEO",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Sara Lee",
    role: "CTO",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-16 px-6 overflow-hidden">

      {/* 🔹 BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>

      {/* 🔹 GLOW EFFECTS */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* 🔥 HERO */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Building the Future
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          We create modern, scalable, and intelligent digital solutions that empower businesses worldwide.
        </p>
      </motion.div>

      {/* 🔥 ABOUT CONTENT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20 relative z-10">

        <motion.img
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          src="https://images.unsplash.com/photo-1552664730-d307ca884978"
          alt="team"
          className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
        />

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-300">Who We Are</h2>
          <p className="text-gray-300 mb-4">
            We are a passionate team of developers, designers, and innovators focused on delivering high-quality digital products.
          </p>
          <p className="text-gray-400">
            Our mission is to simplify technology and create impactful experiences through modern web and mobile solutions.
          </p>
        </motion.div>
      </div>

      {/* 🔥 STATS */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20 relative z-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur border border-gray-700 p-6 rounded-xl text-center shadow-lg"
          >
            <h3 className="text-3xl font-bold text-purple-400">{stat.value}</h3>
            <p className="text-gray-400">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔥 TEAM */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl font-bold">Meet Our Team</h2>
        <p className="text-gray-400 mt-2">The people behind our success</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-20 relative z-10">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur border border-gray-700 p-6 rounded-xl text-center shadow-lg"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-purple-400"
            />
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-gray-400">{member.role}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔥 CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center relative z-10"
      >
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Join Our Courses
        </h2>

        <button
          onClick={() => navigate("/contact")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition duration-300 shadow-lg"
        >
          Contact Us
        </button>
      </motion.div>

    </section>
  );
}