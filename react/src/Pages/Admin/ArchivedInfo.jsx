import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHistory,
  FaUndo,
  FaTrashAlt,
  FaInbox,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API = "https://company-site-jxbr.onrender.com";

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
                  className={`flex-1 rounded-2xl py-4 font-black text-white shadow-xl ${
                    confirm.danger
                      ? "bg-gradient-to-r from-red-700 to-red-500 shadow-red-100"
                      : "bg-gradient-to-r from-blue-900 to-blue-600 shadow-blue-100"
                  }`}
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

export default function ArchivedInfo() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();

  const authHeader = {
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
    },
  };

  const notify = (type, message) => setNotice({ type, message });

  useEffect(() => {
    if (isAuthenticated && user?.user?.role === "admin") {
      fetchDeletedContacts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.user?.role]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const fetchDeletedContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/contacts/deleted`, authHeader);
      setDeletedContacts(res.data);
    } catch (err) {
      console.error("Failed to load trash:", err);
      notify("error", "Failed to load archived inquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`${API}/admin/contacts/${id}/restore`, {}, authHeader);

      setDeletedContacts((prev) => prev.filter((c) => c.id !== id));
      notify("success", "Message restored to inbox.");
    } catch (err) {
      console.error(err);
      notify("error", "Failed to restore message.");
    }
  };

  const handlePermanentDelete = (id) => {
    setConfirm({
      title: "Delete permanently?",
      message:
        "This action cannot be undone. The archived inquiry will be permanently removed.",
      danger: true,
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/admin/contacts/${id}/permanent`, authHeader);

          setDeletedContacts((prev) => prev.filter((c) => c.id !== id));
          notify("success", "Message permanently deleted.");
        } catch (err) {
          console.error(err);
          notify("error", "Failed to permanently delete message.");
        }
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-gray-500">
        Please login to view archive.
      </div>
    );
  }

  if (user?.user?.role !== "admin") {
    return (
      <div className="py-20 text-center text-2xl font-bold text-red-500">
        ACCESS DENIED. Admins Only.
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
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-800 p-4 text-white shadow-xl shadow-blue-100">
                <FaHistory size={32} />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  Archived Inquiries
                </h1>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">
                  Review & Manage Deleted Student Communications
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/contacts")}
              className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/90 px-6 py-3 font-bold text-blue-600 shadow-sm backdrop-blur transition-all hover:bg-blue-50"
            >
              <FaInbox /> Back to Inbox
            </motion.button>
          </div>
        </Reveal>

        {loading ? (
          <div className="py-20 text-center font-bold uppercase tracking-widest text-blue-600 animate-pulse">
            Loading Archive Vault...
          </div>
        ) : deletedContacts.length === 0 ? (
          <Reveal>
            <div className="rounded-[3rem] border border-blue-100 bg-white/90 p-20 text-center shadow-xl shadow-blue-100/40 backdrop-blur">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                <FaHistory size={48} />
              </div>

              <h2 className="mb-2 text-2xl font-black text-slate-900">
                Archive is Empty
              </h2>

              <p className="font-medium text-slate-500">
                There are no archived inquiries to display at this time.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <AnimatePresence>
              {deletedContacts.map((c, index) => (
                <Reveal key={c.id} index={index}>
                  <motion.div
                    layout
                    whileHover={{ y: -6 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white/90 shadow-xl shadow-blue-100/30 backdrop-blur transition-all duration-300"
                  >
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-slate-300 to-blue-200" />

                    <div className="p-8">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-300">
                            <FaUser size={24} />
                          </div>

                          <div>
                            <h3 className="text-xl font-black text-slate-400 line-through decoration-slate-300">
                              {c.name}
                            </h3>

                            <div className="mt-1 flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                Ref: #{c.id}
                              </span>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-400">
                                Archived
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleRestore(c.id)}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
                            title="Restore to Inbox"
                          >
                            <FaUndo size={16} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handlePermanentDelete(c.id)}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm transition-all hover:bg-red-600 hover:text-white"
                            title="Delete Permanently"
                          >
                            <FaTrashAlt size={16} />
                          </motion.button>
                        </div>
                      </div>

                      <div className="mb-6 grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-slate-400">
                          <FaEnvelope className="text-slate-300" />
                          <span className="truncate text-xs font-bold">
                            {c.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-slate-400">
                          <FaPhone className="text-slate-300" />
                          <span className="text-xs font-bold">{c.phone}</span>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-100 bg-slate-50/30 p-6 text-sm italic leading-relaxed text-slate-400">
                        "{c.message || "No message content provided."}"
                      </div>

                      {c.feedback && (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/30 p-4">
                          <label className="mb-1 block text-[9px] font-black uppercase tracking-widest text-blue-400">
                            Staff Feedback
                          </label>

                          <p className="text-xs font-medium italic text-blue-600">
                            "{c.feedback}"
                          </p>
                        </div>
                      )}

                    </div>
                  </motion.div>

                </Reveal>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
