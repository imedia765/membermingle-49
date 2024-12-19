import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImportSection } from "@/components/database/ImportSection";
import { BackupSection } from "@/components/database/BackupSection";
import { DeleteDatabaseSection } from "@/components/database/DeleteDatabaseSection";
import { UserManagementSection } from "@/components/database/UserManagementSection";
import { TestFunctionsSection } from "@/components/database/TestFunctionsSection";
import { getDatabaseStatus } from "@/utils/databaseBackup";

interface DatabaseStatus {
  lastAction: {
    action: string;
    timestamp: string;
    details?: string;
  } | null;
  totalRows: number;
  estimatedSize: string;
}

export default function Database() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getDatabaseStatus();
      setStatus(status);
    } catch (error) {
      console.error('Error fetching database status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch database status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Database Management
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <ImportSection />
        <BackupSection />
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                {status?.lastAction && (
                  <p className="text-sm font-medium">
                    Last Action: {status.lastAction.action} ({status.lastAction.timestamp})
                    {status.lastAction.details && (
                      <span className="block text-xs text-muted-foreground">
                        {status.lastAction.details}
                      </span>
                    )}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Total Records: {status?.totalRows || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Estimated Size: {status?.estimatedSize || '0 KB'}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={fetchStatus}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <UserManagementSection />
        </div>
        <div className="md:col-span-2">
          <TestFunctionsSection />
        </div>
        <div className="md:col-span-2">
          <DeleteDatabaseSection onDelete={fetchStatus} />
        </div>
      </div>
    </div>
  );
}