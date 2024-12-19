import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/medical-examiner/PageHeader";
import { ProcessSection } from "@/components/medical-examiner/ProcessSection";
import { FeesTable } from "@/components/medical-examiner/FeesTable";
import { BurialTimesTable } from "@/components/medical-examiner/BurialTimesTable";
import { StandingRegulations } from "@/components/medical-examiner/StandingRegulations";

const noExclusiveRightFees = [
  { service: "Child in the Forget Me Not Garden", fee: "No charge" },
  { service: "Stillborn child or child under 16 years (unpurchased grave)", fee: "No charge" },
  { service: "Child from outside of East Staffordshire", fee: "£48.00" },
  { service: "Person over 16 years", fee: "£792.00" },
];

const exclusiveRightFees = [
  { service: "Purchase of Exclusive Right of Burial", fee: "£1,245.00" },
  { service: "Purchase of Exclusive Right of Burial for cremated remains", fee: "£433.00" },
  { service: "Additional cost for bricked grave", fee: "£219.00" },
  { service: "Burial of cremated remains", fee: "£219.00" },
  { service: "Admin charge for multiple interments", fee: "£54.00" },
];

const monumentFees = [
  { service: "Standard gravestone (up to 1,350mm × 914mm × 460mm)", fee: "£378.00" },
  { service: "Cremated remains memorial (up to 610mm × 610mm × 460mm)", fee: "£378.00" },
  { service: "Vase (unless incorporated in memorial)", fee: "£94.00" },
  { service: "Additional inscription", fee: "£122.00" },
  { service: "Forget-Me-Not Memorial", fee: "£60.00" },
  { service: "Full kerbset (kerbs & headstone)", fee: "£1,267.00" },
];

const MedicalExaminerProcess = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <PageHeader />

      <div className="space-y-8">
        <ProcessSection />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Cemetery Fees and Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                <FeesTable 
                  title="Graves without Exclusive Right of Burial" 
                  data={noExclusiveRightFees} 
                />
                
                <FeesTable 
                  title="Graves with Exclusive Right of Burial" 
                  data={exclusiveRightFees} 
                />
                
                <FeesTable 
                  title="Monument and Memorial Permits" 
                  data={monumentFees} 
                />
                
                <BurialTimesTable />
                
                <StandingRegulations />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalExaminerProcess;