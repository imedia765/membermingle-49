import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Reply, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ticket, Response } from "./types";

interface TicketResponseDialogProps {
  ticket: Ticket;
  response: string;
  setResponse: (response: string) => void;
  handleAddResponse: () => void;
}

export function TicketResponseDialog({
  ticket,
  response,
  setResponse,
  handleAddResponse,
}: TicketResponseDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          View & Respond
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ticket: {ticket.id}</DialogTitle>
          <DialogDescription>{ticket.subject}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">{ticket.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(ticket.date).toLocaleString()}
            </p>
          </div>
          {ticket.responses.map((response) => (
            <div
              key={response.id}
              className={`rounded-lg p-4 ${
                response.isAdmin ? "bg-blue-50 ml-8" : "bg-muted mr-8"
              }`}
            >
              <p className="text-sm">{response.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(response.date).toLocaleString()}
              </p>
            </div>
          ))}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <Button onClick={handleAddResponse}>
              <Reply className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}