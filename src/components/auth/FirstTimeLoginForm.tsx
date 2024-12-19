import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface FirstTimeLoginFormProps {
  onSubmit: (memberId: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const FirstTimeLoginForm = ({ onSubmit, isLoading }: FirstTimeLoginFormProps) => {
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(memberId, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm text-blue-700">
          For your first login, use your Member ID (e.g. TM20001) as both your username and password.
          You'll be redirected to complete your profile after logging in.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Input
          id="memberId"
          name="memberId"
          type="text"
          placeholder="Member ID (e.g. TM20001)"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value.toUpperCase())}
          required
          disabled={isLoading}
          className="uppercase"
        />
      </div>
      <div className="space-y-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password (same as Member ID)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "First Time Login"}
      </Button>
    </form>
  );
};