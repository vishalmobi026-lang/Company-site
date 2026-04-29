import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Enroll() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    address: "",
    country: "",
    state: "",
    district: "",
    pincode: "",
    course: "Full-Stack Development"
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isInvalid = (field) => touched[field] && !form[field];

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 REQUIRED CHECK
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all required fields!");
      return;
    }

    console.log(form);
    alert("Enrollment Submitted Successfully!");
  };

  return (
    <div className="bg-slate-950 min-h-screen px-4 py-12 text-white">

      {/* 🔙 BACK BUTTON */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-400 hover:underline"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Student Enrollment
        </h1>
        <p className="text-gray-400 mt-2">
          Complete the form below to begin your learning journey
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white/5 backdrop-blur border border-gray-700 p-10 rounded-2xl shadow-xl space-y-8"
      >

        {/* PERSONAL INFO */}
        <div>
          <h2 className="text-lg font-semibold text-purple-300 mb-4">
            Personal Information
          </h2>

          <div className="space-y-5">

            {/* NAME */}
            <div>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-2 p-3 rounded-lg bg-black/30 border 
                ${isInvalid("name") ? "border-red-500" : "border-gray-600"}
                focus:border-purple-400 outline-none`}
              />
              {isInvalid("name") && <p className="text-red-400 text-sm">Name is required</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-2 p-3 rounded-lg bg-black/30 border 
                ${isInvalid("email") ? "border-red-500" : "border-gray-600"}
                focus:border-purple-400 outline-none`}
              />
              {isInvalid("email") && <p className="text-red-400 text-sm">Email is required</p>}
            </div>

            {/* PHONE */}
            <div>
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-2 p-3 rounded-lg bg-black/30 border 
                ${isInvalid("phone") ? "border-red-500" : "border-gray-600"}
                focus:border-purple-400 outline-none`}
              />
              {isInvalid("phone") && <p className="text-red-400 text-sm">Phone is required</p>}
            </div>

          </div>
        </div>

        {/* EDUCATION */}
        <div>
          <h2 className="text-lg font-semibold text-purple-300 mb-4">
            Education Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <input name="college" placeholder="College" value={form.college} onChange={handleChange} className="p-3 rounded bg-black/30 border border-gray-600" />
            <input name="year" placeholder="Year" value={form.year} onChange={handleChange} className="p-3 rounded bg-black/30 border border-gray-600" />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <h2 className="text-lg font-semibold text-purple-300 mb-4">
            Address Details
          </h2>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/30 border border-gray-600"
          />

          <div className="grid md:grid-cols-2 gap-5 mt-4">
            <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="p-3 border rounded bg-black/30 border-gray-600" />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="p-3 border rounded bg-black/30 border-gray-600" />
            <input name="district" placeholder="District" value={form.district} onChange={handleChange} className="p-3 border rounded bg-black/30 border-gray-600" />
            <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="p-3 border rounded bg-black/30 border-gray-600" />
          </div>
        </div>

        {/* COURSE */}
        <div>
          <h2 className="text-lg font-semibold text-purple-300 mb-2">
            Selected Course
          </h2>
          <input
            type="text"
            value={form.course}
            readOnly
            className="w-full p-3 rounded bg-gray-800 font-semibold"
          />
        </div>

        {/* SUBMIT */}
        <div className="text-center pt-6">
          <button
            type="submit"
            className="px-14 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition"
          >
            Submit Enrollment
          </button>
        </div>

      </form>
    </div>
  );
}

export default Enroll;