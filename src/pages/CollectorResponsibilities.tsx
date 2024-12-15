import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CollectorResponsibilities = () => {
  return (
    <div className="container py-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-8 animate-fade-in">
        PWA Collector Member Responsibilities
      </h1>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            A Collector member is a senior member of the PWA who is responsible for
            a specific number of paying members who are part of the death
            committee.
          </p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            Collector Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-muted-foreground list-disc list-inside">
            <li>Act as the representative of the death committee for each member on their list.</li>
            <li>Act as first point of contact for any enquiries from members or prospective members.</li>
            <li>Register new members with the death committee.</li>
            <li>Communicate announcements from death committee to members.</li>
            <li>Collect member's fees whenever a collection is due.</li>
            <li>
              Keep a record of all members' payments made into PWA bank account, including:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Date paid</li>
                <li>Reference used</li>
                <li>Bank account name</li>
              </ul>
            </li>
            <li>When consolidating collection with treasurer, share record/evidence of online payments if requested.</li>
            <li>Act as conduit between the members and death committee Senior Leadership Team (SLT) for any day-to-day issues.</li>
            <li>Attending Collectors meetings with other members.</li>
            <li>Provide guidance to new members and prospective members seeking membership with the PWA.</li>
            <li>Feedback any issues or concerns to the PWA SLT.</li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-8">
        As a Collector Member, you play a crucial role in the smooth operation and
        communication within the Pakistan Welfare Association.
      </p>

      <footer className="text-center text-sm text-muted-foreground mt-12 pb-8">
        © 2024 Pakistan Welfare Association. All rights reserved.
      </footer>
    </div>
  );
};

export default CollectorResponsibilities;