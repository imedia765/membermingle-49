import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImportStatus } from "./ImportStatus";
import { ImportButton } from "./ImportButton";
import { Checkbox } from "@/components/ui/checkbox";
import { importMembersFromCsv } from "@/utils/csvImport";
import { processCollectors, processMembers } from "@/utils/importHelpers";

export function ImportSection() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [removeMemberNumbers, setRemoveMemberNumbers] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      console.log("Initial auth check:", { isAuthenticated: !!session, userId: session?.user?.id });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      console.log("Auth state changed:", { 
        isAuthenticated: !!session,
        userId: session?.user?.id,
        event: _event
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const importData = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to import data",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const result = await importMembersFromCsv('/processed_members.csv');
      
      if (!Array.isArray(result)) {
        throw new Error('Invalid CSV data format');
      }
      
      console.log('CSV data loaded:', result.length, 'members');

      // If removeMemberNumbers is true, remove member_number from each record
      const processedData = removeMemberNumbers 
        ? result.map(({ member_number, ...rest }) => rest)
        : result;

      const collectorIdMap = await processCollectors(processedData, session.user.id);
      console.log('Collectors processed, starting member import...');
      
      const importedCount = await processMembers(processedData, collectorIdMap, session.user.id);
      console.log('Members import completed:', importedCount, 'members processed');

      toast({
        title: "Import successful",
        description: `${importedCount} members have been imported into the database`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An error occurred during import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImportStatus isAuthenticated={isAuthenticated} />
        <p className="text-sm text-muted-foreground">
          Import member data from processed_members.csv file into the database.
          This will create new records and update existing ones.
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="removeMemberNumbers"
            checked={removeMemberNumbers}
            onCheckedChange={(checked) => setRemoveMemberNumbers(checked as boolean)}
          />
          <label
            htmlFor="removeMemberNumbers"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remove existing member numbers and let Supabase generate new ones
          </label>
        </div>
        <ImportButton 
          onClick={importData}
          isImporting={isImporting}
          isDisabled={!isAuthenticated}
        />
      </CardContent>
    </Card>
  );
}