export interface Response {
  id: string;
  message: string;
  date: string;
  isAdmin: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  phoneNumber?: string;
  status: "open" | "closed";
  date: string;
  responses: Response[];
}