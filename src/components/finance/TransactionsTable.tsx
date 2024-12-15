import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TransactionsTable() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          members (
            full_name
          )
        `)
        .order('payment_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member/Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.members?.full_name || 'Unknown Member'}</TableCell>
            <TableCell>{transaction.payment_type}</TableCell>
            <TableCell>{new Date(transaction.payment_date).toLocaleDateString()}</TableCell>
            <TableCell className={Number(transaction.amount) < 0 ? "text-red-500" : "text-green-500"}>
              £{Math.abs(Number(transaction.amount)).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}