# IELTS Listening Test API Schema

## 🏗️ Core Test Structure

### 1. Main Test Object

```json
{
  "id": "string",
  "title": "string",
  "description": "string (optional)",
  "organizationId": "number",
  "difficulty": "easy | medium | hard",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "section_one": "IELTSListeningTestSection",
  "section_two": "IELTSListeningTestSection",
  "section_three": "IELTSListeningTestSection",
  "section_four": "IELTSListeningTestSection",
  "createdBy": "string",
  "status": "published | archived",
  "totalQuestionCount": "number (should be 40)",
  "timeLimit": "number (typically 30 minutes)",
  "instructions": "string (optional)"
}
```

### 2. Test Section Object

```json
{
  "audio": {
    "title": "string",
    "audioUrl": "string",
    "transcript": "string (optional)",
    "difficulty": "easy | medium | hard"
  },
  "questions": ["array of question groups - see below"]
}
```

---

## 🎯 Question Types (10 Types Total)

### Base Question Group Structure

All question types inherit this base structure:

```json
{
  "id": "string",
  "questionType": "see types below",
  "instruction": "string",
  "questions": ["varies by type"]
}
```

---

## 📝 Question Type Details

### 1. Multiple Choice (Single Answer)

**Type:** `multiple_choice`

```json
{
  "id": "string",
  "questionType": "multiple_choice",
  "instruction": "string",
  "questions": [
    {
      "question": "What time does the library open?",
      "options": ["8:00 AM", "9:00 AM", "10:00 AM"],
      "answer": "9:00 AM"
    }
  ]
}
```

### 2. Multiple Choice (Multiple Answers)

**Type:** `multiple_choice_multiple_answers`

```json
{
  "id": "string",
  "questionType": "multiple_choice_multiple_answers",
  "instruction": "Choose TWO letters A-E",
  "questions": [
    {
      "question": "Which facilities are available?",
      "answers": ["A", "C"]
    }
  ],
  "options": ["A - Parking", "B - Cafe", "C - WiFi", "D - Pool", "E - Gym"],
  "answersRequired": 2
}
```

### 3. Sentence Completion

**Type:** `sentence_completion`

```json
{
  "id": "string",
  "questionType": "sentence_completion",
  "instruction": "Complete sentences. Write NO MORE THAN TWO WORDS",
  "questions": [
    {
      "sentenceWithBlank": "The museum opens at ________",
      "correctAnswer": "9 AM"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS"
}
```

### 4. Form Completion

**Type:** `form_completion`

```json
{
  "id": "string",
  "questionType": "form_completion",
  "instruction": "Complete the form below",
  "questions": [
    {
      "sentenceWithBlank": "Name: John ________",
      "correctAnswer": "Smith"
    }
  ],
  "wordLimit": 1,
  "wordLimitText": "ONE WORD ONLY",
  "options": ["optional predefined answers"]
}
```

### 5. Note Completion

**Type:** `note_completion`

```json
{
  "id": "string",
  "questionType": "note_completion",
  "instruction": "Complete the notes below",
  "noteText": "Meeting Notes:\n- Location: {{gap1}}\n- Time: {{gap2}}",
  "questions": [
    {
      "gapId": "gap1",
      "correctAnswer": "Conference Room A"
    },
    {
      "gapId": "gap2",
      "correctAnswer": "2:30 PM"
    }
  ],
  "wordLimit": 3,
  "options": ["optional word bank"]
}
```

### 6. Table Completion

**Type:** `table_completion`

```json
{
  "id": "string",
  "questionType": "table_completion",
  "instruction": "Complete the table below",
  "tableStructure": [
    ["Course", "Duration", "Fee"],
    ["English", "{{cell1}}", "$500"],
    ["Math", "6 months", "{{cell2}}"]
  ],
  "questions": [
    {
      "cellId": "cell1",
      "correctAnswer": "3 months"
    },
    {
      "cellId": "cell2",
      "correctAnswer": "$400"
    }
  ],
  "wordLimit": 2
}
```

### 7. Flow Chart Completion

**Type:** `flow_chart_completion`

```json
{
  "id": "string",
  "questionType": "flow_chart_completion",
  "instruction": "Complete the flowchart",
  "chartType": "image | text",

  // For image-based flowcharts
  "chartImage": "https://example.com/flowchart.png",
  "inputPositions": [
    {
      "stepId": "step1",
      "x": 120,
      "y": 150
    },
    {
      "stepId": "step2",
      "x": 280,
      "y": 320
    }
  ],

  // For text-based flowcharts
  "textSteps": [
    {
      "stepId": "step1",
      "stepNumber": 1,
      "textBefore": "First, submit your",
      "textAfter": "to the admissions office",
      "isGap": true
    },
    {
      "stepId": "step2",
      "stepNumber": 2,
      "textBefore": "Wait for",
      "textAfter": "from the university",
      "isGap": true
    }
  ],

  // Common properties
  "questions": [
    {
      "stepId": "step1",
      "correctAnswer": "application"
    },
    {
      "stepId": "step2",
      "correctAnswer": "confirmation"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS",
  "options": ["application", "confirmation", "documents", "payment"]
}
```

