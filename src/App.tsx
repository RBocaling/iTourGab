import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import MainApp from "./pages/MainApp";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

const App = () => {
  const googleClientId =
    "1044098837547-9fggm8fboc2o00v5uog49a64uuhag2bd.apps.googleusercontent.com";
  const isGoogleEnabled = Boolean(googleClientId);

  const content = (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/welcome-to-i-tour-gab" element={<LandingPage />} />
            <Route path="/*" element={<MainApp />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  if (isGoogleEnabled) {
    return (
      <GoogleOAuthProvider clientId="499708572275-dsql3ijmj6p5314mfl4pov0da835o08g.apps.googleusercontent.com">
        {content}
      </GoogleOAuthProvider>
    );
  }

  return content;
};

export default App;
