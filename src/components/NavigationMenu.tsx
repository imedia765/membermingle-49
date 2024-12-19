import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { RoleBadge } from "./navigation/RoleBadge";
import { useProfile } from "@/hooks/useProfile";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";
import { useNavigate } from "react-router-dom";

export function NavigationMenu() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, setUserRole, createProfile, fetchUserRole } = useProfile();

  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        return false;
      }
      return !!session;
    } catch (error) {
      console.error("Session check failed:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const initializeAuth = async () => {
      const hasSession = await checkSession();
      if (!isActive) return;
      
      setIsLoggedIn(hasSession);
      
      if (hasSession) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const profileData = await fetchUserRole(session.user.id);
          
          if (!profileData) {
            const newProfile = await createProfile(session.user.id, session.user.email);
            if (newProfile) {
              setUserRole('member');
            }
          }
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isActive) return;
      
      console.log("Auth state changed:", event, !!session);
      
      if (event === "SIGNED_IN" && session) {
        setIsLoggedIn(true);
        
        const profileData = await fetchUserRole(session.user.id);
        
        if (!profileData) {
          const newProfile = await createProfile(session.user.id, session.user.email);
          if (newProfile) {
            setUserRole('member');
          }
        }
        
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [toast, createProfile, fetchUserRole, setUserRole, checkSession]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUserRole(null);
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              PWA Burton
            </span>
          </Link>
          <RoleBadge role={userRole} isLoggedIn={isLoggedIn} />
        </div>

        <DesktopNav 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
        />
        
        <MobileNav 
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          open={open}
          setOpen={setOpen}
          handleNavigation={handleNavigation}
        />
      </div>
    </nav>
  );
}