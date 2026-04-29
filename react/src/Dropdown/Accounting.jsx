import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Accounting() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Full-Stack Development",
      desc: "Building both the front end and back end of an application.",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MERN Stack Development",
      desc: "Build full-stack apps using JavaScript.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MEAN Stack Development",
      desc: "JavaScript-based front-end & back-end.",
      img: "https://images.unsplash.com/photo-1581091870627-3b1c5d6d3b5b?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Data Science",
      desc: "Turn raw data into actionable insights.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Artificial Intelligence",
      desc: "Machines that learn and adapt.",
      img: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "PHP Developer",
      desc: "Build dynamic web applications.",
      img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="bg-gray-100 py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
        Software Courses
      </h1>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10">
        {courses.map((course, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
            className="relative w-[320px] rounded-2xl group"
          >

            {/* GLOW BORDER */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition duration-500"></div>

            {/* CARD */}
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">

              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={course.img}
                  alt={course.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Course";
                  }}
                  className="h-48 w-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>

              {/* CONTENT */}
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-2">
                  {course.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {course.desc}
                </p>

                {/* CERTIFICATE */}
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <FaCheckCircle />
                  <span>Certificate Course</span>
                </div>

                {/* ✅ ROUTER BUTTON */}
                <motion.button
                  onClick={() => navigate("/enroll")}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 mx-auto relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>

                  Enroll Now

                  <motion.span
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaArrowRight />
                  </motion.span>
                </motion.button>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Accounting;