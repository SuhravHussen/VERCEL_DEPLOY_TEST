import React, { createContext } from "react";
import { IStepperMethods } from "@/components/ui/stepper";

// Create a context for the stepper to be used across steps
export const TestStepperContext = createContext<{
  stepperRef: React.RefObject<IStepperMethods | null>;
}>({
  stepperRef: { current: null },
});
