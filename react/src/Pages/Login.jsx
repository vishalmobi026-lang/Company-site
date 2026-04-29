import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validate = () => {
    if (!form.email.includes("@")) return "Enter valid email";
    if (form.password.length < 4) return "Password must be at least 4 characters";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Login Successful!");
      navigate("/");
    }, 1500);
  };

  return (
    <section className="relative min-h-screen bg-slate-950 px-6 flex items-center overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#7c3aed_1px,transparent_1px),linear-gradient(90deg,#7c3aed_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>

      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">

        {/* 🔥 LEFT SIDE (ANIMATED) */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-gray-400 text-lg mb-6">
            Access your dashboard and manage everything easily.
          </p>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-purple-400">✔</span>
              <span>Manage courses & students</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-blue-400">✔</span>
              <span>Track performance</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-cyan-400">✔</span>
              <span>Secure dashboard access</span>
            </div>
          </div>
        </motion.div>

        {/* 🔥 LOGIN CARD (ANIMATED) */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur border border-gray-700 p-10 rounded-3xl shadow-2xl w-full max-w-md mx-auto"
        >

          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Admin Login
          </h1>

          <p className="text-center text-gray-400 mb-6 text-sm">
            Secure access to dashboard
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-lg bg-black/30 border border-gray-600 
                text-gray-300 hover:text-white hover:border-white 
                focus:text-white focus:border-white 
                outline-none transition duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 p-3 rounded-lg bg-black/30 border border-gray-600 
                text-gray-300 hover:text-white hover:border-white 
                focus:text-white focus:border-white 
                outline-none transition duration-300"
              />

              <div
                className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition duration-300
                ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 shadow-lg"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Need help?{" "}
            <span
              onClick={() => navigate("/contact")}
              className="text-purple-400 cursor-pointer hover:underline"
            >
              Contact Support
            </span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}