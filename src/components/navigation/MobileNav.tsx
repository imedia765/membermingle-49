import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

interface MobileNavProps {
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleNavigation: (path: string) => void;
}

export const MobileNav = ({ 
  isLoggedIn, 
  handleLogout, 
  open, 
  setOpen, 
  handleNavigation 
}: MobileNavProps) => {
  const onLogoutClick = async () => {
    try {
      await handleLogout();
      setOpen(false);
    } catch (error) {
      console.error("Mobile logout error:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2 md:hidden">
      <ThemeToggle />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] sm:w-[385px] p-0">
          <div className="flex flex-col gap-4 p-6">
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Menu
            </div>
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="justify-start bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                onClick={onLogoutClick}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                className="justify-start bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
            )}
            <Button
              variant="outline"
              className="justify-start bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              onClick={() => handleNavigation("/register")}
            >
              Register
            </Button>
            {isLoggedIn && (
              <Button
                variant="outline"
                className="justify-start bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                onClick={() => handleNavigation("/admin")}
              >
                Admin Panel
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};