import { createContext } from "react";
import { StepperContextType } from "./types";

export const StepperContext = createContext<StepperContextType>({
  stepperRef: { current: null } as unknown as React.RefObject<
    HTMLDivElement & {
      nextStep: () => void;
      prevStep: () => void;
      goToStep: (step: number) => void;
    }
  >,
});
