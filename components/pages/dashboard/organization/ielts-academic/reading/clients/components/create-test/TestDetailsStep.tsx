import React, { useContext, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TestDetailsStepProps } from "./types";
import { StepperContext } from "./StepperContext";

export function TestDetailsStep({
  formData,
  updateFormData,
}: TestDetailsStepProps) {
  const { stepperRef } = useContext(StepperContext);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(!!formData.title && formData.timeLimit > 0);
  }, [formData]);

  const handleNext = () => {
    if (stepperRef.current) {
      stepperRef.current.nextStep();
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Test Title</Label>
          <Input
            id="title"
            placeholder="Enter test title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter test description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <RadioGroup
            value={formData.difficulty}
            onValueChange={(value) =>
              updateFormData({
                difficulty: value as "easy" | "medium" | "hard",
              })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy">Easy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard">Hard</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Test Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="Enter test instructions"
            value={formData.instructions}
            onChange={(e) => updateFormData({ instructions: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimit">Time Limit (Minutes)</Label>
          <Input
            id="timeLimit"
            type="number"
            placeholder="60"
            value={formData.timeLimit}
            onChange={(e) =>
              updateFormData({ timeLimit: Number(e.target.value) })
            }
            min={1}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="min-w-[120px]"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
