import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Courses({ setPage }) {

  const courses = [
    // TECHNICAL
    {
      title: "IT/Technical",
      desc: "Build complete web applications",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      page: "It/Technical"
    },
    {
      title: "Non-Technical",
      desc: "MongoDB, Express, React, Node",
      img: "https://miro.medium.com/v2/resize:fit:1400/1*0G5zu7-Cx6h2n1Zb8Z9g7A.png",
      page: "NonTechnical"
    },

    // NON-TECHNICAL
    {
      title: "Designing",
      desc: "Learn leadership & business strategy",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      page: "Designing"
    },
    {
      title: "Accounting",
      desc: "SEO, Ads & social media growth",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      page: "Accounting"
    },

    // DESIGN
    {
      title: "Civil",
      desc: "Design user-friendly interfaces",
      img: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      page: "Civil"
    }
  ];

  return (
    <div className="bg-gray-100 py-16 px-6">

      <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
        All Courses
      </h1>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10">
        {courses.map((course, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="w-[320px] bg-white rounded-2xl shadow-lg overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={course.img}
              alt={course.title}
              className="h-48 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold mb-2">
                {course.title}
              </h2>

              <p className="text-gray-600 text-sm mb-4">
                {course.desc}
              </p>

              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <FaCheckCircle />
                <span>Certificate Course</span>
              </div>

              {/*  FIXED BUTTON */}
              <button
                onClick={() => setPage(course.page)}
                className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto hover:bg-red-600 transition"
              >
                Enroll Now <FaArrowRight />
              </button>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}