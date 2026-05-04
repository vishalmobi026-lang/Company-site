import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TOAST COMPONENT ================= */

function Toast({ toast, removeToast }) {
  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) removeToast(toast.id);
      }}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={`w-72 rounded-xl shadow-2xl text-white overflow-hidden
      ${toast.type === "success"
        ? "bg-gradient-to-r from-green-500 to-green-700"
        : "bg-gradient-to-r from-red-500 to-red-700"}`}
    >
      <div className="flex items-center gap-3 p-4">
        <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
        <p className="flex-1 text-sm">{toast.message}</p>

        <button onClick={() => removeToast(toast.id)}>✖</button>
      </div>

      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 2, ease: "linear" }}
        className="h-1 bg-white/70"
      />
    </motion.div>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [toasts, setToasts] = useState([]);

  /* ---------- TOAST FUNCTIONS ---------- */

  const addToast = (message, type) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 2000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* ---------- FORM HANDLING ---------- */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email) {
      addToast("All fields are required!", "error");
      return;
    }

    addToast("Form Submitted!", "success");

    setForm({ name: "", phone: "", email: "" });

    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  /* ================= UI ================= */

  return (
    <>
      {/* 🔔 Toast System */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Floating Button */}
      <motion.div
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 180 : 0 }}
        className="fixed bottom-5 right-5 bg-blue-600 text-white text-xl p-4 rounded-full cursor-pointer shadow-lg z-50"
      >
        💬
      </motion.div>

      {/* Chat Box Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-20 right-5 w-72 bg-white rounded-xl shadow-2xl p-4 z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Contact Us
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-500 text-lg font-bold"
              >
                ✖
              </button>
            </div>

            {/* Inputs */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}