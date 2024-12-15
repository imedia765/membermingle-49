import { supabase } from "@/integrations/supabase/client";

interface DuplicateGroup {
  name: string;
  collectors: Array<{
    id: string;
    name: string;
    number: string;
    prefix: string;
    members_count: number;
  }>;
}

export async function findDuplicateCollectors(): Promise<DuplicateGroup[]> {
  console.log('Starting duplicate collector search...');
  
  // First, get all collectors with their member counts
  const { data: collectors, error: collectorsError } = await supabase
    .from('collectors')
    .select(`
      id,
      name,
      number,
      prefix,
      members:members(count)
    `);

  if (collectorsError) {
    console.error('Error fetching collectors:', collectorsError);
    throw collectorsError;
  }

  // Normalize collector names and group them
  const groupedCollectors = collectors.reduce((acc: { [key: string]: any[] }, curr) => {
    // Normalize the name by removing spaces, slashes, and converting to lowercase
    const normalizedName = curr.name
      .toLowerCase()
      .replace(/\s*\/\s*/g, '') // Remove slashes and surrounding spaces
      .replace(/\s*&\s*/g, '')  // Remove ampersands and surrounding spaces
      .replace(/\s+/g, '')      // Remove all remaining spaces
      .trim();
    
    console.log(`Normalized name "${curr.name}" to "${normalizedName}"`);
    
    if (!acc[normalizedName]) {
      acc[normalizedName] = [];
    }
    acc[normalizedName].push({
      ...curr,
      members_count: curr.members?.length || 0
    });
    return acc;
  }, {});

  // Filter for actual duplicates and format the response
  const duplicates = Object.entries(groupedCollectors)
    .filter(([_, collectors]) => collectors.length > 1)
    .map(([name, collectors]) => ({
      name,
      collectors: collectors as Array<{
        id: string;
        name: string;
        number: string;
        prefix: string;
        members_count: number;
      }>
    }));

  console.log('Found duplicate groups:', duplicates);
  return duplicates;
}

export async function mergeCollectors(duplicates: DuplicateGroup[]): Promise<void> {
  console.log('Starting collector merge process...');
  
  for (const group of duplicates) {
    try {
      console.log(`Processing duplicate group for "${group.name}"`);
      
      // Sort collectors by member count (descending) and creation date
      const sortedCollectors = [...group.collectors].sort((a, b) => 
        b.members_count - a.members_count
      );

      const primaryCollector = sortedCollectors[0];
      const duplicateIds = sortedCollectors.slice(1).map(c => c.id);

      console.log(`Primary collector: ${primaryCollector.name} (${primaryCollector.id})`);
      console.log(`Duplicate collectors to merge: ${duplicateIds.join(', ')}`);

      // Update members to use the primary collector
      const { error: updateError } = await supabase
        .from('members')
        .update({ 
          collector_id: primaryCollector.id,
          collector: primaryCollector.name
        })
        .in('collector_id', duplicateIds);

      if (updateError) {
        console.error('Error updating members:', updateError);
        throw updateError;
      }

      // Delete duplicate collectors
      const { error: deleteError } = await supabase
        .from('collectors')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        console.error('Error deleting duplicates:', deleteError);
        throw deleteError;
      }

      console.log(`Successfully merged collectors for group "${group.name}"`);
    } catch (error) {
      console.error(`Error processing group "${group.name}":`, error);
      throw error;
    }
  }
}