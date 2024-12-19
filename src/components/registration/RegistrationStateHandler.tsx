import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  memberId?: string;
  prefilledData?: {
    fullName: string;
    address: string;
    town: string;
    postCode: string;
    mobile: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    email: string;
  };
}

export const RegistrationStateHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.memberId) {
      return;
    }

    const checkMemberProfile = async () => {
      const { data: member, error } = await supabase
        .from('members')
        .select('profile_updated')
        .eq('member_number', state.memberId)
        .maybeSingle();

      if (error) {
        console.error("Error checking member profile:", error);
        return;
      }

      if (member?.profile_updated) {
        toast({
          title: "Profile Already Updated",
          description: "Your profile is already complete. Redirecting to dashboard...",
        });
        navigate('/admin');
      }
    };

    checkMemberProfile();
  }, [state?.memberId, navigate, toast]);

  return null;
};