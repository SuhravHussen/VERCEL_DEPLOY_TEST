export const getStatusColor = (status: string): string => {
  switch (status) {
    case "registered":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "cancelled":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    case "completed":
      return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case "paid":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
    case "failed":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    case "refunded":
      return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const getExamTypeIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case "ielts":
      return "🎯";
    case "toefl":
      return "📚";
    case "gre":
      return "🎓";
    case "sat":
      return "📝";
    case "gmat":
      return "💼";
    default:
      return "📋";
  }
};

export const getExamTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "ielts":
      return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    case "toefl":
      return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "gre":
      return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800";
    case "sat":
      return "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
    case "gmat":
      return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};
