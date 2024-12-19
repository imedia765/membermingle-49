import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface MemberSelectionTableProps {
  members: any[];
  selectedMembers: string[];
  onSelectAll: () => void;
  onMemberToggle: (memberId: string) => void;
  isLoading: boolean;
}

export function MemberSelectionTable({
  members,
  selectedMembers,
  onSelectAll,
  onMemberToggle,
  isLoading
}: MemberSelectionTableProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading members...</div>;
  }

  if (members.length === 0) {
    return <div className="text-center py-4">No members found for this collector</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={selectedMembers.length === members.length && members.length > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead>Member Number</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <Checkbox 
                checked={selectedMembers.includes(member.id)}
                onCheckedChange={() => onMemberToggle(member.id)}
              />
            </TableCell>
            <TableCell>{member.member_number}</TableCell>
            <TableCell>{member.full_name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}