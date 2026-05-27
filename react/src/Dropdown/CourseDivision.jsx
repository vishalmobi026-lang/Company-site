import { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaArrowRight, FaLaptopCode, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const FALLBACK_COURSES = {
  "it / technical": [
    { title: "Full-Stack Development", desc: "Build complete applications with frontend, backend, database, and deployment skills.", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c", tag: "Popular" },
    { title: "MERN Stack Development", desc: "Create full-stack web apps using MongoDB, Express, React, and Node.js.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", tag: "Web Dev" },
    { title: "Python Developer", desc: "Learn Python programming for applications, automation, and backend development.", img: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8", tag: "Code" },
    { title: "UI/UX Design", desc: "Design user-centered interfaces and experiences with modern design tools.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5", tag: "Design" }
  ],
  "accounting": [
    { title: "Tally Prime", desc: "Master professional accounting and GST management with Tally Prime.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f", tag: "Finance" },
    { title: "GST Accounting", desc: "Understand GST billing, tax entries, returns, and practical filing basics.", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c", tag: "Tax" }
  ],
  "non technical": [
    { title: "Digital Marketing", desc: "Learn SEO, SEM, social media, and content marketing strategies.", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a", tag: "Business" },
    { title: "Office Management", desc: "Master MS Office tools for efficient workplace documentation and operations.", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174", tag: "Basics" }
  ],
  "designing": [
    { title: "Graphic Designing", desc: "Master Photoshop, Illustrator, and CorelDRAW for professional branding.", img: "https://insdpunebaner.com/wp-content/uploads/2024/07/graphic-design-1024x559.webp", tag: "Creative" },
    { title: "UI/UX Design", desc: "Design user-centered interfaces and experiences with modern design tools.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5", tag: "Modern" }
  ]
};


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

function CourseDivision() {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndCategory = async () => {
      try {
        setLoading(true);
        // 1. Fetch categories to find the name for this slug
        const catRes = await axios.get("https://company-site-jrbr.onrender.com/categories");
        const currentCat = catRes.data.find(c => c.slug === categorySlug);
        
        if (currentCat) {
          setCategoryName(currentCat.name);
          // 2. Fetch courses for this category
          // Note: Backend stores category name in 'category' field
          try {
            const res = await axios.get(
              `https://company-site-jrbr.onrender.com/courses?category=${encodeURIComponent(currentCat.name)}`
            );
            if (res.data && res.data.length > 0) {
              const formatted = res.data.map(c => ({
                title: c.title,
                desc: c.description,
                img: c.image_url,
                tag: c.tag
              }));
              setCourses(formatted);
            } else {
              setCourses(FALLBACK_COURSES[currentCat.name.toLowerCase()] || []);
            }
          } catch (courseErr) {
            console.error("Failed to fetch courses from API, using fallbacks", courseErr);
            setCourses(FALLBACK_COURSES[currentCat.name.toLowerCase()] || []);
          }
        } else {
          setCategoryName("Courses");
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
        // If category fetch fails, try to infer from slug and use fallbacks
        const slugMap = {
          "it-technical": "IT / Technical",
          "accounting": "Accounting",
          "non-technical": "Non Technical",
          "designing": "Designing"
        };
        const inferredName = slugMap[categorySlug];
        if (inferredName) {
          setCategoryName(inferredName);
          setCourses(FALLBACK_COURSES[inferredName.toLowerCase()] || []);
        } else {
          setCategoryName("Courses");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesAndCategory();
  }, [categorySlug]);

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-14 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[520px] h-[520px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-140px]"></div>
      <div className="absolute w-[420px] h-[420px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          key={categorySlug}
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="text-center mb-12"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
            <FaLaptopCode />
            {categoryName} Training
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-100 via-cyan-300 to-blue-500 bg-clip-text text-transparent pb-2 leading-tight">
            {categoryName} Courses
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            Professional training paths designed to build your skills in {categoryName}.
          </p>
        </motion.div>

        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
        ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                No courses found in this category yet. Check back soon!
            </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}

export default CourseDivision;
