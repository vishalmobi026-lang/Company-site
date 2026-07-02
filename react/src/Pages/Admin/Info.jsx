import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTag,
  FaCommentAlt,
  FaCommentDots,
  FaSave,
  FaTimes,
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

export default function Info() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
    },
  };

  const notify = (type, message) => setNotice({ type, message });

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/contacts`, authHeader);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      notify(
        "error",
        "Failed to load messages. Please ensure you are logged in as staff or admin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirm({
      title: "Move to trash?",
      message: "This inquiry will be moved to the archived messages section.",
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/admin/contacts/${id}`, authHeader);
          setContacts((prev) => prev.filter((c) => c.id !== id));
          notify("success", "Message moved to trash.");
        } catch (err) {
          console.error(err);
          notify("error", "Failed to delete message.");
        }
      },
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/contacts/${id}/status`,
        { status: newStatus },
        authHeader
      );

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      notify("success", `Inquiry marked as ${newStatus}.`);
    } catch (err) {
      console.error(err);
      notify("error", "Failed to update status.");
    }
  };

  const handleFeedbackUpdate = async (id, feedback) => {
    try {
      await axios.put(
        `${API}/admin/contacts/${id}/status`,
        { feedback },
        authHeader
      );

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, feedback } : c))
      );

      notify("success", "Feedback saved successfully.");
    } catch (err) {
      console.error(err);
      notify("error", "Failed to update feedback.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-gray-500">
        Please login to view messages.
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
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-extrabold text-slate-900">
                <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 p-3 text-white shadow-lg shadow-blue-200">
                  <FaEnvelope size={24} />
                </div>
                Contact Inquiries
              </h2>
              <p className="mt-2 font-medium text-slate-500">
                Manage and respond to student inquiries from the contact form.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/85 p-2 shadow-sm backdrop-blur">
              <span className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                {contacts.length} {contacts.length === 1 ? "Entry" : "Entries"}
              </span>

              <button
                onClick={fetchContacts}
                className="p-2 text-slate-400 transition-colors hover:text-blue-600"
                title="Refresh"
              >
                <FaClock />
              </button>
            </div>
          </div>
        </Reveal>

        {!loading && contacts.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-20 text-center shadow-xl shadow-blue-100/40 backdrop-blur">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                <FaEnvelope className="text-4xl text-slate-200" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Inbox is empty
              </h3>
              <p className="font-medium text-slate-400">
                When students fill the contact form, they will appear here.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AnimatePresence>
              {contacts.map((c, index) => (
                <Reveal key={c.id} index={index}>
                  <motion.div
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-3xl border border-blue-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  >
                    <div className="p-7">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                            <FaUser size={20} />
                          </div>

                          <div>
                            <h4 className="text-lg font-bold leading-tight text-slate-900">
                              {c.name}
                            </h4>
                            <span className="mt-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                              <FaClock size={10} /> Just now
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>

                      <div className="mb-6 grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-blue-100">
                          <FaPhone className="w-4 text-slate-400 group-hover:text-blue-500" />
                          <span className="text-sm font-semibold text-slate-600">
                            {c.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-blue-100">
                          <FaEnvelope className="w-4 text-slate-400 group-hover:text-blue-500" />
                          <span className="truncate text-sm font-semibold text-slate-600">
                            {c.email}
                          </span>
                        </div>


                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <FaTag className="mt-1 shrink-0 text-slate-300" />
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                              Subject
                            </p>
                            <p className="text-sm font-bold text-slate-800">
                              {c.subject || "General Inquiry"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaCommentAlt className="mt-1 shrink-0 text-slate-300" />
                          <div className="w-full">
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                              Message
                            </p>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm italic leading-relaxed text-slate-600">
                              "{c.message || "No message content provided."}"
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                          <FaCommentDots className="mt-1 shrink-0 text-blue-400" />
                          <div className="w-full">
                            <div className="mb-1 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Staff Feedback
                              </p>

                              <button
                                onClick={() =>
                                  handleFeedbackUpdate(c.id, c.feedback)
                                }
                                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight text-blue-600 hover:text-blue-700"
                              >
                                <FaSave size={10} /> Save
                              </button>
                            </div>

                            <textarea
                              className="min-h-[80px] w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/30 p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              placeholder="Type staff feedback here..."
                              value={c.feedback || ""}
                              onChange={(e) => {
                                const feedback = e.target.value;
                                setContacts((prev) =>
                                  prev.map((item) =>
                                    item.id === c.id
                                      ? { ...item, feedback }
                                      : item
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
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
