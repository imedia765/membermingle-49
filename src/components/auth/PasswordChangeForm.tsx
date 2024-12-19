import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProfileFormFields } from "./ProfileFormFields";
import { PasswordFields } from "./PasswordFields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const PasswordChangeForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        
        // First verify the session is valid
        const isValid = await checkSession();
        if (!isValid) {
          console.log("No valid session, redirecting to login");
          navigate("/login");
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user?.email) {
          console.error("Error fetching auth user:", userError);
          throw new Error(userError?.message || "No authenticated user found");
        }

        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('email', user.email)
          .single();

        if (memberError) {
          console.error("Member data fetch error:", memberError);
          throw memberError;
        }
        
        console.log("Fetched member data:", memberData);
        setUserData(memberData);
        setIsFirstTimeLogin(memberData.first_time_login || false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try logging in again.",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast, checkSession]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const requiredFields = [
      'fullName', 'email', 'phone', 'address', 'town', 
      'postcode', 'dob', 'gender', 'maritalStatus'
    ];

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields to complete your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Verify session is still valid before proceeding
      const isValid = await checkSession();
      if (!isValid) {
        console.log("Session expired during form submission");
        navigate("/login");
        return;
      }

      const updatedData = {
        full_name: String(formData.get('fullName') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        address: String(formData.get('address') || ''),
        town: String(formData.get('town') || ''),
        postcode: String(formData.get('postcode') || ''),
        date_of_birth: String(formData.get('dob') || ''),
        gender: String(formData.get('gender') || ''),
        marital_status: String(formData.get('maritalStatus') || ''),
        password_changed: true,
        profile_updated: true,
        first_time_login: false,
        profile_completed: true
      };

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) throw passwordError;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error("User session expired");
      }

      const { error: updateError } = await supabase
        .from('members')
        .update(updatedData)
        .eq('email', user.email);

      if (updateError) throw updateError;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      navigate("/admin");
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      {isFirstTimeLogin && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            Welcome! Please complete your profile information. All fields are required for first-time login.
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileFormFields 
          userData={userData} 
          isLoading={isLoading} 
          isRequired={isFirstTimeLogin}
        />
        <PasswordFields
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Card>
  );
};