import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Logged in successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-2xl shadow-lg w-96"
  >
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
      Welcome Back 👋
    </h2>

    {/* Email */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
      />
    </div>

    {/* Password */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Password
      </label>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
      />
    </div>

    {/* Button */}
    <button
      type="submit"
      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
    >
      Login
    </button>

    {/* Footer */}
    <p className="text-center text-sm text-gray-500 mt-4">
      Don’t have an account?{" "}
      <a href="/register" className="text-green-500 hover:underline">
        Sign up
      </a>
    </p>
  </form>
</div>

  );
}
