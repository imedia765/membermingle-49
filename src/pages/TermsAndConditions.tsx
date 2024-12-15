import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Terms and Conditions
            </CardTitle>
            <p className="text-muted-foreground">Version 4 - December 2024</p>
            <p className="text-lg font-semibold">Pakistan Welfare Association</p>
            <p className="text-muted-foreground">Burton Upon Trent</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Members Eligibility</h2>
                <p>Only Muslims can be members of Pakistan Welfare Association (PWA).</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. Membership Fee</h2>
                <p>Any new members must pay a membership fee plus the collection amount for that calendar year. Currently the membership fee is £150 as of January 2024. This may change with inflation and is reviewed periodically to reflect the costs incurred.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">3. Dependents Registration</h2>
                <p>All members will be given a membership number and will need to register their dependents so that the PWA Committee can gain an accurate picture of the actual number of people covered. Dependents include stepchildren and adopted children.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">4. Health Declaration</h2>
                <p>New members must be in good health, with no known terminal illnesses. Any long-term illnesses must be disclosed to the Committee for consideration during the membership process.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">5. Confidentiality</h2>
                <p>All data is confidentially stored under GDPR rules and will not be shared except for necessary processes when death occurs or for use within PWA.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Payment Terms</h2>
                <p>Payments will need to be made within 28 days from collection date. This will take place annually from 1st January and no later than 29th January. Any non-paying members will have a warning, and have seven days to make payment which is up until 5th February, in this seven day period they are not covered as members and nor are their dependents.</p>
                <p className="mt-2">Any further nonpayment will result in cancellation of membership, and will have to re-register as a member, and must pay a new membership fee of £150. All costs are reviewed periodically to reflect inflation, changes will be communicated to members via their Collector Members or directly through a communication mechanism.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">7. Registration Requirements</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Every married man will need to ensure they are registered separately from their parents or guardian.</li>
                  <li>Every young male over the age of 18 must have membership in the association regardless to the fact they are employed/unemployed or disabled except for being in full time education until their 22nd birthday. No membership charges will apply to migrating members up until their 23rd birthday, where a new membership charge is applicable. Apprenticeships do not count as being in education.</li>
                  <li>As and when a members child leaves full time education, they must also register as an individual member. Membership migrated from an existing member does not require to pay membership fees. An adult relative wanting to join, who has never been a member before must follow No 2 above.</li>
                  <li>Any young person who is 22 years of age or over and attends university must still ensure they are registered as members and not automatically assume they have been migrated into a membership.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">8. Special Cases</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unmarried females are not obliged to become members as they will have their membership as part of their parents until they are married following which they will be covered under their husband's membership if he is a member. Therefore, females must not assume they are automatically covered after marriage and must ensure their husband is a member to be covered.</li>
                  <li>If a marriage separation occurs (both live separately) or divorced, with or without children, females and males must have separate memberships.</li>
                  <li>Any lady who is separated from her husband and living with her parents will need to apply as a separate member and pay fees accordingly.</li>
                  <li>Any widowed lady will be considered as the head of the family, and she will still need to ensure her fees are paid regularly regardless to the fact she has children or not.</li>
                  <li>Any male with an additional wife, or wives, must explicitly register their dependants so they are covered. Each additional wife will require additional membership regardless of offspring.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">9. Assistance Offered</h2>
                <p>If a head member of family passes away, a £500 payment is offered to the widow, or orphans under the age of 18 only, in this circumstance if death occurs in Pakistan £1,000 is offered. This is subject to review of the committee to reflect changes in inflation.</p>
                <p className="mt-2">PWA will cover costs for both viable and non-viable foetus.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">10. Residency Requirements</h2>
                <p>Any member who must live out of East Staffordshire Borough Council (ESBC) for work will still receive full benefits of the association. This will be determined by where you are registered for Council Tax or can prove you are an ESBC resident.</p>
                <p className="mt-2">It is advisable for members to be able to prove ESBC residency, such as be on the electoral roll in ESBC or bank statements and proof of address. If you are unable to prove being an ESBC resident may make you liable for triple costs of burial currently set by ESBC, which is on the ESBC website under burial fees and is subject to change at the council's discretion. PWA will only cover the first set of fees which is the cost for being a ESBC resident.</p>
                <p className="mt-2">Any member who moves out of ESBC who are legacy members (pre-2024), will be covered to the costs of the average cost of the last 4 burials, all other costs will be the responsibility of the deceased family. Any members who joined after 2024 will not be covered if they have moved out of ESBC boundaries as defined by the council and will no longer be members of PWA.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">11. Visitor Membership</h2>
                <p>Any visitors of members of the association from other countries will be able to apply for membership for the duration of the temporary stay at a fixed rate of £50 plus last collection, which is non-refundable. As and when a collection is decided on from all members the visitor must also pay their contribution. If the visitor’s status changes, then the visitor must become a new member as per the above guidance. The earlier fee paid will then be deducted from the new membership fee.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">12. Repatriation Costs</h2>
                <p>Where there are circumstances of repatriation to a foreign country, the maximum costs paid are the average of the last 4 UK burials. Cargo costs vary from airlines and can be substantial and fluctuate and are no longer free as previously offered by PIA. The responsibility of costs is up until delivery to any airport in England, any delays or lost cargo are solely the responsibility of the deceased family.</p>
                <p className="mt-2">Where there are circumstances of repatriation back to the UK, where the body is being brought back for burial. The Association is responsible for collection from any airport in England, all costs incurred before this is the responsibility of the deceased family.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">13. Financial Buffer</h2>
                <p>There should be a buffer amount of collected funds in the bank account for the equivalent amount to the cost of 4 deaths, currently amounting to £16,000, in the PWA bank account. Anything below this should trigger a new collection. This is to cover the immediate costs should there be an unforeseen tragedy within one family.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">14. Funeral Arrangements</h2>
                <p>Family members may want to use other funeral providers and may make extra arrangements for funeral services, this extra cost is the responsibility of the family, PWA will only pay the sum of the usual costs from providers used from their preferred/regular funeral provider.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">15. Committee Changes</h2>
                <p>Any changes to payments made, or rule changes must be voted in within the Committee. This should be communicated to other collector members, and then a wider communication made to members.</p>
              </section>

              <div className="mt-8 pt-4 border-t">
                <p className="text-center">By becoming a member of the Pakistan Welfare Association, you agree to abide by these terms and conditions outlined above.</p>
                <p className="text-center text-sm text-muted-foreground mt-4">© 2024 Pakistan Welfare Association. All rights reserved.</p>
              </div>
            </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
