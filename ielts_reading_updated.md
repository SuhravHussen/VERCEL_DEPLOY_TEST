# IELTS Reading Test API Schema

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
  "section_one": "IELTSReadingTestSection",
  "section_two": "IELTSReadingTestSection",
  "section_three": "IELTSReadingTestSection",
  "createdBy": "string",
  "status": "published | archived",
  "totalQuestionCount": "number (should be 40)",
  "timeLimit": "number (typically 60 minutes)",
  "instructions": "string (optional)"
}
```

### 2. Test Section Object

```json
{
  "passage": "IELTSReadingPassage",
  "questions": ["array of question groups - see below"]
}
```

### 3. Reading Passage Object

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "difficulty": "easy | medium | hard",
  "organizationId": "number",
  "subTitle": "string (optional)",
  "createdAt": "string (ISO date, optional)",
  "updatedAt": "string (ISO date, optional)",
  "createdBy": "string (optional)"
}
```

---

## 🎯 Question Types (15 Types Total)

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
      "number": 1,
      "question": "What is the main purpose of the passage?",
      "options": ["To inform", "To persuade", "To entertain"],
      "answer": "To inform"
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
      "number": 1,
      "question": "Which TWO factors contribute to climate change?",
      "answers": ["A", "C"]
    }
  ],
  "options": [
    "A - Deforestation",
    "B - Education",
    "C - Fossil fuels",
    "D - Tourism",
    "E - Art"
  ],
  "answersRequired": 2
}
```

### 3. True/False/Not Given

**Type:** `true_false_not_given`

```json
{
  "id": "string",
  "questionType": "true_false_not_given",
  "instruction": "Do the following statements agree with the information given in the reading passage?",
  "questions": [
    {
      "number": 1,
      "statement": "The research was conducted over five years",
      "answer": "true"
    }
  ]
}
```

### 4. Yes/No/Not Given

**Type:** `yes_no_not_given`

```json
{
  "id": "string",
  "questionType": "yes_no_not_given",
  "instruction": "Do the following statements agree with the views of the writer?",
  "questions": [
    {
      "number": 1,
      "statement": "Technology will solve all environmental problems",
      "answer": "no"
    }
  ]
}
```

### 5. Matching Information

**Type:** `matching_information`

```json
{
  "id": "string",
  "questionType": "matching_information",
  "instruction": "Which paragraph contains the following information?",
  "questions": [
    {
      "number": 1,
      "statement": "Information about early research methods",
      "correctParagraph": "B",
      "imageUrl": "https://example.com/diagram.png (optional)"
    }
  ],
  "paragraphLabels": ["A", "B", "C", "D", "E"]
}
```

### 6. Matching Headings

**Type:** `matching_headings`

```json
{
  "id": "string",
  "questionType": "matching_headings",
  "instruction": "Choose the correct heading for each section",
  "questions": [
    {
      "paragraph": "Section A",
      "correctHeading": "i"
    }
  ],
  "headings": [
    "i - The impact of technology",
    "ii - Historical developments",
    "iii - Future predictions"
  ]
}
```

### 7. Matching Features

**Type:** `matching_features`

```json
{
  "id": "string",
  "questionType": "matching_features",
  "instruction": "Match each statement with the correct researcher",
  "questions": [
    {
      "number": 1,
      "statement": "Developed the first theory",
      "correctFeature": "A"
    }
  ],
  "features": [
    {
      "label": "A",
      "description": "Dr. Smith"
    },
    {
      "label": "B",
      "description": "Prof. Johnson"
    }
  ]
}
```

### 8. Matching Sentence Endings

**Type:** `matching_sentence_endings`

```json
{
  "id": "string",
  "questionType": "matching_sentence_endings",
  "instruction": "Complete each sentence with the correct ending",
  "questions": [
    {
      "number": 1,
      "sentenceStart": "The main finding of the research was",
      "correctEnding": "A"
    }
  ],
  "endings": [
    {
      "label": "A",
      "text": "that climate patterns are changing rapidly"
    },
    {
      "label": "B",
      "text": "that more funding is needed"
    }
  ]
}
```

### 9. Sentence Completion

**Type:** `sentence_completion`

```json
{
  "id": "string",
  "questionType": "sentence_completion",
  "instruction": "Complete the sentences below",
  "questions": [
    {
      "number": 1,
      "sentenceWithBlank": "The experiment lasted for ________",
      "correctAnswer": "six months",
      "imageUrl": "https://example.com/chart.png (optional)"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS"
}
```

### 10. Summary Completion

**Type:** `summary_completion`

```json
{
  "id": "string",
  "questionType": "summary_completion",
  "instruction": "Complete the summary below",
  "summaryText": "The research showed that {{gap1}} is crucial for {{gap2}}. Scientists believe that {{gap3}} will help solve the problem.",
  "questions": [
    {
      "gapId": "gap1",
      "correctAnswer": "collaboration"
    },
    {
      "gapId": "gap2",
      "correctAnswer": "success"
    },
    {
      "gapId": "gap3",
      "correctAnswer": "technology"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS",
  "options": ["collaboration", "technology", "success", "funding", "research"]
}
```

### 11. Note Completion

**Type:** `note_completion`

```json
{
  "id": "string",
  "questionType": "note_completion",
  "instruction": "Complete the notes below",
  "noteText": "Research Notes:\n- Method: {{gap1}}\n- Duration: {{gap2}}\n- Results: {{gap3}}",
  "questions": [
    {
      "gapId": "gap1",
      "correctAnswer": "survey"
    },
    {
      "gapId": "gap2",
      "correctAnswer": "two years"
    },
    {
      "gapId": "gap3",
      "correctAnswer": "positive"
    }
  ],
  "wordLimit": 3,
  "wordLimitText": "NO MORE THAN THREE WORDS",
  "options": ["survey", "interview", "two years", "positive", "negative"]
}
```

### 12. Table Completion

**Type:** `table_completion`

```json
{
  "id": "string",
  "questionType": "table_completion",
  "instruction": "Complete the table below",
  "tableStructure": [
    ["Country", "Population", "GDP"],
    ["USA", "{{cell1}}", "$21 trillion"],
    ["China", "1.4 billion", "{{cell2}}"],
    ["{{cell3}}", "83 million", "$4 trillion"]
  ],
  "questions": [
    {
      "cellId": "cell1",
      "correctAnswer": "331 million"
    },
    {
      "cellId": "cell2",
      "correctAnswer": "$14 trillion"
    },
    {
      "cellId": "cell3",
      "correctAnswer": "Germany"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS",
  "options": ["331 million", "$14 trillion", "Germany", "France", "Japan"]
}
```

### 13. Flow Chart Completion

**Type:** `flow_chart_completion`

```json
{
  "id": "string",
  "questionType": "flow_chart_completion",
  "instruction": "Complete the flowchart below",
  "chartType": "image | text",

  // For image-based flowcharts
  "chartImage": "https://example.com/flowchart.png",
  "inputPositions": [
    {
      "stepId": "step1",
      "x": 150,
      "y": 200
    },
    {
      "stepId": "step2",
      "x": 300,
      "y": 400
    }
  ],

  // For text-based flowcharts
  "textSteps": [
    {
      "stepId": "step1",
      "stepNumber": 1,
      "textBefore": "First, researchers collect",
      "textAfter": "from various sources",
      "isGap": true
    },
    {
      "stepId": "step2",
      "stepNumber": 2,
      "textBefore": "Next, the data undergoes",
      "textAfter": "to identify patterns",
      "isGap": true
    },
    {
      "stepId": "step3",
      "stepNumber": 3,
      "textBefore": "Finally, results are published in academic",
      "textAfter": "",
      "isGap": true
    }
  ],

  // Common properties
  "questions": [
    {
      "stepId": "step1",
      "correctAnswer": "data"
    },
    {
      "stepId": "step2",
      "correctAnswer": "analysis"
    },
    {
      "stepId": "step3",
      "correctAnswer": "journals"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS",
  "options": ["data", "analysis", "journals", "review", "publication"],

  // Additional metadata
  "instructions": "Complete the flowchart showing the research process",
  "totalGaps": 3
}
```

### 14. Diagram Label Completion

**Type:** `diagram_label_completion`

```json
{
  "id": "string",
  "questionType": "diagram_label_completion",
  "instruction": "Label the diagram below",

  // Image-based diagram only
  "diagramImage": "https://example.com/plant-cell.png",
  "inputPositions": [
    {
      "labelId": "label1",
      "x": 120,
      "y": 180
    },
    {
      "labelId": "label2",
      "x": 250,
      "y": 100
    },
    {
      "labelId": "label3",
      "x": 180,
      "y": 300
    }
  ],

  // Questions and answers
  "questions": [
    {
      "labelId": "label1",
      "correctAnswer": "nucleus"
    },
    {
      "labelId": "label2",
      "correctAnswer": "cell wall"
    },
    {
      "labelId": "label3",
      "correctAnswer": "cytoplasm"
    }
  ],
  "wordLimit": 2,
  "wordLimitText": "NO MORE THAN TWO WORDS",
  "options": ["nucleus", "cell wall", "cytoplasm", "membrane", "chloroplast"]
}
```

### 15. Short Answer

**Type:** `short_answer`

```json
{
  "id": "string",
  "questionType": "short_answer",
  "instruction": "Answer the questions below",
  "questions": [
    {
      "number": 1,
      "question": "What was the main conclusion of the study?",
      "correctAnswer": "climate change accelerating"
    }
  ],
  "maxWords": 3,
  "wordLimitText": "NO MORE THAN THREE WORDS"
}
```

## 📋 Complete Test Example

```json
{
  "id": "reading_test_001",
  "title": "IELTS Reading Practice Test 1",
  "description": "Academic Reading Test focusing on environmental science",
  "organizationId": 123,
  "difficulty": "medium",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "createdBy": "admin_user_001",
  "status": "published",
  "totalQuestionCount": 40,
  "timeLimit": 60,
  "instructions": "Read the passages carefully and answer all questions",
  "section_one": {
    "passage": {
      "id": "passage_001",
      "title": "The Rise of Urban Farming",
      "subTitle": "Sustainable agriculture in city environments",
      "content": "Urban farming has emerged as a revolutionary approach to food production...",
      "difficulty": "easy",
      "organizationId": 123,
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z",
      "createdBy": "content_creator_001"
    },
    "questions": [
      {
        "id": "group_1",
        "questionType": "multiple_choice",
        "instruction": "Choose the correct letter, A, B, C or D",
        "questions": [
          {
            "number": 1,
            "question": "What is the main advantage of urban farming?",
            "options": [
              "A - Lower costs",
              "B - Reduced transportation",
              "C - Better taste",
              "D - Larger yields"
            ],
            "answer": "B"
          }
        ]
      },
      {
        "id": "group_2",
        "questionType": "true_false_not_given",
        "instruction": "Do the following statements agree with the information given in Reading Passage 1?",
        "questions": [
          {
            "number": 2,
            "statement": "Urban farming requires less water than traditional farming",
            "answer": "true"
          },
          {
            "number": 3,
            "statement": "All cities have embraced urban farming initiatives",
            "answer": "not_given"
          }
        ]
      }
    ]
  },
  "section_two": {
    "passage": {
      "id": "passage_002",
      "title": "The Psychology of Decision Making",
      "subTitle": "How humans make choices under pressure",
      "content": "Decision-making processes in the human brain are complex...",
      "difficulty": "medium",
      "organizationId": 123
    },
    "questions": [
      {
        "id": "group_3",
        "questionType": "matching_headings",
        "instruction": "Choose the correct heading for each section from the list of headings below",
        "questions": [
          {
            "paragraph": "Section A",
            "correctHeading": "iv"
          },
          {
            "paragraph": "Section B",
            "correctHeading": "ii"
          }
        ],
        "headings": [
          "i - The role of emotions",
          "ii - Cognitive biases in decision making",
          "iii - Historical perspectives",
          "iv - The speed of thought",
          "v - Future research directions"
        ]
      },
      {
        "id": "group_4",
        "questionType": "sentence_completion",
        "instruction": "Complete the sentences below",
        "questions": [
          {
            "number": 15,
            "sentenceWithBlank": "Research shows that people make better decisions when they are ________",
            "correctAnswer": "well rested"
          }
        ],
        "wordLimit": 2,
        "wordLimitText": "NO MORE THAN TWO WORDS"
      }
    ]
  },
  "section_three": {
    "passage": {
      "id": "passage_003",
      "title": "Advanced Materials in Space Exploration",
      "subTitle": "Innovations driving the next generation of spacecraft",
      "content": "The development of advanced materials has been crucial...",
      "difficulty": "hard",
      "organizationId": 123
    },
    "questions": [
      {
        "id": "group_5",
        "questionType": "summary_completion",
        "instruction": "Complete the summary below using words from the box",
        "summaryText": "Advanced materials play a {{gap1}} role in space exploration. These materials must withstand {{gap2}} conditions while remaining {{gap3}}.",
        "questions": [
          {
            "gapId": "gap1",
            "correctAnswer": "crucial"
          },
          {
            "gapId": "gap2",
            "correctAnswer": "extreme"
          },
          {
            "gapId": "gap3",
            "correctAnswer": "lightweight"
          }
        ],
        "wordLimit": 1,
        "wordLimitText": "ONE WORD ONLY",
        "options": ["crucial", "extreme", "lightweight", "expensive", "complex"]
      },
      {
        "id": "group_6",
        "questionType": "short_answer",
        "instruction": "Answer the questions below",
        "questions": [
          {
            "number": 35,
            "question": "What is the biggest challenge in developing space materials?",
            "correctAnswer": "extreme temperatures"
          }
        ],
        "maxWords": 3,
        "wordLimitText": "NO MORE THAN THREE WORDS"
      }
    ]
  }
}
```

---

## 🚀 APIs I Want

### Test Management

- **POST** `/reading-tests` - Create test → Returns Main Test Object
- **GET** `/reading-tests/{testId}` - Get test by ID → Returns Main Test Object
- **PUT** `/reading-tests/{testId}` - Update test → Returns Main Test Object
- **DELETE** `/reading-tests/{testId}` - Delete test → Returns success message
- **GET** `/reading-tests` - Get paginated tests with search/filter/sort → Returns array of Main Test Objects with pagination

### Question Management

- **POST** `/reading-questions` - Create question → Returns Base Question Group Structure
- **GET** `/reading-questions/{questionId}` - Get question by ID → Returns Base Question Group Structure
- **PUT** `/reading-questions/{questionId}` - Update question → Returns Base Question Group Structure
- **DELETE** `/reading-questions/{questionId}` - Delete question → Returns success message
- **GET** `/reading-questions` - Get paginated questions with search/filter/sort → Returns array of Base Question Group Structures
