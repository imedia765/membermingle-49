export interface ImportData {
  collector: string;
  fullName?: string;
  name?: string;
  address?: string;
  email?: string;
  gender?: string;
  maritalStatus?: string;
  mobileNo?: string;
  dateOfBirth?: string;
  postCode?: string;
  town?: string;
  verified?: boolean;
}

export const validateJsonData = (data: any[]): ImportData[] => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON format: expected an array');
  }

  const validData = data.filter((item) => {
    if (typeof item !== 'object' || item === null) {
      console.log('Skipping invalid item:', item);
      return false;
    }
    
    if (!item.collector || (!item.fullName && !item.name)) {
      console.log('Skipping item missing required fields:', item);
      return false;
    }

    return true;
  });

  if (validData.length === 0) {
    throw new Error('No valid data entries found');
  }

  return validData as ImportData[];
};