import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      // 🔑 NORMALIZE AUTH OBJECT
      login({
        role: data.role,
        user_id: data.user_id,          // student only
        display_id: username,           // faculty/admin identity
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">SmartCampus 🎓</h1>
          <p className="text-lg opacity-90">
            AI-Driven University Assistant
          </p>
          <p className="text-sm opacity-80">
            Secure access to academic insights and intelligent campus services.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-base-200">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login to SmartCampus
          </p>

          {error && (
            <div className="alert alert-error text-sm mb-4">
              {error}
            </div>
          )}

          <input
            className="input input-bordered w-full mb-4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="input input-bordered w-full mb-6"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-xs text-center text-gray-400 mt-6">
            © 2026 SmartCampus
          </p>
        </div>
      </div>
    </div>
  );
}
