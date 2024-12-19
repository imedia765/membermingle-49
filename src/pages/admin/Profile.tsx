import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PasswordChangeForm } from "@/components/auth/PasswordChangeForm";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { SupportSection } from "@/components/profile/SupportSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");

  // Check authentication and get user email
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          navigate("/login");
          return;
        }
        
        console.log("Session found:", session);
        setUserEmail(session.user.email);
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Fetch member profile data
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['member-profile', userEmail],
    enabled: !!userEmail && isLoggedIn,
    queryFn: async () => {
      console.log('Fetching profile for email:', userEmail);
      
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          collectors (
            name,
            prefix,
            number
          )
        `)
        .eq('email', userEmail)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      console.log('Found profile:', data);
      return data;
    },
  });

  if (!isLoggedIn) {
    return null;
  }

  if (memberLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Member Profile
      </h1>

      {memberData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Number</p>
                <p className="text-lg font-semibold">{memberData.member_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Collector</p>
                <p className="text-lg font-semibold">
                  {memberData.collectors?.name || 'No collector assigned'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <PasswordChangeForm />
        
        {memberData && (
          <>
            <PaymentHistorySection 
              memberId={memberData.id}
              searchDate={searchDate}
              searchAmount={searchAmount}
              onSearchDateChange={setSearchDate}
              onSearchAmountChange={setSearchAmount}
            />
            <SupportSection />
          </>
        )}
      </div>
    </div>
  );
}