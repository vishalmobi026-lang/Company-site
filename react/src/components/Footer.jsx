import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b inline-block">
            Get in Touch
          </h2>

          <div className="space-y-6 mt-6">

            {/* PHONE */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-full">
                <FaPhoneAlt />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Call us any time:</p>
                <a
                  href="tel:+917598098675"
                  className="font-semibold text-lg hover:text-blue-400"
                >
                  +91 75980 98675
                </a>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-full">
                <FaEnvelope />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email us:</p>
                <a
                  href="mailto:azhagiyamandapam.tn@gteceducation.com"
                  className="font-semibold hover:text-blue-400"
                >
                  azhagiyamandapam.tn@gteceducation.com
                </a>
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-full">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location:</p>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-blue-400"
                >
                  NIYAS ARCADE, Opp. Of Mosque,<br />
                  Azhagiyamandapam.
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center">
          <div className="max-w-md">

            <img
              src="/logo.webp"
              alt="G-TEC"
              className="h-16 mb-4 object-contain"
            />

            <h3 className="text-xl font-bold mb-3">
              G-TEC Computer Education
            </h3>

            <p className="text-gray-400 mb-6">
              G-TEC empowers students with practical skills and global exposure,
              preparing them for successful careers in IT, finance, business,
              and emerging technologies.
            </p>

            <h4 className="font-semibold mb-3">FOLLOW US ON:</h4>

            {/* SOCIAL LINKS */}
            <div className="flex gap-4">

              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaInstagram />
              </a>

              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaFacebookF />
              </a>

              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaLinkedinIn />
              </a>

              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaXTwitter />
              </a>

            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
        © 2026 G-TEC Education | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;