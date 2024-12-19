import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Spouse {
  name: string;
  dateOfBirth: string;
}

export const SpousesSection = forwardRef((props, ref) => {
  const [spouses, setSpouses] = useState<Spouse[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    getSpouses: () => spouses
  }));

  const addSpouse = () => {
    setSpouses([...spouses, { name: "", dateOfBirth: "" }]);
    setIsOpen(true);
  };

  const removeSpouse = (index: number) => {
    setSpouses(spouses.filter((_, i) => i !== index));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex w-full justify-between bg-primary/5 hover:bg-primary/10 text-primary"
        >
          <h3 className="text-lg font-semibold">Spouses</h3>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {spouses.map((spouse, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
            <h4 className="font-medium">Spouse {index + 1}</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label>Name</label>
                <Input
                  value={spouse.name}
                  onChange={(e) => {
                    const newSpouses = [...spouses];
                    newSpouses[index].name = e.target.value;
                    setSpouses(newSpouses);
                  }}
                />
              </div>
              <div className="space-y-2">
                <label>Date of Birth</label>
                <Input
                  type="date"
                  value={spouse.dateOfBirth}
                  onChange={(e) => {
                    const newSpouses = [...spouses];
                    newSpouses[index].dateOfBirth = e.target.value;
                    setSpouses(newSpouses);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => addSpouse()}
                className="bg-green-500 hover:bg-green-600 text-white border-0"
              >
                Add Spouse
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => removeSpouse(index)}
              >
                Remove Spouse
              </Button>
            </div>
          </div>
        ))}
        {spouses.length === 0 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={addSpouse} 
            className="w-full bg-green-500 hover:bg-green-600 text-white border-0"
          >
            Add Spouse
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
});

SpousesSection.displayName = "SpousesSection";