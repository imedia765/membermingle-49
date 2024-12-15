import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { NoticeHistory } from "./NoticeHistory";
import { MemberSelection } from "./MemberSelection";

export interface Notice {
  id: string;
  message: string;
  sentAt: string;
  recipients: string[];
  readBy: string[];
}

export function NoticesSection() {
  const [noticeMessage, setNoticeMessage] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSendNotice = () => {
    if (!noticeMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipient",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notice Sent",
      description: `Notice sent to ${selectedMembers.length} recipients`,
    });
    setNoticeMessage("");
    setSelectedMembers([]);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Notices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MemberSelection 
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
          />
          <Textarea
            placeholder="Enter your notice message here..."
            value={noticeMessage}
            onChange={(e) => setNoticeMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSendNotice}
            className="w-full sm:w-auto"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Notice
          </Button>
          <NoticeHistory />
        </div>
      </CardContent>
    </Card>
  );
}