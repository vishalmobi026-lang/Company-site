import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full sticky top-0 z-50">
{/* 🔵 TOP BAR */}
<div className="relative bg-[#030c2a] text-white text-sm px-10 py-4 flex justify-between items-center hidden md:flex overflow-hidden">

  {/* 🔥 GRID */}
  <div className="absolute inset-0 opacity-20 
    bg-[linear-gradient(#1e293b_1px,transparent_1px),linear-gradient(90deg,#1e293b_1px,transparent_1px)] 
    bg-[size:40px_40px]">
  </div>

  {/* 🔥 CONTENT */}
  <div className="relative z-10 flex justify-between w-full">

    <div className="flex gap-12 items-center">
      <span className="flex items-center gap-2">
        <FaPhoneAlt /> +91 75980 98675
      </span>

      <span className="w-px h-4 bg-gray-500"></span>

      <span className="flex items-center gap-2">
        <FaEnvelope /> azhagiyamandapam.tn@gteceducation.com
      </span>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-gray-300">Follow us:</span>
      <FaInstagram className="hover:text-pink-400 cursor-pointer" />
      <FaFacebookF className="hover:text-blue-400 cursor-pointer" />
      <FaLinkedinIn className="hover:text-cyan-400 cursor-pointer" />
    </div>

  </div>
</div>
      {/* ⚪ MAIN NAVBAR */}
      <div className="bg-white shadow-md px-6 py-1 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-6 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex flex-col items-center">
            <div className="bg-blue-800 p-3.5 rounded-2xl shadow-lg">
              <img src="/logo.webp" alt="logo" className="h-12" />
            </div>

            <a
              href="https://www.gtech-Nagercoil.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 mt-1 hover:text-blue-600"
            >
              www.gtech-Nagercoil.com
            </a>
          </div>

          <div className="text-gray-700 text-xl font-medium">
            Azhagiyamandapam
          </div>
        </div>

        {/* MOBILE ICON */}
        <div className="md:hidden">
          {mobileMenu ? (
            <FaTimes onClick={() => setMobileMenu(false)} />
          ) : (
            <FaBars onClick={() => setMobileMenu(true)} />
          )}
        </div>

        {/* CENTER MENU */}
        <ul className="absolute left-1/2 transform -translate-x-[55%] flex items-center gap-8 hidden md:flex">

          {/* COURSES */}
          <li
            className="relative cursor-pointer flex items-center"
            onMouseEnter={() => setOpenCourses(true)}
            onMouseLeave={() => setOpenCourses(false)}
          >
            <div
              onClick={() => navigate("/courses")}
              className={`flex items-center gap-1 ${
                location.pathname === "/courses"
                  ? "text-blue-600"
                  : "hover:text-blue-600"
              }`}
            >
              Courses <FaChevronDown />
            </div>

            {openCourses && (
              <div className="absolute left-0 top-full pt-3 z-50">
                <div className="bg-gray-900 text-white p-5 rounded-2xl w-80 space-y-3">
                  <div onClick={() => navigate("/courses/technical")} className="p-3 hover:bg-gray-800 rounded">IT / Technical</div>
                  <div onClick={() => navigate("/courses/non-technical")} className="p-3 hover:bg-gray-800 rounded">Non Technical</div>
                  <div onClick={() => navigate("/courses/designing")} className="p-3 hover:bg-gray-800 rounded">Designing</div>
                  <div onClick={() => navigate("/courses/accounting")} className="p-3 hover:bg-gray-800 rounded">Accounting</div>
                  <div onClick={() => navigate("/courses/civil")} className="p-3 hover:bg-gray-800 rounded">Civil</div>
                </div>
              </div>
            )}
          </li>

          {/* ABOUT */}
          <li
            onClick={() => navigate("/about")}
            className={`cursor-pointer ${
              location.pathname === "/about"
                ? "text-blue-600"
                : "hover:text-blue-600"
            }`}
          >
            About us
          </li>

          {/* CONTACT */}
          <li
            onClick={() => navigate("/contact")}
            className={`cursor-pointer ${
              location.pathname === "/contact"
                ? "text-blue-600"
                : "hover:text-blue-600"
            }`}
          >
            Contact us
          </li>
        </ul>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-4">
          <span onClick={() => navigate("/login")} className="cursor-pointer hover:text-blue-600">
            Login
          </span>

          <button
            onClick={() => navigate("/enroll")}
            className="bg-blue-500 text-white px-6 py-2 rounded-full"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white px-6 py-4 space-y-4">
          <div onClick={() => navigate("/")}>Home</div>

          <div>
            <div onClick={() => setOpenCourses(!openCourses)} className="flex justify-between">
              Courses <FaChevronDown />
            </div>

            {openCourses && (
              <div className="pl-3 mt-2 space-y-2">
                <div onClick={() => navigate("/courses/technical")}>IT / Technical</div>
                <div onClick={() => navigate("/courses/non-technical")}>Non Technical</div>
                <div onClick={() => navigate("/courses/designing")}>Designing</div>
                <div onClick={() => navigate("/courses/accounting")}>Accounting</div>
                <div onClick={() => navigate("/courses/civil")}>Civil</div>
              </div>
            )}
          </div>

          <div onClick={() => navigate("/about")}>About us</div>
          <div onClick={() => navigate("/contact")}>Contact us</div>
          <div onClick={() => navigate("/login")}>Login</div>

          <button
            onClick={() => navigate("/enroll")}
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