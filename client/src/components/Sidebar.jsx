import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const navItem = (to, label, pathname) => (
  <Link
    to={to}
    className={`block px-4 py-2 rounded-lg transition ${
      pathname === to ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {label}
  </Link>
);

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  return (
    <aside className="h-screen w-64 border-r bg-white p-4 flex flex-col gap-2">
      <div className="px-2 py-3">
        <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        <p className="text-xs text-gray-500">Stay on top of your work</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItem("/dashboard", "Dashboard", pathname)}
        {navItem("/dashboard", "Tasks Board", pathname)}
        {navItem("/create-task", "Create Task (soon)", pathname)}
        {navItem("/settings", "Settings (soon)", pathname)}
      </nav>

      <button
        onClick={logout}
        className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
      >
        Logout
      </button>
    </aside>
  );
}
