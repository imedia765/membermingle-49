import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { DocumentsSection } from "@/components/profile/DocumentsSection";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { SupportSection } from "@/components/profile/SupportSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check authentication and get user email
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserEmail(session.user.email);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserEmail(session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch member profile data
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['member-profile', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      console.log('Fetching profile for email:', userEmail);
      
      const { data, error } = await supabase
        .from('members')
        .select('*, family_members(*)')
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

      if (!data) {
        console.log('No profile found for email:', userEmail);
        toast({
          title: "Profile not found",
          description: "No member profile found for this email address.",
          variant: "destructive",
        });
        return null;
      }

      console.log('Found profile:', data);
      return data;
    },
  });

  // Mock document types (this could be moved to a constants file)
  const documentTypes = [
    { type: 'Identification', description: 'Valid ID document (Passport, Driving License)' },
    { type: 'Address Proof', description: 'Recent utility bill or bank statement' },
    { type: 'Medical Certificate', description: 'Recent medical certificate if applicable' },
    { type: 'Marriage Certificate', description: 'Marriage certificate if applicable' },
  ];

  // Mock documents (you might want to add a documents table to Supabase later)
  const documents = [
    { name: 'ID Document.pdf', uploadDate: '2024-03-01', type: 'Identification' },
    { name: 'Proof of Address.pdf', uploadDate: '2024-02-15', type: 'Address Proof' },
  ];

  if (memberLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Member Profile
      </h1>

      <div className="space-y-6">
        <AccountSettingsSection memberData={memberData} />
        <DocumentsSection 
          documents={documents}
          documentTypes={documentTypes}
        />
        <PaymentHistorySection 
          memberId={memberData?.id || ''}
          searchDate={searchDate}
          searchAmount={searchAmount}
          onSearchDateChange={setSearchDate}
          onSearchAmountChange={setSearchAmount}
        />
        <SupportSection />
      </div>
    </div>
  );
}