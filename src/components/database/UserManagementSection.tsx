import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSearch } from "./UserSearch";
import { UserList } from "./UserList";

interface Profile {
  id: string;
  email: string | null;
  role: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export function UserManagementSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const [updating, setUpdating] = useState<string | null>(null);

  const { data: users, refetch } = useQuery({
    queryKey: ['profiles', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        // Only search email with ilike, and only match role if it exactly matches one of the valid roles
        if (['member', 'collector', 'admin'].includes(searchTerm.toLowerCase())) {
          query = query.or(`email.ilike.%${searchTerm}%,role.eq.${searchTerm.toLowerCase()}`);
        } else {
          // If search term isn't a valid role, only search in email
          query = query.ilike('email', `%${searchTerm}%`);
        }
      }

      const { data: profiles, error } = await query;

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      return profiles as Profile[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <UserSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          {users?.length ? (
            <UserList 
              users={users}
              onUpdate={refetch}
              updating={updating}
              setUpdating={setUpdating}
            />
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No users found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}