import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionsTable } from "../TransactionsTable";

export function FinanceExpensesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funeral_service">Funeral Service</SelectItem>
                <SelectItem value="cemetery_fees">Cemetery Fees</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="memorial_supplies">Memorial Supplies</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="bereavement_support">Bereavement Support</SelectItem>
                <SelectItem value="maintenance">Facility Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <TransactionsTable type="expense" />
        </div>
      </CardContent>
    </Card>
  );
}