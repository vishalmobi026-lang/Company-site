import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaTrash, FaUser, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactDetail() {
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
      setError("Failed to load messages. Please ensure you are logged in as admin.");
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

  if (!isAuthenticated) {
    return <div className="text-center py-20 text-gray-500">Please login as admin to view messages.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaEnvelope className="text-blue-600" /> 
            Admin Messages
          </h2>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
            {contacts.length} {contacts.length === 1 ? 'Message' : 'Messages'}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <FaEnvelope className="text-gray-200 text-6xl mx-auto mb-4" />
            <p className="text-xl text-gray-400 font-medium">No messages found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {contacts.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <FaUser size={20} />
                      </div>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{c.name}</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaPhone className="text-gray-400 w-4" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaEnvelope className="text-gray-400 w-4" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1">
                      <FaClock size={10} /> Received via Chat
                    </span>
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
