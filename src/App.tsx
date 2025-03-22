
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import Index from "./pages/Index";
import ViewDocuments from "./pages/ViewDocuments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfileSettings from "./pages/ProfileSettings";
import BusinessDetails from "./pages/BusinessDetailsPage";
import PaymentMethods from "./pages/PaymentMethodsPage";
import GeneralSettingsPage from "./pages/GeneralSettingsPage";
import ClientsPage from "./pages/ClientsPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdsFreePage from "./pages/AdsFreePage";
import SecurityPage from "./pages/SecurityPage";
import NotificationsPage from "./pages/NotificationsPage";
import TemplateSettingsPage from "./pages/TemplateSettingsPage";
import CreateQuotation from "./pages/CreateQuotation";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
};

// Public only route for auth pages (to prevent accessing /sign-in when already logged in)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// AppRoutes component to use auth context
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/sign-in" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />
      <Route path="/sign-up" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/document/:id" element={<ProtectedRoute><ViewDocuments /></ProtectedRoute>} />
      <Route path="/create/quotation" element={<ProtectedRoute><CreateQuotation /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
      <Route path="/settings/business" element={<ProtectedRoute><BusinessDetails /></ProtectedRoute>} />
      <Route path="/settings/payment" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
      <Route path="/settings/general" element={<ProtectedRoute><GeneralSettingsPage /></ProtectedRoute>} />
      <Route path="/settings/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
      <Route path="/settings/ads-free" element={<ProtectedRoute><AdsFreePage /></ProtectedRoute>} />
      <Route path="/settings/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
      <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/settings/templates" element={<ProtectedRoute><TemplateSettingsPage /></ProtectedRoute>} />
      
      {/* Handle /create route - redirect to home */}
      <Route path="/create" element={<Navigate to="/" replace />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider storageKey="documents-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
