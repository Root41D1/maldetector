
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScanHistoryProvider } from "@/contexts/ScanHistoryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";
import ScanResultPage from "./pages/ScanResultPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  // Add console logs to debug rendering
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScanHistoryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route 
                  path="/scan" 
                  element={
                    <ProtectedRoute>
                      <ScanPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/scan-result/:id" 
                  element={
                    <ProtectedRoute>
                      <ScanResultPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/subscription" 
                  element={
                    <ProtectedRoute>
                      <SubscriptionPage />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ScanHistoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
