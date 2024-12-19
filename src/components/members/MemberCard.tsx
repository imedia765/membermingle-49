import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, MoreVertical, UserCheck, UserX, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "./types";

interface MemberCardProps {
  member: Member;
  expandedMember: string | null;
  editingNotes: string | null;
  toggleMember: (id: string) => void;
  setEditingNotes: (id: string | null) => void;
  onUpdate?: () => void;
}

export function MemberCard({
  member,
  expandedMember,
  editingNotes,
  toggleMember,
  setEditingNotes,
  onUpdate
}: MemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    toggleMember(member.id);
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = async (newStatus: 'active' | 'suspended' | 'deceased') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Member status has been updated to ${newStatus}`,
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently remove this member? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "The member has been permanently removed",
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = member.status === 'active' ? 'text-green-500' : 
                     member.status === 'suspended' ? 'text-yellow-500' : 
                     member.status === 'deceased' ? 'text-gray-500' : 'text-red-500';

  return (
    <Card className="p-4 bg-card">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">{member.full_name}</h3>
          <div className="flex gap-2 text-sm text-gray-400">
            <span>Member ID: {member.member_number}</span>
            <span>•</span>
            <span className={statusColor}>
              {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToggle}>
            {expandedMember === member.id ? "Less Info" : "More Info"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingNotes(member.id)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {member.status !== 'active' && (
                <DropdownMenuItem onClick={() => handleStatusChange('active')} className="cursor-pointer">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate Member
                </DropdownMenuItem>
              )}
              {member.status === 'active' && (
                <DropdownMenuItem onClick={() => handleStatusChange('suspended')} className="cursor-pointer text-yellow-600">
                  <UserX className="mr-2 h-4 w-4" />
                  Suspend Member
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleStatusChange('deceased')} className="cursor-pointer text-gray-600">
                <UserX className="mr-2 h-4 w-4" />
                Mark as Deceased
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expandedMember === member.id && (
        <div className="mt-4 space-y-2 text-gray-300">
          <p>Email: {member.email || "N/A"}</p>
          <p>Phone: {member.phone || "N/A"}</p>
          <p>Address: {member.address || "N/A"}</p>
          <p>Membership Type: {member.membership_type || "Standard"}</p>
          <p>Verified: {member.verified ? "Yes" : "No"}</p>
          <p>Collector: {member.collector || "N/A"}</p>
        </div>
      )}
    </Card>
  );
}