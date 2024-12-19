import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, UserCheck, Ban, ChevronDown, UserMinus, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PrintCollectorDetails } from "./PrintCollectorDetails";
import { MoveCollectorMembersDialog } from "./MoveCollectorMembersDialog";

interface CollectorActionsProps {
  collector: {
    id: string;
    name: string;
    active?: boolean | null;
    members?: any[];
    prefix?: string;
    number?: string;
  };
  collectors: Array<{ id: string; name: string }>;
  onEdit: (collector: { id: string; name: string }) => void;
  onUpdate: () => void;
}

export function CollectorActions({ collector, collectors, onEdit, onUpdate }: CollectorActionsProps) {
  const { toast } = useToast();
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintCollector = () => {
    const printContent = PrintCollectorDetails({ collector });
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDeleteCollector = async () => {
    if (!window.confirm('Are you sure you want to delete this collector? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // First move all members to unassigned
      const { error: membersError } = await supabase
        .from('members')
        .update({ 
          collector_id: null,
          collector: null,
          updated_at: new Date().toISOString()
        })
        .eq('collector_id', collector.id);

      if (membersError) throw membersError;

      // Then delete the collector
      const { error: deleteError } = await supabase
        .from('collectors')
        .delete()
        .eq('id', collector.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Collector deleted",
        description: "The collector has been removed successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting collector:', error);
      toast({
        title: "Error",
        description: "Failed to delete collector",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateCollector = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('collectors')
        .update({ 
          active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', collector.id);

      if (error) throw error;

      toast({
        title: "Collector activated",
        description: "The collector has been activated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error activating collector:', error);
      toast({
        title: "Error",
        description: "Failed to activate collector",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateCollector = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('collectors')
        .update({ 
          active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', collector.id);

      if (error) throw error;

      toast({
        title: "Collector deactivated",
        description: "The collector has been deactivated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error deactivating collector:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate collector",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-4 shrink-0" disabled={isLoading}>
            Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onEdit(collector)} className="flex items-center gap-2 cursor-pointer">
            <Edit2 className="h-4 w-4" /> Edit Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowMoveDialog(true)} className="flex items-center gap-2 cursor-pointer">
            <UserMinus className="h-4 w-4" /> Move Members
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintCollector} className="flex items-center gap-2 cursor-pointer">
            <Printer className="h-4 w-4" /> Print Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!collector.active && (
            <DropdownMenuItem onClick={handleActivateCollector} className="flex items-center gap-2 cursor-pointer">
              <UserCheck className="h-4 w-4" /> Activate
            </DropdownMenuItem>
          )}
          {collector.active && (
            <DropdownMenuItem onClick={handleDeactivateCollector} className="flex items-center gap-2 cursor-pointer">
              <Ban className="h-4 w-4" /> Deactivate
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDeleteCollector} 
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MoveCollectorMembersDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        collector={collector}
        collectors={collectors}
        onUpdate={onUpdate}
      />
    </>
  );
}