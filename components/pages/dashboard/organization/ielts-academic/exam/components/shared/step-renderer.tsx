"use client";

import {
  BaseStepProps,
  StepNavigationProps,
  BasicInfoStepProps,
  PreviewStepProps,
} from "@/types/exam/ielts-academic/exam-creation";

// Import step components
import { BasicInfoStep } from "../basic-info-step";
import { TestSelectionStep } from "../test-selection-step";
import { LRWGroupStep } from "../lrw-group-step";
import { SpeakingGroupStep } from "../speaking-group-step";
import { PreviewStep } from "../preview-step";

interface StepRendererProps extends BaseStepProps, StepNavigationProps {
  currentStep: number;
  isAdmin?: boolean;
  organizationSlug: string;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  examData,
  updateExamData,
  organizationSlug,
  onNext,
  onPrevious,
  isEditMode,
  examId,
  isAdmin,
}) => {
  const renderStepContent = () => {
    const baseProps: BaseStepProps = {
      examData,
      updateExamData,
      organizationSlug,
      isEditMode,
      examId,
      isAdmin,
    };

    const navigationProps: StepNavigationProps = {
      onNext,
      onPrevious,
    };

    switch (currentStep) {
      case 1:
        const basicInfoProps: BasicInfoStepProps = {
          ...baseProps,
          onNext,
        };
        return <BasicInfoStep {...basicInfoProps} />;

      case 2:
        return <TestSelectionStep {...baseProps} {...navigationProps} />;

      case 3:
        return <LRWGroupStep {...baseProps} {...navigationProps} />;

      case 4:
        return <SpeakingGroupStep {...baseProps} {...navigationProps} />;

      case 5:
        const previewProps: PreviewStepProps = {
          ...baseProps,
          onPrevious,
        };
        return <PreviewStep {...previewProps} />;

      default:
        return null;
    }
  };

  return <div className="min-h-[600px]">{renderStepContent()}</div>;
};
