import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatWidget from "./components/ChatWidget";
import EnrolledStudentDetail from "./components/EnrolledStudentDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import Info from "./Pages/Admin/Info";
import PricingManager from "./Pages/Admin/PricingManager";

import Home from "./Pages/Home/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Courses from "./Pages/Courses";
import Enroll from "./Pages/Enroll";
import CourseDivision from "./Dropdown/CourseDivision";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:categorySlug" element={<CourseDivision />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enroll" element={<Enroll />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/enrollments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EnrolledStudentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <Info />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pricing"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PricingManager />
                </ProtectedRoute>
              }
            />
          </Routes>

        </div>

        <Footer />
        <ChatWidget />
      </div>

    </BrowserRouter>
  );
}

export default App;
