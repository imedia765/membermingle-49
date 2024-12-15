import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MemberSearchInput } from "./MemberSearchInput";
import { MemberSearchResults } from "./MemberSearchResults";
import { PaymentForm } from "./PaymentForm";
import type { MemberSearchResult } from "./types";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentAdded: () => void;
}

export function AddPaymentDialog({ isOpen, onClose, onPaymentAdded }: AddPaymentDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberSearchResult | null>(null);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      amount: "",
      paymentType: "",
      notes: "",
    },
  });

  // Query for searching members with proper collector relationship
  const { data: members } = useQuery({
    queryKey: ['members', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id, 
          full_name, 
          member_number, 
          email,
          collector_id
        `)
        .or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;

      // Remove duplicates based on full_name and collector_id
      const uniqueMembers = data?.reduce((acc: MemberSearchResult[], current) => {
        const exists = acc.find(
          item => 
            item.full_name.toLowerCase() === current.full_name.toLowerCase() && 
            item.collector_id === current.collector_id
        );
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      return uniqueMembers as MemberSearchResult[];
    },
    enabled: searchTerm.length > 0,
  });

  // Form submission and other handlers
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedMember ? (
            <>
              <MemberSearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <MemberSearchResults
                members={members || []}
                onSelect={(member) => {
                  setSelectedMember(member);
                  setSearchTerm("");
                }}
              />
            </>
          ) : (
            <PaymentForm
              member={selectedMember}
              form={form}
              onSubmit={async (data) => {
                try {
                  const { error } = await supabase
                    .from('payments')
                    .insert({
                      member_id: selectedMember.id,
                      collector_id: selectedMember.collector_id,
                      amount: parseFloat(data.amount),
                      payment_type: data.paymentType,
                      notes: data.notes,
                    });

                  if (error) throw error;

                  toast({
                    title: "Payment added successfully",
                    description: `Payment of £${data.amount} has been recorded for ${selectedMember.full_name}`,
                  });

                  onPaymentAdded();
                  onClose();
                } catch (error) {
                  console.error('Error adding payment:', error);
                  toast({
                    title: "Error adding payment",
                    description: "There was an error adding the payment. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              onCancel={() => setSelectedMember(null)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
