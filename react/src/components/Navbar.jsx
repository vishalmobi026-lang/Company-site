
import "./navbar.css";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    
} from "react-icons/fa";

function Navbar({ setPage }) {
    return (
        <div className="nav-container bg-blue-900">

            {/* 🔵 TOP BAR */}
            <div className="topbar">
                <div className="left">
                    <span className="item">
                        <FaPhoneAlt /> +91 75980 98675
                    </span>

                    <span className="divider"></span>

                    <span className="item">
                        <FaEnvelope /> azhagiyamandapam.tn@gteceducation.com
                    </span>
                </div>

                <div className="right">
                    <span>Follow us:</span>
                    <FaInstagram />
                    <FaFacebookF />
                    <FaLinkedinIn />
                </div>
            </div>

            {/* ⚪ MAIN NAVBAR */}
            <div className="mainnav bg-blue-600">

                {/* LOGO */}
                <div className="logo bg-blue-600 p-5 rounded-2xl" onClick={() => setPage("Home")}>
                    <img src="/logo.webp" alt="logo" />
                </div>

                {/* MENU */}
                <ul className="menu">
                
                    <li className="dropdown">
                        <span onClick={() => setPage("Course")}>Courses</span>
                        <ul className="dropdown-menu">
                            <li onClick={() => setPage("It/Technical")}>It/Technical</li>
                            <li onClick={() => setPage("NonTechnical")}>Non Technical</li>
                            <li onClick={() => setPage("Designing")}>Designing</li>
                            <li onClick={() => setPage("Accounting")}>Accounting</li>
                            <li onClick={() => setPage("Civil")}>Civil</li>
                        </ul>
                    </li>
                            <li onClick={() => setPage("About")}>About us</li>
                    <li onClick={() => setPage("Contact")}>Contact us</li>
                    <li onClick={() => setPage("About")}><button className="bg-blue-500 py-2 px-1 rounded-full">Login</button></li>
                     <li onClick={() => setPage("Enrollement")}>Enroll</li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;