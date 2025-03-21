
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import CreateDocument from "./pages/CreateDocument";
import ViewDocuments from "./pages/ViewDocuments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfileSettings from "./pages/ProfileSettings";
import BusinessDetails from "./pages/BusinessDetailsPage";
import PaymentMethods from "./pages/PaymentMethodsPage";
import GeneralSettingsPage from "./pages/GeneralSettingsPage";
import ClientsPage from "./pages/ClientsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="documents-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateDocument />} />
            <Route path="/document/:id" element={<ViewDocuments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/profile" element={<ProfileSettings />} />
            <Route path="/settings/business" element={<BusinessDetails />} />
            <Route path="/settings/payment" element={<PaymentMethods />} />
            <Route path="/settings/general" element={<GeneralSettingsPage />} />
            <Route path="/settings/clients" element={<ClientsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
