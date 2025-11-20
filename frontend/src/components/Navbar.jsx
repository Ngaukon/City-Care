import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png"; // adjust the path to your logo

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo + Text */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="CityCare Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-blue-600">CityCare</span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/create")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Report Issue
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
