import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemberSearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function MemberSearchInput({ searchTerm, setSearchTerm }: MemberSearchInputProps) {
  return (
    <div className="space-y-2">
      <Label>Search Member</Label>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or member number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}