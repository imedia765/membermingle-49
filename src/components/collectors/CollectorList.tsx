import { ScrollArea } from "@/components/ui/scroll-area";
import { CollectorCard } from "./CollectorCard";

interface CollectorListProps {
  collectors: any[];
  expandedCollector: string | null;
  onToggleCollector: (id: string) => void;
  onEditCollector: (collector: { id: string; name: string }) => void;
  onUpdate: () => void;
  isLoading: boolean;
  searchTerm: string;
}

export function CollectorList({
  collectors,
  expandedCollector,
  onToggleCollector,
  onEditCollector,
  onUpdate,
  isLoading,
  searchTerm,
}: CollectorListProps) {
  const filteredCollectors = collectors?.filter(collector =>
    collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collector.number.includes(searchTerm)
  ) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading collectors...</div>
      </div>
    );
  }

  if (filteredCollectors.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          {searchTerm ? "No collectors found matching your search" : "No collectors found"}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="space-y-4">
        {filteredCollectors.map((collector) => (
          <CollectorCard
            key={collector.id}
            collector={collector}
            collectors={collectors}
            expandedCollector={expandedCollector}
            onToggle={onToggleCollector}
            onEdit={onEditCollector}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </ScrollArea>
  );
}