import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MemberCard } from "@/components/members/MemberCard";
import { MembersHeader } from "@/components/members/MembersHeader";
import { MembersSearch } from "@/components/members/MembersSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoveredMembersOverview } from "@/components/members/CoveredMembersOverview";
import { MembersPagination } from "@/components/members/MembersPagination";
import { useMembers } from "@/hooks/use-members";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 20;

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useMembers(page, searchTerm);

  const handleUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['members'] });
  }, [queryClient]);

  const toggleMember = useCallback((id: string) => {
    setExpandedMember(prev => prev === id ? null : id);
  }, []);

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  if (error) {
    console.error('Members component error:', error);
    return (
      <div className="space-y-6">
        <MembersHeader />
        <div className="text-center text-red-500 py-4">
          Failed to load members. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MembersHeader />
      <MembersSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        isLoading={isLoading}
      />
      
      {data?.members && (
        <>
          <div className="text-sm text-muted-foreground mb-2">
            Total Members: {data.totalCount}
          </div>
          <CoveredMembersOverview members={data.members} />
        </>
      )}

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading members...</div>
            </div>
          ) : !data?.members ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">No data available</div>
            </div>
          ) : data.members.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">
                {searchTerm ? "No members found matching your search" : "No members found"}
              </div>
            </div>
          ) : (
            <>
              {data.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  expandedMember={expandedMember}
                  editingNotes={editingNotes}
                  toggleMember={toggleMember}
                  setEditingNotes={setEditingNotes}
                  onUpdate={handleUpdate}
                />
              ))}
              
              <MembersPagination 
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}