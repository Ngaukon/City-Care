import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          disabled={loading} // disabled while loading
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
              wrapperClass=""
            />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
