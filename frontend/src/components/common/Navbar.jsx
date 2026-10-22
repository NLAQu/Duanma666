import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useCart } from "../../store/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl tracking-tight">
          Lumina
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-blush" : "hover:text-blush")}>
            Cửa hàng
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative ${isActive ? "text-blush" : "hover:text-blush"}`
            }
          >
            Giỏ hàng
            {count > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-ink px-1.5 text-[10px] text-white">
                {count}
              </span>
            )}
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "text-blush" : "hover:text-blush")}
            >
              Admin
            </NavLink>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-full border border-ink/20 px-3 py-1.5 hover:bg-ink hover:text-white"
            >
              {user.name}
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-ink px-4 py-1.5 text-white hover:bg-blush"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
