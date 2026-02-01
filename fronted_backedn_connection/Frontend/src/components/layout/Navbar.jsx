import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null; // hide navbar when not authenticated

  return (
    <nav className="w-full bg-gray-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: App name / logo */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide"
        >
          MyApp
        </Link>

        {/* Center: Navigation links */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-3 py-1.5 rounded text-gray-300 hover:text-white hover:bg-gray-700 text-sm"
          >
            Home
          </Link>
          <Link
            to="/ai-assistance"
            className="px-3 py-1.5 rounded text-gray-300 hover:text-white hover:bg-gray-700 text-sm font-medium"
          >
            AI Assistance
          </Link>
        </div>

        {/* Right: User info + Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium">
              {user.name}
            </span>
            <span className="text-xs text-gray-300">
              {user.email}
            </span>
          </div>

          <button
            onClick={logout}   // 🔥 pure action, no navigation, no logic
            className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
