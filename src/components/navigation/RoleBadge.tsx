import { Shield, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string | null;
  isLoggedIn: boolean;
}

export function RoleBadge({ role, isLoggedIn }: RoleBadgeProps) {
  if (!isLoggedIn || !role) return null;

  const roleConfig = {
    admin: { icon: Shield, color: "bg-red-500 hover:bg-red-600" },
    collector: { icon: Users, color: "bg-blue-500 hover:bg-blue-600" },
    member: { icon: User, color: "bg-green-500 hover:bg-green-600" }
  }[role];

  if (!roleConfig) return null;

  const Icon = roleConfig.icon;
  return (
    <Badge className={`${roleConfig.color} ml-2 gap-1`}>
      <Icon className="h-3 w-3" />
      {role}
    </Badge>
  );
}