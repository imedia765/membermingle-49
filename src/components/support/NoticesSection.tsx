import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { NoticeHistory } from "./NoticeHistory";
import { MemberSelection } from "./MemberSelection";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Get the current user's profile
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return profile;
    },
  });

  const handleSendNotice = async () => {
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

    if (!profile) {
      toast({
        title: "Error",
        description: "You must be logged in to send notices",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Create notices for each selected member
      const notices = selectedMembers.map(memberId => ({
        member_id: memberId,
        subject: noticeMessage.substring(0, 50) + (noticeMessage.length > 50 ? "..." : ""),
        description: noticeMessage,
        status: 'notice',
        priority: 'medium',
      }));

      const { error } = await supabase
        .from('support_tickets')
        .insert(notices);

      if (error) throw error;

      toast({
        title: "Notice Sent",
        description: `Notice sent to ${selectedMembers.length} recipients`,
      });
      
      setNoticeMessage("");
      setSelectedMembers([]);
    } catch (error) {
      console.error('Error sending notice:', error);
      toast({
        title: "Error",
        description: "Failed to send notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
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
            disabled={isSending || !profile}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : "Send Notice"}
          </Button>
          <NoticeHistory />
        </div>
      </CardContent>
    </Card>
  );
}