
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrowseEquipment from "./pages/BrowseEquipment";
import BookingFlow from "./pages/BookingFlow";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingWorkflow from "./pages/BookingWorkflow";
import CustomerBooking from "./pages/CustomerBooking";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import AdminRoute from "./pages/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse/:categoryId" element={<BrowseEquipment />} />
          <Route path="/book/:categoryId" element={<BookingFlow />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/admin/login" element={<AuthPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireSuperAdmin>
                <AdminRoute />
              </ProtectedRoute>
            } 
          />
          <Route path="/booking" element={<BookingWorkflow />} />
          <Route path="/customer-booking" element={<CustomerBooking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
