export interface TicketResponse {
  id: string;
  response: string;
  created_at: string;
  responder_id: string | null;
  ticket_id: string | null;
  updated_at: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  member_id: string | null;
  member?: {
    full_name: string;
  } | null;
  ticket_responses?: TicketResponse[];
  // Additional properties needed for the dialog
  createdAt?: string;
  requester?: string;
  responses?: TicketResponse[];
}