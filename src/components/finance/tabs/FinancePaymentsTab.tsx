import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionsTable } from "../TransactionsTable";

const collectors = [
  { id: 1, name: "Anjum Riaz", members: 161 },
  { id: 2, name: "Zabbie", members: 116 },
];

export function FinancePaymentsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by collector" />
              </SelectTrigger>
              <SelectContent>
                {collectors.map((collector) => (
                  <SelectItem key={collector.id} value={collector.name}>
                    {collector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <TransactionsTable />
        </div>
      </CardContent>
    </Card>
  );
}