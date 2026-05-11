import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  const [openMessages, setOpenMessages] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleMobileNavigate = (path) => {
    navigate(path);
    setMobileMenu(false);
    setOpenCourses(false);
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* ... (keep top bar as is) ... */}
      <div className="relative bg-[#030c2a] text-white text-sm px-10 py-4 justify-between items-center hidden md:flex overflow-hidden">
        {/*  GRID */}
        <div
          className="absolute inset-0 opacity-20 
          bg-[linear-gradient(#1e293b_1px,transparent_1px),linear-gradient(90deg,#1e293b_1px,transparent_1px)] 
          bg-[size:40px_40px]"
        ></div>

        {/*  CONTENT */}
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
              className={`flex items-center gap-1 ${location.pathname === "/courses"
                  ? "text-blue-600"
                  : "hover:text-blue-600"
                }`}
            >
              Courses <FaChevronDown />
            </div>

            {openCourses && (
              <div className="absolute left-0 top-full pt-3 z-50">
                <div className="bg-gray-900 text-white p-5 rounded-2xl w-80 space-y-3 shadow-2xl">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => navigate(`/courses/${cat.slug}`)}
                      className="p-3 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-medium"
                    >
                      {cat.name}
                    </div>
                  ))}
                  {categories.length === 0 && <div className="p-3 text-gray-500 italic">No categories yet</div>}
                </div>
              </div>
            )}
          </li>

          {isAuthenticated && (
            <>
              {user?.user?.role === "admin" && (
                <li
                  onClick={() => navigate("/admin/enrollments")}
                  className={`cursor-pointer ${location.pathname === "/admin/enrollments" ? "text-blue-600" : "hover:text-blue-600"}`}
                >
                  Enrollments
                </li>
              )}
              {(user?.user?.role === "admin" || user?.user?.role === "staff") && (
                <li
                  className="relative cursor-pointer flex items-center"
                  onMouseEnter={() => user?.user?.role === "admin" && setOpenMessages(true)}
                  onMouseLeave={() => setOpenMessages(false)}
                >
                  <div
                    onClick={() => navigate("/admin/contacts")}
                    className={`flex items-center gap-1 ${location.pathname === "/admin/contacts"
                        ? "text-blue-600"
                        : "hover:text-blue-600"
                      }`}
                  >
                    Messages {user?.user?.role === "admin" && <FaChevronDown className="text-[10px]" />}
                  </div>

                  {openMessages && user?.user?.role === "admin" && (
                    <div className="absolute left-0 top-full pt-3 z-50">
                      <div className="bg-gray-900 text-white p-4 rounded-2xl w-64 space-y-2 shadow-2xl border border-gray-800">
                        <div
                          onClick={() => {
                            navigate("/admin/contacts/archived");
                            setOpenMessages(false);
                          }}
                          className={`p-3 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-medium flex items-center justify-between ${location.pathname === "/admin/contacts/archived" ? "text-blue-400 bg-gray-800" : ""}`}
                        >
                          Archived Inquiries
                          <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">Admin</span>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )}
              {user?.user?.role === "admin" && (
                <li
                  onClick={() => navigate("/admin/pricing")}
                  className={`cursor-pointer ${location.pathname === "/admin/pricing" ? "text-blue-600" : "hover:text-blue-600"}`}
                >
                  Management
                </li>
              )}
            </>
          )}

          {/* ABOUT */}
          <li
            onClick={() => navigate("/about")}
            className={`cursor-pointer ${location.pathname === "/about"
                ? "text-blue-600"
                : "hover:text-blue-600"
              }`}
          >
            About us
          </li>

          {/* CONTACT */}
          <li
            onClick={() => navigate("/contact")}
            className={`cursor-pointer ${location.pathname === "/contact"
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
                    {categories.map(cat => (
                      <div 
                        key={cat.id}
                        className="cursor-pointer hover:text-blue-700 py-1" 
                        onClick={() => handleMobileNavigate(`/courses/${cat.slug}`)}
                      >
                        {cat.name}
                      </div>
                    ))}
                    {categories.length === 0 && <div className="text-gray-400 italic">No categories</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {isAuthenticated && (
              <>
                {user?.user?.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 }}
                    onClick={() => handleMobileNavigate("/admin/enrollments")}
                    className="hover:cursor-pointer hover:text-blue-600"
                  >
                    Enrollments
                  </motion.div>
                )}
                {(user?.user?.role === "admin" || user?.user?.role === "staff") && (
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.13 }}
                  >
                    <div
                      onClick={() => user?.user?.role === "admin" ? setOpenMessages(!openMessages) : handleMobileNavigate("/admin/contacts")}
                      className="flex justify-between cursor-pointer hover:text-blue-700"
                    >
                      Messages
                      {user?.user?.role === "admin" && (
                        <motion.span
                          animate={{ rotate: openMessages ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <FaChevronDown />
                        </motion.span>
                      )}
                    </div>

                    <AnimatePresence>
                      {openMessages && user?.user?.role === "admin" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden pl-3 mt-2 space-y-2 cursor-pointer text-sm"
                        >
                          <div 
                            className="cursor-pointer hover:text-blue-700 py-1" 
                            onClick={() => handleMobileNavigate("/admin/contacts")}
                          >
                            Inbox Inquiries
                          </div>
                          <div 
                            className="cursor-pointer hover:text-blue-700 py-1 flex items-center justify-between" 
                            onClick={() => handleMobileNavigate("/admin/contacts/archived")}
                          >
                            Archived Inquiries
                            <span className="text-[9px] bg-blue-50 text-blue-500 px-1.5 rounded-md">Admin Only</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
                {user?.user?.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.14 }}
                    onClick={() => handleMobileNavigate("/admin/pricing")}
                    className="hover:cursor-pointer hover:text-blue-600"
                  >
                    Management
                  </motion.div>
                )}
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
