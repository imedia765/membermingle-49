import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Dependant {
  name: string;
  dateOfBirth: string;
  gender: string;
  category: string;
}

export const DependantsSection = () => {
  const [dependants, setDependants] = useState<Dependant[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addDependant = () => {
    setDependants([...dependants, { name: "", dateOfBirth: "", gender: "", category: "" }]);
    setIsOpen(true);
  };

  const removeDependant = (index: number) => {
    setDependants(dependants.filter((_, i) => i !== index));
  };

  const updateDependant = (index: number, field: keyof Dependant, value: string) => {
    const newDependants = [...dependants];
    newDependants[index][field] = value;
    setDependants(newDependants);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex w-full justify-between bg-primary/5 hover:bg-primary/10 text-primary"
        >
          <h3 className="text-lg font-semibold">Dependants</h3>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        {dependants.map((dependant, index) => (
          <Card key={index} className="p-4 space-y-4">
            <h4 className="font-medium text-primary">Dependant {index + 1}</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={dependant.name}
                  onChange={(e) => updateDependant(index, 'name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={dependant.dateOfBirth}
                  onChange={(e) => updateDependant(index, 'dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Input
                  value={dependant.gender}
                  onChange={(e) => updateDependant(index, 'gender', e.target.value)}
                  placeholder="Enter gender"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={dependant.category}
                  onChange={(e) => updateDependant(index, 'category', e.target.value)}
                  placeholder="Enter category"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={addDependant}
                className="bg-green-500 hover:bg-green-600 text-white border-0"
              >
                Add Dependant
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => removeDependant(index)}
              >
                Remove Dependant
              </Button>
            </div>
          </Card>
        ))}
        {dependants.length === 0 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={addDependant} 
            className="w-full bg-green-500 hover:bg-green-600 text-white border-0"
          >
            Add Dependant
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};