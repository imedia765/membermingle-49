import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleMoveMembers = async () => {
    if (!selectedCollectorId) {
      toast({
        title: "Error",
        description: "Please select a collector",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('members')
      .update({ collector_id: selectedCollectorId })
      .eq('collector_id', collector.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to move members",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Members moved",
        description: "All members have been moved to the selected collector.",
      });
      onOpenChange(false);
      onUpdate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Members to Another Collector</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={setSelectedCollectorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a collector" />
            </SelectTrigger>
            <SelectContent>
              {collectors
                .filter(c => c.id !== collector.id)
                .map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleMoveMembers}>
            Move Members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}