import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw, Merge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImportSection } from "@/components/database/ImportSection";
import { exportDatabase, restoreDatabase } from "@/utils/databaseBackup";
import { findDuplicateCollectors, mergeCollectors } from "@/utils/collectorCleanup";

export default function Database() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleBackup = async () => {
    try {
      await exportDatabase();
      toast({
        title: "Backup successful",
        description: "Database backup has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Backup failed",
        description: error instanceof Error ? error.message : "An error occurred during backup",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await restoreDatabase(file);
      toast({
        title: "Restore successful",
        description: "Database has been restored from backup",
      });
    } catch (error) {
      toast({
        title: "Restore failed",
        description: error instanceof Error ? error.message : "An error occurred during restore",
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      setIsCleaningUp(true);
      const duplicates = await findDuplicateCollectors();
      
      if (duplicates.length === 0) {
        toast({
          title: "No duplicates found",
          description: "Your database is clean - no duplicate collectors found.",
        });
        return;
      }

      await mergeCollectors(duplicates);
      
      toast({
        title: "Cleanup successful",
        description: `Merged ${duplicates.length} groups of duplicate collectors.`,
      });
    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: "Cleanup failed",
        description: error instanceof Error ? error.message : "An error occurred during cleanup",
        variant: "destructive",
      });
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Database Management
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <ImportSection />

        <Card>
          <CardHeader>
            <CardTitle>Backup Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a backup of the entire database. This includes all member records, payments, and system settings.
            </p>
            <Button 
              className="w-full flex items-center gap-2"
              onClick={handleBackup}
            >
              <Download className="h-4 w-4" />
              Download Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Restore the database from a previous backup file. Please ensure you have a valid backup file.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              ref={fileInputRef}
              className="hidden"
              id="restore-file"
            />
            <Button 
              className="w-full flex items-center gap-2" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clean up duplicate collectors and maintain database integrity.
            </p>
            <Button 
              className="w-full flex items-center gap-2"
              onClick={handleCleanupDuplicates}
              disabled={isCleaningUp}
            >
              <Merge className="h-4 w-4" />
              {isCleaningUp ? "Cleaning up..." : "Clean Up Duplicates"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Last Backup: 2024-02-15 14:30</p>
                <p className="text-sm text-muted-foreground">Database Size: 256 MB</p>
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
