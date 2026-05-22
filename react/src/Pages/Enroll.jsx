import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaBookOpen,
  FaCheckCircle,
  FaCalendarAlt,
  FaImage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import LottieLib from "lottie-react";
const Lottie = LottieLib.default ?? LottieLib;
import successAnimation from "../Assets/Success.json";
import failAnimation from "../Assets/Fail.json";
import { COUNTRY_CODES } from "../data/countries";

function SubmitAlert({ type, onClose }) {
  const success = type === "success";
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!success || !type) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [type]);

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-cyan-100 bg-white p-9 text-center shadow-[0_40px_120px_-35px_rgba(34,211,238,0.55)]"
          >
            <div
              className={`absolute inset-x-0 top-0 h-2 ${success
                ? "bg-gradient-to-r from-blue-700 via-cyan-400 to-emerald-400"
                : "bg-gradient-to-r from-red-600 via-rose-500 to-orange-400"
                }`}
            />

            <div className="mx-auto mb-2 w-48 h-48">
              <Lottie
                animationData={success ? successAnimation : failAnimation}
                loop={true}
                autoplay={true}
              />
            </div>

            <h2
              className={`mb-3 text-3xl font-black uppercase tracking-tight ${success ? "text-emerald-600" : "text-red-600"
                }`}
            >
              {success ? "Success!" : "Submission Failed"}
            </h2>

            <p className="mx-auto mb-8 max-w-xs text-base font-bold leading-relaxed text-slate-500">
              {success
                ? "Your enrollment application has been submitted. Our academic counselor will contact you shortly."
                : "We could not submit your application. Please check your connection and try again."}
            </p>

            {success ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Redirecting automatically…
                </p>
              </div>
            ) : (
              <div className="relative flex w-full items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.04, y: -3, boxShadow: "0 0 48px 10px rgba(239,68,68,0.55)" }}
                  whileTap={{ scale: 0.95, boxShadow: "0 0 20px 4px rgba(239,68,68,0.8)" }}
                  onClick={onClose}
                  className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-rose-700 via-red-500 to-orange-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-red-900/50"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.9, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/0 via-orange-400/20 to-red-600/0"
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      animate={{ rotate: [0, -30, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                    >
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </motion.svg>
                    Try Again
                  </span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Enroll() {
  const navigate = useNavigate();
  const location = useLocation();

  const [courseOpen, setCourseOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);

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
  const courseList = allCourses.length > 0 ? allCourses.map((c) => c.title) : [selectedCourseName];

  const [eduTab, setEduTab] = useState("college");
  const [idProofName, setIdProofName] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    college: "",
    year: "",
    address: "",
    country: "India",
    state: "",
    district: "",
    pincode: "",
    course: selectedCourseName,
    school: "",
    school_status: "Passout",
    school_year: "",
    college_status: "Pursuing",
    college_degree_type: "Bachelor",
    college_degree: "",
    id_proof: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Full name is required";
        else if (value.trim().length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email address is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Please enter a valid email";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (form.country === "India") {
          if (!/^[6-9]\d{9}$/.test(value)) {
            error = "Indian phone numbers must start with 6, 7, 8, or 9 and be exactly 10 digits";
          }
        } else {
          if (!/^\d{10,15}$/.test(value)) {
            error = "Enter a valid 10-15 digit phone number";
          }
        }
        break;
      case "dob":
        if (!value) error = "Date of Birth is required";
        else {
          const dobDate = new Date(value);
          const year = dobDate.getFullYear();
          const today = new Date();
          if (year < 1990 || year > today.getFullYear()) error = "Enter a valid year (1990–present)";
          else if (dobDate > today) error = "Date of Birth cannot be in the future";
        }
        break;
      case "school":
        if (!value) error = "School name is required";
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
    let formattedValue = value;

    if (name === "year" || name === "school_year" || name === "pincode" || name === "phone") {
      formattedValue = value.replace(/\D/g, "");
      if (name === "year" && formattedValue.length > 4) return;
      if (name === "school_year" && formattedValue.length > 4) return;
      if (name === "pincode" && formattedValue.length > 6) return;
      if (name === "phone") {
        if (form.country === "India" && formattedValue.length > 10) return;
        if (formattedValue.length > 15) return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: formattedValue,
      ...(name === "pincode" && formattedValue.length < 6
        ? { district: "", state: "", country: "India" }
        : {}),
    }));

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (name === "pincode" && formattedValue.length === 6) {
      fetchLocation(formattedValue);
    }
  };

  const fetchLocation = async (pincode) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/pincode/${pincode}`);
      const data = res.data?.[0];

      if (data?.Status === "Success" && data?.PostOffice?.length > 0) {
        const postOffice = data.PostOffice[0];

        setForm((prev) => {
          if (prev.pincode !== pincode) return prev;

          return {
            ...prev,
            district: postOffice.District || "",
            state: postOffice.State || "",
            country: postOffice.Country || "India",
          };
        });

        setErrors((prev) => ({ ...prev, pincode: "" }));
      } else {
        setErrors((prev) => ({ ...prev, pincode: "Invalid pincode" }));
      }
    } catch (err) {
      console.error("Pincode fetch failed", err);
      setErrors((prev) => ({ ...prev, pincode: "Could not fetch location" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const inputClass = (name) => {
    const hasError = errors[name] && touched[name];

    return `w-full mt-1.5 p-3 rounded-xl bg-slate-900 border transition-all duration-300 outline-none text-white text-sm placeholder:text-slate-600 shadow-inner ${hasError
      ? "border-red-500/50 focus:border-red-500 bg-red-500/5 ring-4 ring-red-500/10"
      : "border-slate-800 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
      }`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "phone", "dob"];
    if (eduTab === "school") {
      requiredFields.push("school");
    } else {
      requiredFields.push("college");
    }
    const newErrors = {};
    const newTouched = {};

    requiredFields.forEach((field) => {
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
      setSubmitStatus("success");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen overflow-hidden bg-slate-950 px-2 py-2 sm:px-4 sm:py-4 md:py-6 text-white flex flex-col justify-between">
      <SubmitAlert
        type={submitStatus}
        onClose={() => {
          if (submitStatus === "success") {
            navigate("/");
          } else {
            setSubmitStatus(null);
          }
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />
      <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none" />

      {/* TOP HEADER BLOCK (Extremely compact) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between border-b border-slate-900 pb-2 sm:pb-3 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-bold text-cyan-400 transition hover:text-cyan-300 text-sm py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800"
          >
            <FaArrowLeft size={12} /> Back
          </button>
          <h1 className="bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text text-xl md:text-2xl font-black text-transparent">
            Student Enrollment
          </h1>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur">
          <FaCheckCircle size={10} /> Secure Form Session
        </span>
      </div>

      {/* SELECT PROGRAM & CONTACT INFO COMPACT STRIP (Takes almost no vertical space) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl mt-2 sm:mt-3 shrink-0">
        <div className="bg-slate-900/60 border border-slate-900 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 backdrop-blur-xl">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <FaBookOpen size={14} />
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Target Course</div>
            <div className="text-xs font-black text-cyan-300 leading-tight">{form.course}</div>
          </div>
        </div>
      </div>

      {/* SPLIT SCROLLABLE DASHBOARD PANEL */}
      <div className="relative z-10 mx-auto w-full max-w-7xl mt-2 sm:mt-3 flex-1 min-h-0 overflow-hidden flex flex-col justify-start">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 h-full w-full min-h-0">

          {/* LEFT PANE: PERSONAL & CONTACT */}
          <div className="relative rounded-2xl sm:rounded-[2rem] border border-slate-900 bg-slate-950/40 p-3 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col h-full min-h-0">
            <div className="flex items-center gap-2 mb-2 sm:mb-4 pb-2 border-b border-slate-900 shrink-0">
              <div className="rounded-lg bg-cyan-500/10 p-1.5 text-cyan-400">
                <FaUser size={14} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-cyan-300">
                01. Personal Information
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar space-y-3 sm:space-y-4 min-h-0 pb-3 sm:pb-4">
              <div className="space-y-1">
                <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Full Name *
                </label>
                <input
                  name="name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("name")}
                />
                {errors.name && touched.name && (
                  <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min="1990-01-01"
                      max={new Date().toISOString().split("T")[0]}
                      className={`${inputClass("dob")} appearance-none`}
                    />
                    {!form.dob && (
                      <FaCalendarAlt className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                    )}
                  </div>
                  {errors.dob && touched.dob && (
                    <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                      {errors.dob}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("email")}
                  />
                  {errors.email && touched.email && (
                    <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Phone Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-mono font-bold text-cyan-400 select-none z-20 text-sm">
                      {COUNTRY_CODES.find(c => c.name === form.country)?.code || ""}
                    </span>
                    <input
                      name="phone"
                      placeholder={form.country === "India" ? "10-digit mobile number" : "Mobile number"}
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${inputClass("phone")} pl-16`}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        country: val,
                        phone: val === "India" ? prev.phone.slice(0, 10) : prev.phone,
                      }));
                    }}
                    onBlur={handleBlur}
                    className={inputClass("country")}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-900/60 pt-3">
                <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Street Address
                </label>
                <textarea
                  name="address"
                  placeholder="Door No, Street Name, Landmark"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                  className={`${inputClass("address")} resize-none p-3 text-sm`}
                />
              </div>

              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    placeholder="600001"
                    value={form.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("pincode")}
                  />
                  {errors.pincode && touched.pincode && (
                    <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    District
                  </label>
                  <input
                    name="district"
                    placeholder="District"
                    value={form.district}
                    onChange={handleChange}
                    className={inputClass("district")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    State
                  </label>
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass("state")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: ACADEMIC DETAILS & SUBMISSION */}
          <div className="relative rounded-2xl sm:rounded-[2rem] border border-slate-900 bg-slate-950/40 p-3 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-2 sm:mb-4 pb-2 border-b border-slate-900 shrink-0">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-cyan-500/10 p-1.5 text-cyan-400">
                  <FaGraduationCap size={14} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-cyan-300">
                  02. Academic Information
                </h2>
              </div>

              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 w-36 shrink-0">
                <button
                  type="button"
                  onClick={() => setEduTab("school")}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${eduTab === "school"
                    ? "bg-gradient-to-r from-blue-900 to-blue-600 text-cyan-200 shadow-md"
                    : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  School
                </button>
                <button
                  type="button"
                  onClick={() => setEduTab("college")}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${eduTab === "college"
                    ? "bg-gradient-to-r from-blue-900 to-blue-600 text-cyan-200 shadow-md"
                    : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  College
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar space-y-3 sm:space-y-5 min-h-0 pb-3 sm:pb-4">

              <AnimatePresence mode="wait">
                {eduTab === "school" && (
                  <motion.div
                    key="school"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* SCHOOL EDUCATION SUB-SECTION */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> School Category
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            School Name *
                          </label>
                          <input
                            name="school"
                            placeholder="Name of your last school"
                            value={form.school}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputClass("school")}
                          />
                          {errors.school && touched.school && (
                            <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                              {errors.school}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Status *
                          </label>
                          <select
                            name="school_status"
                            value={form.school_status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputClass("school_status")}
                          >
                            <option value="Passout">Passout</option>
                            <option value="Pursuing">Pursuing</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {form.school_status === "Pursuing" ? "Year of Pursuing (School)" : "Year of Passing (School)"}
                        </label>
                        <input
                          name="school_year"
                          placeholder="YYYY"
                          value={form.school_year}
                          onChange={handleChange}
                          className={inputClass("school_year")}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {eduTab === "college" && (
                  <motion.div
                    key="college"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* COLLEGE EDUCATION SUB-SECTION */}
                    <div className="border-t border-slate-900/60 pt-4 space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> College / University Category
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            College Name *
                          </label>
                          <input
                            name="college"
                            placeholder="Name of your college"
                            value={form.college}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputClass("college")}
                          />
                          {errors.college && touched.college && (
                            <p className="ml-1 mt-1 text-[9px] font-bold uppercase text-red-400">
                              {errors.college}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Status *
                          </label>
                          <select
                            name="college_status"
                            value={form.college_status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputClass("college_status")}
                          >
                            <option value="Pursuing">Pursuing</option>
                            <option value="Passout">Passout</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Degree Type
                          </label>
                          <select
                            name="college_degree_type"
                            value={form.college_degree_type}
                            onChange={handleChange}
                            className={inputClass("college_degree_type")}
                          >
                            <option value="Bachelor">Bachelor</option>
                            <option value="Master">Master</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Degree Course
                          </label>
                          <select
                            name="college_degree"
                            value={form.college_degree}
                            onChange={handleChange}
                            className={inputClass("college_degree")}
                          >
                            <option value="">Select Degree</option>
                            <option value="BCA">BCA</option>
                            <option value="MCA">MCA</option>
                            <option value="B.Sc">B.Sc</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="MBA">MBA</option>
                            <option value="BBA">BBA</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {form.college_status === "Pursuing" ? "Year of Pursuing" : "Year of Passing"}
                          </label>
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* COURSE PROGRAM PROGRAM DROPDOWN */}
              <div className="border-t border-slate-900/60 pt-4 space-y-2">
                <label className="ml-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Verify or Change Selected Program
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCourseOpen(!courseOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left font-bold text-white text-sm outline-none transition focus:border-cyan-400"
                  >
                    <span>{form.course}</span>
                    <span className={`text-cyan-400 transition-transform duration-300 ${courseOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>

                  <AnimatePresence>
                    {courseOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="custom-scrollbar absolute bottom-full z-50 mb-3 max-h-[180px] w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
                      >
                        {courseList.map((course) => (
                          <button
                            key={course}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, course }));
                              setCourseOpen(false);
                            }}
                            className={`block w-full px-4 py-3 text-left text-xs font-bold transition-all ${form.course === course
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
              {/* Sleek Dynamic Helper Card to fill vertical space beautifully */}
              <div className="rounded-2xl border border-slate-900/60 bg-slate-950/40 p-3 shadow-xl flex items-start gap-4 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/20">
                <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 shrink-0">
                  <FaCheckCircle size={18} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    Enrollment Instructions
                  </h4>
                  <p className="mt-1 text-[10px] font-semibold text-slate-400 leading-relaxed">
                    Verify all active academic details before submitting. Our admissions board will cross-reference your records during the onboarding session. If you need any assistance, reach out directly via our secure helpdesk link.
                  </p>
                </div>
              </div>

              {/* SINGLE IMAGE FIELD (Moved inside scrollable area) */}
              <div className="pt-3 border-t border-slate-900/60 shrink-0">
                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Upload ID Proof (Image)
                  </label>
                  <div className="relative flex flex-col items-center justify-center border border-dashed border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-cyan-500/40 rounded-xl py-3 px-3 text-center cursor-pointer transition-all duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setIdProofName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm((prev) => ({ ...prev, id_proof: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="text-cyan-400/80 mb-0.5">
                      <FaImage size={14} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 truncate max-w-full">
                      {idProofName || "Choose Image File"}
                    </span>
                    <span className="text-[7px] text-slate-500 font-semibold uppercase">
                      ID Proof (Aadhaar/PAN)
                    </span>
                  </div>
                </div>
              </div>

            </div>
            {/* END OF SCROLLABLE AREA */}

            {/* SUBMIT BUTTON CONTAINER */}
            <div className="border-t border-slate-900 pt-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Ready to enroll
                </p>
              </div>

              <motion.button
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-600 px-6 py-3 text-sm font-black shadow-lg shadow-blue-900/20 ${loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </motion.button>
            </div>

          </div>

        </form>
      </div>
    </section>
  );
}

export default Enroll;
