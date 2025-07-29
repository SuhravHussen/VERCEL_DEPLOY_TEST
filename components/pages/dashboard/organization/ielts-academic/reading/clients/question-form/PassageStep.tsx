"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Editor } from "@tiptap/react";
import { useContext, useEffect, useState } from "react";
import { StepperContext } from "../CreateQuestionPageClient";

interface PassageData {
  title: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
}

interface PassageStepProps {
  formData: PassageData;
  updateFormData: (data: Partial<PassageData>) => void;
}

export default function PassageStep({
  formData,
  updateFormData,
}: PassageStepProps) {
  const { stepperRef } = useContext(StepperContext);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Update content when editor changes
  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        updateFormData({ content: editor.getHTML() });
      };

      editor.on("update", handleUpdate);

      return () => {
        editor.off("update", handleUpdate);
      };
    }
  }, [editor, updateFormData]);

  // Validate form
  useEffect(() => {
    const valid =
      !!formData.title && !!formData.content && !!formData.difficulty;
    console.log("Form validation:", {
      title: !!formData.title,
      content: !!formData.content,
      difficulty: !!formData.difficulty,
      valid,
    });
    setIsValid(valid);
  }, [formData]);

  const handleNext = () => {
    console.log("Handle next clicked", {
      stepperRef: stepperRef.current,
      isValid,
      formData,
    });
    if (stepperRef.current) {
      console.log("Calling nextStep...");
      stepperRef.current.nextStep();
    } else {
      console.error("stepperRef.current is null");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Passage Title</Label>
          <Input
            id="title"
            placeholder="Enter passage title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
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
          <Label>Passage Content</Label>
          <div className="border rounded-md min-h-[400px]">
            <SimpleEditor
              key={formData.content} // Re-initialize editor when content changes
              onEditorReady={setEditor}
              initialContent={formData.content}
            />
          </div>
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
