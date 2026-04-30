import { useState } from "react";
import { FaCheckCircle, FaArrowRight, FaLaptopCode, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function CourseCard({ course, index, navigate }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group overflow-hidden rounded-2xl border border-slate-700 bg-white/5 backdrop-blur-xl shadow-xl transition hover:border-cyan-400/50"
    >
      <div className="relative h-44 overflow-hidden bg-slate-900">
        {!imageError ? (
          <img
            src={course.img}
            alt={course.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(14,165,233,.25),rgba(15,23,42,.95)),linear-gradient(#334155_1px,transparent_1px),linear-gradient(90deg,#334155_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]">
            <div className="text-center">
              <FaCode className="mx-auto mb-3 text-4xl text-cyan-300" />
              <p className="text-sm font-semibold text-cyan-100">{course.title}</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent"></div>

        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs text-cyan-200 backdrop-blur">
          {course.tag}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
          <FaCode />
        </div>

        <h2 className="text-lg font-bold mb-2">{course.title}</h2>

        <p className="text-gray-400 text-sm mb-4 leading-relaxed min-h-[60px]">
          {course.desc}
        </p>

        <div className="flex items-center gap-2 text-cyan-300 mb-5 text-sm">
          <FaCheckCircle />
          <span>Certificate Course</span>
        </div>

        <motion.button
          onClick={() =>
            navigate("/enroll", { state: { course: course.title } })
          }
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          className="w-full bg-gradient-to-r from-blue-900 to-blue-500 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
        >
          Enroll Now
          <FaArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
}

function Technical() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Full-Stack Development",
      desc: "Build complete applications with frontend, backend, database, and deployment skills.",
      img: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80",
      tag: "Popular",
    },
    {
      title: "MERN Stack Development",
      desc: "Create full-stack web apps using MongoDB, Express, React, and Node.js.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      tag: "Web Dev",
    },
    {
      title: "MEAN Stack Development",
      desc: "Build scalable applications with MongoDB, Express, Angular, and Node.js.",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      tag: "Full Stack",
    },
    {
      title: "Python Developer",
      desc: "Learn Python programming for applications, automation, and backend development.",
      img: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80",
      tag: "Programming",
    },
    {
      title: "Java Developer",
      desc: "Build secure, scalable, and high-performance applications with Java.",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
      tag: "Software",
    },
    {
      title: "JavaScript",
      desc: "Make websites interactive, dynamic, and responsive using JavaScript.",
      img: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
      tag: "Frontend",
    },
    {
      title: "HTML",
      desc: "Learn the standard structure language used to create web pages.",
      img: "https://images.unsplash.com/photo-1581276879432-15a19d654956?auto=format&fit=crop&w=800&q=80",
      tag: "Basics",
    },
    {
      title: "CSS",
      desc: "Style modern websites with layouts, responsive design, and animations.",
      img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80",
      tag: "Design",
    },
    {
      title: "Machine Learning",
      desc: "Understand systems that learn patterns and make predictions from data.",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      tag: "AI",
    },
    {
      title: "Data Science",
      desc: "Extract insights from data using analysis, visualization, and modeling.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      tag: "Data",
    },
    {
      title: "Artificial Intelligence",
      desc: "Learn the basics of intelligent systems, automation, and AI concepts.",
      img: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?auto=format&fit=crop&w=800&q=80",
      tag: "AI",
    },
    {
      title: "PHP Developer",
      desc: "Build server-side web applications and dynamic websites with PHP.",
      img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80",
      tag: "Backend",
    },
    {
      title: "MySQL",
      desc: "Learn relational database design, queries, tables, and data management.",
      img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
      tag: "Database",
    },
    {
      title: "SQL",
      desc: "Query, filter, join, and manage database records efficiently.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      tag: "Database",
    },
    {
      title: "MongoDB",
      desc: "Work with flexible NoSQL data structures for modern applications.",
      img: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=800&q=80",
      tag: "NoSQL",
    },
    {
      title: "Oracle",
      desc: "Understand enterprise database systems and professional data handling.",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      tag: "Enterprise",
    },
  ];

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-14 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[520px] h-[520px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-140px]"></div>
      <div className="absolute w-[420px] h-[420px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.75 }}
          className="text-center mb-12"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
            <FaLaptopCode />
            Technical Training
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Software Courses
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            Learn programming, web development, databases, and AI skills with practical training paths.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard
              key={course.title}
              course={course}
              index={index}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Technical;
