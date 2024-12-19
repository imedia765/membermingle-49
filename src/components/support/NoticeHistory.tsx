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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function NoticeHistory() {
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name');
      if (error) throw error;
      return data;
    },
  });

  const { data: notices = [], isLoading: isLoadingNotices } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          description,
          created_at,
          member_id,
          ticket_responses (
            id,
            created_at,
            responder_id
          )
        `)
        .eq('status', 'notice')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.full_name : 'Unknown Member';
  };

  if (isLoadingMembers || isLoadingNotices) {
    return <div>Loading...</div>;
  }

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
            {notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>
                  {format(new Date(notice.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>{notice.subject}</TableCell>
                <TableCell>{notice.member_id ? "1" : "All"} members</TableCell>
                <TableCell>
                  <Badge variant={notice.ticket_responses.length > 0 ? "default" : "secondary"}>
                    {notice.ticket_responses.length > 0 ? "Read" : "Unread"}
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
                      {notice.member_id ? (
                        <DropdownMenuItem className="justify-between">
                          <span>{getMemberName(notice.member_id)}</span>
                          {notice.ticket_responses.length > 0 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>Sent to all members</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="whitespace-pre-wrap">
                        {notice.description}
                      </DropdownMenuItem>
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