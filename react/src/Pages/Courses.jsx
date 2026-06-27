import { FaCheckCircle, FaArrowRight, FaLayerGroup, FaLaptopCode, FaBriefcase, FaPaintBrush, FaCalculator, FaHardHat, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const CATEGORY_IMAGES = {
  "it / technical": "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "non technical": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  "non-technical": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  "designing": "https://insdpunebaner.com/wp-content/uploads/2024/07/graphic-design-1024x559.webp",
  "accounting": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "civil": "https://thumbs.dreamstime.com/b/female-civil-engineer-examines-urban-traffic-patterns-female-civil-engineer-examines-urban-traffic-patterns-d-mapping-446739853.jpg",
  "coding": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
};


const CATEGORY_TAGS = {
  "it / technical": "Most Popular",
  "non technical": "Career Skills",
  "non-technical": "Career Skills",
  "designing": "Creative",
  "accounting": "Finance",
  "civil": "Professional",
  "coding": "Trending",
};



const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80";

export default function Courses() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://company-site-jrbr.onrender.com/categories");
        if (res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getImage = (cat) =>
    cat.image_url || CATEGORY_IMAGES[cat.name?.toLowerCase()] || FALLBACK_IMAGE;

  const getTag = (name) =>
    CATEGORY_TAGS[name?.toLowerCase()] || "Certificate Course";

  return (
    <section className="relative min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[520px] h-[520px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-130px]"></div>
      <div className="absolute w-[420px] h-[420px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-130px] right-[-120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
            <FaLayerGroup />
            Choose your learning path
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text text-transparent pb-2 leading-tight">
            Explore Our Courses
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed">
            Pick the path that matches your goal and start building practical skills with structured training.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 60, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-xl shadow-xl transition border-slate-700 hover:border-cyan-400/50"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImage(cat)}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/70 px-4 py-2 text-xs text-cyan-200 backdrop-blur">
                    {getTag(cat.name)}
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {cat.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                    Professional training in {cat.name} — build real skills with hands-on projects.
                  </p>

                  <div className="flex items-center gap-2 text-cyan-300 mb-5">
                    <FaCheckCircle />
                    <span className="text-sm">Certificate Course</span>
                  </div>

                  <button
                    onClick={() => navigate(`/courses/${cat.slug}`)}
                    className="group/btn w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-500 flex items-center justify-center gap-2 hover:scale-105 transition duration-300 shadow-md shadow-blue-900/30"
                  >
                    View Course
                    <FaArrowRight className="transition group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}

            {categories.length === 0 && !loading && (
              <div className="col-span-3 text-center py-20 text-gray-400">
                No course categories found. Please check back soon!
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
//courses
//courses are here
