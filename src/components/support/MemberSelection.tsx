import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Member } from "@/components/members/types";
import { supabase } from "@/integrations/supabase/client";

interface MemberSelectionProps {
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
}

export function MemberSelection({ selectedMembers, setSelectedMembers }: MemberSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollector, setSelectedCollector] = useState<string>("all");

  // Fetch members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      return data as Member[];
    },
  });

  // Fetch collectors
  const { data: collectors = [] } = useQuery({
    queryKey: ['collectors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collectors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching collectors:', error);
        throw error;
      }
      return data;
    },
  });

  // Filter members based on search and collector
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.member_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollector = selectedCollector === "all" || member.collector_id === selectedCollector;
    return matchesSearch && matchesCollector;
  });

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={selectedCollector}
            onValueChange={setSelectedCollector}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by collector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collectors</SelectItem>
              {collectors.map((collector) => (
                <SelectItem key={collector.id} value={collector.id}>
                  {collector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="selectAll"
          checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="selectAll">Select All Members ({filteredMembers.length})</Label>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {isLoadingMembers ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No members found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <Checkbox
                  id={member.id}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                />
                <Label htmlFor={member.id} className="flex-1">
                  <div className="flex justify-between items-center">
                    <span>{member.full_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {member.member_number}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}