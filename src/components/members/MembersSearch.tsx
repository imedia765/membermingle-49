import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface MembersSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading?: boolean;
}

export function MembersSearch({ searchTerm, setSearchTerm, isLoading }: MembersSearchProps) {
  return (
    <div className="relative">
      <Input
        placeholder="Search members by name or member number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
}