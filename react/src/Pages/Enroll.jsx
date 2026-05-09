import { useState, useEffect } from "react";
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
  FaCalendarAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Enroll() {
  const navigate = useNavigate();
  const location = useLocation();

  const [courseOpen, setCourseOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8000/courses");
        setAllCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses for enrollment", err);
      }
    };
    fetchAllCourses();
  }, []);

  const selectedCourseName = location.state?.course || "Full-Stack Development";
  
  const courseList = allCourses.length > 0 ? allCourses.map(c => c.title) : [selectedCourseName];
  const courseDescriptions = allCourses.reduce((acc, c) => {
    acc[c.title] = c.description;
    return acc;
  }, {});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    college: "",
    year: "",
    address: "",
    country: "",
    state: "",
    district: "",
    pincode: "",
    course: selectedCourseName,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email address is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Please enter a valid email";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit number";
        break;
      case "dob":
        if (!value) error = "Date of Birth is required";
        break;
      case "college":
        if (!value) error = "College/Institution name is required";
        break;
      case "pincode":
        if (value && !/^\d{6}$/.test(value)) error = "Invalid pincode (6 digits)";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatting specific fields
    let formattedValue = value;
    if (name === "year" || name === "pincode" || name === "phone") {
        formattedValue = value.replace(/\D/g, "");
        if (name === "year" && formattedValue.length > 4) return;
        if (name === "pincode" && formattedValue.length > 6) return;
        if (name === "phone" && formattedValue.length > 10) return;
    }

    setForm(prev => ({ ...prev, [name]: formattedValue }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Pincode auto-fill
    if (name === "pincode" && formattedValue.length === 6) {
      fetchLocation(formattedValue);
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
          country: "India",
        }));
        setErrors(prev => ({ ...prev, pincode: "" }));
      } else {
        setErrors(prev => ({ ...prev, pincode: "Invalid pincode" }));
      }
    } catch (err) {
      console.error("Pincode fetch failed", err);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const inputClass = (name) => {
    const hasError = errors[name] && touched[name];
    return `w-full mt-2 p-3.5 rounded-xl bg-slate-900/80 border transition-all duration-300 outline-none text-white placeholder:text-slate-600 shadow-inner ${
      hasError 
        ? "border-red-500/50 focus:border-red-500 bg-red-500/5 ring-4 ring-red-500/10" 
        : "border-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
    }`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check
    const requiredFields = ["name", "email", "phone", "dob", "college"];
    const newErrors = {};
    const newTouched = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
      newTouched[field] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) element.focus();
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/enrollments", form);
      setSubmitStatus('success');
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
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
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition font-bold"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 mb-4 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur font-bold">
            <FaCheckCircle />
            Start your learning journey
          </span>

          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text text-transparent pb-2">
            Student Enrollment
          </h1>

          <p className="text-slate-400 mt-4 text-lg font-medium">
            Complete the form below and our team will contact you shortly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            className="bg-white/5 backdrop-blur-2xl border border-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-2xl space-y-10 relative overflow-hidden"
          >
            {/* Status Overlay */}
            <AnimatePresence>
                {submitStatus === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                            <FaCheckCircle className="text-white text-4xl" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Registration Successful!</h2>
                        <p className="text-slate-400 font-medium">Thank you for choosing G-Tech. Our academic counselor will reach out to you within 24 hours.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid sm:grid-cols-3 gap-6">
              {["Personal", "Education", "Course"].map((step, index) => (
                <div
                  key={step}
                  className={`rounded-2xl border p-5 transition-all duration-500 ${
                    index === 0 ? "border-cyan-400/30 bg-cyan-400/5 shadow-lg shadow-cyan-400/5" : "border-slate-800 bg-slate-950/40"
                  }`}
                >
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Step 0{index + 1}</p>
                  <h3 className={`font-bold ${index === 0 ? "text-cyan-300" : "text-slate-400"}`}>{step}</h3>
                </div>
              ))}
            </div>

            {/* SECTION 1: PERSONAL */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="p-2 bg-cyan-400/10 rounded-lg"><FaUser size={18} /></div> 
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Full Name *</label>
                  <input
                    name="name"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("name")}
                  />
                  {errors.name && touched.name && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Date of Birth *</label>
                  <div className="relative">
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${inputClass("dob")} appearance-none`}
                    />
                    {!form.dob && <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />}
                  </div>
                  {errors.dob && touched.dob && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.dob}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("email")}
                  />
                  {errors.email && touched.email && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Phone Number *</label>
                  <input
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("phone")}
                  />
                  {errors.phone && touched.phone && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* SECTION 2: EDUCATION */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="p-2 bg-cyan-400/10 rounded-lg"><FaGraduationCap size={18} /></div> 
                Academic Details
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">College / University *</label>
                    <input
                        name="college"
                        placeholder="Name of your current or last institution"
                        value={form.college}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClass("college")}
                    />
                    {errors.college && touched.college && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.college}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Year of Passing</label>
                    <input
                        name="year"
                        placeholder="YYYY"
                        value={form.year}
                        onChange={handleChange}
                        className={inputClass("year")}
                    />
                </div>
              </div>
            </div>

            {/* SECTION 3: ADDRESS */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="p-2 bg-cyan-400/10 rounded-lg"><FaMapMarkerAlt size={18} /></div> 
                Communication Address
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Street Address</label>
                <textarea
                    name="address"
                    placeholder="Door No, Street Name, Landmark"
                    rows="2"
                    value={form.address}
                    onChange={handleChange}
                    className={`${inputClass("address")} resize-none`}
                />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Pincode</label>
                    <input name="pincode" placeholder="600001" value={form.pincode} onChange={handleChange} onBlur={handleBlur} className={inputClass("pincode")} />
                    {errors.pincode && touched.pincode && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.pincode}</p>}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">District</label>
                    <input name="district" placeholder="District" value={form.district} onChange={handleChange} className={inputClass("district")} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">State</label>
                    <input name="state" placeholder="State" value={form.state} onChange={handleChange} className={inputClass("state")} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Country</label>
                    <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className={inputClass("country")} />
                </div>
              </div>
            </div>

            {/* SECTION 4: COURSE */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="p-2 bg-cyan-400/10 rounded-lg"><FaBookOpen size={18} /></div> 
                Selected Program
              </h2>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCourseOpen(!courseOpen)}
                  className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none transition text-white text-left flex items-center justify-between font-bold"
                >
                  <span>{form.course}</span>
                  <span className={`text-cyan-400 transition-transform duration-300 ${courseOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                <AnimatePresence>
                    {courseOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 bottom-full mb-3 w-full max-h-[250px] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl custom-scrollbar"
                    >
                        {courseList.map((course) => (
                        <button
                            key={course}
                            type="button"
                            onClick={() => {
                            setForm({ ...form, course });
                            setCourseOpen(false);
                            }}
                            className={`block w-full px-5 py-4 text-left text-sm font-bold transition-all ${form.course === course
                                ? "bg-blue-600 text-white"
                                : "text-slate-300 hover:bg-slate-800"
                            }`}
                        >
                            {course}
                        </button>
                        ))}
                    </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-800">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <p className="text-xs font-black uppercase tracking-widest">Secure Enrollment</p>
              </div>

              <motion.button
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                className={`w-full md:w-auto px-12 py-5 rounded-2xl text-lg font-black bg-gradient-to-r from-blue-900 to-blue-600 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting...</>
                ) : (
                    "Submit Enrollment Application"
                )}
              </motion.button>
            </div>

            {submitStatus === 'error' && (
                <p className="text-red-400 text-center font-bold text-sm mt-4">Failed to submit application. Please check your connection and try again.</p>
            )}
          </motion.form>

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: 45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="lg:sticky lg:top-10 space-y-6"
          >
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl rounded-full"></div>
                
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300">
                    <FaBookOpen />
                </div>

                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Selected Program</p>
                <h2 className="text-2xl font-black text-cyan-300 mb-4">{form.course}</h2>

                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {courseDescriptions[form.course] || "Master job-ready skills with our professional certification program designed for the industry."}
                </p>

                <div className="my-8 h-px bg-slate-800/50 w-full"></div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-cyan-400/10 rounded-lg text-cyan-300"><FaPhoneAlt size={14} /></div>
                        <div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Assistance</p>
                            <p className="font-bold text-slate-200">+91 75980 98675</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-cyan-400/10 rounded-lg text-cyan-300"><FaEnvelope size={14} /></div>
                        <div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Support Email</p>
                            <p className="font-bold text-slate-200 text-sm break-all leading-tight">azhagiyamandapam.tn@gteceducation.com</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Next Steps
                    </p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Our academic team will process your application and contact you within 24 hours with schedule details.
                    </p>
                </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

export default Enroll;
