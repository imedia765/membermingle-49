import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";

interface MembersData {
  members: Member[];
  totalCount: number;
}

export const useMembers = (page: number, searchTerm: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['members', page, searchTerm],
    queryFn: async (): Promise<MembersData> => {
      console.log('Starting members fetch...', { page, searchTerm });
      
      try {
        // First get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }

        if (!user) {
          throw new Error('No authenticated user found');
        }

        console.log('Current user:', user.id);

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking profile:', profileError);
          throw profileError;
        }

        // If no profile exists, create one
        if (!existingProfile) {
          console.log('Creating new profile for user');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              role: 'admin', // Default role for testing
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
        }

        // Now fetch members
        let query = supabase
          .from('members')
          .select('*', { count: 'exact' });

        // Apply search filter if searchTerm exists
        if (searchTerm) {
          query = query.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%`);
        }

        // Apply pagination
        const from = page * 20;
        const to = from + 19;
        
        const { data: members, error: queryError, count } = await query
          .range(from, to)
          .order('created_at', { ascending: false });
        
        if (queryError) {
          console.error('Error fetching members:', queryError);
          throw queryError;
        }
        
        console.log('Query completed. Members found:', members?.length);
        console.log('Total count:', count);
        
        return {
          members: members?.map(member => ({
            ...member,
            name: member.full_name
          })) || [],
          totalCount: count || 0
        };
      } catch (error) {
        console.error('Error in useMembers:', error);
        throw error;
      }
    },
    meta: {
      errorMessage: "Failed to load members"
    },
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
    refetchOnWindowFocus: false // Prevent unnecessary refetches
  });
};