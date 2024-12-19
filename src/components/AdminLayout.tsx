import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, ClipboardList, Database, DollarSign, UserCircle, ChevronDown, HeadsetIcon, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: Users, label: "Members", to: "/admin/members" },
  { icon: UserCheck, label: "Collectors", to: "/admin/collectors" },
  { icon: ClipboardList, label: "Registrations", to: "/admin/registrations" },
  { icon: Database, label: "Database", to: "/admin/database" },
  { icon: DollarSign, label: "Finance", to: "/admin/finance" },
  { icon: HeadsetIcon, label: "Support Tickets", to: "/admin/support" },
  { icon: UserCircle, label: "Profile", to: "/admin/profile" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef(Date.now());

  // Update last activity timestamp on any user interaction
  useEffect(() => {
    const updateLastActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);

    return () => {
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
    };
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!session && location.pathname !== '/login') {
        navigate("/login");
        return false;
      }
      
      return !!session;
    } catch (error) {
      console.error('Session check error:', error);
      toast({
        title: "Authentication Error",
        description: "Please try logging in again",
        variant: "destructive",
      });
      navigate("/login");
      return false;
    }
  }, [navigate, toast, location.pathname]);

  useEffect(() => {
    let isActive = true;

    const initializeAuth = async () => {
      if (!isActive) return;
      
      setLoading(true);
      const hasSession = await checkSession();
      if (isActive) {
        setIsLoggedIn(hasSession);
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isActive) return;
      
      console.log("Auth state changed:", event);
      setIsLoggedIn(!!session);
      
      if (!session && location.pathname !== '/login') {
        navigate("/login");
      }
    });

    // Set up controlled query refresh interval with inactivity check
    const setupQueryRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      refreshIntervalRef.current = setInterval(() => {
        const inactiveTime = Date.now() - lastActivityRef.current;
        // Only refresh if user has been active in the last 5 minutes
        if (inactiveTime < 5 * 60 * 1000) {
          queryClient.invalidateQueries({ 
            predicate: (query) => !query.queryKey.includes('static')
          });
        }
      }, 30000);
    };

    if (isLoggedIn) {
      setupQueryRefresh();
    }

    // Cleanup function
    return () => {
      isActive = false;
      subscription.unsubscribe();
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [navigate, queryClient, location.pathname, isLoggedIn, checkSession]);

  const handleNavigation = useCallback((path: string) => {
    if (location.pathname !== path) {
      queryClient.cancelQueries();
      navigate(path);
    }
  }, [location.pathname, navigate, queryClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="w-full justify-between h-12 hover:bg-primary/90 transition-colors my-2"
              >
                <span className="font-semibold">Menu</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-[calc(1400px-4rem)]">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.to}
                  onClick={() => handleNavigation(item.to)}
                  className="flex items-center gap-3 cursor-pointer py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 text-base"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <main className="flex-1">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}