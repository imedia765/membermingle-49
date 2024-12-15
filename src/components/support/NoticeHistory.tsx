import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_MEMBERS = [
  { id: "1", name: "John Doe", group: "Anjum Riaz Group" },
  { id: "2", name: "Jane Smith", group: "Zabbie Group" },
  { id: "3", name: "Alice Johnson", group: "Anjum Riaz Group" },
  { id: "4", name: "Bob Wilson", group: "Zabbie Group" },
];

const SAMPLE_NOTICES = [
  {
    id: "1",
    message: "Monthly meeting scheduled for next week",
    sentAt: "2024-03-20T10:00:00",
    recipients: ["1", "2", "3", "4"],
    readBy: ["1", "3"]
  },
  {
    id: "2",
    message: "New guidelines update",
    sentAt: "2024-03-19T15:30:00",
    recipients: ["1", "2"],
    readBy: ["1"]
  }
];

export function NoticeHistory() {
  const getMemberName = (memberId: string) => {
    const member = SAMPLE_MEMBERS.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notice History</h3>
      <ScrollArea className="h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Read Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_NOTICES.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>
                  {format(new Date(notice.sentAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>{notice.message}</TableCell>
                <TableCell>{notice.recipients.length} members</TableCell>
                <TableCell>
                  <Badge variant={notice.readBy.length === notice.recipients.length ? "default" : "secondary"}>
                    {notice.readBy.length}/{notice.recipients.length} read
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View Details <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {notice.recipients.map((recipientId) => (
                        <DropdownMenuItem key={recipientId} className="justify-between">
                          <span>{getMemberName(recipientId)}</span>
                          {notice.readBy.includes(recipientId) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}