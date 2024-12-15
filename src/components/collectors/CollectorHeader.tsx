import { Button } from "@/components/ui/button";
import { UserPlus, Printer } from "lucide-react";

interface CollectorHeaderProps {
  onImportData: () => Promise<void>;
  onPrintAll: () => void;
}

export function CollectorHeader({ onImportData, onPrintAll }: CollectorHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-4xl font-bold text-white">
        Collectors Management
      </h1>
      <div className="flex flex-wrap gap-2">
        <Button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onImportData}
        >
          <UserPlus className="h-4 w-4" />
          Import Data
        </Button>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="h-4 w-4" />
          Add New Collector
        </Button>
        <Button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onPrintAll}
        >
          <Printer className="h-4 w-4" />
          Print All Collectors
        </Button>
      </div>
    </div>
  );
}