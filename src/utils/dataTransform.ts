export interface CleanMember {
  name?: string;
  fullName?: string;
  address?: string;
  collector: string;
  email?: string;
  gender?: string;
  maritalStatus?: string;
  mobileNo?: string;
  dateOfBirth?: string | null;
  postCode?: string;
  town?: string;
  verified?: boolean;
  notes?: string[];
}

export function transformMemberData(jsonData: any[]): CleanMember[] {
  return jsonData.map(item => {
    // Handle the specific format from the file
    const name = item["Unknown Author2024-07-30T14:49:00Author:\nName of member\nName"] || item.name;
    const address = item["Unknown Author2024-07-30T14:49:00Author:\nAddress of member\nAddress"] || item.address;
    const collector = item.Collector || item.collector;

    return {
      name,
      address,
      collector: collector?.trim() || '',
      email: item.email || '',
      gender: item.gender || null,
      maritalStatus: item.maritalStatus || null,
      mobileNo: item.mobileNo || '',
      dateOfBirth: item.dateOfBirth || null,
      postCode: item.postCode || '',
      town: item.town || '',
      verified: item.verified || false,
      notes: Array.isArray(item.notes) ? item.notes : (item.Notes ? [item.Notes] : [])
    };
  });
}