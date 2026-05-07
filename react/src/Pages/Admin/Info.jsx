import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FaTrash, FaUser, FaPhone, FaEnvelope, FaClock, FaTag, FaCommentAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Info() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/admin/contacts", {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setContacts(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages. Please ensure you are logged in as staff or admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:8000/admin/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/admin/contacts/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`
        }
      });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center py-20 text-gray-500">Please login to view messages.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                <FaEnvelope size={24} /> 
              </div>
              Contact Inquiries
            </h2>
            <p className="mt-2 text-slate-500 font-medium">Manage and respond to student inquiries from the contact form.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold">
              {contacts.length} {contacts.length === 1 ? 'Entry' : 'Entries'}
            </span>
            <button 
              onClick={fetchContacts}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="Refresh"
            >
              <FaClock />
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-xl shadow-sm"
          >
            <p className="text-red-700 font-medium">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading inquiries...</p>
          </div>
        ) : contacts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-slate-200 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox is empty</h3>
            <p className="text-slate-400 font-medium">When students fill the contact form, they will appear here.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {contacts.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                          <FaUser size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 leading-tight">{c.name}</h4>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                            <FaClock size={10} /> Just now
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-colors">
                        <FaPhone className="text-slate-400 w-4 group-hover:text-blue-500" />
                        <span className="text-sm font-semibold text-slate-600">{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-colors overflow-hidden">
                        <FaEnvelope className="text-slate-400 w-4 group-hover:text-blue-500" />
                        <span className="text-sm font-semibold text-slate-600 truncate">{c.email}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FaTag className="text-slate-300 mt-1 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                          <p className="text-sm font-bold text-slate-800">{c.subject || "General Inquiry"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaCommentAlt className="text-slate-300 mt-1 shrink-0" />
                        <div className="w-full">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</p>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
                            "{c.message || "No message content provided."}"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-8">
                      <button className="text-blue-600 text-sm font-bold hover:underline">Reply via Email</button>
                      
                      <div className="flex items-center gap-6 border-l border-slate-200 pl-8">
                        <div 
                          className="flex items-center gap-2 cursor-pointer group/toggle"
                          onClick={() => handleStatusUpdate(c.id, "Deactive")}
                        >
                          <span className={`text-[13px] font-bold transition-colors duration-300 ${c.status === "Deactive" ? "text-slate-500" : "text-slate-300 group-hover/toggle:text-slate-400"}`}>Deactive</span>
                          <div className={`h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${c.status === "Deactive" ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-transparent"}`}>
                            <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${c.status === "Deactive" ? "bg-red-500 scale-100 opacity-100" : "bg-slate-200 scale-50 opacity-0"}`}></div>
                          </div>
                        </div>
                        <div 
                          className="flex items-center gap-2 cursor-pointer group/toggle"
                          onClick={() => handleStatusUpdate(c.id, "Active")}
                        >
                          <span className={`text-[13px] font-bold transition-colors duration-300 ${c.status === "Active" ? "text-emerald-600" : "text-slate-300 group-hover/toggle:text-slate-400"}`}>Active</span>
                          <div className={`h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${c.status === "Active" ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-transparent"}`}>
                            <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${c.status === "Active" ? "bg-emerald-500 scale-100 opacity-100" : "bg-slate-200 scale-50 opacity-0"}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Ref: #{c.id}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
