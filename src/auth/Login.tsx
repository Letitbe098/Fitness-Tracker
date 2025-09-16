import { useState } from "react";
import { Mail, Lock } from "lucide-react";

interface LoginProps {
  onLogin: (username: string) => void;
  onTabChange: (tab: string) => void;
}

export default function Login({ onLogin, onTabChange }: LoginProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with API call (POST /api/auth/login)
    if (form.email === "test@example.com" && form.password === "123456") {
      setMessage("✅ Login successful!");
      onLogin("TestUser"); // example username from login
      onTabChange("profile"); // redirect to profile page
    } else {
      setMessage("❌ Invalid credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?workout,gym')" }}
    >
      <div className="bg-white/90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        {message && <p className="mb-4 text-center text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="flex-1 outline-none"
              required
            />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="flex-1 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => onTabChange("register")}
            className="text-green-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
