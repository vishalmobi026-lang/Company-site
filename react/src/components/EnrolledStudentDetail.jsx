import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaSearch,
  FaUserGraduate,
  FaPhone,
  FaEnvelope,
  FaSchool,
  FaMapMarkerAlt,
  FaTimes,
  FaSignOutAlt,
  FaSave,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://company-site-jrbr.onrender.com";

const reveal = {
  hidden: { opacity: 0, y: 45, scale: 0.97 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: Math.min(index * 0.06, 0.3),
      ease: "easeOut",
    },
  }),
};

function Reveal({ children, index = 0, className = "" }) {
  return (
    <motion.div
      custom={index}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Notice({ notice, onClose }) {
  const success = notice?.type === "success";

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          className={`fixed right-4 top-24 z-[120] w-[92vw] max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl ${
            success
              ? "border-emerald-200 shadow-emerald-100"
              : "border-red-200 shadow-red-100"
          }`}
        >
          <div className={`h-1.5 ${success ? "bg-emerald-500" : "bg-red-500"}`} />

          <div className="flex gap-4 p-5">
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                success ? "bg-emerald-500" : "bg-red-500"
              }`}
            />

            <div className="flex-1">
              <h4
                className={`font-black ${
                  success ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {success ? "Success" : "Action failed"}
              </h4>

              <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500">
                {notice.message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-700 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-100">
                Please Confirm
              </p>
              <h3 className="mt-2 text-2xl font-black">{confirm.title}</h3>
            </div>

            <div className="p-6">
              <p className="font-semibold leading-relaxed text-slate-600">
                {confirm.message}
              </p>

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
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-700 to-red-500 py-4 font-black text-white shadow-xl shadow-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function EnrolledStudentDetail() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
    },
  };

  const notify = (type, message) => setNotice({ type, message });

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/enrollments`, authHeader);
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        notify("error", "Your session has expired. Please log out and log in again.");
      } else {
        notify("error", "Failed to load enrollments. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirm({
      title: "Delete enrollment?",
      message: "This student enrollment will be permanently removed.",
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/admin/enrollments/${id}`, authHeader);
          setEnrollments((prev) => prev.filter((e) => e.id !== id));
          notify("success", "Enrollment deleted successfully.");
        } catch (err) {
          console.error(err);
          notify("error", "Failed to delete enrollment.");
        }
      },
    });
  };

  const startEdit = (enrollment) => {
    setEditingId(enrollment.id);
    setEditForm({
      ...enrollment,
      country: enrollment.country || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      const numericValue = value.replace(/\D/g, "").slice(0, 4);
      setEditForm((prev) => ({ ...prev, year: numericValue }));
      return;
    }

    if (name === "pincode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);

      setEditForm((prev) => ({
        ...prev,
        pincode: numericValue,
        ...(numericValue.length < 6
          ? { district: "", state: "", country: "" }
          : {}),
      }));

      if (numericValue.length === 6) {
        fetchLocationForEdit(numericValue);
      }

      return;
    }

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchLocationForEdit = async (pincode) => {
    try {
      const res = await axios.get(
        `${API}/api/pincode/${pincode}`
      );

      const data = res.data?.[0];

      if (data?.Status === "Success" && data?.PostOffice?.length > 0) {
        const postOffice = data.PostOffice[0];

        setEditForm((prev) => {
          if (prev.pincode !== pincode) return prev;

          return {
            ...prev,
            district: postOffice.District || "",
            state: postOffice.State || "",
            country: postOffice.Country || "India",
          };
        });

        notify("success", "Location auto-filled from pincode.");
      } else {
        setEditForm((prev) => ({
          ...prev,
          district: "",
          state: "",
          country: "",
        }));

        notify("error", "No location found for this pincode.");
      }
    } catch (err) {
      console.error("Pincode fetch failed", err);
      notify("error", "Could not auto-fill location from pincode.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API}/admin/enrollments/${editingId}`,
        editForm,
        authHeader
      );

      setEnrollments((prev) =>
        prev.map((e) => (e.id === editingId ? res.data : e))
      );

      setEditingId(null);
      notify("success", "Enrollment updated successfully.");
    } catch (err) {
      console.error(err);
      notify("error", "Failed to update enrollment.");
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    const keyword = searchTerm.toLowerCase();

    return (
      (e.name || "").toLowerCase().includes(keyword) ||
      (e.email || "").toLowerCase().includes(keyword) ||
      (e.course || "").toLowerCase().includes(keyword)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-gray-500">
        Please login as admin.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-24 sm:px-6">
      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-10 bg-[linear-gradient(#2563eb_1px,transparent_1px),linear-gradient(90deg,#2563eb_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      <div className="absolute left-[-130px] top-[-140px] h-[430px] w-[430px] rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-[-130px] right-[-120px] h-[390px] w-[390px] rounded-full bg-cyan-300/30 blur-3xl" />

      <Notice notice={notice} onClose={() => setNotice(null)} />
      <ConfirmModal confirm={confirm} setConfirm={setConfirm} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-black text-slate-900">
                <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 p-3 text-white shadow-lg shadow-blue-200">
                  <FaUserGraduate size={24} />
                </div>
                Student Enrollments
              </h2>

              <p className="mt-2 font-medium text-slate-500">
                Manage and track all student course applications.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-blue-100 bg-white/90 py-3 pl-11 pr-4 shadow-sm backdrop-blur transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Reveal>

        {notice?.message?.includes("expired") && (
          <Reveal>
            <div className="mb-8 flex items-center justify-between rounded-2xl border-l-4 border-red-500 bg-red-50 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                  <FaSignOutAlt />
                </div>

                <div>
                  <p className="font-bold text-red-700">Your session has expired.</p>
                  <p className="text-sm text-red-600/70">
                    Logging out and back in will refresh your security token.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="rounded-xl bg-red-600 px-6 py-2 font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
              >
                Logout Now
              </button>
            </div>
          </Reveal>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-20 text-center shadow-xl shadow-blue-100/40 backdrop-blur">
              <FaUserGraduate className="mx-auto mb-4 text-7xl text-gray-200" />
              <p className="text-xl font-medium text-gray-400">
                No enrollments found.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredEnrollments.map((e, index) => (
                <Reveal key={e.id} index={index}>
                  <motion.div
                    layout
                    whileHover={{ y: -5 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm backdrop-blur transition-all hover:shadow-xl hover:shadow-blue-100"
                  >
                    <div className="flex flex-col justify-between gap-6 lg:flex-row">
                      <div className="flex-1">
                        <div className="mb-4 flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                            {(e.name || "S").charAt(0)}
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {e.name}
                            </h3>

                            <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                              {e.course}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaEnvelope className="text-gray-400" /> {e.email}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhone className="text-gray-400" /> {e.phone}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <FaSchool className="text-gray-400" />{" "}
                            <span className="font-semibold text-slate-700">School:</span> {e.school || "N/A"} ({e.school_status || "N/A"}{e.school_year ? `, ${e.school_year}` : ""})
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <FaUserGraduate className="text-gray-400" />{" "}
                            <span className="font-semibold text-slate-700">College:</span> {e.college || "N/A"} ({e.college_degree_type || "N/A"} - {e.college_degree || "N/A"}, {e.college_status || "N/A"}{e.year ? `, ${e.year}` : ""})
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <FaMapMarkerAlt className="text-gray-400" />
                            <span className="truncate">
                              {e.address
                                ? `${e.address}, ${e.district || ""}, ${e.state || ""}, ${e.country || ""}, ${e.pincode || ""}`
                                : "N/A"}
                            </span>
                          </div>

                          {e.id_proof && (
                            <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                              <span className="font-semibold text-slate-700">ID Proof:</span>
                              <span className="text-emerald-600 font-medium">Available (View in Edit mode)</span>
                            </div>
                          )}

                          {e.staff_feedback && (
                            <div className="flex items-start gap-2 text-gray-600 sm:col-span-2 lg:col-span-3 mt-2 rounded-xl bg-green-50 p-4 border border-green-200 shadow-sm">
                              <span className="font-bold text-green-700 whitespace-nowrap pt-0.5">Staff Feedback:</span>
                              <span className="text-green-800 leading-relaxed font-medium">
                                {e.staff_feedback}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end lg:self-center">
                        {e.staff_feedback && (
                          <div className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-3 py-1.5 shadow-sm">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)]" />
                            <span className="text-[11px] font-black uppercase tracking-wider text-green-700">OK</span>
                          </div>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.04, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEdit(e)}
                          className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FaEdit /> Edit
                        </motion.button>

                        {user?.user?.role === "admin" && (
                          <motion.button
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(e.id)}
                            className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                          >
                            <FaTrash /> Delete
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
              onClick={() => setEditingId(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 35 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_40px_120px_-30px_rgba(15,23,42,0.55)]"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-600 p-7 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_35%)]" />
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

                <div className="relative flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-2xl font-black shadow-xl backdrop-blur-md">
                      {(editForm.name || "S").charAt(0)}
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100">
                        Student Record Editor
                      </p>
                      <h3 className="text-2xl font-black tracking-tight">
                        {editForm.name || "Edit Enrollment"}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-50">
                          Ref #{editingId}
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-50">
                          {editForm.course || "Course"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingId(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all hover:rotate-90 hover:bg-white/20"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleEditSubmit}
                className="max-h-[calc(92vh-150px)] overflow-y-auto bg-slate-50/70 p-7"
              >
                <div className="mb-6 rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <FaUserGraduate />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">Student Details</h4>
                      <p className="text-xs font-semibold text-slate-400">
                        Basic identity and course information
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["Name", "name", "text", ""],
                      ["Email", "email", "email", ""],
                      ["Phone", "phone", "text", ""],
                      ["Course", "course", "text", "lg:col-span-2"],
                      ["School Name", "school", "text", ""],
                      ["School Status", "school_status", "text", ""],
                      ["School Passing Year", "school_year", "text", ""],
                      ["College Name", "college", "text", ""],
                      ["College Status", "college_status", "text", ""],
                      ["Degree Type", "college_degree_type", "text", ""],
                      ["Degree Course", "college_degree", "text", ""],
                      ["College Passing Year", "year", "text", ""],
                    ].map(([label, name, type, span]) => (
                      <div key={name} className={span}>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={editForm[name] || ""}
                          onChange={handleEditChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-cyan-100 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">Location Details</h4>
                      <p className="text-xs font-semibold text-slate-400">
                        Pincode can auto-fill district, state, and country
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={editForm.pincode || ""}
                        onChange={handleEditChange}
                        className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 font-black text-blue-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    {[
                      ["District", "district"],
                      ["State", "state"],
                      ["Country", "country"],
                    ].map(([label, name]) => (
                      <div key={name}>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {label}
                        </label>
                        <input
                          type="text"
                          name={name}
                          value={editForm[name] || ""}
                          onChange={handleEditChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    ))}

                    <div className="lg:col-span-3">
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Full Address
                      </label>
                      <textarea
                        name="address"
                        value={editForm.address || ""}
                        onChange={handleEditChange}
                        rows="3"
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    {editForm.id_proof && (
                      <div className="lg:col-span-3 mt-2">
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Uploaded ID Proof
                        </label>
                        <div className="p-2 border border-slate-200 bg-white rounded-xl inline-block">
                          <img src={editForm.id_proof} alt="ID Proof" className="max-h-48 rounded-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-green-100 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-green-50 p-3 text-green-600">
                      <FaEdit />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">Staff Feedback</h4>
                      <p className="text-xs font-semibold text-slate-400">
                        Add internal notes or follow-up feedback about this student
                      </p>
                    </div>
                  </div>
                  <div>
                    <textarea
                      name="staff_feedback"
                      value={editForm.staff_feedback || ""}
                      onChange={handleEditChange}
                      rows="4"
                      placeholder="Type your feedback here..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 -mx-7 mt-7 flex justify-end gap-3 border-t border-slate-200 bg-white/90 px-7 py-5 backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-2xl bg-slate-100 px-6 py-3 font-black text-slate-500 transition-all hover:bg-slate-200"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 px-8 py-3 font-black text-white shadow-xl shadow-blue-200"
                  >
                    <FaSave /> Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
