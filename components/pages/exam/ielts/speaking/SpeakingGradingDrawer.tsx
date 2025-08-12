"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/user";
import { SectionGrade } from "@/types/exam/exam-submission";
import {
  useGetSpeakingGrade,
  useAddSpeakingGrade,
  useUpdateSpeakingGrade,
} from "@/hooks/organization/speaking-sessions/use-speaking-grades";
import { SuccessMessage } from "@/components/shared/SuccessMessage";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Spinner } from "@/components/ui/spinner-1";

interface SpeakingGradingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: User;
  speakingSession?: {
    id?: string;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
  };
}

interface GradeFormData {
  coherence_and_cohesion: string;
  lexical_resource: string;
  grammatical_range_and_accuracy: string;
  pronunciation: string;
  band_score: string;
  feedback: string;
}

const bandScores = [
  9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1,
];

export function SpeakingGradingDrawer({
  isOpen,
  onClose,
  student,
  speakingSession,
}: SpeakingGradingDrawerProps) {
  const sessionId = speakingSession?.id || "";

  // If no session ID, we can't use the grading hooks
  const canGrade = Boolean(sessionId);

  // Form state
  const [formData, setFormData] = useState<GradeFormData>({
    coherence_and_cohesion: "",
    lexical_resource: "",
    grammatical_range_and_accuracy: "",
    pronunciation: "",
    band_score: "",
    feedback: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Hooks - only use if we have a session ID
  const {
    grade: existingGrade,
    isLoading: isLoadingGrade,
    hasGrade,
  } = useGetSpeakingGrade(canGrade ? sessionId : "");

  const { addGrade, isAdding, error: addError } = useAddSpeakingGrade();
  const {
    updateGrade,
    isUpdating,
    error: updateError,
  } = useUpdateSpeakingGrade();

  const isSubmitting = isAdding || isUpdating;
  const submitError = addError || updateError;

  // Load existing grade data into form
  useEffect(() => {
    if (existingGrade) {
      setFormData({
        coherence_and_cohesion:
          existingGrade.coherence_and_cohesion?.toString() || "",
        lexical_resource: existingGrade.lexical_resource?.toString() || "",
        grammatical_range_and_accuracy:
          existingGrade.grammatical_range_and_accuracy?.toString() || "",
        pronunciation: existingGrade.pronunciation?.toString() || "",
        band_score: existingGrade.band_score?.toString() || "",
        feedback: existingGrade.feedback || "",
      });
    }
  }, [existingGrade]);

  // Handle form input changes
  const handleInputChange = (field: keyof GradeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!canGrade || !sessionId) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    // Validate required fields
    const requiredFields: (keyof GradeFormData)[] = [
      "coherence_and_cohesion",
      "lexical_resource",
      "grammatical_range_and_accuracy",
      "pronunciation",
      "band_score",
    ];

    const isValid = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );
    if (!isValid) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    try {
      const gradeData: SectionGrade = {
        coherence_and_cohesion: parseFloat(formData.coherence_and_cohesion),
        lexical_resource: parseFloat(formData.lexical_resource),
        grammatical_range_and_accuracy: parseFloat(
          formData.grammatical_range_and_accuracy
        ),
        pronunciation: parseFloat(formData.pronunciation),
        band_score: parseFloat(formData.band_score),
        feedback: formData.feedback,
        graded_by: "current-instructor-id", // TODO: Get from auth context
        graded_at: new Date().toISOString(),
      };

      if (hasGrade) {
        await updateGrade({ sessionId, grade: gradeData });
      } else {
        await addGrade({ sessionId, grade: gradeData });
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  // Calculate average band score automatically
  useEffect(() => {
    const scores = [
      formData.coherence_and_cohesion,
      formData.lexical_resource,
      formData.grammatical_range_and_accuracy,
      formData.pronunciation,
    ]
      .map((s) => parseFloat(s))
      .filter((s) => !isNaN(s));

    if (scores.length === 4) {
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      const roundedAverage = Math.round(average * 2) / 2; // Round to nearest 0.5
      setFormData((prev) => ({
        ...prev,
        band_score: roundedAverage.toString(),
      }));
    }
  }, [
    formData.coherence_and_cohesion,
    formData.lexical_resource,
    formData.grammatical_range_and_accuracy,
    formData.pronunciation,
  ]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] bg-card text-card-foreground border-t border-border">
        <DrawerHeader className="border-b border-border">
          <DrawerTitle className="text-primary">
            {hasGrade ? "Update" : "Add"} Speaking Assessment
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            {hasGrade ? "Update the" : "Grade the"} speaking performance for{" "}
            {student.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Loading State */}
            {isLoadingGrade && (
              <div className="flex justify-center py-8">
                <Spinner size={32} />
              </div>
            )}

            {!isLoadingGrade && (
              <>
                {/* Success Message */}
                {showSuccess && (
                  <SuccessMessage
                    message={
                      hasGrade
                        ? "Grade Updated Successfully!"
                        : "Grade Added Successfully!"
                    }
                    description={`Speaking assessment for ${
                      student.name
                    } has been ${hasGrade ? "updated" : "saved"}.`}
                  />
                )}

                {/* Error Message */}
                {(showError || submitError) && (
                  <ErrorMessage
                    message={
                      submitError ||
                      (!canGrade
                        ? "Unable to grade: No speaking session information available."
                        : "Please fill in all required fields before submitting.")
                    }
                  />
                )}

                {/* No grading available warning */}
                {!canGrade && (
                  <ErrorMessage message="Speaking session information is not available. Grading is disabled." />
                )}

                {/* Session Information */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-primary">
                      Session Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Student:</span>
                        <span className="font-medium text-foreground">
                          {student.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-foreground">
                          {student.email}
                        </span>
                      </div>
                    </div>

                    {speakingSession && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium text-foreground">
                            {new Date(
                              speakingSession.date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium text-foreground">
                            {new Date(
                              speakingSession.start_time
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(
                              speakingSession.end_time
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge
                            variant="outline"
                            className="text-xs border-border text-foreground"
                          >
                            {speakingSession.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Speaking Criteria */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-primary">
                      Speaking Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Fluency & Coherence */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Fluency & Coherence{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-primary"
                          value={formData.coherence_and_cohesion}
                          onChange={(e) =>
                            handleInputChange(
                              "coherence_and_cohesion",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Band</option>
                          {bandScores.map((band) => (
                            <option key={band} value={band}>
                              Band {band}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lexical Resource */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Lexical Resource{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-primary"
                          value={formData.lexical_resource}
                          onChange={(e) =>
                            handleInputChange(
                              "lexical_resource",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Band</option>
                          {bandScores.map((band) => (
                            <option key={band} value={band}>
                              Band {band}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Grammatical Range & Accuracy */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Grammatical Range & Accuracy{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-primary"
                          value={formData.grammatical_range_and_accuracy}
                          onChange={(e) =>
                            handleInputChange(
                              "grammatical_range_and_accuracy",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select Band</option>
                          {bandScores.map((band) => (
                            <option key={band} value={band}>
                              Band {band}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Pronunciation */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Pronunciation{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-primary"
                          value={formData.pronunciation}
                          onChange={(e) =>
                            handleInputChange("pronunciation", e.target.value)
                          }
                        >
                          <option value="">Select Band</option>
                          {bandScores.map((band) => (
                            <option key={band} value={band}>
                              Band {band}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Overall Band Score */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Overall Speaking Band{" "}
                        <span className="text-muted-foreground text-xs">
                          (Auto-calculated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className="w-full max-w-xs text-sm border border-border rounded-md px-3 py-2 bg-muted text-foreground cursor-not-allowed"
                        value={
                          formData.band_score
                            ? `Band ${formData.band_score}`
                            : ""
                        }
                        readOnly
                        disabled
                      />
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Feedback & Comments
                      </label>
                      <textarea
                        className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                        rows={4}
                        placeholder="Provide detailed feedback on the student's speaking performance..."
                        value={formData.feedback}
                        onChange={(e) =>
                          handleInputChange("feedback", e.target.value)
                        }
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        className="flex-1 sm:flex-none"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canGrade}
                      >
                        {isSubmitting && <Spinner size={16} />}
                        {!canGrade
                          ? "Grading Unavailable"
                          : hasGrade
                          ? "Update Grade"
                          : "Save Grade"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-accent"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Close Assessment Panel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
