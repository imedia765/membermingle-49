import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TicketDetailsDialog } from "@/components/support/TicketDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { NoticesSection } from "@/components/support/NoticesSection";
import { useState } from "react";

interface TicketResponse {
  id: string;
  message: string;
  createdAt: string;
  isAdmin: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  requester: string;
  message?: string;
  responses: TicketResponse[];
}

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [tickets] = useState<Ticket[]>([
    {
      id: "T-001",
      subject: "Account Access Issue",
      status: "Open",
      priority: "High",
      createdAt: "2024-03-15",
      requester: "John Doe",
      message: "I cannot access my account after the recent update.",
      responses: [
        {
          id: "R1",
          message: "Have you tried clearing your browser cache?",
          createdAt: "2024-03-15T10:30:00",
          isAdmin: true,
        },
        {
          id: "R2",
          message: "Yes, I tried that but still having issues.",
          createdAt: "2024-03-15T11:00:00",
          isAdmin: false,
        },
      ],
    },
    {
      id: "T-002",
      subject: "Payment Processing Error",
      status: "In Progress",
      priority: "Medium",
      createdAt: "2024-03-14",
      requester: "Jane Smith",
      message: "Payment failed multiple times.",
      responses: [],
    },
  ]);

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Ticket ${ticketId} status changed to ${newStatus}`,
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Support Management
      </h1>

      <NoticesSection />

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                className="border rounded px-2 py-1"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === "Open" ? "destructive" : "default"}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ticket.priority === "High" ? "destructive" : "default"}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.createdAt}</TableCell>
                    <TableCell>{ticket.requester}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
