/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import ListeningTestOverlay from "./listening-test-overlay";
import ListeningTestNavigation from "./listening-test-navigation";
import QuestionRenderer from "./question-renderer";
import ListeningTestTimer from "./listening-test-timer";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";

interface ListeningTestPageProps {
  listeningTest: IELTSListeningTest;
  examId: string;
}

export default function ListeningTestPage({
  listeningTest,
  examId,
}: ListeningTestPageProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  // Convert sections to array format for easier handling
  const sections = [
    { id: 1, section: listeningTest.section_one },
    { id: 2, section: listeningTest.section_two },
    { id: 3, section: listeningTest.section_three },
    { id: 4, section: listeningTest.section_four },
  ];

  // Calculate section progress
  const sectionProgress = sections.reduce((acc, { id, section }) => {
    const questions = section.questions || [];
    let totalQuestions = 0;
    let answeredQuestions = 0;

    questions.forEach((group) => {
      const groupQuestions = (group as any).questions || [];
      totalQuestions += groupQuestions.length || 1;

      groupQuestions.forEach((question: any) => {
        const questionId = `q${question.number || question.gapId}`;
        if (answers[questionId]) {
          answeredQuestions++;
        }
      });

      // Handle group-level answers
      if (group.questionType === "multiple_choice_multiple_answers") {
        const groupAnswers = answers[`group_${group.id}`];
        if (
          groupAnswers &&
          Array.isArray(groupAnswers) &&
          groupAnswers.length > 0
        ) {
          answeredQuestions++;
        }
        totalQuestions = 1;
      }
    });

    acc[id] = { total: totalQuestions, answered: answeredQuestions };
    return acc;
  }, {} as Record<number, { total: number; answered: number }>);

  const handleStartTest = () => {
    setShowOverlay(false);
    setTestStarted(true);

    // Initialize audio for first section
    const firstSection = sections[0].section;
    if (firstSection.audio?.audioUrl) {
      const audio = new Audio(firstSection.audio.audioUrl);
      audio.addEventListener("loadeddata", () => {
        audio.play().catch(console.error);
      });
      setAudioElement(audio);
    }
  };

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmit = () => {
    console.log("Listening test answers:", answers);
    console.log("Exam ID:", examId);
    console.log("Total questions answered:", Object.keys(answers).length);

    // Here you would typically submit to a server action
    // For now, just logging the data as requested
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!testStarted) return;

      // Ctrl + Left/Right for section navigation
      if (event.ctrlKey && event.key === "ArrowLeft") {
        event.preventDefault();
        handlePreviousSection();
      } else if (event.ctrlKey && event.key === "ArrowRight") {
        event.preventDefault();
        handleNextSection();
      }
      // Alt + N for next section
      else if (event.altKey && event.key === "n") {
        event.preventDefault();
        handleNextSection();
      }
      // Alt + P for previous section
      else if (event.altKey && event.key === "p") {
        event.preventDefault();
        handlePreviousSection();
      }
      // Alt + F for finish (submit)
      else if (event.altKey && event.key === "f") {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, currentSection]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, [audioElement]);

  const currentSectionData = sections[currentSection - 1]?.section;
  const currentSectionQuestions = currentSectionData?.questions || [];

  if (!testStarted) {
    return (
      <ListeningTestOverlay
        isOpen={showOverlay}
        onStartTest={handleStartTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">IELTS Listening Test</h1>
            {audioElement && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Volume2 className="w-4 h-4" />
                <span>Audio playing</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ListeningTestTimer totalMinutes={40} onTimeUp={handleTimeUp} />
            <Button onClick={handleSubmit} variant="destructive">
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Navigation Sidebar */}
        <ListeningTestNavigation
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          sectionProgress={sectionProgress}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">
                  Part {currentSection}
                </h2>
                <p className="text-gray-600">
                  Questions {/* @ts-ignore */}
                  {currentSectionQuestions[0]?.question_range?.start || ""}
                  {currentSectionQuestions.length > 1 &&
                    ` - ${
                      currentSectionQuestions[
                        currentSectionQuestions.length - 1
                        //@ts-ignore
                      ]?.question_range?.end || ""
                    }`}
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-8">
                {currentSectionQuestions.map((questionGroup, index) => (
                  <QuestionRenderer
                    key={questionGroup.id || index}
                    questionGroup={questionGroup}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePreviousSection}
                  disabled={currentSection === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Part</span>
                </Button>

                <div className="flex space-x-4">
                  {currentSection < 4 ? (
                    <Button
                      onClick={handleNextSection}
                      className="flex items-center space-x-2"
                    >
                      <span>Next Part</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} variant="destructive">
                      Submit Test
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
