"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { Currency } from "@/types/currency";
import {
  BasicInfoStepProps,
  ValidationErrors,
} from "@/types/exam/ielts-academic/exam-creation";
import { validateBasicInfo } from "../utils/form-validation";
import { ExamDetailsForm } from "./basic-info/exam-details-form";
import { PricingForm } from "./basic-info/pricing-form";

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  examData,
  updateExamData,
  onNext,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback(() => {
    const newErrors = validateBasicInfo(examData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [examData]);

  const handleNext = useCallback(() => {
    if (validateForm()) {
      onNext();
    }
  }, [validateForm, onNext]);

  const handleInputChange = useCallback(
    (
      field: keyof IELTSExamModel,
      value: string | number | boolean | Currency
    ) => {
      updateExamData({ [field]: value });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [updateExamData, errors]
  );

  // Check form completion
  const hasRequiredFields = !!(
    examData.title &&
    examData.currency &&
    (examData.is_free || examData.price)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-2 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            Basic Information & Pricing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enter the basic details and pricing information for your IELTS
            Academic exam. This information will be visible to students during
            registration.
          </p>
        </div>

        {/* Form Completion Status */}
        <Card className="border-2 border-border/50 shadow-sm mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Form Completion</p>
                  <p className="text-sm text-muted-foreground">
                    {hasRequiredFields
                      ? "All required fields completed"
                      : "Please fill in all required fields"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      examData.title ? "bg-green-500" : "bg-muted"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    Basic Details
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      (examData.is_free || examData.price) && examData.currency
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">Pricing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Forms */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div className="space-y-6">
            <ExamDetailsForm
              examData={examData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          </div>

          <div className="space-y-6">
            <PricingForm
              examData={examData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-border/50">
          <Button
            onClick={handleNext}
            disabled={!hasRequiredFields}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
