import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { importDataFromJson } from "@/utils/importData";
import { EditCollectorDialog } from "@/components/collectors/EditCollectorDialog";
import { CollectorList } from "@/components/collectors/CollectorList";
import { syncCollectorIds } from "@/utils/databaseOperations";
import { CollectorHeader } from "@/components/collectors/CollectorHeader";
import { CollectorSearch } from "@/components/collectors/CollectorSearch";
import { PrintTemplate } from "@/components/collectors/PrintTemplate";

export default function Collectors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCollector, setExpandedCollector] = useState<string | null>(null);
  const [editingCollector, setEditingCollector] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const { data: collectors, isLoading, refetch } = useQuery({
    queryKey: ['collectors'],
    queryFn: async () => {
      console.log('Starting collectors fetch process...');
      
      // First, get all collectors
      const { data: collectorsData, error: collectorsError } = await supabase
        .from('collectors')
        .select('*')
        .order('name');

      if (collectorsError) {
        console.error('Error fetching collectors:', collectorsError);
        throw collectorsError;
      }

      // Then, get all members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('full_name');

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      console.log('Raw collectors data:', collectorsData);
      console.log('Raw members data:', membersData);

      // Map members to their collectors using the collector field
      const enhancedCollectorsData = collectorsData.map(collector => {
        // Normalize collector names for comparison
        const normalizeCollectorName = (name: string) => {
          return name?.trim().toLowerCase().replace(/\s+/g, ' ') || '';
        };

        const collectorName = normalizeCollectorName(collector.name);
        
        // Find all members that belong to this collector using the collector field
        const collectorMembers = membersData?.filter(member => {
          const memberCollector = normalizeCollectorName(member.collector);
          return memberCollector === collectorName;
        }) || [];

        console.log(`Members for collector ${collector.name}:`, {
          collectorName,
          memberCount: collectorMembers.length,
          members: collectorMembers
        });

        return {
          ...collector,
          members: collectorMembers
        };
      });

      console.log('Enhanced collectors data:', enhancedCollectorsData);
      return enhancedCollectorsData;
    }
  });

  const handleImportData = async () => {
    const result = await importDataFromJson();
    if (result.success) {
      toast({
        title: "Data imported successfully",
        description: "The collectors and members data has been imported.",
      });
      refetch();
    } else {
      toast({
        title: "Import failed",
        description: "There was an error importing the data.",
        variant: "destructive",
      });
    }
  };

  const handlePrintAll = () => {
    const printContent = PrintTemplate({ collectors });
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <CollectorHeader 
        onImportData={handleImportData}
        onPrintAll={handlePrintAll}
      />

      <CollectorSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <CollectorList
        collectors={collectors || []}
        expandedCollector={expandedCollector}
        onToggleCollector={setExpandedCollector}
        onEditCollector={setEditingCollector}
        onUpdate={refetch}
        isLoading={isLoading}
        searchTerm={searchTerm}
      />

      {editingCollector && (
        <EditCollectorDialog
          isOpen={true}
          onClose={() => setEditingCollector(null)}
          collector={editingCollector}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}