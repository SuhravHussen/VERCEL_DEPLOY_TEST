"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Play,
  Pause,
  Volume2,
  Clock,
  User,
  Calendar,
  MapPin,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { SpeakingSubmission, SectionGrade } from "@/types/exam/exam-submission";

interface SpeakingGradingRendererNewProps {
  submission: SpeakingSubmission;
  existingGrade?: SectionGrade;
  onGradeChange?: (gradeData: SpeakingGradeData) => void;
}

export interface SpeakingGradeData {
  band_score?: number;
  feedback?: string;
  coherence_and_cohesion?: number; // Fluency and Coherence
  lexical_resource?: number;
  grammatical_range_and_accuracy?: number;
  pronunciation?: number;
}

// IELTS Speaking Band Descriptors
const SPEAKING_CRITERIA = [
  {
    key: "coherence_and_cohesion",
    title: "Fluency and Coherence",
    description:
      "Ability to talk with normal levels of continuity, rate and effort",
  },
  {
    key: "lexical_resource",
    title: "Lexical Resource",
    description:
      "Range of vocabulary and ability to use it naturally and appropriately",
  },
  {
    key: "grammatical_range_and_accuracy",
    title: "Grammatical Range and Accuracy",
    description: "Range and accurate usage of grammar",
  },
  {
    key: "pronunciation",
    title: "Pronunciation",
    description: "Ability to produce comprehensible speech to fulfill the task",
  },
];

