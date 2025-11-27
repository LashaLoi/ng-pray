"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const QueryProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
