import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  // Hide login/register links on their respective pages
  const hideAuthLinks = location.pathname === "/login" || location.pathname === "/register";

  return (
    <footer className="w-full bg-gray-900 text-gray-300 mt-10">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT SIDE — BRAND */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} SDG Helper. All Rights Reserved.
        </p>

        {/* RIGHT SIDE — LINKS */}
        <div className="flex gap-6 text-sm">
          {!hideAuthLinks && (
            <>
              <Link className="hover:text-white transition" to="/login">
                Login
              </Link>
              <Link className="hover:text-white transition" to="/register">
                Register
              </Link>
            </>
          )}

          <Link className="hover:text-white transition" to="/">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}