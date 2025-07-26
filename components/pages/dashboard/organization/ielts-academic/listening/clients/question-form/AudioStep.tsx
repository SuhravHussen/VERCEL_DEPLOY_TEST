import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StepperContext } from "../CreateListeningQuestionPageClient";
import { IELTSListeningAudio } from "@/types/exam/ielts-academic/listening/listening";
import { Music, UploadCloud } from "lucide-react";

interface AudioStepProps {
  formData: IELTSListeningAudio;
  updateFormData: (data: Partial<IELTSListeningAudio>) => void;
}

export default function AudioStep({
  formData,
  updateFormData,
}: AudioStepProps) {
  const { stepperRef } = React.useContext(StepperContext);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setFileName(file.name);

      // For demo purposes, we'll create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        updateFormData({ audioUrl: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // In a real production app, you'd upload to a server:
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload-audio', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // updateFormData({ audioUrl: data.audioUrl });
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="audio-title" className="text-sm mb-2">
          Audio Title
        </Label>
        <Input
          id="audio-title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
        />
      </div>

      <div className="border rounded-md p-4">
        <Label className="mb-2 block">Audio File</Label>
        {formData.audioUrl ? (
          <div className="mb-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <Music className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {fileName || "Audio file uploaded"}
              </span>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateFormData({ audioUrl: "" });
                    setFileName(undefined);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
            <audio controls className="w-full mt-2">
              <source src={formData.audioUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-md">
            <UploadCloud className="h-10 w-10 mb-2 text-muted-foreground" />
            <p className="text-muted-foreground mb-4 text-center">
              Upload audio file
            </p>
            <div>
              <Input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <label htmlFor="audio-upload">
                <Button
                  variant="outline"
                  disabled={uploading}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : "Select Audio"}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="difficulty" className="text-sm mb-2">
          Difficulty
        </Label>
        <Select
          value={formData.difficulty}
          onValueChange={(value) =>
            updateFormData({
              difficulty: value as "easy" | "medium" | "hard",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => stepperRef.current?.nextStep()}>Next</Button>
      </div>
    </div>
  );
}
