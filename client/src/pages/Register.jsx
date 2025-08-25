import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registered successfully!");
      window.location.href = "/"; // redirect to dashboard/home
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-2xl flex flex-col gap-5 w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Register
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline font-medium">
            Login
          </a>
        </p>
      </form>
    </div>


  );
}
