import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function PageHeader() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Medical Examiner Process and Cemetery Charges
        </h1>
        <p className="text-muted-foreground mb-6">
          Information about the Medical Examiner Process and Cemetery Fees effective from 1st April 2024.
        </p>
      </div>
    </div>
  );
}