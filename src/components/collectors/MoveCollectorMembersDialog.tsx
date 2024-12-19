import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberSelectionTable } from "./MemberSelectionTable";
import { CollectorSelect } from "./CollectorSelect";

interface MoveCollectorMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collector: { id: string; name: string };
  collectors: Array<{ id: string; name: string }>;
  onUpdate: () => void;
}

export function MoveCollectorMembersDialog({
  open,
  onOpenChange,
  collector,
  collectors,
  onUpdate,
}: MoveCollectorMembersDialogProps) {
  const { toast } = useToast();
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open, collector.id]);

  const fetchMembers = async () => {
    setIsLoading(true);
    console.log('Fetching members for collector:', collector.id);
    
    const { data, error } = await supabase
      .from('members')
      .select('id, full_name, member_number')
      .eq('collector_id', collector.id)
      .order('full_name');

    if (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } else {
      console.log('Fetched members:', data);
      setMembers(data || []);
    }
    setIsLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(current =>
      current.includes(memberId)
        ? current.filter(id => id !== memberId)
        : [...current, memberId]
    );
  };

  const handleMoveMembers = async () => {
    if (!selectedCollectorId) {
      toast({
        title: "Error",
        description: "Please select a collector",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select members to move",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Get the new collector's name
    const newCollector = collectors.find(c => c.id === selectedCollectorId);
    if (!newCollector) {
      toast({
        title: "Error",
        description: "Selected collector not found",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('members')
      .update({ 
        collector_id: selectedCollectorId,
        collector: newCollector.name, // Add this line to update the collector name
        updated_at: new Date().toISOString()
      })
      .in('id', selectedMembers);

    if (error) {
      console.error('Error moving members:', error);
      toast({
        title: "Error",
        description: "Failed to move members",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `${selectedMembers.length} members have been moved to ${newCollector.name}.`,
      });
      onOpenChange(false);
      onUpdate();
    }
    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCollectorId("");
      setSelectedMembers([]);
      setMembers([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Move Members from {collector.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <CollectorSelect
            collectors={collectors}
            currentCollectorId={collector.id}
            selectedCollectorId={selectedCollectorId}
            onCollectorChange={setSelectedCollectorId}
          />

          <ScrollArea className="h-[400px] rounded-md border">
            <MemberSelectionTable
              members={members}
              selectedMembers={selectedMembers}
              onSelectAll={handleSelectAll}
              onMemberToggle={handleMemberToggle}
              isLoading={isLoading}
            />
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleMoveMembers}
            disabled={isLoading || selectedMembers.length === 0 || !selectedCollectorId}
          >
            Move {selectedMembers.length} Members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}