import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PatientProvider } from "./contexts/PatientContext";
import Home from "./pages/Home";
import Laboratory from "./pages/Laboratory";
import Trends from "./pages/Trends";
import Dashboard from "./pages/Dashboard";
import ExamsDetail from "./pages/ExamsDetail";
import MedicalInsights from "./pages/MedicalInsights";
import SportsInsights from "./pages/SportsInsights";
import CompleteHistory from "./pages/CompleteHistory";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/exams" component={ExamsDetail} />
      <Route path="/medical-insights" component={MedicalInsights} />
      <Route path="/sports-insights" component={SportsInsights} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/laboratory" component={Laboratory} />
      <Route path="/trends" component={Trends} />
      <Route path="/history" component={CompleteHistory} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <PatientProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </PatientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
