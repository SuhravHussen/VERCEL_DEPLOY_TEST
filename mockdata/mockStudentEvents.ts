import { CalendarEvent } from "@/components/ui/event-viewer";

const mockStudentEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "IELTS Listening Practice Test",
    date: new Date(2025, 7, 5), // August 5, 2025
    time: "09:00",
    description: "Complete a full listening practice test with all 4 sections",
    color: "blue",
    category: "Practice Test",
  },
  {
    id: "2",
    title: "IELTS Reading Mock Exam",
    date: new Date(2025, 7, 8), // August 8, 2025
    time: "10:00",
    description: "Academic reading test - 3 passages, 60 minutes",
    color: "green",
    category: "Practice Test",
  },
  {
    id: "3",
    title: "Speaking Practice Session",
    date: new Date(2025, 7, 12), // August 12, 2025
    time: "14:00",
    description: "Practice Part 1, 2, and 3 speaking topics with tutor",
    color: "orange",
    category: "Speaking",
  },
  {
    id: "4",
    title: "Writing Task 1 Workshop",
    date: new Date(2025, 7, 15), // August 15, 2025
    time: "16:00",
    description: "Learn strategies for describing charts, graphs, and diagrams",
    color: "purple",
    category: "Writing",
  },
  {
    id: "5",
    title: "IELTS Full Mock Exam",
    date: new Date(2025, 7, 20), // August 20, 2025
    time: "09:00",
    description: "Complete 4-skill practice exam under timed conditions",
    color: "red",
    category: "Mock Exam",
  },
  {
    id: "6",
    title: "Vocabulary Building Session",
    date: new Date(2025, 7, 22), // August 22, 2025
    time: "11:00",
    description: "Focus on academic vocabulary and collocations",
    color: "teal",
    category: "Vocabulary",
  },
  {
    id: "7",
    title: "Writing Task 2 Essay Practice",
    date: new Date(2025, 7, 25), // August 25, 2025
    time: "15:00",
    description: "Practice argumentative and discussion essays",
    color: "purple",
    category: "Writing",
  },
  {
    id: "8",
    title: "Pronunciation Workshop",
    date: new Date(2025, 7, 28), // August 28, 2025
    time: "13:00",
    description: "Work on stress patterns, intonation, and problem sounds",
    color: "pink",
    category: "Speaking",
  },
  {
    id: "9",
    title: "IELTS Official Exam",
    date: new Date(2025, 8, 2), // September 2, 2025
    time: "08:30",
    description: "Official IELTS Academic test - arrive 30 minutes early",
    color: "red",
    category: "Official Exam",
  },
  {
    id: "10",
    title: "Grammar Review Session",
    date: new Date(2025, 7, 18), // August 18, 2025
    time: "10:30",
    description:
      "Review complex grammatical structures for writing and speaking",
    color: "yellow",
    category: "Grammar",
  },
  {
    id: "11",
    title: "Reading Strategies Workshop",
    date: new Date(2025, 8, 5), // September 5, 2025
    time: "14:00",
    description: "Learn skimming, scanning, and time management techniques",
    color: "green",
    category: "Reading",
  },
  {
    id: "12",
    title: "Speaking Mock Interview",
    date: new Date(2025, 8, 8), // September 8, 2025
    time: "16:30",
    description: "Full speaking test simulation with feedback",
    color: "orange",
    category: "Speaking",
  },
];

export default mockStudentEvents;
