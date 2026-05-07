import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaBookOpen,
  FaCheckCircle,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

function Enroll() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCourse = location.state?.course || "Full-Stack Development";
  const [courseOpen, setCourseOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const courses = {
    [selectedCourse]: "Selected course from your chosen category.",
    "Full-Stack Development": "Frontend and backend development fundamentals.",
    "MERN Stack Development": "MongoDB, Express, React, and Node project training.",
    "MEAN Stack Development": "MongoDB, Express, Angular, and Node project training.",
    "Python Developer": "Python programming for applications and automation.",
    "Java Developer": "Secure and scalable application development with Java.",
    JavaScript: "Interactive website development with JavaScript.",
    HTML: "Web page structure and HTML fundamentals.",
    CSS: "Modern styling, layouts, and responsive design.",
    "Machine Learning": "Machine learning concepts and prediction basics.",
    "Data Science": "Data analysis, visualization, and insights.",
    "Artificial Intelligence": "AI concepts and intelligent systems.",
    "PHP Developer": "Server-side web development with PHP.",
    MySQL: "Relational database design and queries.",
    SQL: "Query and manage database records.",
    MongoDB: "Flexible NoSQL database structures.",
    Oracle: "Enterprise database systems.",

    "Office Administration": "Office workflow, documents, and operations.",
    "Business Communication": "Professional speaking, writing, and presentations.",
    "Digital Marketing": "SEO, social media, ads, and online growth.",
    "Human Resource Basics": "Recruitment, HR records, and workplace policy.",
    Entrepreneurship: "Business planning, sales, and growth strategy.",
    "Spoken English": "Fluency, vocabulary, grammar, and interview speaking.",

    "Graphic Designing": "Branding, posters, layouts, and visual communication.",
    "UI/UX Designing": "Wireframes, prototypes, and user-friendly interfaces.",
    Photoshop: "Photo editing, retouching, and digital artwork.",
    Illustrator: "Logos, vectors, icons, and illustrations.",
    "Video Editing": "Cuts, transitions, reels, and content editing.",
    "Motion Graphics": "Animated titles, promos, and visual effects.",

    "AutoCAD Civil": "2D drafting, plans, layouts, and civil drawings.",
    "Revit Architecture": "Building models, elevations, sections, and BIM.",
    "STAAD Pro": "Structural analysis and design workflow.",
    "3ds Max": "Architectural 3D models and visual presentations.",
    SketchUp: "3D building concepts, interiors, and layouts.",
    "Quantity Surveying": "Estimation, costing, BOQ, and documentation.",

    "Tally Prime": "Company creation, vouchers, GST, inventory, and reports.",
    "GST Accounting": "GST billing, tax entries, returns, and filing basics.",
    "Excel for Accounts": "Formulas, reports, and accounting data tools.",
    "Payroll Management": "Salary, attendance, deductions, and payroll records.",
    "Business Accounting": "Ledger, journal, balance sheet, and billing basics.",
    "Advanced Tally": "GST, inventory, banking, and business accounting.",
  };

  const courseList = Object.keys(courses);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    address: "",
    country: "",
    state: "",
    district: "",
    pincode: "",
    course: selectedCourse,
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Year of qualification: 4 digit number only
    if (name === "year") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 4) return;
      setForm({ ...form, [name]: numericValue });
      return;
    }

    setForm({ ...form, [name]: value });

    // Pincode auto-fill logic
    if (name === "pincode" && value.length === 6) {
      fetchLocation(value);
    }
  };


  const fetchLocation = async (pincode) => {
    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (res.data[0].Status === "Success") {
        const postOffice = res.data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          district: postOffice.District,
          state: postOffice.State,
          country: "India", // Most pincode APIs are country-specific
        }));
      }
    } catch (err) {
      console.error("Pincode fetch failed", err);
    }
  };


  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isInvalid = (field) => touched[field] && !form[field];

  const inputClass = (field) =>
    `w-full mt-2 p-3 rounded-lg bg-slate-950/70 border outline-none transition text-white placeholder:text-gray-500 ${isInvalid(field)
      ? "border-red-500 focus:border-red-400"
      : "border-slate-700 focus:border-cyan-400"
    }`;

  const normalInputClass =
    "w-full p-3 rounded-lg bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition text-white placeholder:text-gray-500";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "phone"];
    const newTouched = requiredFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});

    setTouched({ ...touched, ...newTouched });

    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/enrollments", form);
      alert("Enrollment Submitted Successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit enrollment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-slate-950 px-4 py-10 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[420px] h-[420px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-120px] right-[-100px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 mb-4 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
            <FaCheckCircle />
            Start your learning journey
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Student Enrollment
          </h1>

          <p className="text-gray-400 mt-3">
            Complete the form below and our team will contact you shortly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            className="bg-white/5 backdrop-blur-xl border border-slate-700 p-5 md:p-8 rounded-2xl shadow-2xl space-y-7"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              {["Personal", "Education", "Course"].map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <p className="text-xs text-gray-400">Step {index + 1}</p>
                  <h3 className="font-semibold text-cyan-300">{step}</h3>
                </div>
              ))}
            </div>

            <div>
              <h2 className="flex items-center gap-3 text-lg font-semibold text-cyan-300 mb-5">
                <FaUser /> Personal Information
              </h2>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("name")}
                  />
                  {isInvalid("name") && (
                    <p className="text-red-400 text-sm mt-1">Name is required</p>
                  )}
                </div>

                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("email")}
                  />
                  {isInvalid("email") && (
                    <p className="text-red-400 text-sm mt-1">Email is required</p>
                  )}
                </div>

                <div>
                  <label>Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter your phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("phone")}
                  />
                  {isInvalid("phone") && (
                    <p className="text-red-400 text-sm mt-1">Phone is required</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-3 text-lg font-semibold text-cyan-300 mb-5">
                <FaGraduationCap /> Education Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  name="college"
                  placeholder="College / Institution"
                  value={form.college}
                  onChange={handleChange}
                  className={normalInputClass}
                />

                <input
                  name="year"
                  placeholder="Year (e.g. 2024)"
                  value={form.year}
                  onChange={handleChange}
                  className={normalInputClass}
                  maxLength={4}
                />

              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-3 text-lg font-semibold text-cyan-300 mb-5">
                <FaMapMarkerAlt /> Address Details
              </h2>

              <textarea
                name="address"
                placeholder="Full Address"
                rows="3"
                value={form.address}
                onChange={handleChange}
                className={`${normalInputClass} resize-none`}
              />

              <div className="grid md:grid-cols-2 gap-5 mt-5">
                <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className={normalInputClass} />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} className={normalInputClass} />
                <input name="district" placeholder="District" value={form.district} onChange={handleChange} className={normalInputClass} />
                <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className={normalInputClass} />
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-3 text-lg font-semibold text-cyan-300 mb-5">
                <FaBookOpen /> Selected Course
              </h2>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCourseOpen(!courseOpen)}
                  className="w-full p-3 rounded-lg bg-slate-950/70 border border-slate-700 focus:border-cyan-400 outline-none transition text-white text-left flex items-center justify-between"
                >
                  <span>{form.course}</span>
                  <span className="text-cyan-300">{courseOpen ? "▲" : "▼"}</span>
                </button>

                {courseOpen && (
                  <div className="absolute z-50 bottom-full mb-2 w-full max-h-[220px] overflow-y-auto rounded-xl border border-cyan-400/40 bg-slate-900 shadow-2xl">
                    {courseList.map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, course });
                          setCourseOpen(false);
                        }}
                        className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-cyan-400 hover:text-slate-950 ${form.course === course
                            ? "bg-blue-600 text-white"
                            : "text-gray-200"
                          }`}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-6 border-t border-slate-700">
              <p className="text-sm text-gray-400">
                Fields marked with * are required.
              </p>

              <motion.button
                disabled={loading}
                whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                type="submit"
                className={`w-full md:w-auto px-14 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-900 to-blue-500 shadow-lg shadow-blue-900/30 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Submitting..." : "Submit Enrollment"}
              </motion.button>
            </div>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, x: 45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="lg:sticky lg:top-6 rounded-2xl border border-slate-700 bg-white/5 p-6 backdrop-blur-xl shadow-2xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300">
              <FaBookOpen />
            </div>

            <p className="text-sm text-gray-400">Selected Course</p>

            <h2 className="mt-1 text-2xl font-bold text-cyan-300">
              {form.course}
            </h2>

            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              {courses[form.course] || "Selected course from your chosen category."}
            </p>

            <div className="my-6 border-t border-slate-700"></div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-cyan-300" />
                <div>
                  <p className="font-semibold">Need guidance?</p>
                  <p className="text-sm text-gray-400">+91 75980 98675</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-cyan-300" />
                <div>
                  <p className="font-semibold">Email support</p>
                  <p className="text-sm text-gray-400 break-all">
                    azhagiyamandapam.tn@gteceducation.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
              <p className="text-sm text-cyan-200">What happens next?</p>
              <p className="mt-2 text-sm text-gray-400">
                After submitting, our team will contact you with course timing,
                fees, and admission details.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

export default Enroll;
