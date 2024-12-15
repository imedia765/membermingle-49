import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateTicketDialog } from "./CreateTicketDialog";
import { TicketResponseDialog } from "./TicketResponseDialog";
import { Ticket } from "./types";

export function TicketingSection() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const ticket: Ticket = {
      id: `TICKET-${Math.random().toString(36).substr(2, 9)}`,
      subject: newTicket.subject,
      message: newTicket.message,
      status: "open",
      date: new Date().toISOString(),
      responses: [],
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: "", message: "" });
    toast({
      title: "Success",
      description: "Ticket created successfully",
    });
  };

  const handleAddResponse = () => {
    if (!response || !selectedTicket) return;

    const newResponse = {
      id: Math.random().toString(36).substr(2, 9),
      message: response,
      date: new Date().toISOString(),
      isAdmin: false,
    };

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            responses: [...ticket.responses, newResponse],
          }
        : ticket
    );

    setTickets(updatedTickets);
    setResponse("");
    toast({
      title: "Success",
      description: "Response added successfully",
    });
  };

  return (
    <div className="space-y-6">
      <CreateTicketDialog
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        handleCreateTicket={handleCreateTicket}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ticket.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(ticket.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <TicketResponseDialog
                    ticket={ticket}
                    response={response}
                    setResponse={setResponse}
                    handleAddResponse={handleAddResponse}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}