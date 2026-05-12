import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaImage, FaLayerGroup, FaBookOpen, FaCrown } from "react-icons/fa";

export default function PricingManager() {
  const [pricings, setPricings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useContext(AuthContext);

  // Form states for new course
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    tag: ""
  });

  // Category management state
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", slug: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pricingRes, courseRes, catRes] = await Promise.all([
        axios.get("http://localhost:8000/pricing"),
        axios.get("http://localhost:8000/courses"),
        axios.get("http://localhost:8000/categories")
      ]);
      
      setPricings(pricingRes.data.length > 0 ? pricingRes.data : [
        { course_name: "Full Stack Development", standard_price: 35000, offer_price: 30000, is_featured: 1, accent_color: "#2563eb", border_color: "#e2e8f0" },
        { course_name: "Backend Development", standard_price: 25000, offer_price: 20000, is_featured: 1, accent_color: "#2563eb", border_color: "#e2e8f0" },
        { course_name: "Frontend Development", standard_price: 20000, offer_price: 15000, is_featured: 1, accent_color: "#2563eb", border_color: "#e2e8f0" }
      ]);
      
      setCourses(courseRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setNewCourse(prev => ({ ...prev, category: catRes.data[0].name }));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from server.");
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name || !newCat.slug) return;
    try {
      const res = await axios.post("http://localhost:8000/admin/categories", newCat, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      });
      setCategories([...categories, res.data]);
      setNewCat({ name: "", slug: "" });
      setSuccess(`Category "${res.data.name}" added!`);
    } catch (err) {
      setError("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Deleting this category will NOT delete courses in it, but they won't show up on category pages. Continue?")) return;
    try {
      await axios.delete(`http://localhost:8000/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      });
      setCategories(categories.filter(c => c.id !== id));
      setSuccess("Category removed.");
    } catch (err) {
      setError("Failed to delete category.");
    }
  };

  const handlePricingChange = (index, field, value) => {
    const updated = [...pricings];
    updated[index][field] = value;
    setPricings(updated);
  };

  const handleAddFeature = (pIndex) => {
    const updated = [...pricings];
    const features = updated[pIndex].features ? updated[pIndex].features.split(",") : [];
    features.push("New Feature");
    updated[pIndex].features = features.join(",");
    setPricings(updated);
  };

  const handleFeatureChange = (pIndex, fIndex, value) => {
    const updated = [...pricings];
    const features = updated[pIndex].features.split(",");
    features[fIndex] = value;
    updated[pIndex].features = features.join(",");
    setPricings(updated);
  };

  const handleRemoveFeature = (pIndex, fIndex) => {
    const updated = [...pricings];
    const features = updated[pIndex].features.split(",");
    features.splice(fIndex, 1);
    updated[pIndex].features = features.join(",");
    setPricings(updated);
  };

  const handleSavePricing = async () => {
    setError(null);
    setSuccess(null);
    try {
      await axios.post("http://localhost:8000/admin/pricing", pricings, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      });
      setSuccess("Pricing updated successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update pricing.");
    }
  };

  const handleResetPricing = async () => {
    if (!window.confirm("This will PERMANENTLY reset all pricing to factory defaults (Full-Stack, MERN, Python). Continue?")) return;
    setError(null);
    setSuccess(null);
    try {
      await axios.post("http://localhost:8000/admin/pricing/reset", {}, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      });
      setSuccess("Pricing reset to defaults!");
      fetchData(); // Reload data
    } catch (err) {
      setError("Failed to reset pricing.");
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/admin/courses", newCourse, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      });
      setCourses([...courses, res.data]);
      setShowAddCourse(false);
      setNewCourse({ title: "", description: "", image_url: "", category: "Technical", tag: "" });
      setSuccess("Course added successfully!");
    } catch (err) {
      setError("Failed to add course.");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:8000/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      });
      setCourses(courses.filter(c => c.id !== id));
      setSuccess("Course deleted.");
    } catch (err) {
      setError("Failed to delete course.");
    }
  };

  if (loading) return <div className="text-blue-600 text-center mt-32 animate-pulse font-bold">Initializing Management Portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 sm:px-6 pb-20 text-slate-900 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                <FaCrown size={24} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Management
              </h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Control course pricing, manage divisions, and update your academic offerings in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{courses.length} Courses Live</span>
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-center font-bold shadow-sm">
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-2xl text-center font-bold shadow-sm">
            {success}
          </motion.div>
        )}

        {/* --- PRICING STRATEGY SECTION --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <FaLayerGroup size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Course Pricing Strategy</h2>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">Market value & Promotional offers</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleResetPricing}
                className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <FaTimes /> Reset Defaults
              </button>
              <button
                onClick={handleSavePricing}
                className="px-8 py-3.5 bg-slate-900 text-white shadow-xl shadow-slate-200 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
              >
                <FaSave /> Update Pricing
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricings.slice(0, 3).map((pricing, index) => (
              <div 
                key={pricing.id || index} 
                style={{ borderColor: pricing.is_featured ? (pricing.accent_color || '#3b82f6') : '#f1f5f9' }}
                className={`group bg-white border-2 p-8 rounded-[2rem] transition-all duration-500 shadow-xl shadow-slate-200/40 relative ${
                    pricing.is_featured ? "ring-8 ring-slate-50" : "hover:border-slate-300"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Program Name</label>
                        {pricing.is_featured === 1 && (
                            <span style={{ color: pricing.accent_color }} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                Featured on Home
                            </span>
                        )}
                    </div>
                    <input
                      type="text"
                      value={pricing.course_name}
                      onChange={(e) => handlePricingChange(index, 'course_name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black text-slate-800 shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Standard Tuition (₹)</label>
                    <input
                      type="text"
                      value={pricing.standard_price}
                      onChange={(e) => handlePricingChange(index, 'standard_price', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono font-bold text-slate-600 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Offer (₹)</label>
                    <input
                      type="text"
                      value={pricing.offer_price}
                      onChange={(e) => handlePricingChange(index, 'offer_price', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono font-bold text-blue-600 shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-8 mt-4">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Home Page Presence</label>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const isActivating = !pricing.is_featured;
                                handlePricingChange(index, 'is_featured', isActivating);
                                // Default to Royal Blue when enabling
                                if (isActivating) {
                                    handlePricingChange(index, 'accent_color', '#2563eb');
                                    handlePricingChange(index, 'border_color', '#dbeafe');
                                }
                            }}
                            className={`group relative px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center gap-4 ${
                                pricing.is_featured 
                                ? "bg-slate-100 text-blue-600 shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff]" 
                                : "bg-slate-100 text-slate-400 shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:text-slate-600"
                            }`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-700 ${
                                pricing.is_featured 
                                    ? "bg-blue-600 shadow-[0_0_15px_#2563eb] scale-110" 
                                    : "bg-slate-300"
                            }`}></div>
                            {pricing.is_featured ? "Featured Now" : "Enable Slot"}
                        </motion.button>
                    </div>
                  </div>
                  
                  {/* FEATURES EDITING */}
                  <div className="md:col-span-2 space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Highlights / Features</label>
                      <button 
                        onClick={() => handleAddFeature(index)}
                        className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                      >
                        <FaPlus size={10} /> Add Item
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(pricing.features || "").split(",").filter(f => f.trim() !== "").map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 bg-white border border-slate-200 pl-3 pr-1 py-1 rounded-xl shadow-sm">
                          <input 
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, fIndex, e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 w-32"
                          />
                          <button 
                            onClick={() => handleRemoveFeature(index, fIndex)}
                            className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                      {(!pricing.features || pricing.features === "") && (
                        <p className="text-[10px] text-slate-400 italic py-2">No highlights added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- DIVISION & CATALOG SECTION --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
            <div className="max-w-2xl">
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full mb-4 inline-block">Professional Portal</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                Academic Divisions & <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Course Catalog</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Add, edit, or remove courses from the public enrollment divisions. Manage your educational categories to organize courses in the main menu.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowCatManager(!showCatManager)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${showCatManager ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {showCatManager ? <><FaTimes /> Close Divisions</> : <><FaLayerGroup /> Manage Divisions</>}
              </button>
              <button 
                onClick={() => setShowAddCourse(!showAddCourse)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${showAddCourse ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
              >
                {showAddCourse ? <><FaTimes /> Close Form</> : <><FaPlus /> Add New Course</>}
              </button>
            </div>
          </div>

          {/* DIVISION MANAGER (SLIDE DOWN) */}
          <AnimatePresence>
            {showCatManager && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-12">
                <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 sm:p-10 shadow-inner">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <FaLayerGroup className="text-blue-600" /> Educational Divisions (Navbar Menu)
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500 font-bold">Create a new category for your courses. This will immediately appear in the Navbar dropdown.</p>
                      <form onSubmit={handleAddCategory} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Division Name (e.g. Data Science)"
                          value={newCat.name}
                          onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Slug (e.g. data-science)"
                          value={newCat.slug}
                          onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-mono text-xs font-bold text-slate-500"
                        />
                        <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                          Add New Division
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                          <div>
                            <p className="font-black text-slate-900">{cat.name}</p>
                            <p className="text-[10px] font-mono font-bold text-slate-400">/courses/{cat.slug}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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

          {/* ADD COURSE FORM (SLIDE DOWN) */}
          <AnimatePresence>
            {showAddCourse && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-12">
                <form onSubmit={handleAddCourse} className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 sm:p-10 grid md:grid-cols-2 gap-8 shadow-inner">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Academic Course Title</label>
                      <input 
                        required
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                        placeholder="e.g. Master in Artificial Intelligence"
                        value={newCourse.title}
                        onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assigned Division</label>
                      <select 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-700"
                        value={newCourse.category}
                        onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                      >
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Visual Cover URL</label>
                      <div className="relative">
                        <FaImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-500 text-sm"
                          placeholder="https://images.unsplash.com/..."
                          value={newCourse.image_url}
                          onChange={e => setNewCourse({...newCourse, image_url: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Classification Tag</label>
                      <input 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800"
                        placeholder="e.g. Certification, Advanced, Job Oriented"
                        value={newCourse.tag}
                        onChange={e => setNewCourse({...newCourse, tag: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Academic Overview</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none resize-none font-medium text-slate-600"
                        placeholder="Briefly describe what students will learn in this curriculum..."
                        value={newCourse.description}
                        onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
                      Publish Course to Catalog
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* COURSE GRID CONTAINER */}
<div className="h-[500px] overflow-y-auto pr-2">

  {/* COURSE GRID DISPLAY */}
  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">

    {courses.map(course => (
      <div
        key={course.id}
        className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group relative"
      >

        <div className="relative h-56 rounded-[2rem] overflow-hidden mb-6 shadow-md">
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute top-5 right-5 px-4 py-1.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
            {course.category}
          </div>
        </div>

        <div className="flex-1 px-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-blue-600"></span>

            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              {course.tag || 'Academic'}
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6">
            {course.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto px-2">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <FaBookOpen className="text-blue-600" />
            ID: {course.id}
          </div>

          <button
            onClick={() => handleDeleteCourse(course.id)}
            className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
          >
            <FaTrash size={16} />
          </button>
        </div>

      </div>
    ))}

  </div>
</div>
        </div>
      </div>
    </div>
  );
}
