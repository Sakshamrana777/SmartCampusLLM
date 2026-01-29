import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { loginUser } from "../api";

import { Eye, EyeOff, GraduationCap, Sun, Moon } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake] = useState(false);

  const passwordRef = useRef(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password.");
      triggerShake();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      login({
        role: data.role,
        user_id: data.user_id,
        department: data.department,
        display_id: data.display_id,
      });

    } catch (err) {
      setError("Invalid username or password.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">

      {/* 🌗 THEME TOGGLE BUTTON (top right) */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full shadow-lg 
                   bg-card border hover:bg-muted transition"
      >
        {theme === "light" ? (
          <Moon size={22} className="text-foreground" />
        ) : (
          <Sun size={22} className="text-yellow-400" />
        )}
      </button>

      {/* LEFT BRANDING */}
      <div className="hidden lg:flex w-1/2 
                      bg-gradient-to-br from-indigo-600 to-purple-700
                      text-white items-center justify-center px-12 animate-fade-in">
        <div className="max-w-md text-center space-y-6">

          <div className="flex justify-center mb-4 transform hover:scale-110 transition-all duration-500">
            <GraduationCap size={70} className="drop-shadow-2xl" />
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
            SmartCampus
          </h1>

          <p className="text-lg opacity-90">AI-Powered University Assistant</p>

          <p className="text-sm opacity-80">
            Intelligent insights for students, faculty, and administrators.
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div
          className={`w-full max-w-md bg-card backdrop-blur-xl border border-border 
                      rounded-2xl shadow-2xl p-10 transition-all duration-500
                      ${shake ? "animate-shake" : "animate-scale-in"}`}
        >

          <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
            Welcome Back
          </h2>

          <p className="text-center text-muted-foreground mb-8">
            Sign in to SmartCampus
          </p>

          {error && (
            <div className="alert alert-error text-sm mb-4 shadow-lg">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <input
            className="input input-bordered w-full mb-4 bg-background text-foreground
                       border-border focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-300 transition"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username) {
                passwordRef.current.focus();
              }
            }}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              ref={passwordRef}
              type={showPass ? "text" : "password"}
              className="input input-bordered w-full mb-6 bg-background text-foreground
                         border-border pr-12 focus:border-indigo-500 
                         focus:ring-2 focus:ring-indigo-300 transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && username && password) {
                  handleLogin();
                }
              }}
            />

            {/* EYE ICON */}
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 
                         text-muted-foreground hover:text-foreground"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className={`btn btn-primary w-full mt-2 py-3 text-md font-medium 
                        shadow-md hover:shadow-lg active:scale-95 transition 
                        ${loading ? "loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* FOOTER */}
          <p className="text-xs text-center text-muted-foreground mt-8">
            © 2026 SmartCampus • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
