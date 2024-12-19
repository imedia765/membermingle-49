import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CollectorSelectProps {
  collectors: Array<{ id: string; name: string }>;
  currentCollectorId: string;
  selectedCollectorId: string;
  onCollectorChange: (value: string) => void;
}

export function CollectorSelect({
  collectors,
  currentCollectorId,
  selectedCollectorId,
  onCollectorChange
}: CollectorSelectProps) {
  return (
    <Select onValueChange={onCollectorChange} value={selectedCollectorId}>
      <SelectTrigger>
        <SelectValue placeholder="Select a collector" />
      </SelectTrigger>
      <SelectContent>
        {collectors
          .filter(c => c.id !== currentCollectorId)
          .map(c => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}