import { useState, useEffect } from "react";
import { IELTSReadingPassage } from "@/types/exam/ielts-academic/reading/passage/passage";

interface UseFetchPassagesOptions {
  limit?: number;
  search?: string;
}

interface UseFetchPassagesResult {
  passages: IELTSReadingPassage[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  searchPassages: (term: string) => void;
}

/**
 * Custom hook to fetch and manage IELTS reading passages
 * Can be extended to fetch from API when backend is ready
 */
export function useFetchPassages(
  options?: UseFetchPassagesOptions
): UseFetchPassagesResult {
  const [passages, setPassages] = useState<IELTSReadingPassage[]>([]);
  const [filteredPassages, setFilteredPassages] = useState<
    IELTSReadingPassage[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch passages
  const fetchPassages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, we're getting data from localStorage
      // In the future, this can be replaced with an API call
      const storedPassages = localStorage.getItem("ielts_reading_passages");

      // Get the individual passage too, if it exists
      const individualPassage = localStorage.getItem("ielts_reading_passage");

      let passagesArray: IELTSReadingPassage[] = [];

      // Parse stored passages
      if (storedPassages) {
        passagesArray = JSON.parse(storedPassages);
      }

      // Add individual passage if it exists and not already in the array
      if (individualPassage) {
        const passage = JSON.parse(individualPassage);
        if (!passagesArray.find((p) => p.id === passage.id)) {
          passagesArray = [passage, ...passagesArray];

          // Update the localStorage with the combined list
          localStorage.setItem(
            "ielts_reading_passages",
            JSON.stringify(passagesArray)
          );
        }
      }

      // Apply limit if provided
      if (options?.limit && passagesArray.length > options.limit) {
        passagesArray = passagesArray.slice(0, options.limit);
      }

      setPassages(passagesArray);
      setFilteredPassages(passagesArray);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch passages")
      );
      console.error("Error fetching passages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search function
  const searchPassages = (term: string) => {
    if (!term.trim()) {
      setFilteredPassages(passages);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();
    const filtered = passages.filter(
      (passage) =>
        passage.title.toLowerCase().includes(lowerCaseTerm) ||
        passage.subTitle?.toLowerCase().includes(lowerCaseTerm) ||
        passage.content.toLowerCase().includes(lowerCaseTerm)
    );

    setFilteredPassages(filtered);
  };

  // Initial fetch
  useEffect(() => {
    fetchPassages();
  }, [options?.limit]);

  // Apply search filter from options if provided
  useEffect(() => {
    if (options?.search) {
      searchPassages(options.search);
    }
  }, [options?.search, passages]);

  return {
    passages: filteredPassages,
    isLoading,
    error,
    refetch: fetchPassages,
    searchPassages,
  };
}
