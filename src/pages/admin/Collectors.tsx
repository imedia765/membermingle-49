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

      // Then, get all members with their collector names
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('full_name');

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      // Debug: Log all unique collector names from members table
      const uniqueCollectorNames = [...new Set(membersData.map(m => m.collector).filter(Boolean))];
      console.log('Unique collector names in members table:', uniqueCollectorNames);

      // Debug: Log all collector names from collectors table
      console.log('Collectors in collectors table:', collectorsData.map(c => c.name));

      // Map members to their collectors using exact collector name matching
      const enhancedCollectorsData = collectorsData.map(collector => {
        // Function to normalize collector names for comparison
        const normalizeCollectorName = (name: string) => {
          if (!name) return '';
          return name.toLowerCase()
            .replace(/[\/&,.-]/g, ' ')  // Replace special characters with spaces
            .split(/\s+/)               // Split on whitespace
            .filter(part => part)       // Remove empty parts
            .join(' ')                  // Join back together with spaces
            .trim();                    // Remove any trailing whitespace
        };

        const normalizedCollectorName = normalizeCollectorName(collector.name);
        
        // Find all members that belong to this collector
        const collectorMembers = membersData?.filter(member => {
          if (!member.collector) return false;
          
          const normalizedMemberCollector = normalizeCollectorName(member.collector);
          
          const isMatch = normalizedMemberCollector === normalizedCollectorName;
          
          // Debug: Log each comparison
          if (isMatch) {
            console.log('Match found:', {
              originalCollectorName: collector.name,
              originalMemberCollector: member.collector,
              normalizedCollectorName,
              normalizedMemberCollector,
              memberName: member.full_name
            });
          }
          
          return isMatch;
        }) || [];

        // Debug: Log collector details
        console.log(`Collector "${collector.name}":`, {
          normalizedName: normalizedCollectorName,
          memberCount: collectorMembers.length,
          members: collectorMembers.map(m => ({
            id: m.id,
            name: m.full_name,
            collector: m.collector
          }))
        });

        return {
          ...collector,
          members: collectorMembers
        };
      });

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