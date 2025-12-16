import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks/useAuthStore";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const logout = useAuthStore((s) => s.logout);

  const hideSidebar = location.pathname === "/" || location.pathname === "/choose-plan";
  if (hideSidebar) return null;

  const handleLogin = () => {
    openAuthModal("/for-you");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link to="/for-you" className="sidebar-item">For You</Link>

        <Link to="/library" className="sidebar-item">My Library</Link>

        <div className="sidebar-item sidebar-disabled">Highlights</div>
        <div className="sidebar-item sidebar-disabled">Search</div>

        <Link to="/settings" className="sidebar-item">Settings</Link>

        <div className="sidebar-item sidebar-disabled">Help & Support</div>

        {user ? (
          <button className="sidebar-auth-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="sidebar-auth-btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </nav>
    </aside>
  );
}
