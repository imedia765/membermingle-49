import { Input } from "@/components/ui/input";

interface PasswordFieldsProps {
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  isLoading: boolean;
}

export const PasswordFields = ({ 
  newPassword, 
  confirmPassword, 
  setNewPassword, 
  setConfirmPassword,
  isLoading 
}: PasswordFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>
    </div>
  );
};