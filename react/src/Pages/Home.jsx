import { useState } from "react";
import { FaCheck } from "react-icons/fa";

function Home({ setPage, setOpenCourses }) {

  const [offer, setOffer] = useState("Standard"); // ✅ REQUIRED

  return (
    <div>

      {/* 🔥 FIRST HERO */}
      <section className="h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-r from-blue-900 to-black text-white px-6">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">

          <div className="max-w-xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to G-TEC Education
            </h1>

            <p className="text-gray-300 text-lg mb-6">
              Learn industry-ready skills with expert guidance and real-world projects.<br />
              Build your future with modern courses designed for career success.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mb-8">
              Your journey to success starts here.
            </h2>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setPage("Enroll")}
                className="bg-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition"
              >
                Enroll Now
              </button>

              <button
                onClick={() => {
                  setPage("Home");
                  setOpenCourses(true);
                }}
                className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
              >
                See Courses
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              alt="learning"
              className="w-[420px] rounded-xl shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* 🔥 HERO 2 */}
      <section className="h-screen flex items-center justify-center bg-gray-100 px-6">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">

          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              G-TEC Education
            </h2>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Transform your future with cutting-edge skills and real-world knowledge.<br />
              We don’t just teach — we build careers that last.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-8">
              Learn Smart. Grow Fast. Succeed Globally.
            </h3>

            <button
              onClick={() => setPage("Courses")}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition"
            >
              Explore Courses
            </button>
          </div>

          <div className="w-full md:w-[450px]">
            <video
              src="/videos/education.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[380px] object-cover rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* 🔥 HERO 5 (UPDATED PRICING STYLE) */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black text-white px-6 py-16">

        <div className="max-w-7xl w-full text-center">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Start Your Career With Confidence
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Gain real-world experience and industry knowledge with our expertly designed programs.
          </p>

          <h2 className="text-xl font-semibold text-blue-300 mb-10">
            Upgrade your skills. Unlock opportunities.
          </h2>

          {/* OFFER TOGGLE */}
          <div className="mb-12 inline-flex bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setOffer("Standard")}
              className={`px-6 py-2 rounded-full ${offer === "Standard" ? "bg-blue-500" : ""}`}
            >
              Standard
            </button>

            <button
              onClick={() => setOffer("Offer")}
              className={`px-6 py-2 rounded-full ${offer === "Offer" ? "bg-blue-500" : ""}`}
            >
              Offer
            </button>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-8">

            {/* FULL STACK */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-8 border border-gray-700 hover:scale-105 transition">
              <h2 className="text-xl font-semibold mb-4">Full Stack</h2>
              <p className="text-gray-400 mb-6">Frontend + Backend development</p>
              <h3 className="text-3xl font-bold mb-6">
                ₹{offer === "Offer" ? "9,999" : "14,999"}
              </h3>
              <button onClick={() => setPage("Enroll")} className="w-full bg-gray-700 py-3 rounded-lg mb-6">
                Enroll Now
              </button>
              <ul className="space-y-2 text-left text-sm">
                <li><FaCheck /> HTML, CSS, JS</li>
                <li><FaCheck /> React + Backend</li>
              </ul>
            </div>

            {/* MERN */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-8 border-2 border-blue-500 scale-105 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">MERN Stack</h2>
              <h3 className="text-3xl font-bold mb-6">
                ₹{offer === "Offer" ? "12,999" : "19,999"}
              </h3>
              <button onClick={() => setPage("Enroll")} className="w-full bg-blue-500 py-3 rounded-lg mb-6">
                Enroll Now
              </button>
              <ul className="space-y-2 text-left text-sm">
                <li><FaCheck /> MongoDB</li>
                <li><FaCheck /> React</li>
                <li><FaCheck /> Node</li>
              </ul>
            </div>

            {/* PYTHON */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-8 border border-gray-700 hover:scale-105 transition">
              <h2 className="text-xl font-semibold mb-4">Python</h2>
              <h3 className="text-3xl font-bold mb-6">
                ₹{offer === "Offer" ? "7,999" : "11,999"}
              </h3>
              <button onClick={() => setPage("Enroll")} className="w-full bg-gray-700 py-3 rounded-lg mb-6">
                Enroll Now
              </button>
              <ul className="space-y-2 text-left text-sm">
                <li><FaCheck /> Python Basics</li>
                <li><FaCheck /> AI Basics</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 🔥 HERO 4 */}
      <section className="h-screen flex items-center justify-center bg-gray-100 px-6">
        <div className="max-w-5xl text-center">

          <h1 className="text-4xl font-bold mb-6 text-blue-900">
            Learn From Experts
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Our courses are designed by industry professionals.
          </p>

          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            Knowledge that builds careers.
          </h2>

        </div>
      </section>

    </div>
  );
}

export default Home; 