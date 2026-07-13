
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import SectionPage from "./pages/SectionPage";
import DesignerPage from "./pages/DesignerPage";
import PrivacyPage from "./pages/PrivacyPage";
import OffertaPage from "./pages/OffertaPage";
import AboutPage from "./pages/AboutPage";
import AdvertisePage from "./pages/AdvertisePage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import GuidesPage from "./pages/GuidesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/offerta" element={<OffertaPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/:sectionId" element={<SectionPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;