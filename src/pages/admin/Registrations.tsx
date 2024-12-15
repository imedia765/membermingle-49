import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { RegistrationCard } from "@/components/registration/RegistrationCard";
import { RegistrationsHeader } from "@/components/registration/RegistrationsHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Registrations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      console.log('Fetching registrations...');
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          status,
          created_at,
          members (
            id,
            full_name,
            email,
            phone,
            address,
            town,
            postcode,
            date_of_birth,
            gender,
            marital_status,
            family_members (
              id,
              name,
              date_of_birth,
              gender,
              relationship
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        toast({
          title: "Error fetching registrations",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched registrations:', data);
      return data.map(reg => ({
        id: reg.id,
        name: reg.members?.full_name || 'Unknown',
        status: reg.status || 'Pending',
        date: new Date(reg.created_at).toLocaleDateString(),
        email: reg.members?.email || '',
        contact: reg.members?.phone || '',
        address: reg.members?.address || '',
        personalInfo: {
          fullName: reg.members?.full_name || '',
          address: reg.members?.address || '',
          town: reg.members?.town || '',
          postCode: reg.members?.postcode || '',
          email: reg.members?.email || '',
          mobile: reg.members?.phone || '',
          dateOfBirth: reg.members?.date_of_birth || '',
          gender: reg.members?.gender || '',
          maritalStatus: reg.members?.marital_status || '',
        },
        dependants: reg.members?.family_members?.map(fm => ({
          name: fm.name,
          dateOfBirth: fm.date_of_birth,
          gender: fm.gender,
          category: fm.relationship
        })) || []
      }));
    },
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredRegistrations = registrations?.filter(registration =>
    registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <RegistrationsHeader />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RegistrationsHeader />

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search registrations..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {filteredRegistrations?.map((registration) => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
              isOpen={openItems.includes(registration.id)}
              onToggle={() => toggleItem(registration.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}