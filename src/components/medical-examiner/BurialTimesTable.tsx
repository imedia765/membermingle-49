import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const burialTimes = [
  { month: "January", start: "2:30pm", conclusion: "3:30pm" },
  { month: "February", start: "3:30pm", conclusion: "4:30pm" },
  { month: "March", start: "4:00pm", conclusion: "5:00pm" },
  { month: "April-August", start: "5:45pm", conclusion: "6:45pm" },
  { month: "September", start: "5:30pm", conclusion: "6:30pm" },
  { month: "October", start: "4:00pm", conclusion: "5:00pm" },
  { month: "November", start: "2:45pm", conclusion: "3:45pm" },
  { month: "December", start: "2:30pm", conclusion: "3:30pm" },
];

export function BurialTimesTable() {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-primary">Burial Times</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Month</TableHead>
            <TableHead className="text-primary">Latest Start</TableHead>
            <TableHead className="text-right text-primary">Conclusion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {burialTimes.map((time) => (
            <TableRow key={time.month}>
              <TableCell className="text-foreground">{time.month}</TableCell>
              <TableCell className="text-foreground">{time.start}</TableCell>
              <TableCell className="text-right text-foreground">{time.conclusion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}