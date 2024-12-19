import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { countries } from "@/data/countries";

interface CountryListProps {
  value?: string;
  onSelect: (value: string) => void;
}

export const CountryList = ({ value, onSelect }: CountryListProps) => {
  return (
    <Command className="w-full">
      <CommandInput placeholder="Search country..." />
      <CommandEmpty>No country found.</CommandEmpty>
      <CommandGroup className="max-h-[200px] overflow-y-auto">
        {countries.map((country) => (
          <CommandItem
            key={country.value}
            value={country.value}
            onSelect={() => onSelect(country.value)}
            className="cursor-pointer"
          >
            {country.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};