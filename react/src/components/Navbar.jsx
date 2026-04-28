import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaChevronDown,
  FaBars,
  FaTimes
} from "react-icons/fa";

function Navbar({ setPage, Page, openCourses, setOpenCourses }) {

  // ✅ ADDED STATE FOR MOBILE MENU
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="w-full sticky top-0 z-50">

      {/* 🔵 TOP BAR */}
      <div className="bg-blue-900 text-white text-sm px-10 py-4 flex justify-between items-center hidden md:flex">
        <div className="flex gap-12 items-center">
          <span className="flex items-center gap-2">
            <FaPhoneAlt /> +91 75980 98675
          </span>

          <span className="w-px h-4 bg-gray-400"></span>

          <span className="flex items-center gap-2">
            <FaEnvelope /> azhagiyamandapam.tn@gteceducation.com
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>Follow us:</span>
          <FaInstagram className="cursor-pointer" />
          <FaFacebookF className="cursor-pointer" />
          <FaLinkedinIn className="cursor-pointer" />
        </div>
      </div>

      {/* ⚪ MAIN NAVBAR */}
      <div className="bg-white shadow-md px-6 py-1 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6" onClick={() => setPage("Home")}>
          <div className="flex flex-col items-center cursor-pointer">
            <div className="bg-blue-800 p-3.5 rounded-2xl shadow-lg w-38 flex justify-center">
              <img src="/logo.webp" alt="logo" className="h-12 object-contain" />
            </div>

            <a
              href="https://www.gteceducation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-48 text-center text-xs text-gray-600 mt-1 leading-none block hover:text-blue-600"
            >
              www.gteceducation.com
            </a>
          </div>

          <div className="text-gray-700 text-xl font-medium whitespace-nowrap mt-4 -ml-8">
            Azhagiyamandapam
          </div>
        </div>

        {/* ✅ HAMBURGER ICON (ONLY MOBILE) */}
        <div className="md:hidden">
          {mobileMenu ? (
            <FaTimes size={22} onClick={() => setMobileMenu(false)} />
          ) : (
            <FaBars size={22} onClick={() => setMobileMenu(true)} />
          )}
        </div>

        {/* CENTER MENU */}
        <ul className="absolute left-1/2 transform -translate-x-[55%] flex items-center gap-8 font-medium hidden md:flex">

          {/* COURSES */}
          <li
            className="relative cursor-pointer flex items-center"
            onMouseEnter={() => setOpenCourses(true)}
            onMouseLeave={() => setOpenCourses(false)}
          >
            <div
              onClick={() => setPage("Courses")}
              className={`flex items-center gap-1 transition ${
                Page === "Courses" ? "text-blue-600" : "hover:text-blue-600"
              }`}
            >
              Courses <FaChevronDown className="text-xs mt-[2px]" />
            </div>

            {/*  DROPDOWN */}
            {openCourses && (
              <div className="absolute left-0 top-full pt-3 z-50">
                <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-2xl w-80 space-y-3">

                  <div
                    onClick={() => {
                      setPage("It/Technical");
                      setOpenCourses(false);
                    }}
                    className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                  >
                    <h3 className="font-semibold text-sm">IT / Technical</h3>
                    <p className="text-xs text-gray-400">Learn programming, development & IT skills</p>
                  </div>

                  <div
                    onClick={() => {
                      setPage("NonTechnical");
                      setOpenCourses(false);
                    }}
                    className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                  >
                    <h3 className="font-semibold text-sm">Non Technical</h3>
                    <p className="text-xs text-gray-400">Business, management & soft skills</p>
                  </div>

                  <div
                    onClick={() => {
                      setPage("Designing");
                      setOpenCourses(false);
                    }}
                    className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                  >
                    <h3 className="font-semibold text-sm">Designing</h3>
                    <p className="text-xs text-gray-400">UI/UX, graphic & creative design</p>
                  </div>

                  <div
                    onClick={() => {
                      setPage("Accounting");
                      setOpenCourses(false);
                    }}
                    className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                  >
                    <h3 className="font-semibold text-sm">Accounting</h3>
                    <p className="text-xs text-gray-400">Finance, Tally & business accounting</p>
                  </div>

                  <div
                    onClick={() => {
                      setPage("Civil");
                      setOpenCourses(false);
                    }}
                    className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                  >
                    <h3 className="font-semibold text-sm">Civil</h3>
                    <p className="text-xs text-gray-400">Construction & engineering skills</p>
                  </div>

                </div>
              </div>
            )}
          </li>

          {/* ABOUT */}
          <li
            onClick={() => setPage("About")}
            className={`cursor-pointer transition ${
              Page === "About" ? "text-blue-600" : "hover:text-blue-600"
            }`}
          >
            About us
          </li>

          {/* CONTACT */}
          <li
            onClick={() => setPage("Contact")}
            className={`cursor-pointer transition ${
              Page === "Contact" ? "text-blue-600" : "hover:text-blue-600"
            }`}
          >
            Contact us
          </li>

        </ul>

        {/* RIGHT */}
        <div className="flex items-center gap-4 hidden md:flex">
          <span
            onClick={() => setPage("Login")}
            className={`cursor-pointer font-semibold transition ${
              Page === "Login" ? "text-blue-600" : "hover:text-blue-600"
            }`}
          >
            Login
          </span>

          <button
            onClick={() => setPage("Enroll")}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Enroll Now
          </button>
        </div>

      </div>

      {/* ✅ MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">

          <div onClick={() => setPage("Home")}>Home</div>

          <div>
            <div
              onClick={() => setOpenCourses(!openCourses)}
              className="flex justify-between items-center"
            >
              Courses
              <FaChevronDown className={`${openCourses ? "rotate-180" : ""}`} />
            </div>

            {openCourses && (
              <div className="pl-3 mt-2 space-y-2">
                <div onClick={() => setPage("It/Technical")}>IT / Technical</div>
                <div onClick={() => setPage("NonTechnical")}>Non Technical</div>
                <div onClick={() => setPage("Designing")}>Designing</div>
                <div onClick={() => setPage("Accounting")}>Accounting</div>
                <div onClick={() => setPage("Civil")}>Civil</div>
              </div>
            )}
          </div>

          <div onClick={() => setPage("About")}>About us</div>
          <div onClick={() => setPage("Contact")}>Contact us</div>
          <div onClick={() => setPage("Login")}>Login</div>

          <button
            onClick={() => setPage("Enroll")}
            className="w-full bg-blue-500 text-white py-2 rounded-full"
          >
            Enroll Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;