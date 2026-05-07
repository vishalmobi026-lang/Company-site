import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaTrash, FaEdit, FaSearch, FaUserGraduate, FaPhone, FaEnvelope, FaSchool, FaMapMarkerAlt, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function EnrolledStudentDetail() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/admin/enrollments", {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setEnrollments(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log out and log in again.");
      } else {
        setError("Failed to load enrollments. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
    try {
      await axios.delete(`http://localhost:8000/admin/enrollments/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setEnrollments(enrollments.filter(e => e.id !== id));
    } catch (err) {
      alert("Failed to delete enrollment.");
    }
  };

  const startEdit = (enrollment) => {
    setEditingId(enrollment.id);
    setEditForm(enrollment);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Year limit: 4 digit number
    if (name === "year") {
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length > 4) return;
        setEditForm({ ...editForm, [name]: numericValue });
        return;
    }

    setEditForm({ ...editForm, [name]: value });

    if (name === "pincode" && value.length === 6) {
        fetchLocationForEdit(value);
    }
  };


  const fetchLocationForEdit = async (pincode) => {
    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (res.data[0].Status === "Success") {
        const postOffice = res.data[0].PostOffice[0];
        setEditForm((prev) => ({
          ...prev,
          district: postOffice.District,
          state: postOffice.State,
          country: "India",
        }));
      }
    } catch (err) {
      console.error("Pincode fetch failed", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/admin/enrollments/${editingId}`, editForm, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setEnrollments(enrollments.map(e => e.id === editingId ? res.data : e));
      setEditingId(null);
    } catch (err) {
      alert("Failed to update enrollment.");
    }
  };

  const filteredEnrollments = enrollments.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <div className="text-center py-20 text-gray-500">Please login as admin.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaUserGraduate className="text-blue-600" /> 
              Student Enrollments
            </h2>
            <p className="text-gray-500 mt-1">Manage and track all student course applications.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                    <FaSignOutAlt />
                </div>
                <div>
                    <p className="text-red-700 font-bold">{error}</p>
                    {error.includes("expired") && <p className="text-red-600/70 text-sm">Logging out and back in will refresh your security token.</p>}
                </div>
            </div>
            {error.includes("expired") && (
                <button 
                    onClick={() => { logout(); window.location.href = "/login"; }}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
                >
                    Logout Now
                </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
            <FaUserGraduate className="text-gray-200 text-7xl mx-auto mb-4" />
            <p className="text-xl text-gray-400 font-medium">No enrollments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredEnrollments.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                          {e.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{e.name}</h3>
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mt-1">
                            {e.course}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="text-gray-400" /> {e.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaPhone className="text-gray-400" /> {e.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaSchool className="text-gray-400" /> {e.college || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUserGraduate className="text-gray-400" /> {e.year || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                          <FaMapMarkerAlt className="text-gray-400" /> 
                          <span className="truncate">{e.address ? `${e.address}, ${e.district}, ${e.state}, ${e.pincode}` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-center">
                      <button 
                        onClick={() => startEdit(e)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setEditingId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-blue-600 p-6 flex justify-between items-center text-white sticky top-0 z-10">
                <h3 className="text-xl font-bold">Edit Enrollment</h3>
                <button onClick={() => setEditingId(null)} className="hover:rotate-90 transition-transform">
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                  <div className="lg:col-span-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={editForm.name} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={editForm.email} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={editForm.phone} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Course</label>
                    <input 
                      type="text" 
                      name="course"
                      value={editForm.course} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">College</label>
                    <input 
                      type="text" 
                      name="college"
                      value={editForm.college} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Year</label>
                    <input 
                      type="text" 
                      name="year"
                      value={editForm.year} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Pincode (Auto-fills Address)</label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={editForm.pincode} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition font-bold text-blue-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">District</label>
                    <input 
                      type="text" 
                      name="district"
                      value={editForm.district} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={editForm.state} 
                      onChange={handleEditChange}
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="text-xs font-bold text-gray-400 uppercase">Full Address</label>
                    <textarea 
                      name="address"
                      value={editForm.address} 
                      onChange={handleEditChange}
                      rows="2"
                      className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-6 py-2 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
