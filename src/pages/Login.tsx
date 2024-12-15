import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("Login component mounted - checking session");
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Session check result:", { session, error });
      if (session) {
        console.log("Active session found, redirecting to admin");
        navigate("/admin");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", { event, session });
      if (event === "SIGNED_IN" && session) {
        console.log("Sign in event detected, redirecting to admin");
        navigate("/admin");
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email login attempt started");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Attempting email login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Email login response:", { data, error });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Email login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    }
  };

  const handleMemberIdSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Member ID login attempt started");
    const formData = new FormData(e.currentTarget);
    const memberId = formData.get("memberId") as string;
    const password = formData.get("memberPassword") as string;

    try {
      // First, look up the member's email using their member ID
      console.log("Looking up member with ID:", memberId);
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('email')
        .eq('member_number', memberId)
        .single();

      console.log("Member lookup result:", { memberData, memberError });

      if (memberError || !memberData?.email) {
        throw new Error("Member ID not found");
      }

      // Then sign in with the found email and provided password
      console.log("Attempting login with member's email");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: memberData.email,
        password,
      });

      console.log("Member ID login response:", { data, error });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("Member ID login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid member ID or password",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Google login attempt started");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });

      console.log("Google login response:", { data, error });

      if (error) throw error;
      
      // The redirect will happen automatically, but we'll show a loading toast
      toast({
        title: "Redirecting to Google",
        description: "Please wait while we redirect you to Google sign-in...",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during Google login",
        variant: "destructive",
      });
    }
  };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            toast({
                title: "Logged out",
                description: "You have been logged out successfully.",
            });
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast({
                title: "Logout failed",
                description: error instanceof Error ? error.message : "An error occurred during logout",
                variant: "destructive",
            });
        }
    };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
        {isLoggedIn ? (
            <Button onClick={handleLogout} className="w-full">
                Logout
            </Button>
        ) : (
            <>
          <Button 
            variant="outline" 
            className="w-full mb-6 h-12 text-lg bg-white hover:bg-gray-50 border-2 shadow-sm text-gray-700 font-medium" 
            onClick={handleGoogleLogin}
          >
            <Icons.google className="mr-2 h-5 w-5 [&>path]:fill-[#4285F4]" />
            Continue with Google
          </Button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="memberId">Member ID</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login with Email
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="memberId">
              <form onSubmit={handleMemberIdSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="memberId"
                    name="memberId"
                    type="text"
                    placeholder="Member ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="memberPassword"
                    name="memberPassword"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login with Member ID
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
          </>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
