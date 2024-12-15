import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

interface ImportButtonProps {
  onClick: () => void;
  isImporting: boolean;
  isDisabled: boolean;
}

export function ImportButton({ onClick, isImporting, isDisabled }: ImportButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={isImporting || isDisabled}
      className="w-full flex items-center gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      {isImporting ? "Importing..." : "Import Members"}
    </Button>
  );
}