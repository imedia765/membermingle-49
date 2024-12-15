import { supabase } from "@/integrations/supabase/client";

export async function importDataFromJson() {
  try {
    const response = await fetch('/pwadb.json');
    const data = await response.json();
    console.log('Importing data:', data);

    // First, create collectors
    for (const collector of data.collectors) {
      const { error: collectorError } = await supabase
        .from('collectors')
        .insert({
          name: collector.name,
          prefix: collector.prefix,
          number: collector.number,
          email: collector.email || null,
          phone: collector.phone || null,
          active: true
        });

      if (collectorError) {
        console.error('Error inserting collector:', collectorError);
      }
    }

    // Then create members
    for (const member of data.members) {
      // First get collector ID
      const { data: collectorData } = await supabase
        .from('collectors')
        .select('id')
        .eq('name', member.collector)
        .single();

      if (collectorData) {
        const { error: memberError } = await supabase
          .from('members')
          .insert({
            collector_id: collectorData.id,
            full_name: member.name,
            member_number: member.membershipNo,
            email: member.email || null,
            phone: member.phone || null,
            address: member.address || null,
            status: member.status?.toLowerCase() || 'active',
            verified: false
          });

        if (memberError) {
          console.error('Error inserting member:', memberError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error };
  }
}