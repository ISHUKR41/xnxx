import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="dark min-h-screen bg-black text-white" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isLoading && (
            <LoadingScreen 
              onComplete={() => setIsLoading(false)}
              duration={3000}
            />
          )}
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
