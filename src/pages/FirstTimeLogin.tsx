import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FirstTimeLoginForm } from "@/components/auth/FirstTimeLoginForm";
import { handleFirstTimeAuth } from "@/utils/firstTimeAuthHandler";

export default function FirstTimeLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstTimeLogin = async (memberId: string, password: string) => {
    setIsLoading(true);
    try {
      await handleFirstTimeAuth(memberId, password);
      
      toast({
        title: "Login successful",
        description: "Welcome! Please update your profile information.",
      });
      navigate('/profile');
    } catch (error) {
      console.error("First time login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid Member ID or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">First Time Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FirstTimeLoginForm 
            onSubmit={handleFirstTimeLogin}
            isLoading={isLoading}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Already updated your password?
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Back to Regular Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}