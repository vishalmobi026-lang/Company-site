import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUserShield,
  FaKey,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    if (!form.username) return "Username is required";
    if (form.password.length < 4) return "Password must be at least 4 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          username: form.username,
          password: form.password,
        },
        { withCredentials: true }
      );

      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);

      setError("Invalid username or password");
    }
  };
  return (
    <section className="relative min-h-screen bg-slate-950 px-4 sm:px-6 py-12 flex items-center overflow-hidden text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px] animate-[moveGrid_20s_linear_infinite]"></div>

      <div className="absolute w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] bg-blue-500/20 blur-3xl rounded-full top-[-140px] left-[-150px]"></div>
      <div className="absolute w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-130px] right-[-130px]"></div>

      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-10 items-center relative z-10">
        {/* LEFT ADMIN ANIMATION */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[430px] w-[430px] flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute h-[360px] w-[360px] rounded-full border border-cyan-400/30"
            ></motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute h-[280px] w-[280px] rounded-full border border-blue-400/30 border-dashed"
            ></motion.div>

            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 h-44 w-44 rounded-3xl border border-cyan-400/40 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl"
            >
              <FaUserShield className="text-7xl text-cyan-300" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-12 rounded-2xl border border-cyan-400/30 bg-slate-950/80 px-5 py-4"
            >
              <FaShieldAlt className="text-cyan-300 text-2xl mb-2" />
              <p className="text-sm text-gray-300">Admin Only</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 right-10 rounded-2xl border border-blue-400/30 bg-slate-950/80 px-5 py-4"
            >
              <FaKey className="text-blue-300 text-2xl mb-2" />
              <p className="text-sm text-gray-300">Secure Login</p>
            </motion.div>
          </motion.div>
        </div>
        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full max-w-lg mx-auto lg:-translate-y-15 overflow-hidden rounded-[28px] border border-cyan-400/30 bg-white/5 backdrop-blur-xl shadow-2xl"

        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-900 via-cyan-400 to-blue-500"></div>

          <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="ml-3 text-xs text-gray-400">admin-login.secure</span>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-3xl text-cyan-300 shadow-lg shadow-cyan-400/10">
                <FaLock />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-200 to-cyan-300 bg-clip-text text-transparent">
                Admin Login
              </h1>

              <p className="text-center text-gray-400 mt-2 text-sm">
                Authorized dashboard access only
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/15 border border-red-500/50 text-red-300 text-sm p-3 rounded-xl mb-4 text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">Username</label> {/* Fixed from Email Address */}
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Fixed from FaEnvelope */}

                  <input
                    type="text"
                    name="username"
                    placeholder="admin_core"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-950/70 border border-slate-700 text-gray-200 placeholder:text-gray-500 focus:border-cyan-400 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter secure password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-4 rounded-xl bg-slate-950/70 border border-slate-700 text-gray-200 placeholder:text-gray-500 focus:border-cyan-400 outline-none transition"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="accent-cyan-400"
                  />
                  Remember me
                </label>

                <span className="text-cyan-300">Secure mode</span>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : undefined}
                whileTap={!loading ? { scale: 0.96 } : undefined}
                className={`w-full py-4 rounded-xl font-semibold transition duration-300 ${loading
                    ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-900 to-blue-500 shadow-lg shadow-blue-900/30"
                  }`}
              >
                {loading ? "Verifying Access..." : "Login to Dashboard"}
              </motion.button>
            </form>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-sm font-semibold text-cyan-300">Admin</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-sm font-semibold text-cyan-300">Secure</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs text-gray-400">Access</p>
                <p className="text-sm font-semibold text-cyan-300">Private</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
