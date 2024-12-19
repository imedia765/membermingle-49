import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Member } from "@/components/members/types";

export default function CoveredMembers() {
  const navigate = useNavigate();

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return data as Member[];
    },
  });

  const totalCoveredMembers = members?.reduce((acc, member) => {
    const spousesCount = member.coveredMembers?.spouses?.length || 0;
    const dependantsCount = member.coveredMembers?.dependants?.length || 0;
    return acc + spousesCount + dependantsCount;
  }, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/members')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Button>
        <div className="text-lg font-semibold">
          Total Covered Members: {totalCoveredMembers}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading members...</div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Primary Member</TableHead>
              <TableHead>Covered Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Relationship</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map(member => (
              <>
                {member.coveredMembers?.spouses?.map((spouse, index) => (
                  <TableRow key={`${member.id}-spouse-${index}`}>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>Spouse</TableCell>
                    <TableCell>{spouse.name}</TableCell>
                    <TableCell>{spouse.dateOfBirth}</TableCell>
                    <TableCell>Spouse</TableCell>
                  </TableRow>
                ))}
                {member.coveredMembers?.dependants?.map((dependant, index) => (
                  <TableRow key={`${member.id}-dependant-${index}`}>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>Dependant</TableCell>
                    <TableCell>{dependant.name}</TableCell>
                    <TableCell>{dependant.dateOfBirth}</TableCell>
                    <TableCell>{dependant.relationship}</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}