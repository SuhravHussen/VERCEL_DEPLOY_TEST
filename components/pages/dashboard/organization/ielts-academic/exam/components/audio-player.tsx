import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IELTSListeningAudio } from "@/types/exam/ielts-academic/listening/listening";

interface AudioPlayerProps {
  audio: IELTSListeningAudio;
  sectionNumber: number;
  className?: string;
}

export function AudioPlayer({
  audio,
  sectionNumber,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  // Difficulty colors
  const difficultyColors = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError("Failed to load audio file");
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setError("Failed to play audio");
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audio.audioUrl;
    link.download = `${audio.title}.mp3`;
    link.click();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Section {sectionNumber}: {audio.title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={difficultyColors[audio.difficulty]}
            >
              {audio.difficulty}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={audio.audioUrl}
          preload="metadata"
          className="hidden"
        />

        {/* Error State */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Main Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlay}
            disabled={isLoading || !!error}
            size="lg"
            className="h-12 w-12 rounded-full"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <Button
            onClick={restart}
            disabled={isLoading || !!error}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Restart
          </Button>

          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              value={currentTime}
              onChange={(e) => handleSeek([Number(e.target.value)])}
              max={duration || 100}
              step={1}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !!error}
            />
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <div className="flex-1 max-w-32">
            <input
              type="range"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange([Number(e.target.value)])}
              max={1}
              step={0.1}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <span className="text-xs text-muted-foreground min-w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Transcript */}
        {audio.transcript && (
          <Collapsible open={showTranscript} onOpenChange={setShowTranscript}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                {showTranscript ? "Hide" : "Show"} Transcript
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="bg-muted/30 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2 text-sm">Audio Transcript</h4>
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {audio.transcript}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Audio Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>💡 Use headphones for the best listening experience</p>
          <p>🔄 You can replay the audio as many times as needed</p>
        </div>
      </CardContent>
    </Card>
  );
}
