import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

// Tables in order of deletion (respecting foreign key constraints)
const TABLES = [
  'ticket_responses',
  'support_tickets',
  'registrations',
  'payments',
  'family_members',
  'admin_notes',
  'members',
  'collectors',
  'profiles'
] as const;

type TableName = typeof TABLES[number];

interface DeleteDatabaseSectionProps {
  onDelete?: () => void;
}

export function DeleteDatabaseSection({ onDelete }: DeleteDatabaseSectionProps) {
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteDatabase = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting database deletion...");

      // Delete data from all tables in reverse order of dependencies
      for (const table of TABLES) {
        console.log(`Deleting all records from ${table}...`);
        const { error } = await supabase
          .from(table)
          .delete()
          .not('id', 'is', null); // Changed to delete all non-null IDs

        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          throw error;
        }
      }

      await supabase
        .from('database_logs')
        .insert({
          action: 'delete',
          details: 'All database records deleted'
        });

      toast({
        title: "Database cleared successfully",
        description: "All data has been removed from the database.",
      });

      onDelete?.();
    } catch (error) {
      console.error('Error deleting database:', error);
      toast({
        title: "Failed to clear database",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmText("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">Delete Database</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Warning: This action will permanently delete all data from the database. This cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive"
              className="w-full flex items-center gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete All Data"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all data
                from all tables in the database.
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Type "DELETE" to confirm:
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="mb-2"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDatabase}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete All Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}