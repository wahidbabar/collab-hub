"use client";

import { Provider } from "jotai";
import React from "react";

interface JotaiProviderProps {
  children: React.ReactNode;
}

const JotaiProvider = ({ children }: JotaiProviderProps) => {
  return <Provider>{children}</Provider>;
};

export default JotaiProvider;
