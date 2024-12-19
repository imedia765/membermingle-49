import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const MedicalExaminerProcess = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Medical Examiner Process</h1>
          <p className="text-muted-foreground mb-6">
            This page provides detailed information about our Medical Examiner Death Certification process,
            including the flow chart and supporting documentation.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Process Flow Chart</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                View or download our comprehensive Medical Examiner Process Flow Chart:
              </p>
              <object
                data="/Flowchart-ME-Process-NBC-Final-1.pdf"
                type="application/pdf"
                width="100%"
                height="500px"
                className="mb-4"
              >
                <p>
                  Unable to display PDF file.{" "}
                  <a
                    href="/Flowchart-ME-Process-NBC-Final-1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Download PDF
                  </a>
                </p>
              </object>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Supporting Documentation</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <img
                  src="/WhatsApp Image 2024-10-02 at 3.50.07 PM.jpeg"
                  alt="Medical Examiner Process Documentation 1"
                  className="rounded-lg w-full h-auto shadow-lg object-contain"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4">
                <img
                  src="/WhatsApp Image 2024-10-02 at 3.50.07 PM (1).jpeg"
                  alt="Medical Examiner Process Documentation 2"
                  className="rounded-lg w-full h-auto shadow-lg object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalExaminerProcess;