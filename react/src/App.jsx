import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Courses from "./Pages/Courses";
import Enroll from "./Pages/Enroll";

// DROPDOWN
import Technical from "./Dropdown/Technical";
import NonTechnical from "./Dropdown/NonTechnical";
import Designing from "./Dropdown/Designing";
import Accounting from "./Dropdown/Accounting";
import Civil from "./Dropdown/Civil";

function App() {
  return (
    <BrowserRouter>

      {/* ✅ SCROLL FIX */}
      <ScrollToTop />

      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/technical" element={<Technical />} />
            <Route path="/courses/non-technical" element={<NonTechnical />} />
            <Route path="/courses/designing" element={<Designing />} />
            <Route path="/courses/accounting" element={<Accounting />} />
            <Route path="/courses/civil" element={<Civil />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enroll" element={<Enroll />} />
          </Routes>
        </div>

        {/* FOOTER */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;