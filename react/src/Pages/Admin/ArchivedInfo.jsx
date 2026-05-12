import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FaTrash, FaUser, FaPhone, FaEnvelope, FaClock, FaTag, FaCommentAlt, FaCommentDots, FaSave, FaHistory, FaUndo, FaChevronDown, FaChevronUp, FaTrashAlt, FaInbox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ArchivedInfo() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.user?.role === "admin") {
      fetchDeletedContacts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.user?.role]);

  const fetchDeletedContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/admin/contacts/deleted", {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setDeletedContacts(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load trash:", err);
      setError("Failed to load archived inquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:8000/admin/contacts/${id}/restore`, {}, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setDeletedContacts(deletedContacts.filter(c => c.id !== id));
      alert("Message restored to inbox!");
    } catch (err) {
      console.error(err);
      alert("Failed to restore message.");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("CRITICAL: This will permanently delete the record. Continue?")) return;

    try {
      await axios.delete(`http://localhost:8000/admin/contacts/${id}/permanent`, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setDeletedContacts(deletedContacts.filter(c => c.id !== id));
      alert("Message permanently deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to permanently delete message.");
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center py-20 text-gray-500">Please login to view archive.</div>;
  }

  if (user?.user?.role !== "admin") {
    return <div className="text-center py-20 text-red-500 font-bold text-2xl">ACCESS DENIED. Admins Only.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200">
              <FaHistory size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Archived Inquiries</h1>
              <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Review & Manage Deleted Student Communications</p>
            </div>
          </div>

          <button 
            onClick={() => navigate("/admin/contacts")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl font-bold border border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
          >
            <FaInbox /> Back to Inbox
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold mb-8">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-20 text-blue-600 font-bold animate-pulse uppercase tracking-widest">Loading Archive Vault...</div>
        ) : deletedContacts.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <FaHistory size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Archive is Empty</h2>
            <p className="text-slate-500 font-medium">There are no archived inquiries to display at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {deletedContacts.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                        <FaUser size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-400 line-through decoration-slate-300">{c.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ref: #{c.id}</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-bold rounded-md uppercase">Archived</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleRestore(c.id)}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Restore to Inbox"
                      >
                        <FaUndo size={16} />
                      </button>
                      <button 
                        onClick={() => handlePermanentDelete(c.id)}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete Permanently"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl text-slate-400 border border-slate-100">
                      <FaEnvelope className="text-slate-300" />
                      <span className="text-xs font-bold truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl text-slate-400 border border-slate-100">
                      <FaPhone className="text-slate-300" />
                      <span className="text-xs font-bold">{c.phone}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/30 rounded-3xl border border-slate-100 italic text-slate-400 text-sm leading-relaxed">
                    "{c.message || "No message content provided."}"
                  </div>
                  
                  {c.feedback && (
                    <div className="mt-6 p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
                      <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Staff Feedback</label>
                      <p className="text-xs text-blue-600 font-medium italic">"{c.feedback}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
