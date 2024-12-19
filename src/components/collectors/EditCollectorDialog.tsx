import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditCollectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collector: {
    id: string;
    name: string;
  };
  onUpdate: () => void;
}

export function EditCollectorDialog({ isOpen, onClose, collector, onUpdate }: EditCollectorDialogProps) {
  const [name, setName] = useState(collector.name);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update collector name
      const { error: updateError } = await supabase
        .from('collectors')
        .update({ 
          name,
          updated_at: new Date().toISOString()
        })
        .eq('id', collector.id);

      if (updateError) throw updateError;

      // Update all members' collector field to match new name
      const { error: membersUpdateError } = await supabase
        .from('members')
        .update({ 
          collector: name,
          updated_at: new Date().toISOString()
        })
        .eq('collector_id', collector.id);

      if (membersUpdateError) throw membersUpdateError;

      toast({
        title: "Success",
        description: "Collector name updated successfully. Member numbers will be updated automatically.",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating collector:', error);
      toast({
        title: "Error",
        description: "Failed to update collector name",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Collector</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collector name"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || name === collector.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}