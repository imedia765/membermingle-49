import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { countries } from "@/data/countries";
import { useLocation } from "react-router-dom";

interface PersonalInfoProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

interface LocationState {
  memberId?: string;
  prefilledData?: {
    fullName: string;
    address: string;
    town: string;
    postCode: string;
    mobile: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    email: string;
  };
}

export const PersonalInfoSection = ({ register, setValue, watch }: PersonalInfoProps) => {
  const location = useLocation();
  const state = location.state as LocationState;
  const gender = watch("gender");

  useEffect(() => {
    if (state?.prefilledData) {
      const data = state.prefilledData;
      setValue("fullName", data.fullName);
      setValue("address", data.address || "");
      setValue("town", data.town || "");
      setValue("postCode", data.postCode || "");
      setValue("mobile", data.mobile || "");
      setValue("dob", data.dob || "");
      setValue("gender", data.gender || "male");
      setValue("maritalStatus", data.maritalStatus || "");
      setValue("email", data.email || "");
    }
  }, [state, setValue]);

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
          <Select onValueChange={(value) => setValue("pob", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country of Birth" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="maritalStatus">Marital Status</label>
          <Select onValueChange={(value) => setValue("maritalStatus", value)}>
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
        <div className="space-y-4">
          <Label htmlFor="gender">Gender</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="gender"
              checked={gender === "male"}
              onCheckedChange={(checked) => setValue("gender", checked ? "male" : "female")}
            />
            <Label htmlFor="gender" className="text-sm">
              {gender === "male" ? "Male" : "Female"}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};