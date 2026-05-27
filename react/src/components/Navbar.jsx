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
  FaUserShield,
  FaUserGraduate,
  FaTrophy,
  FaEnvelopeOpenText,
  FaHistory,
  FaTicketAlt,
  FaTags,
  FaBriefcase
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";


function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [categories, setCategories] = useState([]);


  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://company-site-jrbr.onrender.com/categories");
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
          className="flex items-center gap-3 md:gap-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-800 p-2 md:p-3.5 rounded-xl md:rounded-2xl shadow-lg">
              <img src="/logo.webp" alt="logo" className="h-10 w-auto md:h-12 md:w-25" />
            </div>

            <a
              href="https://g-tec-nagercoil.vercel.app/courses/it-non-technical"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-xs text-gray-600 mt-1 hover:text-blue-600"
            >
              www.g-tec-nagercoil.com
            </a>
          </div>

          <div className="text-gray-700 text-base md:text-xl font-medium flex items-center gap-1 md:gap-2">
            <IoLocationSharp className="text-[#ed1c25] shrink-0" />
            <span className="whitespace-nowrap">Azhagiyamandapam</span>
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                location.pathname.startsWith("/courses")
                  ? "text-blue-600 bg-blue-50/50"
                  : "hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <span className="font-semibold" onClick={() => navigate("/courses")}>Courses</span>
              <FaChevronDown className={`text-[10px] transition-transform duration-300 ${openCourses ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {openCourses && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 top-full pt-3 z-50"
                >
                  <div className="bg-gray-900 text-white p-2 rounded-[1.5rem] w-80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-800 backdrop-blur-xl">
                    <div className="p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 px-2">Program Categories</p>
                      <div className="space-y-1">
                        {categories.map(cat => (
                          <div
                            key={cat.id}
                            onClick={() => { navigate(`/courses/${cat.slug}`); setOpenCourses(false); }}
                            className="group flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer hover:bg-blue-600 text-gray-300 hover:text-white"
                          >
                            <div className="text-sm text-gray-500 group-hover:text-white transition-transform group-hover:scale-110">
                              <FaTags />
                            </div>
                            <span className="text-xs font-bold">{cat.name}</span>
                          </div>
                        ))}
                        {categories.length === 0 && (
                          <div className="p-3 text-gray-500 italic text-xs">No categories available yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          {isAuthenticated && (user?.user?.role === "admin" || user?.user?.role === "staff") && (
            <li
              className="relative cursor-pointer flex items-center"
              onMouseEnter={() => setOpenAdmin(true)}
              onMouseLeave={() => setOpenAdmin(false)}
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  location.pathname.startsWith("/admin")
                    ? "text-blue-600 bg-blue-50/50"
                    : "hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaUserShield className="text-sm" />
                <span className="font-semibold">
                  {user?.user?.role === "admin" ? "Admin Panel" : "Staff Panel"}
                </span>
                <FaChevronDown className={`text-[10px] transition-transform duration-300 ${openAdmin ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {openAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
                  >
                    <div className="bg-gray-900 text-white p-2 rounded-[1.5rem] w-80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-800 backdrop-blur-xl">
                      
                      {user?.user?.role === "admin" ? (
                        <>
                          {/* FULL ADMIN VIEW */}
                          <div className="p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 px-2">Records & Results</p>
                            <div className="space-y-1">
                              <AdminLink 
                                icon={<FaUserGraduate />} 
                                label="Student Enrollments" 
                                path="/admin/enrollments" 
                                active={location.pathname === "/admin/enrollments"}
                                onClick={() => { navigate("/admin/enrollments"); setOpenAdmin(false); }}
                              />
                              <AdminLink 
                                icon={<FaTrophy />} 
                                label="Scholarship Results" 
                                path="/admin/game-scores" 
                                active={location.pathname === "/admin/game-scores"}
                                onClick={() => { navigate("/admin/game-scores"); setOpenAdmin(false); }}
                              />
                            </div>
                          </div>

                          <div className="h-px bg-gray-800 mx-4" />

                          <div className="p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 px-2">Communications</p>
                            <div className="space-y-1">
                              <AdminLink 
                                icon={<FaEnvelopeOpenText />} 
                                label="Inbox Inquiries" 
                                path="/admin/contacts" 
                                active={location.pathname === "/admin/contacts"}
                                onClick={() => { navigate("/admin/contacts"); setOpenAdmin(false); }}
                              />
                              <AdminLink 
                                icon={<FaBriefcase />} 
                                label="Professional Emails" 
                                path="/admin/contacts/professional" 
                                active={location.pathname === "/admin/contacts/professional"}
                                onClick={() => { navigate("/admin/contacts/professional"); setOpenAdmin(false); }}
                              />
                              <AdminLink 
                                icon={<FaHistory />} 
                                label="Archived Inquiries" 
                                path="/admin/contacts/archived" 
                                active={location.pathname === "/admin/contacts/archived"}
                                onClick={() => { navigate("/admin/contacts/archived"); setOpenAdmin(false); }}
                              />
                            </div>
                          </div>

                          <div className="h-px bg-gray-800 mx-4" />

                          <div className="p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 px-2">Tools & Pricing</p>
                            <div className="space-y-1">
                              <AdminLink 
                                icon={<FaTicketAlt />} 
                                label="Verify Coupon" 
                                path="/admin/coupon-decoder" 
                                active={location.pathname === "/admin/coupon-decoder"}
                                onClick={() => { navigate("/admin/coupon-decoder"); setOpenAdmin(false); }}
                              />
                              <AdminLink 
                                icon={<FaTags />} 
                                label="Course Management" 
                                path="/admin/pricing" 
                                active={location.pathname === "/admin/pricing"}
                                onClick={() => { navigate("/admin/pricing"); setOpenAdmin(false); }}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        /* STAFF ONLY VIEW */
                        <div className="p-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 px-2">Inquiry Portal</p>
                          <div className="space-y-1">
                            <AdminLink 
                              icon={<FaEnvelopeOpenText />} 
                              label="Inbox Inquiries" 
                              path="/admin/contacts" 
                              active={location.pathname === "/admin/contacts"}
                              onClick={() => { navigate("/admin/contacts"); setOpenAdmin(false); }}
                            />
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
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
            className="md:hidden absolute top-full left-0 w-full bg-white px-6 py-4 space-y-4 shadow-xl max-h-[calc(100vh-70px)] overflow-y-auto border-t border-gray-100"
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
            {isAuthenticated && (user?.user?.role === "admin" || user?.user?.role === "staff") && (
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
              >
                <div
                  onClick={() => setOpenAdmin(!openAdmin)}
                  className="flex justify-between items-center cursor-pointer hover:text-blue-700 font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <FaUserShield size={16} />
                    {user?.user?.role === "admin" ? "Admin Panel" : "Staff Panel"}
                  </div>
                  <motion.span
                    animate={{ rotate: openAdmin ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FaChevronDown size={12} />
                  </motion.span>
                </div>

                <AnimatePresence>
                  {openAdmin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden pl-6 mt-3 space-y-4 border-l-2 border-slate-100 ml-2"
                    >
                      {user?.user?.role === "admin" ? (
                        <>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Records</p>
                            <div onClick={() => handleMobileNavigate("/admin/enrollments")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Student Enrollments</div>
                            <div onClick={() => handleMobileNavigate("/admin/game-scores")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Scholarship Results</div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Messages</p>
                            <div onClick={() => handleMobileNavigate("/admin/contacts")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Inbox Inquiries</div>
                            <div onClick={() => handleMobileNavigate("/admin/contacts/professional")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Professional Emails</div>
                            <div onClick={() => handleMobileNavigate("/admin/contacts/archived")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Archived Inquiries</div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tools</p>
                            <div onClick={() => handleMobileNavigate("/admin/coupon-decoder")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Verify Coupon</div>
                            <div onClick={() => handleMobileNavigate("/admin/pricing")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Course Management</div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry Portal</p>
                          <div onClick={() => handleMobileNavigate("/admin/contacts")} className="text-sm py-1 hover:text-blue-600 cursor-pointer">Inbox Inquiries</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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

function AdminLink({ icon, label, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
          : "hover:bg-blue-600 text-gray-300 hover:text-white"
      }`}
    >
      <div className={`text-sm transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
}


export default Navbar;

