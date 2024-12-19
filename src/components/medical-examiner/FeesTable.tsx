import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FeesTableProps {
  title: string;
  data: Array<{
    service: string;
    fee: string;
  }>;
}

export function FeesTable({ title, data }: FeesTableProps) {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-primary">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Service</TableHead>
            <TableHead className="text-right text-primary">Fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-foreground">{row.service}</TableCell>
              <TableCell className="text-right text-foreground">{row.fee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}