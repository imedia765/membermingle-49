import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface PaymentHistorySectionProps {
  memberId: string;
  searchDate: string;
  searchAmount: string;
  onSearchDateChange: (value: string) => void;
  onSearchAmountChange: (value: string) => void;
}

export const PaymentHistorySection = ({
  memberId,
  searchDate,
  searchAmount,
  onSearchDateChange,
  onSearchAmountChange,
}: PaymentHistorySectionProps) => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', memberId, searchDate, searchAmount],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select('*')
        .eq('member_id', memberId)
        .order('payment_date', { ascending: false });

      if (searchDate) {
        query = query.eq('payment_date', searchDate);
      }

      if (searchAmount) {
        query = query.eq('amount', parseFloat(searchAmount));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button 
          variant="default"
          className="flex items-center gap-2 w-full justify-between bg-primary hover:bg-primary/90"
        >
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span>Payment History</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Search by Date</label>
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => onSearchDateChange(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Search by Amount</label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 50.00"
                value={searchAmount}
                onChange={(e) => onSearchAmountChange(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading payments...</TableCell>
                  </TableRow>
                ) : !payments?.length ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No payments found</TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.payment_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{payment.payment_type}</TableCell>
                      <TableCell>£{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};