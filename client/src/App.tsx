import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { EnhancedLoadingScreen } from "@/components/Enhanced/LoadingScreen";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dark min-h-screen bg-black text-white" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isLoading && <EnhancedLoadingScreen />}
          {!isLoading && (
            <Router>
              <Switch>
                <Route path="/" component={Index} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/tools" component={Tools} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
