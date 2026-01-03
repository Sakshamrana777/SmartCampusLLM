import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ChatWidget from "./ChatWidget";

export default function Layout({ children }) {
  const { auth, logout } = useContext(AuthContext);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">SmartCampus 🎓</h2>

        <ul className="space-y-2">
          {auth?.role === "student" && (
            <li className="font-medium">Student Dashboard</li>
          )}
          {auth?.role === "faculty" && (
            <li className="font-medium">Faculty Dashboard</li>
          )}
          {auth?.role === "admin" && (
            <li className="font-medium">Admin Dashboard</li>
          )}
        </ul>

        <button
          onClick={logout}
          className="btn btn-sm btn-outline mt-6"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        {children}

        {/* 🤖 FLOATING CHAT BUTTON */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-lg"
        >
          🤖
        </button>

        {/* 🤖 CHAT PANEL */}
        {chatOpen && (
          <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">SmartCampus Assistant</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="btn btn-sm btn-ghost"
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
