import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Users, UserCheck, ClipboardList, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

export default function Dashboard() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeCollectors, setActiveCollectors] = useState(0);
  const [pendingRegistrations, setPendingRegistrations] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [membershipTypeData, setMembershipTypeData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total members using count
        const { count: membersCount, error: membersError } = await supabase
          .from("members")
          .select('*', { count: 'exact', head: true });
        
        if (membersError) throw membersError;
        setTotalMembers(membersCount || 0);

        // Fetch active collectors
        const { data: collectorsData, error: collectorsError } = await supabase
          .from("collectors")
          .select("*", { count: 'exact' })
          .eq('active', true);
        if (collectorsError) throw collectorsError;
        setActiveCollectors(collectorsData.length);

        // Fetch pending registrations
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('registrations')
          .select("*")
          .eq('status', 'pending');
        if (registrationsError) throw registrationsError;
        setPendingRegistrations(registrationsData.length);

        // Fetch monthly revenue (This is a simplified example, you might need a more complex query or a database function)
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('amount')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        if (paymentsError) throw paymentsError;

        const totalRevenue = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
        setMonthlyRevenue(totalRevenue);

        // Fetch membership type distribution
        const { data: membershipTypes, error: membershipTypesError } = await supabase
          .from('members')
          .select('membership_type') as {data: {membership_type: string}[], error: any};

        if (membershipTypesError) throw membershipTypesError;

        const typeCounts = membershipTypes.reduce((acc, curr) => {
          acc[curr.membership_type] = (acc[curr.membership_type] || 0) + 1;
          return acc;
        }, {});

        const formattedMembershipTypeData = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value: value as number,
        }));
        setMembershipTypeData(formattedMembershipTypeData);

        // Fetch membership data for chart (This is a simplified example, you might need a more complex query or a database function)
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const monthlyData = [];
        for (let i = 0; i < 5; i++) {
          const month = new Date(currentYear, currentMonth - i);
          const monthName = month.toLocaleString('default', { month: 'short' });
          const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
          const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();

          const { data: monthlyMembers, error: monthlyMembersError } = await supabase
            .from('members')
            .select('*', { count: 'exact' })
            .gte('created_at', firstDayOfMonth)
            .lt('created_at', lastDayOfMonth);

          if (monthlyMembersError) throw monthlyMembersError;

          const { data: monthlyPayments, error: monthlyPaymentsError } = await supabase
            .from('payments')
            .select('amount')
            .gte('created_at', firstDayOfMonth)
            .lt('created_at', lastDayOfMonth);

          if (monthlyPaymentsError) throw monthlyPaymentsError;

          const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

          monthlyData.push({
            month: monthName,
            members: monthlyMembers.length,
            revenue: monthlyRevenue,
          });
        }
        setMembershipData(monthlyData.reverse());

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button className="w-full">
            <Activity className="mr-2 h-4 w-4" />
            Quick Analysis
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          icon={<Users className="h-6 w-6" />} 
          title="Total Members" 
          value={totalMembers.toString()}
          trend={{ value: "+10%", positive: true }} // Placeholder, needs actual trend calculation
        />
        <StatsCard 
          icon={<UserCheck className="h-6 w-6" />} 
          title="Active Collectors" 
          value={activeCollectors.toString()}
          trend={{ value: "0%", positive: true }} // Placeholder, needs actual trend calculation
        />
        <StatsCard 
          icon={<ClipboardList className="h-6 w-6" />} 
          title="Pending Registrations" 
          value={pendingRegistrations.toString()}
          trend={{ value: "-25%", positive: false }} // Placeholder, needs actual trend calculation
        />
        <StatsCard 
          icon={<DollarSign className="h-6 w-6" />} 
          title="Monthly Revenue" 
          value={`£${monthlyRevenue.toFixed(2)}`}
          trend={{ value: "+12%", positive: true }} // Placeholder, needs actual trend calculation
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Membership & Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={membershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="members" fill="hsl(var(--primary))" name="Members" />
                  <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--primary)/0.5)" name="Revenue (£)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Membership Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {membershipTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                Export Member List
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <ClipboardList className="h-6 w-6 mb-2" />
                Review Pending Applications
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                <DollarSign className="h-6 w-6 mb-2" />
                Financial Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ 
  icon, 
  title, 
  value, 
  trend 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  trend: { value: string; positive: boolean } 
}) {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {trend.value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
