import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import React from "react";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful 🎉");
    }

    setLoading(false);
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-black px-4">
  <form
    onSubmit={handleSignup}
    className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center"
  >
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
      Sign Up
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
      {loading ? "Creating..." : "Sign Up"}
    </button>

    <p className="mt-4 text-gray-500 text-sm text-center">
      Already have an account?{" "}
      <Link to="/login" className="text-purple-600 hover:underline">
        Login
      </Link>
    </p>
  </form>
</div>
  );
};

export default Signup;
