import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className="border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={loading} // disabled when loading
        >
          {loading ? (
            <RotatingLines
              visible={true}
              height="24"
              width="24"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass="flex items-center justify-center"
            />
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
}
