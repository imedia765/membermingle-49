import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailLoginForm } from "./EmailLoginForm";
import { MemberIdLoginForm } from "./MemberIdLoginForm";

interface LoginTabsProps {
  onEmailSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onMemberIdSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading?: boolean;
}

export const LoginTabs = ({ onEmailSubmit, onMemberIdSubmit, isLoading }: LoginTabsProps) => {
  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="memberId">Member ID</TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <EmailLoginForm onSubmit={onEmailSubmit} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="memberId">
        <MemberIdLoginForm onSubmit={onMemberIdSubmit} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};