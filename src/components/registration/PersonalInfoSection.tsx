import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister } from "react-hook-form";

interface PersonalInfoProps {
  register: UseFormRegister<any>;
}

export const PersonalInfoSection = ({ register }: PersonalInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName">Full Name</label>
          <Input
            id="fullName"
            {...register("fullName", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="address">Address</label>
          <Textarea
            id="address"
            {...register("address", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="town">Town</label>
          <Input
            id="town"
            {...register("town", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="postCode">Post Code</label>
          <Input
            id="postCode"
            {...register("postCode", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            id="password"
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mobile">Mobile No</label>
          <Input
            type="tel"
            id="mobile"
            {...register("mobile", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="dob">Date of Birth</label>
          <Input
            type="date"
            id="dob"
            {...register("dob", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="pob">Place of Birth</label>
          <Input
            id="pob"
            {...register("pob", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="maritalStatus">Marital Status</label>
          <Select onValueChange={(value) => register("maritalStatus").onChange({ target: { value } })}>
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
        <div className="space-y-2">
          <label htmlFor="gender">Gender</label>
          <Select onValueChange={(value) => register("gender").onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
