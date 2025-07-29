import React, { createContext } from "react";
import { IStepperMethods } from "@/components/ui/stepper";

interface StepperContextType {
  stepperRef: React.RefObject<HTMLDivElement & IStepperMethods>;
}

export const StepperContext = createContext<StepperContextType>({
  stepperRef: { current: null } as unknown as React.RefObject<
    HTMLDivElement & IStepperMethods
  >,
});
