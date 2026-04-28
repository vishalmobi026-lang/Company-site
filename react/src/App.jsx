import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Footer from "./components/Footer";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Courses from "./Pages/Courses";

// ✅ IMPORT DROPDOWN PAGES
import Technical from "./Dropdown/Technical";
import NonTechnical from "./Dropdown/NonTechnical";
import Designing from "./Dropdown/Designing";
import Accounting from "./Dropdown/Accounting";
import Civil from "./Dropdown/Civil";

function App() {
  const [Page, setPage] = useState("Home");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      {/* ✅ PASS Page also */}
      <Navbar setPage={setPage} Page={Page} />

      {/* ❌ removed marginTop (since navbar is sticky) */}
      <div style={{ flex: 1 }}>
        {Page === "Home" && <Home />}
        {Page === "Courses" && <Courses />}
        {Page === "It/Technical" && <Technical />}
        {Page === "NonTechnical" && <NonTechnical />}
        {Page === "Designing" && <Designing />}
        {Page === "Accounting" && <Accounting />}
        {Page === "Civil" && <Civil />}
        {Page === "Contact" && <Contact />}
        {Page === "About" && <About />}
        {Page === "Login" && <Login />}
      </div>

      {/* ✅ FOOTER CONTROL */}
      {(Page === "Home" ||
        Page === "About" ||
        Page === "Contact" ||
        Page === "Courses") && <Footer />}
    </div>
  );
}

export default App;