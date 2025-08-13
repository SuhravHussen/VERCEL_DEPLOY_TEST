"use client";

import { useState } from "react";
import {
  getListeningTestFullData,
  getReadingTestFullData,
  getWritingTestFullData,
} from "@/server-actions/exam/get-exam-data";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

// Hook for fetching listening test full data
export function useListeningTestFullData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListeningTestFullData = async (
    id: string,
    type: "practice" | "registered" = "registered"
  ): Promise<IELTSListeningTest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getListeningTestFullData(id, type);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch listening test data";
      setError(errorMessage);
      console.error("Error fetching listening test full data:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Backward compatibility method
  const fetchListeningTestFullDataByRegId = async (
    regId: string
  ): Promise<IELTSListeningTest | null> => {
    return fetchListeningTestFullData(regId, "registered");
  };

  return {
    fetchListeningTestFullData,
    fetchListeningTestFullDataByRegId,
    isLoading,
    error,
  };
}

// Hook for fetching reading test full data
export function useReadingTestFullData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadingTestFullData = async (
    id: string,
    type: "practice" | "registered" = "registered"
  ): Promise<IELTSReadingTest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReadingTestFullData(id, type);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch reading test data";
      setError(errorMessage);
      console.error("Error fetching reading test full data:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Backward compatibility method
  const fetchReadingTestFullDataByRegId = async (
    regId: string
  ): Promise<IELTSReadingTest | null> => {
    return fetchReadingTestFullData(regId, "registered");
  };

  return {
    fetchReadingTestFullData,
    fetchReadingTestFullDataByRegId,
    isLoading,
    error,
  };
}

// Hook for fetching writing test full data
export function useWritingTestFullData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWritingTestFullData = async (
    id: string,
    type: "practice" | "registered" = "registered"
  ): Promise<IELTSWritingTest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWritingTestFullData(id, type);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch writing test data";
      setError(errorMessage);
      console.error("Error fetching writing test full data:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Backward compatibility method
  const fetchWritingTestFullDataByRegId = async (
    regId: string
  ): Promise<IELTSWritingTest | null> => {
    return fetchWritingTestFullData(regId, "registered");
  };

  return {
    fetchWritingTestFullData,
    fetchWritingTestFullDataByRegId,
    isLoading,
    error,
  };
}
