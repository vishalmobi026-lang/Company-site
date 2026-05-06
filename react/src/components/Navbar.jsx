import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleMobileNavigate = (path) => {
    navigate(path);
    setMobileMenu(false);
    setOpenCourses(false);
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* 🔵 TOP BAR */}
      <div className="relative bg-[#030c2a] text-white text-sm px-10 py-4 justify-between items-center hidden md:flex overflow-hidden">
        {/* 🔥 GRID */}
        <div
          className="absolute inset-0 opacity-20 
          bg-[linear-gradient(#1e293b_1px,transparent_1px),linear-gradient(90deg,#1e293b_1px,transparent_1px)] 
          bg-[size:40px_40px]"
        ></div>

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
        <div
          className="flex items-center gap-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-800 p-3.5 rounded-2xl shadow-lg">
              <img src="/logo.webp" alt="logo" className="h-12 w-25" />
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
        <ul className="absolute left-1/2 transform -translate-x-[55%] items-center gap-8 hidden md:flex">
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
                  <div
                    onClick={() => navigate("/courses/technical")}
                    className="p-3 hover:bg-gray-800 rounded"
                  >
                    IT / Technical
                  </div>
                  <div
                    onClick={() => navigate("/courses/non-technical")}
                    className="p-3 hover:bg-gray-800 rounded"
                  >
                    Non Technical
                  </div>
                  <div
                    onClick={() => navigate("/courses/designing")}
                    className="p-3 hover:bg-gray-800 rounded"
                  >
                    Designing
                  </div>
                  <div
                    onClick={() => navigate("/courses/accounting")}
                    className="p-3 hover:bg-gray-800 rounded"
                  >
                    Accounting
                  </div>
                  <div
                    onClick={() => navigate("/courses/civil")}
                    className="p-3 hover:bg-gray-800 rounded"
                  >
                    Civil
                  </div>
                </div>
              </div>
            )}
          </li>

          {isAuthenticated && (
            <>
              <li
                onClick={() => navigate("/admin/enrollments")}
                className={`cursor-pointer ${location.pathname === "/admin/enrollments" ? "text-blue-600" : "hover:text-blue-600"}`}
              >
                Enrollments
              </li>
              <li
                onClick={() => navigate("/admin/contacts")}
                className={`cursor-pointer ${location.pathname === "/admin/contacts" ? "text-blue-600" : "hover:text-blue-600"}`}
              >
                Messages
              </li>
              <li
                onClick={() => navigate("/admin/pricing")}
                className={`cursor-pointer ${location.pathname === "/admin/pricing" ? "text-blue-600" : "hover:text-blue-600"}`}
              >
                Pricing Manager
              </li>
            </>
          )}

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
          {isAuthenticated ? (
            <span
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="cursor-pointer hover:text-blue-600"
            >
              Logout
            </span>
          ) : (
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:text-blue-600"
            >
              Login
            </span>
          )}

          <button
            onClick={() => navigate("/enroll")}
            className="bg-gradient-to-r from-blue-900 to-blue-500 text-white px-5 py-2 rounded-full hover:from-blue-500 hover:to-cyan-500"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* MOBILE MENU WITH MOTION */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="md:hidden bg-white px-6 py-4 space-y-4 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              onClick={() => handleMobileNavigate("/")}
              className="hover:cursor-pointer hover:text-blue-600"
            >
              Home
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <div
                onClick={() => setOpenCourses(!openCourses)}
                className="flex justify-between cursor-pointer hover:text-blue-700"
              >
                Courses
                <motion.span
                  animate={{ rotate: openCourses ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FaChevronDown />
                </motion.span>
              </div>

              <AnimatePresence>
                {openCourses && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden pl-3 mt-2 space-y-2 cursor-pointer text-sm "

                  >
                    <div className="cursor-pointer hover:text-blue-700" onClick={() => handleMobileNavigate("/courses/technical")}>
                      IT / Technical
                    </div>
                    <div className="cursor-pointer hover:text-blue-700" onClick={() => handleMobileNavigate("/courses/non-technical")}>
                      Non Technical
                    </div>
                    <div className="cursor-pointer hover:text-blue-700" onClick={() => handleMobileNavigate("/courses/designing")}>
                      Designing
                    </div>
                    <div className="cursor-pointer hover:text-blue-700" onClick={() => handleMobileNavigate("/courses/accounting")}>
                      Accounting
                    </div>
                    <div className="cursor-pointer hover:text-blue-700" onClick={() => handleMobileNavigate("/courses/civil")}>
                      Civil
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {isAuthenticated && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                  onClick={() => handleMobileNavigate("/admin/enrollments")}
                  className="hover:cursor-pointer hover:text-blue-600"
                >
                  Enrollments
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.13 }}
                  onClick={() => handleMobileNavigate("/admin/contacts")}
                  className="hover:cursor-pointer hover:text-blue-600"
                >
                  Messages
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.14 }}
                  onClick={() => handleMobileNavigate("/admin/pricing")}
                  className="hover:cursor-pointer hover:text-blue-600"
                >
                  Pricing Manager
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              onClick={() => handleMobileNavigate("/about")}
               className="hover:cursor-pointer hover:text-blue-600"
            >
              About us
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              onClick={() => handleMobileNavigate("/contact")}
               className="hover:cursor-pointer hover:text-blue-600"
            >
              Contact us
            </motion.div>

            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                onClick={() => {
                  logout();
                  handleMobileNavigate("/");
                }}
                className="hover:cursor-pointer hover:text-blue-600"
              >
                Logout
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                onClick={() => handleMobileNavigate("/login")}
                className="hover:cursor-pointer hover:text-blue-600"
              >
                Login
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMobileNavigate("/enroll")}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-500  text-white py-2 rounded-full"
            >
              Enroll Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
