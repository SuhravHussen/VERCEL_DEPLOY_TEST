export const ieltsListeningTestSections = [
  // SECTION ONE - Everyday social conversation (Questions 1-10)
  {
    audio: {
      title: "Booking a Hotel Room",
      audioUrl: "https://example.com/audio/section1.mp3",
      transcript:
        "A conversation between a customer and hotel receptionist about booking a room...",
      difficulty: "easy",
    },
    questions: [
      {
        id: "group1",
        questionType: "form_completion",
        instruction:
          "Complete the booking form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS AND/OR A NUMBER",

        questions: [
          {
            sentenceWithBlank: "Name: John _______",
            correctAnswer: "Smith",
          },
          {
            sentenceWithBlank: "Phone number: _______",
            correctAnswer: "07456 123789",
          },
          {
            sentenceWithBlank: "Number of nights: _______",
            correctAnswer: "3",
          },
        ],
      },
      {
        id: "group2",
        questionType: "multiple_choice",
        instruction: "Choose the correct letter, A, B or C.",
        questions: [
          {
            question: "What time is breakfast served?",
            options: ["A 7:00 - 9:00", "B 7:30 - 9:30", "C 8:00 - 10:00"],
            answer: "B",
          },
          {
            question: "The hotel's main attraction is:",
            options: [
              "A the swimming pool",
              "B the fitness center",
              "C the spa",
            ],
            answer: "C",
          },
        ],
      },
      {
        id: "group3",
        questionType: "short_answer",
        instruction:
          "Answer the questions below. Write NO MORE THAN THREE WORDS for each answer.",
        maxWords: 3,
        wordLimitText: "NO MORE THAN THREE WORDS",
        questions: [
          {
            question: "What type of room does the customer want?",
            correctAnswer: "double room",
          },
          {
            question: "What special requirement does the customer have?",
            correctAnswer: "sea view",
          },
          {
            question: "How will the customer pay?",
            correctAnswer: "credit card",
          },
        ],
      },
      {
        id: "group4",
        questionType: "sentence_completion",
        instruction:
          "Complete the sentences below. Write ONE WORD ONLY for each answer.",
        wordLimit: 1,
        wordLimitText: "ONE WORD ONLY",
        questions: [
          {
            sentenceWithBlank:
              "Check-in time is at _______ o'clock in the afternoon.",
            correctAnswer: "three",
          },
          {
            sentenceWithBlank:
              "The hotel provides free _______ for all guests.",
            correctAnswer: "parking",
          },
        ],
      },
    ],
  },

  // SECTION TWO - Monologue on everyday topic (Questions 11-20)
  {
    audio: {
      title: "Community Center Activities",
      audioUrl: "https://example.com/audio/section2.mp3",
      transcript:
        "A talk by the community center manager about facilities and activities...",
      difficulty: "easy",
    },
    questions: [
      {
        id: "group5",
        questionType: "matching",
        instruction:
          "What feature does each room have? Choose your answers from the box and write the correct letter, A-H, next to questions 11-14.",
        options: [
          "A air conditioning",
          "B sound system",
          "C mirrors",
          "D wooden floor",
          "E carpeted floor",
          "F large windows",
          "G storage space",
          "H kitchen facilities",
        ],
        questions: [
          { number: 11, prompt: "Dance studio", correctMatch: "C" },
          { number: 12, prompt: "Meeting room", correctMatch: "A" },
          { number: 13, prompt: "Art room", correctMatch: "F" },
          { number: 14, prompt: "Fitness room", correctMatch: "B" },
        ],
      },
      {
        id: "group6",
        questionType: "table_completion",
        instruction:
          "Complete the table below. Write NO MORE THAN TWO WORDS for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        tableStructure: [
          ["Activity", "Day", "Time", "Cost"],
          ["Yoga", "_______ (15)", "9:00 AM", "_______ (16)"],
          ["Swimming", "Daily", "_______ (17)", "Free"],
        ],
        questions: [
          { cellId: "15", correctAnswer: "weekdays" },
          { cellId: "16", correctAnswer: "£5" },
          { cellId: "17", correctAnswer: "6:00 PM" },
        ],
      },
      {
        id: "group7",
        questionType: "note_completion",
        instruction:
          "Complete the notes below. Write ONE WORD ONLY for each answer.",
        wordLimit: 1,
        wordLimitText: "ONE WORD ONLY",
        noteText:
          "Community Center Notes:\n• Most popular facility: _______ (18)\n• New equipment in: _______ (19)\n• Annual membership: £_______ (20)",
        questions: [
          { gapId: "18", correctAnswer: "pool" },
          { gapId: "19", correctAnswer: "gym" },
          { gapId: "20", correctAnswer: "120" },
        ],
      },
    ],
  },

  // SECTION THREE - Conversation in educational context (Questions 21-30)
  {
    audio: {
      title: "University Tutorial Discussion",
      audioUrl: "https://example.com/audio/section3.mp3",
      transcript:
        "A conversation between two students and their tutor about a research project...",
      difficulty: "medium",
    },
    questions: [
      {
        id: "group8",
        questionType: "multiple_choice_multiple_answers",
        instruction:
          "Which THREE problems do the students mention about their survey? Choose THREE letters, A-G.",
        answersRequired: 3,
        options: [
          "A low response rate",
          "B unclear questions",
          "C technical difficulties",
          "D time constraints",
          "E language barriers",
          "F lack of funding",
          "G equipment failure",
        ],
        questions: [
          {
            question: "Problems with survey:",
            answers: ["A", "B", "D"],
          },
        ],
      },
      {
        id: "group9",
        questionType: "flow_chart_completion",
        instruction:
          "Complete the flow chart below. Write NO MORE THAN TWO WORDS for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        chartStructure:
          "Research Process: 1. Literature review → 2. _______ (22) → 3. Data collection → 4. _______ (23) → 5. Write report",
        startingQuestionNumber: 22,
        questions: [
          { stepId: "22", correctAnswer: "design survey" },
          { stepId: "23", correctAnswer: "analyze data" },
        ],
      },
      {
        id: "group10",
        questionType: "diagram_label_completion",
        instruction:
          "Label the diagram below. Write NO MORE THAN TWO WORDS for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        diagramDescription: "Solar Panel System Diagram",
        diagramImage: "solar_panel_diagram.jpg",
        questions: [
          { labelId: "24", correctAnswer: "solar panels" },
          { labelId: "25", correctAnswer: "battery storage" },
          { labelId: "26", correctAnswer: "power inverter" },
        ],
      },
      {
        id: "group11",
        questionType: "multiple_choice",
        instruction: "Choose the correct letter, A, B or C.",
        questions: [
          {
            number: 27,
            question: "The students' research topic is:",
            options: [
              "A climate change effects",
              "B renewable energy",
              "C sustainable agriculture",
            ],
            answer: "B",
          },
          {
            question: "The main problem with their initial approach was:",
            options: [
              "A lack of data",
              "B too broad scope",
              "C insufficient time",
            ],
            answer: "B",
          },
          {
            question: "The tutor suggests they focus on:",
            options: [
              "A solar power only",
              "B wind power only",
              "C both solar and wind power",
            ],
            answer: "A",
          },
          {
            question: "When is the final presentation due?",
            options: ["A next week", "B next month", "C next semester"],
            answer: "B",
          },
        ],
      },
    ],
  },

  // SECTION FOUR - Academic lecture (Questions 31-40)
  {
    audio: {
      title: "Lecture on Marine Biology and Ocean Conservation",
      audioUrl: "https://example.com/audio/section4.mp3",
      transcript:
        "A university lecture about coral reef ecosystems, marine biodiversity, and conservation strategies...",
      difficulty: "hard",
    },
    questions: [
      {
        id: "group12",
        questionType: "sentence_completion",
        instruction:
          "Complete the sentences below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS AND/OR A NUMBER",
        questions: [
          {
            sentenceWithBlank:
              "Coral reefs cover less than _______ of the ocean floor.",
            correctAnswer: "1%",
          },
          {
            sentenceWithBlank:
              "They support approximately _______ of all marine species.",
            correctAnswer: "25%",
          },
        ],
      },
      {
        id: "group13",
        questionType: "form_completion",
        instruction:
          "Complete the research form below. Write NO MORE THAN THREE WORDS for each answer.",
        wordLimit: 3,
        wordLimitText: "NO MORE THAN THREE WORDS",

        options: [
          "climate change",
          "ocean warming",
          "30 degrees Celsius",
          "5-10 years",
          "human activities",
          "pollution",
        ],
        questions: [
          {
            sentenceWithBlank: "Main threat: _______",
            correctAnswer: "climate change",
          },
          {
            sentenceWithBlank: "Bleaching temperature: _______",
            correctAnswer: "30 degrees Celsius",
          },
          {
            sentenceWithBlank: "Recovery time: _______",
            correctAnswer: "5-10 years",
          },
        ],
      },
      {
        id: "group14",
        questionType: "table_completion",
        instruction:
          "Complete the table below. Write ONE WORD ONLY for each answer.",
        wordLimit: 1,
        wordLimitText: "ONE WORD ONLY",
        tableStructure: [
          ["Conservation Method", "Success Rate", "Cost"],
          ["Marine reserves", "_______ (36)", "High"],
          ["Coral transplantation", "Moderate", "_______ (37)"],
          ["Water quality improvement", "High", "_______ (38)"],
        ],
        questions: [
          { cellId: "36", correctAnswer: "high" },
          { cellId: "37", correctAnswer: "expensive" },
          { cellId: "38", correctAnswer: "moderate" },
        ],
      },
      {
        id: "group15",
        questionType: "short_answer",
        instruction:
          "Answer the questions below. Write NO MORE THAN THREE WORDS for each answer.",
        maxWords: 3,
        wordLimitText: "NO MORE THAN THREE WORDS",
        questions: [
          {
            question:
              "What percentage of the Great Barrier Reef has been lost?",
            correctAnswer: "fifty percent",
          },
          {
            question: "What do marine protected areas show?",
            correctAnswer: "significant recovery",
          },
        ],
      },
    ],
  },
];
