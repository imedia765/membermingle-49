export function StandingRegulations() {
  return (
    <section className="prose dark:prose-invert max-w-none">
      <h3 className="text-lg font-semibold mb-4 text-primary">Standing Regulations</h3>
      <div className="space-y-4 text-foreground">
        <p>
          The fees apply only to those residing in the Borough of East Staffordshire at the time of death. 
          The normal requirement for residency is that the deceased lived within the Borough for the twelve months prior to death.
        </p>
        <p>
          For non-residents, the interment fee and Exclusive Right of Burial fee (where applicable) is trebled. 
          Non-residents are exempt from the trebled fees if they meet any of the following criteria:
        </p>
        <ul className="list-disc pl-6 text-foreground">
          <li>The deceased had previously lived within the Borough within the last 20 years for a period exceeding 5 years</li>
          <li>The deceased was a former resident within the Borough within the last 20 years for a period exceeding 5 years but moved outside the Borough to a rest/nursing home</li>
        </ul>
      </div>
    </section>
  );
}