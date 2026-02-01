import { useState } from "react";
import { Link} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
 

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔹 client-side validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      await login(form);          // AuthContext → authService → backend
    
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
        <h1 className="text-slate-900 text-center text-3xl font-bold tracking-tight">
          Sign in
        </h1>
        <p className="text-slate-500 text-center text-sm mt-2">
          Welcome back 👋 Please enter your details
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="text-slate-700 text-sm font-medium mb-1.5 block">
              User email
            </label>

            <div className="relative">
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

             
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-700 text-sm font-medium mb-1.5 block">
              Password
            </label>

            <div className="relative ">
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

             
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-semibold tracking-wide rounded-lg text-white
              bg-blue-600 hover:bg-blue-700 active:bg-blue-800
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Link */}
          <p className="text-slate-600 text-sm text-center pt-2">
            Don&apos;t have an account?
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline ml-1 font-semibold"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
);

}

export default Login;
