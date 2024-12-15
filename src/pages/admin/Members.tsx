import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MemberCard } from "@/components/members/MemberCard";
import { MembersHeader } from "@/components/members/MembersHeader";
import { MembersSearch } from "@/components/members/MembersSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoveredMembersOverview } from "@/components/members/CoveredMembersOverview";
import type { Member } from "@/components/members/types";

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      console.log('Fetching members...');
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      // Map the full_name to name for CoveredMembersOverview compatibility
      const mappedData = data.map(member => ({
        ...member,
        name: member.full_name
      }));
      
      console.log('Fetched members:', mappedData);
      return mappedData;
    }
  });

  const filteredMembers = members?.filter(member => 
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.member_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleMember = (id: string) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <MembersHeader />
      <MembersSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {members && <CoveredMembersOverview members={members} />}

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading members...</div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">
                {searchTerm ? "No members found matching your search" : "No members found"}
              </div>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                expandedMember={expandedMember}
                editingNotes={editingNotes}
                toggleMember={toggleMember}
                setEditingNotes={setEditingNotes}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}