export default function SpeakingGradingRendererNew({
  submission,
  existingGrade,
  onGradeChange,
}: SpeakingGradingRendererNewProps) {
  // Individual criteria scores
  const [fluencyScore, setFluencyScore] = useState<string>("");
  const [lexicalScore, setLexicalScore] = useState<string>("");
  const [grammaticalScore, setGrammaticalScore] = useState<string>("");
  const [pronunciationScore, setPronunciationScore] = useState<string>("");

  // Overall score and feedback
  const [overallBandScore, setOverallBandScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  // Audio player states
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<
    Map<string, HTMLAudioElement>
  >(new Map());

  // Prefill from existing grade
  useEffect(() => {
    if (existingGrade) {
      setFluencyScore(existingGrade.coherence_and_cohesion?.toString() || "");
      setLexicalScore(existingGrade.lexical_resource?.toString() || "");
      setGrammaticalScore(
        existingGrade.grammatical_range_and_accuracy?.toString() || ""
      );
      setPronunciationScore(existingGrade.pronunciation?.toString() || "");
      setOverallBandScore(existingGrade.band_score?.toString() || "");
      setFeedback(existingGrade.feedback || "");
    }
  }, [existingGrade]);

  // Auto-calculate overall band score
  useEffect(() => {
    const scores = [
      fluencyScore,
      lexicalScore,
      grammaticalScore,
      pronunciationScore,
    ];
    const validScores = scores.filter((s) => s && !isNaN(parseFloat(s)));

    if (validScores.length === 4) {
      const average =
        validScores.reduce((sum, score) => sum + parseFloat(score), 0) / 4;
      const roundedScore = Math.round(average * 2) / 2; // Round to nearest 0.5
      setOverallBandScore(roundedScore.toString());
    }
  }, [fluencyScore, lexicalScore, grammaticalScore, pronunciationScore]);

  // Notify parent of changes
  useEffect(() => {
    if (onGradeChange) {
      const gradeData: SpeakingGradeData = {
        band_score: overallBandScore ? parseFloat(overallBandScore) : undefined,
        feedback: feedback || undefined,
        coherence_and_cohesion: fluencyScore
          ? parseFloat(fluencyScore)
          : undefined,
        lexical_resource: lexicalScore ? parseFloat(lexicalScore) : undefined,
        grammatical_range_and_accuracy: grammaticalScore
          ? parseFloat(grammaticalScore)
          : undefined,
        pronunciation: pronunciationScore
          ? parseFloat(pronunciationScore)
          : undefined,
      };

      // Only send if we have at least some data
      if (
        gradeData.band_score !== undefined ||
        gradeData.feedback !== undefined ||
        gradeData.coherence_and_cohesion !== undefined ||
        gradeData.lexical_resource !== undefined ||
        gradeData.grammatical_range_and_accuracy !== undefined ||
        gradeData.pronunciation !== undefined
      ) {
        onGradeChange(gradeData);
      }
    }
  }, [
    overallBandScore,
    feedback,
    fluencyScore,
    lexicalScore,
    grammaticalScore,
    pronunciationScore,
    onGradeChange,
  ]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleAudio = async (url: string, index: number) => {
    const audioKey = `${url}-${index}`;

    if (currentlyPlaying === audioKey) {
      const audio = audioElements.get(audioKey);
      if (audio) {
        audio.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      if (currentlyPlaying) {
        const currentAudio = audioElements.get(currentlyPlaying);
        if (currentAudio) {
          currentAudio.pause();
        }
      }

      let audio = audioElements.get(audioKey);
      if (!audio) {
        audio = new Audio(url);
        audio.addEventListener("ended", () => setCurrentlyPlaying(null));
        audio.addEventListener("error", (e) => {
          console.error("Audio playback error:", e);
          setCurrentlyPlaying(null);
        });
        setAudioElements((prev) =>
          new Map(prev).set(audioKey, audio as HTMLAudioElement)
        );
      }

      try {
        await audio.play();
        setCurrentlyPlaying(audioKey);
      } catch (error) {
        console.error("Failed to play audio:", error);
        setCurrentlyPlaying(null);
      }
    }
  };

  const session = submission.session;

  return (
    <div className="space-y-6">
      {/* Session Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mic className="h-5 w-5 text-orange-600" />
            Speaking Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(session.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(session.start_time)} -{" "}
                    {formatTime(session.end_time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Instructor</p>
                  <p className="text-sm text-muted-foreground">
                    {session.instructor?.name || `ID: ${session.instructor_id}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      session.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
              {submission.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(submission.duration)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Session details not available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Recordings */}
      {submission.recording_urls && submission.recording_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Volume2 className="h-5 w-5 text-blue-600" />
              Speaking Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submission.recording_urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAudio(url, index)}
                      className="h-8 w-8 p-0"
                    >
                      {currentlyPlaying === `${url}-${index}` ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                    <div>
                      <p className="text-sm font-medium">
                        Recording {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to play audio
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={url}
                      download={`speaking-recording-${index + 1}.mp3`}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Notes */}
      {submission.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {submission.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grading Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            IELTS Speaking Assessment
            {existingGrade && (
              <Badge
                variant="outline"
                className="ml-2 text-xs text-blue-600 border-blue-200 bg-blue-50"
              >
                Editing existing grade
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Individual Criteria Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPEAKING_CRITERIA.map((criteria, index) => {
              const stateSetters = [
                setFluencyScore,
                setLexicalScore,
                setGrammaticalScore,
                setPronunciationScore,
              ];
              const stateValues = [
                fluencyScore,
                lexicalScore,
                grammaticalScore,
                pronunciationScore,
              ];

              return (
                <div key={criteria.key} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {criteria.title}
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    {criteria.description}
                  </p>
                  <Input
                    type="number"
                    min="1"
                    max="9"
                    step="0.5"
                    value={stateValues[index]}
                    onChange={(e) => stateSetters[index](e.target.value)}
                    placeholder="0.0"
                    className="text-sm"
                  />
                </div>
              );
            })}
          </div>

          {/* Overall Band Score and Feedback */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Overall Speaking Band Score
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="9"
                  step="0.5"
                  value={overallBandScore}
                  onChange={(e) => setOverallBandScore(e.target.value)}
                  placeholder="Auto-calculated..."
                  className="text-sm bg-blue-50 border-blue-200"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-calculated from individual scores, can be manually
                  adjusted
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Overall Feedback</Label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide overall feedback on the speaking performance..."
                  className="min-h-[100px] text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
