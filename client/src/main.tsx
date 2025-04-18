import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./lib/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { GuidanceProvider } from "@/hooks/use-guidance";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GuidanceProvider>
        <App />
        <Toaster />
      </GuidanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);
