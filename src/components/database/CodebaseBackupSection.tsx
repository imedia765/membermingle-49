import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function CodebaseBackupSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await supabase.functions.invoke('backup-codebase', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (!response.data) {
        throw new Error('Failed to generate backup');
      }

      // Convert the response data to a blob
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `codebase-backup-${timestamp}.zip`;
      
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Backup downloaded successfully",
        description: `Saved as ${filename}`,
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Codebase Backup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Download a complete backup of the application codebase. This includes all source files, configurations, and assets.
        </p>
        <Button 
          className="w-full flex items-center gap-2"
          onClick={handleDownload}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          {isLoading ? "Generating backup..." : "Download Codebase"}
        </Button>
      </CardContent>
    </Card>
  );
}