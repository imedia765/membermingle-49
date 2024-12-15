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

    const { error } = await supabase
      .from('collectors')
      .update({ name })
      .eq('id', collector.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update collector name",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Collector name updated successfully",
      });
      onUpdate();
      onClose();
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
            <Button type="submit" disabled={isLoading}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}