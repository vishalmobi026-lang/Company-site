import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Footer() {
  const contactItems = [
    {
      icon: <FaPhoneAlt />,
      label: "Call us any time",
      value: "+91 75980 98675",
      href: "tel:+917598098675",
    },
    {
      icon: <FaEnvelope />,
      label: "Email us",
      value: "azhagiyamandapam.tn@gteceducation.com",
      href: "mailto:azhagiyamandapam.tn@gteceducation.com",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Location",
      value: "NIYAS ARCADE, Opp. Of Mosque, Azhagiyamandapam.",
      href: "https://maps.google.com/?q=G-Tec+Computer+Education+Azhagiyamandapam",
    },
  ];

  const quickLinks = [
    { label: "Courses", path: "/courses" },
    { label: "About us", path: "/about" },
    { label: "Contact us", path: "/contact" },
    { label: "Enroll Now", path: "/enroll" },
  ];

  const socials = [
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaLinkedinIn />, href: "#" },
    { icon: <FaXTwitter />, href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white px-4 sm:px-6 py-12 sm:py-16">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] bg-blue-500/20 blur-3xl rounded-full top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-cyan-400/20 blur-3xl rounded-full bottom-[-120px] right-[-120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_0.7fr] gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Get in Touch
            </h2>

            <p className="text-gray-400 mb-6 sm:mb-8 max-w-md text-sm sm:text-base leading-relaxed">
              Reach out to our team for course details, admission support, and career guidance.
            </p>

            <div className="space-y-4 sm:space-y-5">
              {contactItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Location" ? "_blank" : undefined}
                  rel={item.label === "Location" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  whileHover={{ x: 6, scale: 1.01 }}
                  className="flex items-start gap-3 sm:gap-4 rounded-2xl border border-slate-800 bg-white/5 p-4 sm:p-5 backdrop-blur transition hover:border-cyan-400/50"
                >
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {item.label}
                    </p>
                    <p className="font-semibold text-white text-sm sm:text-base break-words">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-white/5 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
              <img
                src="/logo.webp"
                alt="G-TEC"
                className="h-14 sm:h-16 mb-5 object-contain"
              />

              <h3 className="text-xl sm:text-2xl font-bold mb-3">
                G-TEC Computer Education
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
                G-TEC empowers students with practical skills and global exposure,
                preparing them for successful careers in IT, finance, business,
                and emerging technologies.
              </p>

              <h4 className="font-semibold mb-4 text-cyan-200">
                Follow us on
              </h4>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socials.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    whileHover={{ y: -5, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-white transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-slate-950"
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  <span className="text-cyan-200 font-bold uppercase tracking-wider text-[10px]">Official Website</span>
                  <br />
                  If you want to know more about G-TEC, please visit{" "}
                  <a 
                    href="https://www.gteceducation.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium underline underline-offset-4"
                  >
                    www.gteceducation.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 text-cyan-200">
              Quick Links
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-white/5 px-4 py-3 text-gray-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
                >
                  <span>{link.label}</span>
                  <FaArrowRight className="text-sm transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
              <p className="text-sm text-gray-300">Training Location</p>
              <h4 className="mt-1 text-lg font-bold text-cyan-200">
                Azhagiyamandapam
              </h4>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Practical courses, mentor support, and career-focused learning.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-slate-800 mt-10 sm:mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-gray-400 text-xs sm:text-sm text-center md:text-left">
          <p>© 2026 G-TEC Education | All Rights Reserved</p>
          <p className="text-cyan-300">Built for career-ready learners</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
