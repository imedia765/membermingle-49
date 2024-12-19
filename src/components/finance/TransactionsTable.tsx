import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TransactionsTableProps {
  type?: 'expense' | 'payment' | 'all';
}

export function TransactionsTable({ type = 'all' }: TransactionsTableProps) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', type],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          members (
            full_name
          )
        `)
        .order('payment_date', { ascending: false });
      
      // Filter based on type
      if (type === 'expense') {
        query = query.lt('amount', 0);
      } else if (type === 'payment') {
        query = query.gt('amount', 0);
      }
      
      const { data, error } = await query.limit(10);
      
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
            <TableCell>{transaction.members?.full_name || transaction.notes || 'Unknown Member'}</TableCell>
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