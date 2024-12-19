import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UseFormRegister } from "react-hook-form";
import { CountryList } from "./CountryList";
import { countries } from "@/data/countries";

interface CountrySelectorProps {
  register: UseFormRegister<any>;
}

export const CountrySelector = ({ register }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSelect = (value: string) => {
    const country = countries.find(c => c.value === value);
    setSelectedCountry(country?.label || "");
    register("country").onChange({ target: { value: country?.value || "" } });
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="country">Country</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCountry || "Select country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <CountryList value={selectedCountry} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
};