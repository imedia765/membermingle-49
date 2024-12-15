import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

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

interface TicketDetailsDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (ticketId: string, newStatus: string) => void;
}

export function TicketDetailsDialog({
  ticket,
  open,
  onOpenChange,
  onStatusChange,
}: TicketDetailsDialogProps) {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send this to your backend
    toast({
      title: "Success",
      description: "Response submitted successfully",
    });
    setResponse("");
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Ticket #{ticket.id} - {ticket.subject}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant={ticket.status === "Open" ? "destructive" : "default"}>
              {ticket.status}
            </Badge>
            <Badge variant={ticket.priority === "High" ? "destructive" : "default"}>
              {ticket.priority}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Requester</h3>
            <p>{ticket.requester}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Original Message</h3>
            <p className="text-muted-foreground">{ticket.message}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Responses</h3>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {ticket.responses.map((response) => (
                <div
                  key={response.id}
                  className={`mb-4 p-3 rounded-lg ${
                    response.isAdmin
                      ? "bg-primary/10 ml-4"
                      : "bg-muted mr-4"
                  }`}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">
                      {response.isAdmin ? "Support Agent" : "Requester"}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(response.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{response.message}</p>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Add Response</h3>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1"
              value={ticket.status}
              onChange={(e) => onStatusChange(ticket.id, e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmitResponse}>Submit Response</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}