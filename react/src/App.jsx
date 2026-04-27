import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Footer from "./components/Footer";
import Contact from "./Pages/contact";
function App() {
  const [Page, setPage] = useState("Home");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Navbar setPage={setPage} />

  
      <div style={{ flex: 1, marginTop: "60px" }}>
        {Page === "Home" && <Home />}
        {Page === "About" && <About />}
        {Page === "Contact" && <Contact />}
      </div>

      <Footer />
    </div>
  );
}

export default App;