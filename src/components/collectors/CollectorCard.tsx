import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CollectorActions } from "./CollectorActions";

interface CollectorCardProps {
  collector: any;
  collectors: any[];
  expandedCollector: string | null;
  onToggle: (id: string) => void;
  onEdit: (collector: { id: string; name: string }) => void;
  onUpdate: () => void;
}

export function CollectorCard({ 
  collector, 
  collectors,
  expandedCollector, 
  onToggle, 
  onEdit,
  onUpdate 
}: CollectorCardProps) {
  const isExpanded = expandedCollector === collector.id;
  const memberCount = collector.members?.length || 0;
  const statusText = collector.active ? "Active" : "Inactive";
  const statusColor = collector.active ? "text-green-500" : "text-red-500";

  return (
    <Card className="bg-card">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(collector.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl text-white truncate">
                  {collector.prefix}{collector.number} - {collector.name}
                </h3>
                <span className={`text-sm ${statusColor}`}>({statusText})</span>
              </div>
              <p className="text-sm text-gray-400">
                Members: {memberCount}
              </p>
            </div>
          </div>
          <CollectorActions 
            collector={collector}
            collectors={collectors}
            onEdit={onEdit}
            onUpdate={onUpdate}
          />
        </div>
      </CardHeader>
      {isExpanded && collector.members && collector.members.length > 0 && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Member ID</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Phone</TableHead>
                  <TableHead className="text-white">Address</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collector.members.map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-white font-mono">{member.member_number}</TableCell>
                    <TableCell className="text-white">{member.full_name}</TableCell>
                    <TableCell className="text-white">{member.email || 'N/A'}</TableCell>
                    <TableCell className="text-white">{member.phone || 'N/A'}</TableCell>
                    <TableCell className="text-white">{member.address || 'N/A'}</TableCell>
                    <TableCell className="text-white capitalize">{member.status || 'active'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}