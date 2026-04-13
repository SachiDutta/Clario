import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Router, Switch, Route, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import AIChatbot from "@/components/AIChatbot";
import Home from "@/pages/Home";
import Analyze from "@/pages/Analyze";
import Simulator from "@/pages/Simulator";
import Compare from "@/pages/Compare";

const queryClient = new QueryClient();

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22, ease: "easeIn" } },
};

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return null;
}

function AnimatedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Component />
    </motion.div>
  );
}

function Pages() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location} location={location}>
        <Route path="/" component={() => <AnimatedRoute component={Home} />} />
        <Route path="/analyze" component={() => <AnimatedRoute component={Analyze} />} />
        <Route path="/simulator" component={() => <AnimatedRoute component={Simulator} />} />
        <Route path="/compare" component={() => <AnimatedRoute component={Compare} />} />
        <Route component={() => <AnimatedRoute component={Home} />} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div
            className="min-h-screen bg-[#020817] text-white font-sans selection:bg-primary/30 selection:text-white"
          >
            <ScrollToTop />
            <Navbar />
            <Pages />
            <AIChatbot />
          </div>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
