import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Technical() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Full-Stack Development",
      desc: "Building both the front end and back end of an application.",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MERN Stack Development",
      desc: "Enables building full-stack web applications using only JavaScript.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MEAN Stack Development",
      desc: "Utilizes JavaScript for both front-end and back-end.",
      img: "https://images.unsplash.com/photo-1581091870627-3b1c5d6d3b5b?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Python Developer",
      desc: "Integrates modern front-end and back-end technologies.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Java Developer",
      desc: "Build secure, scalable, high-performance applications.",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "JavaScript",
      desc: "Makes websites interactive, dynamic and responsive.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "HTML",
      desc: "Standard language to structure web pages.",
      img: "https://images.unsplash.com/photo-1581276879432-15a19d654956?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "CSS",
      desc: "Styles your web pages beautifully.",
      img: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Machine Learning",
      desc: "Systems that learn from data automatically.",
      img: "https://images.unsplash.com/photo-1581091012184-7c1b9f2c6c8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Data Science",
      desc: "Extract insights and knowledge from data.",
      img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Artificial Intelligence",
      desc: "Simulation of human intelligence in machines.",
      img: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "PHP Developer",
      desc: "Server-side scripting for web development.",
      img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MySQL",
      desc: "Open-source relational database system.",
      img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "SQL",
      desc: "Query and manage databases efficiently.",
      img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "MongoDB",
      desc: "Flexible NoSQL database.",
      img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Oracle",
      desc: "Enterprise-level database system.",
      img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80"
    },
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

            {/* GLOW */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition"></div>

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
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-2">
                  {course.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {course.desc}
                </p>

                <div className="flex justify-center gap-2 text-green-600 mb-4">
                  <FaCheckCircle />
                  <span>Certificate Course</span>
                </div>

                {/* ✅ ROUTER BUTTON */}
                <motion.button
                  onClick={() => navigate("/enroll")}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-red-500 text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto"
                >
                  Enroll Now
                  <FaArrowRight />
                </motion.button>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Technical;