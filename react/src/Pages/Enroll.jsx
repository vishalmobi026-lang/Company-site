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
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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
              className={`absolute inset-x-0 top-0 h-2 ${
                success
                  ? "bg-gradient-to-r from-blue-700 via-cyan-400 to-emerald-400"
                  : "bg-gradient-to-r from-red-600 via-rose-500 to-orange-400"
              }`}
            />

            <div className="relative mx-auto mb-7 flex h-44 w-44 items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className={`absolute h-40 w-40 rounded-full border ${
                  success ? "border-cyan-300/80" : "border-red-300/70"
                }`}
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className={`absolute h-32 w-32 rounded-full border border-dashed ${
                  success ? "border-blue-300/80" : "border-rose-300/70"
                }`}
              />

              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute h-36 w-36 rounded-full ${
                  success ? "bg-cyan-200/50" : "bg-red-200/50"
                }`}
              />

              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 top-5 hidden rounded-2xl border border-cyan-200 bg-slate-950 px-4 py-3 text-left shadow-xl sm:block"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200">
                  G-TEC
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 bottom-5 hidden rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-xl sm:block"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                  Enrolled
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-[1.7rem] shadow-2xl ${
                  success
                    ? "bg-gradient-to-br from-cyan-300 via-blue-600 to-blue-900 text-white"
                    : "bg-gradient-to-br from-red-400 via-rose-600 to-red-900 text-white"
                }`}
              >
                {success ? (
                  <FaCheckCircle className="text-5xl" />
                ) : (
                  <FaTimes className="text-5xl" />
                )}
              </motion.div>
            </div>

            <h2
              className={`mb-3 text-3xl font-black uppercase tracking-tight ${
                success ? "text-emerald-600" : "text-red-600"
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
                  Redirecting in
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-300 bg-cyan-50 text-2xl font-black text-cyan-600">
                  {countdown}
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200"
              >
                Try Again
              </motion.button>
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
        else {
          const dobDate = new Date(value);
          const year = dobDate.getFullYear();
          const today = new Date();
          if (year < 1990 || year > today.getFullYear()) error = "Enter a valid year (1990–present)";
          else if (dobDate > today) error = "Date of Birth cannot be in the future";
        }
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

    if (name === "year" || name === "pincode" || name === "phone") {
      formattedValue = value.replace(/\D/g, "");
      if (name === "year" && formattedValue.length > 4) return;
      if (name === "pincode" && formattedValue.length > 6) return;
      if (name === "phone" && formattedValue.length > 10) return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: formattedValue,
      ...(name === "pincode" && formattedValue.length < 6
        ? { district: "", state: "", country: "" }
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
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
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

    return `w-full mt-2 p-3.5 rounded-xl bg-slate-900/80 border transition-all duration-300 outline-none text-white placeholder:text-slate-600 shadow-inner ${
      hasError
        ? "border-red-500/50 focus:border-red-500 bg-red-500/5 ring-4 ring-red-500/10"
        : "border-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
    }`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "phone", "dob", "college"];
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
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white">
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

      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]" />

      <div className="absolute left-[-120px] top-[-120px] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-100px] h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-bold text-cyan-300 transition hover:text-cyan-200"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm font-bold text-cyan-200 backdrop-blur">
            <FaCheckCircle />
            Start your learning journey
          </span>

          <h1 className="bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text pb-2 text-4xl font-black text-transparent md:text-6xl">
            Student Enrollment
          </h1>

          <p className="mt-4 text-lg font-medium text-slate-400">
            Complete the form below and our team will contact you shortly.
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            className="relative space-y-10 overflow-hidden rounded-[2.5rem] border border-slate-800 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl md:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-3">
              {["Personal", "Education", "Course"].map((step, index) => (
                <div
                  key={step}
                  className={`rounded-2xl border p-5 transition-all duration-500 ${
                    index === 0
                      ? "border-cyan-400/30 bg-cyan-400/5 shadow-lg shadow-cyan-400/5"
                      : "border-slate-800 bg-slate-950/40"
                  }`}
                >
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Step 0{index + 1}
                  </p>
                  <h3 className={`font-bold ${index === 0 ? "text-cyan-300" : "text-slate-400"}`}>
                    {step}
                  </h3>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="rounded-lg bg-cyan-400/10 p-2">
                  <FaUser size={18} />
                </div>
                Personal Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
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
                    <p className="ml-1 mt-1 text-[10px] font-bold uppercase text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
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
                      <FaCalendarAlt className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    )}
                  </div>
                  {errors.dob && touched.dob && (
                    <p className="ml-1 mt-1 text-[10px] font-bold uppercase text-red-400">
                      {errors.dob}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
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
                    <p className="ml-1 mt-1 text-[10px] font-bold uppercase text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("phone")}
                  />
                  {errors.phone && touched.phone && (
                    <p className="ml-1 mt-1 text-[10px] font-bold uppercase text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="rounded-lg bg-cyan-400/10 p-2">
                  <FaGraduationCap size={18} />
                </div>
                Academic Details
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1 md:col-span-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
                    College / University *
                  </label>
                  <input
                    name="college"
                    placeholder="Name of your current or last institution"
                    value={form.college}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("college")}
                  />
                  {errors.college && touched.college && (
                    <p className="ml-1 mt-1 text-[10px] font-bold uppercase text-red-400">
                      {errors.college}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
                    Year of Passing
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

            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="rounded-lg bg-cyan-400/10 p-2">
                  <FaMapMarkerAlt size={18} />
                </div>
                Communication Address
              </h2>

              <div className="space-y-1">
                <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
                  Street Address
                </label>
                <textarea
                  name="address"
                  placeholder="Door No, Street Name, Landmark"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                  className={`${inputClass("address")} resize-none`}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
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
                    <p className="ml-1 mt-1 text-[10px] font-bold uppercase text-red-400">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                {["district", "state", "country"].map((field) => (
                  <div key={field} className="space-y-1">
                    <label className="ml-1 text-xs font-black uppercase tracking-wider text-slate-400">
                      {field}
                    </label>
                    <input
                      name={field}
                      placeholder={field}
                      value={form[field]}
                      onChange={handleChange}
                      className={inputClass(field)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-black text-cyan-300">
                <div className="rounded-lg bg-cyan-400/10 p-2">
                  <FaBookOpen size={18} />
                </div>
                Selected Program
              </h2>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCourseOpen(!courseOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-4 text-left font-bold text-white outline-none transition focus:border-cyan-400"
                >
                  <span>{form.course}</span>
                  <span
                    className={`text-cyan-400 transition-transform duration-300 ${
                      courseOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {courseOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="custom-scrollbar absolute bottom-full z-50 mb-3 max-h-[250px] w-full overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
                    >
                      {courseList.map((course) => (
                        <button
                          key={course}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, course });
                            setCourseOpen(false);
                          }}
                          className={`block w-full px-5 py-4 text-left text-sm font-bold transition-all ${
                            form.course === course
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

            <div className="flex flex-col items-center justify-between gap-8 border-t border-slate-800 pt-10 md:flex-row">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                <p className="text-xs font-black uppercase tracking-widest">
                  Secure Enrollment
                </p>
              </div>

              <motion.button
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                className={`flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 px-12 py-5 text-lg font-black shadow-xl shadow-blue-900/20 md:w-auto ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  "Submit Enrollment Application"
                )}
              </motion.button>
            </div>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, x: 45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="space-y-6 lg:sticky lg:top-10"
          >
            <div className="group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-2xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/5 blur-3xl" />

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300">
                <FaBookOpen />
              </div>

              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Selected Program
              </p>
              <h2 className="mb-4 text-2xl font-black text-cyan-300">
                {form.course}
              </h2>

              <p className="text-sm font-medium leading-relaxed text-slate-400">
                {courseDescriptions[form.course] ||
                  "Master job-ready skills with our professional certification program designed for the industry."}
              </p>

              <div className="my-8 h-px w-full bg-slate-800/50" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
                    <FaPhoneAlt size={14} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">
                      Assistance
                    </p>
                    <p className="font-bold text-slate-200">+91 75980 98675</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
                    <FaEnvelope size={14} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">
                      Support Email
                    </p>
                    <p className="break-all text-sm font-bold leading-tight text-slate-200">
                      azhagiyamandapam.tn@gteceducation.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Next Steps
                </p>
                <p className="text-xs font-medium leading-relaxed text-slate-400">
                  Our academic team will process your application and contact you within
                  24 hours with schedule details.
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
