import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom"; // <-- import useNavigate
import React from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // ✅ Redirect to dashboard automatically
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-black px-4">
  <form
    onSubmit={handleLogin}
    className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center"
  >
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
      Login
    </h2>

    <input
      type="email"
      placeholder="Email"
      className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-purple-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full border border-gray-300 p-3 mb-6 rounded-lg focus:ring-2 focus:ring-purple-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
    >
      {loading ? "Logging in..." : "Login"}
    </button>

    <p className="mt-4 text-gray-500 text-sm text-center">
      Don’t have an account?{" "}
      <Link to="/signup" className="text-purple-600 hover:underline">
        Sign Up
      </Link>
    </p>
  </form>
</div>

  );
};

export default Login;
