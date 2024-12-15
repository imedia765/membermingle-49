import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateTicketDialogProps {
  newTicket: {
    subject: string;
    message: string;
    phoneNumber?: string;
  };
  setNewTicket: (ticket: { subject: string; message: string; phoneNumber?: string }) => void;
  handleCreateTicket: () => void;
}

export function CreateTicketDialog({
  newTicket,
  setNewTicket,
  handleCreateTicket,
}: CreateTicketDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Create New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Please provide details about your inquiry
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Subject"
            value={newTicket.subject}
            onChange={(e) =>
              setNewTicket({ ...newTicket, subject: e.target.value })
            }
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={newTicket.phoneNumber}
            onChange={(e) =>
              setNewTicket({ ...newTicket, phoneNumber: e.target.value })
            }
          />
          <Textarea
            placeholder="Message"
            value={newTicket.message}
            onChange={(e) =>
              setNewTicket({ ...newTicket, message: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreateTicket}>Submit Ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}