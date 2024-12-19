import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProcessSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Medical Examiner Process</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <object
            data="/Flowchart-ME-Process-NBC-Final-1.pdf"
            type="application/pdf"
            width="100%"
            height="500px"
            className="mb-4"
          >
            <p className="text-muted-foreground">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}