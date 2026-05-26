import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  FaPlus, FaTrash, FaSave, FaTimes, FaImage,
  FaLayerGroup, FaBookOpen, FaCrown
} from "react-icons/fa";

const API = "https://company-site-jrbr.onrender.com";
const auth = (user) => ({ headers: { Authorization: `Bearer ${user?.access_token}` } });

const defaults = [
  { course_name: "Full Stack Development", standard_price: 35000, offer_price: 30000, is_featured: 1, accent_color: "#2563eb", border_color: "#e2e8f0" },
  { course_name: "Backend Development", standard_price: 25000, offer_price: 20000, is_featured: 1, accent_color: "#2563eb", border_color: "#e2e8f0" },
  { course_name: "Frontend Development", standard_price: 20000, offer_price: 15000, is_featured: 1, accent_color: "#2563eb", border_color: "#e2e8f0" },
];

const reveal = {
  hidden: { opacity: 0, y: 55, scale: 0.97 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: Math.min(i * 0.07, 0.35), ease: "easeOut" },
  }),
};

function Reveal({ children, className = "", index = 0 }) {
  return (
    <motion.div
      custom={index}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.18, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Notice({ type, message, onClose }) {
  const ok = type === "success";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          className={`fixed right-4 top-24 z-[120] w-[92vw] max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl ${
            ok ? "border-emerald-200 shadow-emerald-100" : "border-red-200 shadow-red-100"
          }`}
        >
          <div className={`h-1.5 ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
          <div className="flex items-start gap-4 p-5">
            <div className={`mt-1 h-3 w-3 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
            <div className="flex-1">
              <h4 className={`font-black ${ok ? "text-emerald-700" : "text-red-700"}`}>
                {ok ? "Success" : "Action failed"}
              </h4>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">{message}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <FaTimes size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConfirmModal({ confirm, setConfirm }) {
  return (
    <AnimatePresence>
      {confirm && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            className="w-full max-w-md overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-700 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-100">Please Confirm</p>
              <h3 className="mt-2 text-2xl font-black">{confirm.title}</h3>
            </div>
            <div className="p-6">
              <p className="font-semibold leading-relaxed text-slate-600">{confirm.message}</p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 font-black text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirm.onConfirm();
                    setConfirm(null);
                  }}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 py-4 font-black text-white shadow-xl shadow-blue-100"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PricingManager() {
  const [pricings, setPricings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleApiError = (err, fallbackMessage) => {
    if (err.response?.status === 401) {
      logout();
      return;
    }
    notify("error", err.response?.data?.detail || fallbackMessage);
  };

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showCatManager, setShowCatManager] = useState(false);
const [newCat, setNewCat] = useState({
  name: "",
  slug: "",
  image_url: ""
});
  const [newCourse, setNewCourse] = useState({ title: "", description: "", image_url: "", category: "", tag: "" });

  const notify = (type, message) => setNotice({ type, message });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pricingRes, courseRes, catRes] = await Promise.all([
        axios.get(`${API}/pricing`),
        axios.get(`${API}/courses`),
        axios.get(`${API}/categories`),
      ]);

      setPricings(pricingRes.data.length ? pricingRes.data : defaults);
      setCourses(courseRes.data);
      setCategories(catRes.data);
      if (catRes.data.length) setNewCourse((p) => ({ ...p, category: catRes.data[0].name }));
    } catch (err) {
      handleApiError(err, "Failed to fetch data from server.");
    } finally {
      setLoading(false);
    }
  };

  const updatePricing = (index, field, value) => {
    setPricings((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const updateFeatures = (pIndex, updater) => {
    setPricings((prev) =>
      prev.map((p, i) => {
        if (i !== pIndex) return p;
        const features = (p.features || "").split(",").filter(Boolean);
        return { ...p, features: updater(features).join(",") };
      })
    );
  };

  const savePricing = async () => {
    try {
      await axios.post(`${API}/admin/pricing`, pricings, auth(user));
      notify("success", "Pricing updated successfully.");
    } catch (err) {
      handleApiError(err, "Failed to update pricing.");
    }
  };

  const resetPricing = () => setConfirm({
    title: "Reset pricing?",
    message: "This will permanently reset all pricing to factory defaults.",
    onConfirm: async () => {
      try {
        await axios.post(`${API}/admin/pricing/reset`, {}, auth(user));
        notify("success", "Pricing reset to defaults.");
        fetchData();
      } catch (err) {
        handleApiError(err, "Failed to reset pricing.");
      }
    },
  });

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name || !newCat.slug) return;

    try {
      const res = await axios.post(`${API}/admin/categories`, newCat, auth(user));
      setCategories((p) => [...p, res.data]);
    setNewCat({
  name: "",
  slug: "",
  image_url: ""
});
      notify("success", `Category "${res.data.name}" added.`);
    } catch (err) {
      handleApiError(err, "Failed to add category.");
    }
  };

  const deleteCategory = (id) => setConfirm({
    title: "Delete division?",
    message: "Courses will not be deleted, but this division will disappear from category pages.",
    onConfirm: async () => {
      try {
        await axios.delete(`${API}/admin/categories/${id}`, auth(user));
        setCategories((p) => p.filter((c) => c.id !== id));
        notify("success", "Category removed.");
      } catch (err) {
        handleApiError(err, "Failed to delete category.");
      }
    },
  });

  const addCourse = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/admin/courses`, newCourse, auth(user));
      setCourses((p) => [...p, res.data]);
      setShowAddCourse(false);
      setNewCourse({ title: "", description: "", image_url: "", category: categories[0]?.name || "", tag: "" });
      notify("success", "Course added successfully.");
    } catch (err) {
      handleApiError(err, "Failed to add course.");
    }
  };

  const deleteCourse = (id) => setConfirm({
    title: "Delete course?",
    message: "This course will be removed from the public catalog.",
    onConfirm: async () => {
      try {
        await axios.delete(`${API}/admin/courses/${id}`, auth(user));
        setCourses((p) => p.filter((c) => c.id !== id));
        notify("success", "Course deleted.");
      } catch (err) {
        handleApiError(err, "Failed to delete course.");
      }
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-gray-500">
        Please login to access this page.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#2563eb_1px,transparent_1px),linear-gradient(90deg,#2563eb_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }} className="relative z-10 font-black uppercase tracking-widest text-blue-700">
          Initializing Management Portal...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 pb-20 pt-24 text-slate-900 selection:bg-blue-100 sm:px-6">
      <motion.div animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10 bg-[linear-gradient(#2563eb_1px,transparent_1px),linear-gradient(90deg,#2563eb_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute left-[-130px] top-[-140px] h-[430px] w-[430px] rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-[-130px] right-[-120px] h-[390px] w-[390px] rounded-full bg-cyan-300/30 blur-3xl" />

      <Notice type={notice?.type} message={notice?.message} onClose={() => setNotice(null)} />
      <ConfirmModal confirm={confirm} setConfirm={setConfirm} />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 p-3 text-white shadow-lg shadow-blue-200">
                  <FaCrown size={24} />
                </div>
                <h1 className="bg-gradient-to-r from-blue-950 to-blue-500 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">
                  Management
                </h1>
              </div>
              <p className="ml-1 font-medium text-slate-500">
                Control course pricing, manage divisions, and update your academic offerings in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">{courses.length} Courses Live</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <section className="relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white/85 p-8 shadow-2xl shadow-blue-100/50 backdrop-blur-xl md:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-900 via-blue-500 to-cyan-400" />

            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><FaLayerGroup size={20} /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Course Pricing Strategy</h2>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-slate-500">Market value & Promotional offers</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={resetPricing} className="flex items-center gap-2 rounded-2xl bg-slate-100 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-200 active:scale-95">
                  <FaTimes /> Reset Defaults
                </button>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }} onClick={savePricing} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 px-8 py-3.5 font-black text-white shadow-xl shadow-blue-200">
                  <FaSave /> Update Pricing
                </motion.button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {pricings.slice(0, 3).map((pricing, index) => (
                <Reveal key={pricing.id || index} index={index}>
                  <div
                    style={{ borderColor: pricing.is_featured ? pricing.accent_color || "#3b82f6" : "#f1f5f9" }}
                    className={`group relative rounded-[2rem] border-2 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 ${
                      pricing.is_featured ? "ring-8 ring-blue-50/70" : "hover:border-slate-300"
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Program Name</label>
                          {pricing.is_featured === 1 && (
                            <span style={{ color: pricing.accent_color }} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> Featured on Home
                            </span>
                          )}
                        </div>
                        <input value={pricing.course_name} onChange={(e) => updatePricing(index, "course_name", e.target.value)} className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-black text-slate-800 shadow-inner outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                      </div>

                      {[
                        ["Standard Tuition (₹)", "standard_price", "text-slate-600"],
                        ["Special Offer (₹)", "offer_price", "text-blue-600"],
                      ].map(([label, field, color]) => (
                        <div key={field} className="space-y-2">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                          <input value={pricing[field]} onChange={(e) => updatePricing(index, field, e.target.value)} className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono font-bold ${color} shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50`} />
                        </div>
                      ))}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-8 border-t border-slate-50 pt-6 md:col-span-2">
                        <div className="space-y-4">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Home Page Presence</label>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const active = !pricing.is_featured;
                              updatePricing(index, "is_featured", active);
                              if (active) {
                                updatePricing(index, "accent_color", "#2563eb");
                                updatePricing(index, "border_color", "#dbeafe");
                              }
                            }}
                            className={`flex items-center gap-4 rounded-[2rem] bg-slate-100 px-10 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                              pricing.is_featured ? "text-blue-600 shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff]" : "text-slate-400 shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff]"
                            }`}
                          >
                            <span className={`h-3.5 w-3.5 rounded-full ${pricing.is_featured ? "scale-110 bg-blue-600 shadow-[0_0_15px_#2563eb]" : "bg-slate-300"}`} />
                            {pricing.is_featured ? "Featured Now" : "Enable Slot"}
                          </motion.button>
                        </div>
                      </div>

                      <div className="mt-2 space-y-3 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Program Highlights / Features</label>
                          <button onClick={() => updateFeatures(index, (f) => [...f, "New Feature"])} className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                            <FaPlus size={10} /> Add Item
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(pricing.features || "").split(",").filter(Boolean).map((feature, fIndex) => (
                            <div key={fIndex} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-3 pr-1 shadow-sm">
                              <input value={feature} onChange={(e) => updateFeatures(index, (f) => f.map((x, i) => i === fIndex ? e.target.value : x))} className="w-32 bg-transparent text-xs font-bold text-slate-600 outline-none" />
                              <button onClick={() => updateFeatures(index, (f) => f.filter((_, i) => i !== fIndex))} className="rounded-lg p-1.5 text-slate-300 hover:text-red-500">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                          {!pricing.features && <p className="py-2 text-[10px] italic text-slate-400">No highlights added yet.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

      <Reveal>
  <section className="rounded-[2.5rem] border border-blue-100 bg-white/85 p-8 shadow-2xl shadow-blue-100/50 backdrop-blur-xl md:p-12">
    <div className="mb-12 flex flex-col justify-between gap-10 lg:flex-row">
      <div className="max-w-2xl">
        <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-700">
          Professional Portal
        </span>
        <h2 className="mb-4 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
          Academic Divisions &{" "}
          <span className="bg-gradient-to-r from-blue-900 to-cyan-500 bg-clip-text text-transparent">
            Course Catalog
          </span>
        </h2>
        <p className="font-medium leading-relaxed text-slate-500">
          Add, edit, or remove courses from the public enrollment divisions.
          Manage educational categories for the main menu.
        </p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCatManager(!showCatManager)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-md lg:flex-none ${
            showCatManager
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {showCatManager ? (
            <>
              <FaTimes size={13} /> Close Divisions
            </>
          ) : (
            <>
              <FaLayerGroup size={13} /> Manage Divisions
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowAddCourse(!showAddCourse)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-md lg:flex-none ${
            showAddCourse
              ? "bg-slate-900 text-white"
              : "bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-blue-200"
          }`}
        >
          {showAddCourse ? (
            <>
              <FaTimes size={13} /> Close Form
            </>
          ) : (
            <>
              <FaPlus size={13} /> Add New Course
            </>
          )}
        </motion.button>
      </div>
    </div>

    <AnimatePresence>
      {showCatManager && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -20 }}
          className="mb-12 overflow-hidden"
        >
          <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50/90 p-8 shadow-inner sm:p-10">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900">
              <FaLayerGroup className="text-blue-600" /> Educational Divisions
            </h3>
            <div className="grid gap-10 md:grid-cols-2">
              <form onSubmit={addCategory} className="space-y-3">
                <input
                  placeholder="Division Name"
                  value={newCat.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-");
                    setNewCat({ name, slug: autoSlug });
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold outline-none focus:ring-4 focus:ring-blue-100"
                />
                <div className="relative">
                  <input
                    placeholder="Slug (auto-generated)"
                    value={newCat.slug}
                    onChange={(e) =>
                      setNewCat({ ...newCat, slug: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-xs font-bold text-slate-500 outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  {newCat.slug && (
                    <p className="mt-1 ml-2 text-[10px] font-bold text-blue-500">
                      URL: /courses/{newCat.slug}
                    </p>
                  )}
                </div>
                <div className="relative">
  <FaImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

  <input
    placeholder="Division Image URL"
    value={newCat.image_url}
    onChange={(e) =>
      setNewCat({ ...newCat, image_url: e.target.value })
    }
    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm font-bold text-slate-500 outline-none focus:ring-4 focus:ring-blue-100"
  />
</div>
                <button className="w-full rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 py-4 text-lg font-black text-white">
                  Add New Division
                </button>
              </form>

              <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div>
                      <p className="font-black text-slate-900">{cat.name}</p>
                      <p className="font-mono text-[10px] font-bold text-slate-400">
                        /courses/{cat.slug}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="rounded-xl p-3 text-slate-300 hover:bg-red-50 hover:text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showAddCourse && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          className="mb-12 overflow-hidden"
        >
          <form
            onSubmit={addCourse}
            className="grid gap-8 rounded-[2.5rem] border border-slate-200 bg-slate-50/90 p-8 shadow-inner md:grid-cols-2 sm:p-10"
          >
            <div className="space-y-5">
              <input
                required
                placeholder="Academic Course Title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold outline-none focus:ring-4 focus:ring-blue-100"
              />
              <select
                value={newCourse.category}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, category: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="relative">
                <FaImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Visual Cover URL"
                  value={newCourse.image_url}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, image_url: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm font-bold text-slate-500 outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
            

            <div className="space-y-5">
              <input
                placeholder="Classification Tag"
                value={newCourse.tag}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, tag: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold outline-none focus:ring-4 focus:ring-blue-100"
              />
              <textarea
                required
                rows={4}
                placeholder="Academic Overview"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-100"
              />
              <button className="w-full rounded-2xl bg-slate-900 py-5 text-lg font-black text-white shadow-xl shadow-slate-200">
                Publish Course to Catalog
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  </section>
</Reveal>


        <div className="h-[500px] overflow-y-auto pr-2">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <Reveal key={course.id} index={index}>
                <div className="group relative flex flex-col rounded-[2.5rem] border border-blue-100 bg-white/90 p-6 shadow-blue-100 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative mb-6 h-56 overflow-hidden rounded-[2rem] shadow-md">
                    <img src={course.image_url} alt={course.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/45 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute right-5 top-5 rounded-full bg-white/95 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm backdrop-blur">
                      {course.category}
                    </div>
                  </div>

                  <div className="flex-1 px-2">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-px w-8 bg-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{course.tag || "Academic"}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-black text-slate-900 transition-colors group-hover:text-blue-600">{course.title}</h3>
                    <p className="mb-6 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">{course.description}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 px-2 pt-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <FaBookOpen className="text-blue-600" /> ID: {course.id}
                    </div>
                    <button onClick={() => deleteCourse(course.id)} className="rounded-2xl p-3 text-slate-300 hover:bg-red-50 hover:text-red-600">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
