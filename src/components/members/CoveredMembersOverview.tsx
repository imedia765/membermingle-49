import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, Users } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Member } from "./types";

interface CoveredMembersOverviewProps {
  members: Member[];
}

export const CoveredMembersOverview = ({ members }: CoveredMembersOverviewProps) => {
  const totalCoveredMembers = members.reduce((acc, member) => {
    const spousesCount = member.coveredMembers?.spouses?.length || 0;
    const dependantsCount = member.coveredMembers?.dependants?.length || 0;
    return acc + spousesCount + dependantsCount;
  }, 0);

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="default"
              className="flex items-center gap-2 w-full justify-between bg-primary hover:bg-primary/90"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Covered Members Overview</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <div className="text-lg font-semibold">
                Total Covered Members: {totalCoveredMembers}
              </div>
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
                  {members.map(member => (
                    <>
                      {member.coveredMembers?.spouses?.map((spouse, index) => (
                        <TableRow key={`spouse-${member.id}-${index}`}>
                          <TableCell>{member.full_name}</TableCell>
                          <TableCell>Spouse</TableCell>
                          <TableCell>{spouse.name}</TableCell>
                          <TableCell>{spouse.dateOfBirth}</TableCell>
                          <TableCell>Spouse</TableCell>
                        </TableRow>
                      ))}
                      {member.coveredMembers?.dependants?.map((dependant, index) => (
                        <TableRow key={`dependant-${member.id}-${index}`}>
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
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};