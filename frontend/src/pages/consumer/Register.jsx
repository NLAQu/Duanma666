import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8">
      <h1 className="font-display text-3xl">Tạo tài khoản</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          placeholder="Họ tên"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
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
          minLength={6}
          placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
        {error && <p className="text-sm text-blush">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-ink py-3 text-white">
          Đăng ký
        </button>
      </form>
      <p className="mt-4 text-sm">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-blush underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
