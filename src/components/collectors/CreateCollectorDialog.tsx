import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function CreateCollectorDialog({ onUpdate }: { onUpdate: () => void }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth check error:', error);
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(!!session);
        if (!session) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      setIsAuthenticated(!!session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: members, isLoading } = useQuery({
    queryKey: ['unassigned-members'],
    queryFn: async () => {
      if (!isAuthenticated) {
        console.log('Not authenticated, skipping fetch');
        return [];
      }

      console.log('Fetching unassigned members...');
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .is('collector', null)
        .order('full_name');
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      console.log('Fetched members:', data);
      return data;
    },
    enabled: isAuthenticated, // Only run query when authenticated
  });

  const filteredMembers = members?.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.member_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateCollector = async (member: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create collectors",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      // Generate prefix from member name (first letters of each word)
      const prefix = member.full_name
        .split(/\s+/)
        .map((word: string) => word.charAt(0).toUpperCase())
        .join('');

      // Get the next available number for this prefix
      const { data: existingCollectors } = await supabase
        .from('collectors')
        .select('number')
        .ilike('prefix', prefix);

      const nextNumber = String(
        Math.max(0, ...existingCollectors?.map(c => parseInt(c.number)) || [0]) + 1
      ).padStart(2, '0');

      // Create the new collector
      const { error: createError } = await supabase
        .from('collectors')
        .insert({
          name: member.full_name,
          prefix,
          number: nextNumber,
          email: member.email,
          phone: member.phone,
          active: true
        });

      if (createError) throw createError;

      // Update the member's collector field
      const { error: updateError } = await supabase
        .from('members')
        .update({ 
          collector: member.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', member.id);

      if (updateError) throw updateError;

      toast({
        title: "Collector created",
        description: `${member.full_name} has been added as a collector.`
      });

      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating collector:', error);
      toast({
        title: "Error",
        description: "Failed to create collector",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="h-4 w-4" />
          Add New Collector
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Collector</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-4">
                  Loading members...
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No unassigned members found
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => handleCreateCollector(member)}
                  >
                    <div>
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.member_number}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Select
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}