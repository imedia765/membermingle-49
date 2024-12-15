import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CollectorSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CollectorSearch({ searchTerm, onSearchChange }: CollectorSearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by collector name or number..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}