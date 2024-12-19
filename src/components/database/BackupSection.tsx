import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { exportDatabase, restoreDatabase } from "@/utils/databaseBackup";
import { useToast } from "@/hooks/use-toast";

interface BackupSectionProps {
  onBackupComplete?: () => void;
  onRestoreComplete?: () => void;
}

export function BackupSection({ onBackupComplete, onRestoreComplete }: BackupSectionProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    try {
      await exportDatabase();
      toast({
        title: "Backup successful",
        description: "Database backup has been downloaded",
      });
      onBackupComplete?.();
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
      onRestoreComplete?.();
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

  return (
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
  );
}