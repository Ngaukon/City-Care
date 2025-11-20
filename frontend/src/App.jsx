import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroCard from "./components/Hero";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import { Toaster } from "react-hot-toast";

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">

      <Toaster position="top-right" />
      <Navbar />

      {/* Only show hero on home */}
      {location.pathname === "/" && <HeroCard />}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow container mx-auto px-4 py-6 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<SinglePost />} />
        </Routes>
      </main>

      {/* FOOTER ALWAYS AT BOTTOM */}
      <Footer />
    </div>
  );
}
