import { supabase } from "@/integrations/supabase/client";
import { saveAs } from 'file-saver';

const TABLES = [
  'members',
  'collectors',
  'payments',
  'family_members',
  'registrations',
  'support_tickets',
  'ticket_responses',
  'admin_notes'
] as const;

type TableName = typeof TABLES[number];

export async function exportDatabase() {
  try {
    const results = await Promise.all(
      TABLES.map(table => 
        supabase.from(table).select('*')
      )
    );

    const backupData = {
      members: results[0].data,
      collectors: results[1].data,
      payments: results[2].data,
      familyMembers: results[3].data,
      registrations: results[4].data,
      supportTickets: results[5].data,
      ticketResponses: results[6].data,
      adminNotes: results[7].data,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    
    saveAs(blob, `database_backup_${new Date().toISOString()}.json`);
    return { success: true };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

export async function restoreDatabase(backupFile: File) {
  try {
    const fileContent = await backupFile.text();
    const backupData = JSON.parse(fileContent);

    if (!backupData.timestamp || !backupData.members) {
      throw new Error('Invalid backup file format');
    }

    const tableMap: Record<string, TableName> = {
      members: 'members',
      collectors: 'collectors',
      payments: 'payments',
      familyMembers: 'family_members',
      registrations: 'registrations',
      supportTickets: 'support_tickets',
      ticketResponses: 'ticket_responses',
      adminNotes: 'admin_notes'
    };

    for (const [key, table] of Object.entries(tableMap)) {
      const data = backupData[key];
      
      if (Array.isArray(data)) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', 'placeholder');

        if (deleteError) {
          console.error(`Error clearing ${table}:`, deleteError);
          throw deleteError;
        }

        if (data.length > 0) {
          const { error: insertError } = await supabase
            .from(table)
            .insert(data);

          if (insertError) {
            console.error(`Error restoring ${table}:`, insertError);
            throw insertError;
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
}