import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form);
      if (user.role === "admin" || user.role === "seller") {
        navigate("/admin");
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8">
      <h1 className="font-display text-3xl">Đăng nhập</h1>
      <p className="mt-2 text-sm text-ink/60">
        Admin thử: admin@gmail.com / 123456
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
        <input
          type="password"
          required
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
        {error && <p className="text-sm text-blush">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-ink py-3 text-white">
          Vào cửa hàng
        </button>
      </form>
      <p className="mt-4 text-sm">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blush underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
