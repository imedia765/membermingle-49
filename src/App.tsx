import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { NavigationMenu } from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TermsAndConditions from "./pages/TermsAndConditions";
import CollectorResponsibilities from "./pages/CollectorResponsibilities";
import MedicalExaminerProcess from "./pages/MedicalExaminerProcess";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Members from "./pages/admin/Members";
import Collectors from "./pages/admin/Collectors";
import Registrations from "./pages/admin/Registrations";
import Database from "./pages/admin/Database";
import Finance from "./pages/admin/Finance";
import Support from "./pages/admin/Support";
import Profile from "./pages/admin/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <NavigationMenu />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/collector-responsibilities" element={<CollectorResponsibilities />} />
                <Route path="/medical-examiner-process" element={<MedicalExaminerProcess />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="members" element={<Members />} />
                  <Route path="collectors" element={<Collectors />} />
                  <Route path="registrations" element={<Registrations />} />
                  <Route path="database" element={<Database />} />
                  <Route path="finance" element={<Finance />} />
                  <Route path="support" element={<Support />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;