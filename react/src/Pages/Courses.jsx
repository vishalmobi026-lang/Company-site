import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Courses() {

  const navigate = useNavigate();

  const courses = [
    {
      title: "IT/Technical",
      desc: "Build complete web applications",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      path: "/courses/technical"
    },
    {
      title: "Non-Technical",
      desc: "Management, Communication, Business Skills",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", // ✅ FIXED
      path: "/courses/non-technical"
    },
    {
      title: "Designing",
      desc: "Learn leadership & business strategy",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      path: "/courses/designing"
    },
    {
      title: "Accounting",
      desc: "SEO, Ads & social media growth",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      path: "/courses/accounting"
    },
    {
      title: "Civil",
      desc: "Design user-friendly interfaces",
      img: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      path: "/courses/civil"
    }
  ];

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-16 px-6 overflow-hidden">

      {/* 🔹 Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>

      {/* 🔹 Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* 🔹 TITLE */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-14 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent relative z-10">
        Explore Our Courses
      </h1>

      {/* 🔹 CARDS */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 relative z-10">

        {courses.map((course, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.05 }}
            className="w-[320px] bg-white/5 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition"
          >

            {/* 🔹 IMAGE */}
            <div className="relative">
              <img
                src={course.img}
                alt={course.title}
                className="h-48 w-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=Course";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* 🔹 CONTENT */}
            <div className="p-6 text-center">

              <h2 className="text-xl font-semibold mb-2">
                {course.title}
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                {course.desc}
              </p>

              <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                <FaCheckCircle />
                <span>Certificate Course</span>
              </div>

              <button
                onClick={() => navigate(course.path)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center gap-2 mx-auto hover:scale-105 transition duration-300 shadow-md"
              >
                Enroll Now <FaArrowRight />
              </button>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}