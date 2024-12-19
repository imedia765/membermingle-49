import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useProfile() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const createProfile = async (userId: string, email: string | undefined) => {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (checkError) {
        console.error("Profile check error:", checkError);
        return null;
      }

      // If profile exists, don't try to create it again
      if (existingProfile) {
        return existingProfile;
      }

      const { data: profile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'member',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error("Profile creation error:", createError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error("Profile creation failed:", error);
      return null;
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return;
      }

      if (profileData) {
        setUserRole(profileData.role);
      }
      
      return profileData;
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  return {
    userRole,
    setUserRole,
    createProfile,
    fetchUserRole
  };
}