import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormFieldsProps {
  userData: any;
  isLoading: boolean;
  isRequired?: boolean;
}

export const ProfileFormFields = ({ userData, isLoading, isRequired = false }: ProfileFormFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full Name {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={userData?.full_name}
          disabled={isLoading}
          required={isRequired}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={userData?.email}
          disabled={isLoading}
          required={isRequired}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={userData?.phone}
          disabled={isLoading}
          required={isRequired}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Textarea
          id="address"
          name="address"
          defaultValue={userData?.address}
          disabled={isLoading}
          required={isRequired}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="town" className="text-sm font-medium">
          Town {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Input
          id="town"
          name="town"
          defaultValue={userData?.town}
          disabled={isLoading}
          required={isRequired}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="postcode" className="text-sm font-medium">
          Post Code {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Input
          id="postcode"
          name="postcode"
          defaultValue={userData?.postcode}
          disabled={isLoading}
          required={isRequired}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="dob" className="text-sm font-medium">
          Date of Birth {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Input
          id="dob"
          name="dob"
          type="date"
          defaultValue={userData?.date_of_birth}
          disabled={isLoading}
          required={isRequired}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="gender" className="text-sm font-medium">
          Gender {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Select name="gender" defaultValue={userData?.gender} required={isRequired} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="maritalStatus" className="text-sm font-medium">
          Marital Status {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Select name="maritalStatus" defaultValue={userData?.marital_status} required={isRequired} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select Marital Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};