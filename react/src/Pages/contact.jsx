import { FaPhoneAlt, FaMapMarkerAlt, FaClock, FaEnvelope } from "react-icons/fa";

function Contact() {
  return (
    <div className="bg-gray-100 py-16 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        {/*  LEFT SIDE */}
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">
            Have Any Questions?
          </h2>

          <p className="text-gray-600 mb-8">
            We offer a free counseling session to help you match your interests
            with the right technical path. Just visit our institute or give us a call.
          </p>

          {/* ADDRESS */}
          <div className="bg-white p-5 rounded-xl shadow-md flex gap-4 mb-5 hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h4 className="font-semibold">Address</h4>
              <p className="text-gray-600 text-sm">
                NIYAS ARCADE, Opp. Of Mosque,<br />
                Azhagiyamandapam.
              </p>
            </div>
          </div>

          {/* PHONE */}
          <div className="bg-white p-5 rounded-xl shadow-md flex gap-4 mb-5 hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FaPhoneAlt />
            </div>
            <div>
              <h4 className="font-semibold">Phone Number</h4>
              <p className="text-gray-600 text-sm">
                +91 75980 98675, 72002 86091
              </p>
            </div>
          </div>

          {/* HOURS */}
          <div className="bg-white p-5 rounded-xl shadow-md flex gap-4 hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FaClock />
            </div>
            <div>
              <h4 className="font-semibold">Working Hours</h4>
              <p className="text-gray-600 text-sm">
                Mon - Sat : 09:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* 🔵 RIGHT SIDE (FORM) */}
        <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl">

          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <h1 className="text-3xl font-bold mb-6">GET IN TOUCH</h1>

          <form className="space-y-4">

            {/* NAME + EMAIL */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name*"
                className="p-3 rounded-lg bg-white text-black outline-none"
              />
              <input
                type="email"
                placeholder="Email Address*"
                className="p-3 rounded-lg bg-white text-black outline-none"
              />
            </div>

            {/* SUBJECT + PHONE */}
            <div className="grid md:grid-cols-2 gap-4">
              <select className="p-3 rounded-lg bg-white text-black outline-none">
                <option>Select Subject</option>
                <option>Course Inquiry</option>
                <option>Admission</option>
                <option>Support</option>
              </select>

              <input
                type="text"
                placeholder="Phone Number*"
                className="p-3 rounded-lg bg-white text-black outline-none"
              />
            </div>

            {/* MESSAGE */}
            <textarea
              rows="5"
              placeholder="Write your Message*"
              className="w-full p-3 rounded-lg bg-white text-black outline-none"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-red-500 px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition"
            >
              Send Message
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;