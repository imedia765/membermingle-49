import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { useNavigate } from "react-router-dom";

interface DesktopNavProps {
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
}

export const DesktopNav = ({ isLoggedIn, handleLogout }: DesktopNavProps) => {
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Desktop logout error:", error);
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-2">
      {isLoggedIn ? (
        <Button variant="outline" size="sm" onClick={onLogoutClick}>
          Logout
        </Button>
      ) : (
        <Link to="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      )}
      <Link to="/register">
        <Button variant="default" size="sm">
          Register
        </Button>
      </Link>
      {isLoggedIn && (
        <Link to="/admin">
          <Button variant="outline" size="sm">
            Admin Panel
          </Button>
        </Link>
      )}
      <ThemeToggle />
    </div>
  );
};