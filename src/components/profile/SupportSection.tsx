import { HeadsetIcon, MailIcon, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TicketingSection } from "./TicketingSection";

export const SupportSection = () => {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button 
          variant="default"
          className="flex items-center gap-2 w-full justify-between bg-primary hover:bg-primary/90"
        >
          <div className="flex items-center gap-2">
            <HeadsetIcon className="h-4 w-4" />
            <span>Support</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="space-y-6">
          <div className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team through any of these channels:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                <span>support@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" />
                <span>+44 (0) 123 456 7890</span>
              </div>
            </div>
          </div>
          
          <TicketingSection />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};