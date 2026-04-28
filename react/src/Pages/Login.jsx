import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Login Successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black px-6">

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Admin only 
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Login to access the admin dashboard and manage courses, students, and more.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={!form.email || !form.password}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${
                !form.email || !form.password
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            Login
          </button>

        </form>

        {/* EXTRA LINKS */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            need help?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
                Contact Support
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}