import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { UserProvider } from "./context/UserContext";
import Chatbot from "@/components/Chatbot";


const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Index = lazy(() => import("./pages/Index"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Insights = lazy(() => import("./pages/Insights"));
const Loans = lazy(() => import("./pages/Loans"));
const Settings = lazy(() => import("./pages/Settings"));
const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));
const PersonalDashboard = lazy(() => import("./pages/PersonalDashboard"));
const SignUp = lazy(() => import("./pages/SignUp"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const AllRecommendations = lazy(() => import("./pages/AllRecommendations"));
const FinancialAnalysis = lazy(() => import("./pages/FinancialAnalysis"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <Suspense
            fallback={
              <div className="min-h-screen grid place-items-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/personal" element={<PersonalDashboard />} />
              <Route path="/public/:userId?" element={<PublicDashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/recommendations" element={<AllRecommendations />} />
              <Route path="/financial-analysis" element={<FinancialAnalysis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
          </Suspense>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;