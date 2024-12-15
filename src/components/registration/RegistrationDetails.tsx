import { CardContent } from "@/components/ui/card";
import { Registration } from "@/types/registration";

interface RegistrationDetailsProps {
  registration: Registration;
}

export const RegistrationDetails = ({ registration }: RegistrationDetailsProps) => {
  const personalInfo = registration.personalInfo || {};
  const nextOfKin = registration.nextOfKin || {};

  return (
    <CardContent className="pt-0">
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 text-primary">Personal Information</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(personalInfo).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-muted-foreground">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-primary">Next of Kin</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(nextOfKin).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium capitalize">{key}</p>
                <p className="text-sm text-muted-foreground">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        {registration.spouses && registration.spouses.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-primary">Spouses</h4>
            <div className="space-y-4">
              {registration.spouses.map((spouse, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{spouse.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">{spouse.dateOfBirth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {registration.dependants && registration.dependants.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-primary">Dependants</h4>
            <div className="space-y-4">
              {registration.dependants.map((dependant, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{dependant.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">{dependant.dateOfBirth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">{dependant.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">{dependant.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};