import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ImportStatusProps {
  isAuthenticated: boolean;
}

export function ImportStatus({ isAuthenticated }: ImportStatusProps) {
  if (!isAuthenticated) {
    return (
      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <InfoIcon className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-sm text-yellow-700">
          Please log in to import data
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}