### 8. Diagram Label Completion

**Type:** `diagram_label_completion`

```json
{
  "id": "string",
  "questionType": "diagram_label_completion",
  "instruction": "Label the diagram below",

  // Image-based diagram only
  "diagramImage": "https://example.com/diagram.png",
  "inputPositions": [
    {
      "labelId": "label1",
      "x": 150,
      "y": 100
    },
    {
      "labelId": "label2",
      "x": 200,
      "y": 250
    },
    {
      "labelId": "label3",
      "x": 80,
      "y": 180
    }
  ],

  // Questions and answers
  "questions": [
    {
      "labelId": "label1",
      "correctAnswer": "petal"
    },
    {
      "labelId": "label2",
      "correctAnswer": "stem"
    },
    {
      "labelId": "label3",
      "correctAnswer": "leaves"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS",
  "options": ["petal", "stem", "leaves", "roots", "pistil"],

  // Additional metadata
  "instructions": "Complete the labels for the flower diagram",
  "totalLabels": 3
}
```

### 9. Matching

**Type:** `matching`

```json
{
  "id": "string",
  "questionType": "matching",
  "instruction": "Match each person with their opinion",
  "questions": [
    {
      "prompt": "Dr. Smith believes",
      "correctMatch": "A"
    }
  ],
  "options": [
    "A - Research is most important",
    "B - Practice matters more",
    "C - Both are equally valuable"
  ]
}
```

### 10. Short Answer

**Type:** `short_answer`

```json
{
  "id": "string",
  "questionType": "short_answer",
  "instruction": "Answer the questions below",
  "questions": [
    {
      "question": "What is the maximum group size?",
      "correctAnswer": "12 people"
    }
  ],
  "maxWords": 3,
  "wordLimitText": "NO MORE THAN THREE WORDS"
}
```

## 📋 Complete Test Example

```json
{
  "id": "test_001",
  "title": "IELTS Listening Practice Test 1",
  "organizationId": 123,
  "difficulty": "medium",
  "status": "published",
  "totalQuestionCount": 40,
  "timeLimit": 30,
  "section_one": {
    "audio": {
      "title": "Hotel Booking",
      "audioUrl": "https://example.com/section1.mp3",
      "difficulty": "easy"
    },
    "questions": [
      {
        "id": "group_1",
        "questionType": "form_completion",
        "instruction": "Complete the booking form",
        "questions": [
          {
            "sentenceWithBlank": "Guest name: ________",
            "correctAnswer": "Johnson"
          }
        ],
        "wordLimit": 1
      }
    ]
  },
  "section_two": {
    "audio": {
      "title": "Museum Information",
      "audioUrl": "https://example.com/section2.mp3",
      "difficulty": "easy"
    },
    "questions": [
      {
        "id": "group_2",
        "questionType": "multiple_choice",
        "instruction": "Choose the correct answer",
        "questions": [
          {
            "question": "The museum opens at:",
            "options": ["9:00", "10:00", "11:00"],
            "answer": "10:00"
          }
        ]
      }
    ]
  },
  "section_three": {
    "audio": {
      "title": "Student Discussion",
      "audioUrl": "https://example.com/section3.mp3",
      "difficulty": "medium"
    },
    "questions": [
      {
        "id": "group_3",
        "questionType": "matching",
        "instruction": "Match speakers with opinions",
        "questions": [
          {
            "prompt": "Sarah",
            "correctMatch": "A"
          }
        ],
        "options": ["A - Prefers theory", "B - Prefers practice"]
      }
    ]
  },
  "section_four": {
    "audio": {
      "title": "Academic Lecture",
      "audioUrl": "https://example.com/section4.mp3",
      "difficulty": "hard"
    },
    "questions": [
      {
        "id": "group_4",
        "questionType": "sentence_completion",
        "instruction": "Complete the sentences",
        "questions": [
          {
            "sentenceWithBlank": "Climate affects ________ globally",
            "correctAnswer": "weather patterns"
          }
        ],
        "wordLimit": 2
      }
    ]
  }
}
```

---

## 🚀 APIs I Want

### Test Management

- **POST** `/tests` - Create test → Returns Main Test Object
- **GET** `/tests/{testId}` - Get test by ID → Returns Main Test Object
- **PUT** `/tests/{testId}` - Update test → Returns Main Test Object
- **DELETE** `/tests/{testId}` - Delete test → Returns success message
- **GET** `/tests` - Get paginated tests with search/filter/sort → Returns array of Main Test Objects with pagination

### Question Management

- **POST** `/questions` - Create question → Returns Base Question Group Structure
- **GET** `/questions/{questionId}` - Get question by ID → Returns Base Question Group Structure
- **PUT** `/questions/{questionId}` - Update question → Returns Base Question Group Structure
- **DELETE** `/questions/{questionId}` - Delete question → Returns success message
- **GET** `/questions` - Get paginated questions with search/filter/sort → Returns array of Base Question Group Structures
