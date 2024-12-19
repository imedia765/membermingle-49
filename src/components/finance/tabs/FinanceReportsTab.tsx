import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function FinanceReportsTab() {
  const [selectedCollector, setSelectedCollector] = useState<string>("");
  const { toast } = useToast();

  const { data: collectors, isLoading: isLoadingCollectors } = useQuery({
    queryKey: ['collectors'],
    queryFn: async () => {
      console.log('Fetching collectors...');
      const { data, error } = await supabase
        .from('collectors')
        .select('id, name, prefix, number')
        .order('name');

      if (error) {
        console.error('Error fetching collectors:', error);
        toast({
          title: "Error",
          description: "Failed to fetch collectors",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments', selectedCollector],
    queryFn: async () => {
      console.log('Fetching payments...');
      let query = supabase
        .from('payments')
        .select(`
          id,
          amount,
          payment_date,
          payment_type,
          status,
          notes,
          members (
            member_number,
            full_name
          ),
          collectors (
            name
          )
        `)
        .order('payment_date', { ascending: false });

      if (selectedCollector) {
        query = query.eq('collector_id', selectedCollector);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payments",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
    enabled: true,
  });

  const handleExport = () => {
    if (!payments) return;

    const csvContent = [
      ['Date', 'Member', 'Amount', 'Type', 'Status', 'Collector', 'Notes'].join(','),
      ...payments.map(payment => [
        payment.payment_date,
        `${payment.members?.member_number} - ${payment.members?.full_name}`,
        payment.amount,
        payment.payment_type,
        payment.status,
        payment.collectors?.name,
        `"${payment.notes || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedCollector}
              onValueChange={setSelectedCollector}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by collector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Collectors</SelectItem>
                {collectors?.map((collector) => (
                  <SelectItem key={collector.id} value={collector.id}>
                    {collector.prefix}{collector.number} - {collector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleExport}
              disabled={isLoadingPayments || !payments?.length}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Member</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Amount</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Collector</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingPayments ? (
                    <tr>
                      <td colSpan={7} className="h-10 px-4 text-center">
                        Loading payments...
                      </td>
                    </tr>
                  ) : !payments?.length ? (
                    <tr>
                      <td colSpan={7} className="h-10 px-4 text-center">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="p-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td className="p-4">
                          {payment.members?.member_number} - {payment.members?.full_name}
                        </td>
                        <td className="p-4">£{payment.amount}</td>
                        <td className="p-4 capitalize">{payment.payment_type}</td>
                        <td className="p-4 capitalize">{payment.status}</td>
                        <td className="p-4">{payment.collectors?.name}</td>
                        <td className="p-4">{payment.notes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}