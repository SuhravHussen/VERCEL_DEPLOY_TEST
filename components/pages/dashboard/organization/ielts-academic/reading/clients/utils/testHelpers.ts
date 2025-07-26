// Helper functions for the tests components

/**
 * Gets a readable label for the test difficulty level
 */
export const getDifficultyLabel = (difficulty: string): string => {
  const labels: Record<string, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };
  return labels[difficulty] || difficulty;
};

/**
 * Gets the appropriate tailwind color classes for a difficulty level
 */
export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return colors[difficulty] || "";
};

/**
 * Formats a date string for display
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
