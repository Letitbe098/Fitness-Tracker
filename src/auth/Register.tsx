import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // TODO: Replace with API call (POST /api/auth/register)
    setMessage("✅ Registered successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?fitness,gym')" }}>
      <div className="bg-white/90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
        {message && <p className="mb-4 text-center text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="text-gray-500 mr-2" />
            <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="flex-1 outline-none" required />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail className="text-gray-500 mr-2" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="flex-1 outline-none" required />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="text-gray-500 mr-2" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="flex-1 outline-none" required />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="text-gray-500 mr-2" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="flex-1 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
