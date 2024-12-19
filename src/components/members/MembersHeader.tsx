import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MembersHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Members Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Button className="w-full flex items-center justify-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
        <Button 
          variant="default"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => navigate('/admin/members/covered')}
        >
          <Users className="h-4 w-4" />
          View Covered Members
        </Button>
      </div>
    </div>
  );
}