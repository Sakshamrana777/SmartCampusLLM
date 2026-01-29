import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import ChatWidget from "./ChatWidget";

// Lucide Icons
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  LogOut,
  MessageCircle,
  Sun,
  Moon,
} from "lucide-react";

export default function Layout({ children }) {
  const { auth, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">

      {/* ============================
          FIXED PREMIUM SIDEBAR
      ============================ */}
      <aside
        className="w-64 fixed left-0 top-0 h-full bg-card border-r 
                   shadow-lg z-40 flex flex-col p-6 transition-colors"
      >
        {/* Branding + Horizontal Toggle */}
        <div className="flex items-center justify-between mb-10">

          {/* Branding */}
          <div className="flex items-center gap-3">
            <GraduationCap size={32} className="text-indigo-600" />
            <h2 className="text-2xl font-bold tracking-tight">SmartCampus</h2>
          </div>

          {/* 🌙 THEME TOGGLE – RIGHT SIDE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={20} className="text-gray-700" />
            ) : (
              <Sun size={20} className="text-yellow-300" />
            )}
          </button>
        </div>

        {/* ============================
            MENU
        ============================ */}
        <nav className="space-y-3 flex-1">
          {auth?.role === "student" && (
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                            hover:bg-indigo-50 dark:hover:bg-indigo-900 transition">
              <LayoutDashboard size={20} className="text-indigo-600" />
              <span className="font-medium">Student Dashboard</span>
            </div>
          )}

          {auth?.role === "faculty" && (
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                            hover:bg-indigo-50 dark:hover:bg-indigo-900 transition">
              <Users size={20} className="text-indigo-600" />
              <span className="font-medium">Faculty Dashboard</span>
            </div>
          )}

          {auth?.role === "admin" && (
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                            hover:bg-indigo-50 dark:hover:bg-indigo-900 transition">
              <Users size={20} className="text-indigo-600" />
              <span className="font-medium">Admin Dashboard</span>
            </div>
          )}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-2 p-3 mt-auto text-gray-700 dark:text-gray-300
                     hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 
                     dark:hover:text-red-300 transition rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ============================
          MAIN CONTENT AREA
      ============================ */}
      <main className="flex-1 ml-64 p-6 relative transition-colors">
        {children}

        {/* CHAT BUTTON */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700
                     text-white p-4 rounded-full shadow-xl transition"
        >
          <MessageCircle size={24} />
        </button>

        {/* CHAT PANEL */}
        {chatOpen && (
          <div className="fixed top-0 right-0 h-full w-1/2 bg-card shadow-xl z-50 flex flex-col transition-colors">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">SmartCampus Assistant</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            <ChatWidget />
          </div>
        )}
      </main>
    </div>
  );
}
