export interface Registration {
  id: string;
  name: string;
  status: string;
  date: string;
  email: string;
  contact: string;
  address: string;
  personalInfo?: {
    fullName: string;
    address: string;
    town: string;
    postCode: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
  };
  nextOfKin?: {
    [key: string]: string;
  };
  spouses?: Array<{
    name: string;
    dateOfBirth: string;
  }>;
  dependants?: Array<{
    name: string;
    dateOfBirth: string;
    gender: string;
    category: string;
  }>;
}