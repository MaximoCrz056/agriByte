import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DemoForm from "@/components/DemoForm";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ManageUsers from "./components/ManageUsers";
import ManageGreenhouses from "./components/ManageGreenhouses";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuth from "./pages/NotAuth";
import DashboardFarm from "./pages/DashboardFarm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<DemoForm />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-greenhouses" element={<ManageGreenhouses />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute farmerOnly={true} />}>
            <Route path="/dashboard-farmer" element={<DashboardFarm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
          <Route path="/not-auth" element={<NotAuth />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
