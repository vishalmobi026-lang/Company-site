import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

function Enroll({ setPage }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Enrollment Submitted Successfully!");
  };

  const isInvalid = (field) => touched[field] && !form[field];

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-12">

      {/* BACK */}
    

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Student Enrollment
        </h1>
        <p className="text-gray-500 mt-2">
          Complete the form below to begin your learning journey with us
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl space-y-8"
      >

        {/* PERSONAL INFO */}
        <div>
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Personal Information
          </h2>

          <div className="space-y-5">

            <div>
              <label className="font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-2 p-3 rounded-lg border 
                ${isInvalid("name") ? "border-red-500" : "border-gray-300"}
                focus:ring-2 focus:ring-blue-500 outline-none`}
              />
            </div>

            <div>
              <label className="font-medium">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-2 p-3 rounded-lg border 
                ${isInvalid("email") ? "border-red-500" : "border-gray-300"}
                focus:ring-2 focus:ring-blue-500 outline-none`}
              />
            </div>

            <div>
              <label className="font-medium">Phone Number *</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

          </div>
        </div>

        {/* EDUCATION */}
        <div>
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Education Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="college"
              placeholder="College / School Name"
              value={form.college}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="year"
              placeholder="Year of Study"
              value={form.year}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Address Details
          </h2>

          <textarea
            name="address"
            placeholder="Enter your full address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="grid md:grid-cols-2 gap-5 mt-4">

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="district"
              placeholder="District"
              value={form.district}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>
        </div>

        {/* COURSE */}
        <div>
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Selected Course
          </h2>
          <input
            type="text"
            value={form.course}
            readOnly
            className="w-full p-3 rounded-lg bg-gray-100 font-semibold"
          />
        </div>

        {/* SUBMIT */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={!form.name || !form.email}
            className={`px-14 py-3 rounded-full text-lg font-semibold transition
              ${
                !form.name || !form.email
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-lg"
              }`}
          >
            Submit Enrollment
          </button>
        </div>

      </form>
    </div>
  );
}

export default Enroll;