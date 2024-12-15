import { File, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

interface Document {
  name: string;
  uploadDate: string;
  type: string;
}

interface DocumentType {
  type: string;
  description: string;
}

interface DocumentsSectionProps {
  documents: Document[];
  documentTypes: DocumentType[];
}

export const DocumentsSection = ({ documents, documentTypes }: DocumentsSectionProps) => {
  const { toast } = useToast();

  const handleFileUpload = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Document Upload",
        description: `${type} document uploaded successfully: ${file.name}`,
      });
    }
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button 
          variant="default"
          className="flex items-center gap-2 w-full justify-between bg-primary hover:bg-primary/90"
        >
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>Documents</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {documentTypes.map((doc) => (
              <div key={doc.type} className="p-4 border rounded-lg space-y-2">
                <h3 className="font-medium">{doc.type}</h3>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload(doc.type)}
                    className="text-sm"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Button size="sm" className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <ScrollArea className="h-[300px] mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};