import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserListProps {
  users: any[];
  onUpdate: () => void;
  updating: string | null;
  setUpdating: (id: string | null) => void;
}

export function UserList({ users, onUpdate, updating, setUpdating }: UserListProps) {
  const { toast } = useToast();

  const updateUserRole = async (userId: string, newRole: "member" | "collector" | "admin") => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: "User role has been successfully updated.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. You might not have permission.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              Last login: {user.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleString() 
                : 'Never logged in'}
            </p>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <Select
            value={user.role || 'member'}
            onValueChange={(value: "member" | "collector" | "admin") => updateUserRole(user.id, value)}
            disabled={updating === user.id}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}