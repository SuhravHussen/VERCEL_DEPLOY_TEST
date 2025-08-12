"use client";

import { useState } from "react";
import {
  getListeningTestFullDataByRegId,
  getReadingTestFullDataByRegId,
  getWritingTestFullDataByRegId,
} from "@/server-actions/exam/get-exam-data";
import { IELTSListeningTest } from "@/types/exam/ielts-academic/listening/listening";
import { IELTSReadingTest } from "@/types/exam/ielts-academic/reading/test/test";
import { IELTSWritingTest } from "@/types/exam/ielts-academic/writing/writing";

// Hook for fetching listening test full data
export function useListeningTestFullData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListeningTestFullData = async (
    regId: string
  ): Promise<IELTSListeningTest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getListeningTestFullDataByRegId(regId);
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

  return {
    fetchListeningTestFullData,
    isLoading,
    error,
  };
}

// Hook for fetching reading test full data
export function useReadingTestFullData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadingTestFullData = async (
    regId: string
  ): Promise<IELTSReadingTest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReadingTestFullDataByRegId(regId);
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

  return {
    fetchReadingTestFullData,
    isLoading,
    error,
  };
}

// Hook for fetching writing test full data
export function useWritingTestFullData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWritingTestFullData = async (
    regId: string
  ): Promise<IELTSWritingTest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWritingTestFullDataByRegId(regId);
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

  return {
    fetchWritingTestFullData,
    isLoading,
    error,
  };
}
