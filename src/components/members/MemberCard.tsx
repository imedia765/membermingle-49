import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Member } from "./types";

interface MemberCardProps {
  member: Member;
  expandedMember: string | null;
  editingNotes: string | null;
  toggleMember: (id: string) => void;
  setEditingNotes: (id: string | null) => void;
}

export function MemberCard({
  member,
  expandedMember,
  editingNotes,
  toggleMember,
  setEditingNotes,
}: MemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    toggleMember(member.id);
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{member.full_name}</h3>
          <p className="text-sm text-gray-500">Member ID: {member.member_number}</p>
        </div>
        <Button variant="outline" onClick={handleToggle}>
          {expandedMember === member.id ? "Less Info" : "More Info"}
        </Button>
      </div>

      {expandedMember === member.id && (
        <div className="mt-4 space-y-2">
          <p>Email: {member.email || "N/A"}</p>
          <p>Phone: {member.phone || "N/A"}</p>
          <p>Address: {member.address || "N/A"}</p>
          <p>Status: {member.status || "N/A"}</p>
          <p>Membership Type: {member.membership_type || "Standard"}</p>
          <p>Verified: {member.verified ? "Yes" : "No"}</p>
        </div>
      )}
    </Card>
  );
}