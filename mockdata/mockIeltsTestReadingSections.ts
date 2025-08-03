const ieltsTestSections = [
  // Section 1: Climate Change and Renewable Energy
  {
    passage: {
      id: "passage_1",
      title: "The Future of Renewable Energy",
      content: `Climate change has become one of the most pressing issues of our time. As global temperatures continue to rise, scientists and policymakers are increasingly turning to renewable energy sources as a solution. Solar power, wind energy, and hydroelectric systems represent the three main pillars of sustainable energy production.
  
  Solar panels have experienced dramatic improvements in efficiency over the past decade. Modern photovoltaic cells can now convert up to 22% of sunlight into electricity, compared to just 15% in 2010. This advancement has made solar energy cost-competitive with traditional fossil fuels in many regions. Countries like Germany and Denmark have successfully integrated large-scale solar installations into their national grids.
  
  Wind energy has also seen remarkable growth. Offshore wind farms, in particular, have proven highly effective due to consistent wind patterns over ocean surfaces. The world's largest offshore wind farm, located in the North Sea, generates enough electricity to power over one million homes. However, wind energy faces challenges related to intermittency and storage.
  
  Hydroelectric power remains the most established form of renewable energy. Large dams can generate massive amounts of electricity, but they often have significant environmental impacts on local ecosystems. Small-scale hydroelectric projects, known as micro-hydro systems, offer a more environmentally friendly alternative while still providing reliable power to rural communities.
  
  The transition to renewable energy is not without obstacles. Energy storage technology must improve to handle the variable nature of solar and wind power. Additionally, existing power grids need substantial upgrades to accommodate distributed energy sources. Despite these challenges, many experts believe that renewable energy will account for 80% of global electricity production by 2050.
  
  Government policies play a crucial role in accelerating the adoption of renewable energy. Feed-in tariffs, tax incentives, and carbon pricing mechanisms have proven effective in encouraging investment in clean energy technologies. International cooperation will be essential to achieve global climate goals and ensure a sustainable energy future for all nations.`,
      difficulty: "medium",
    },
    questions: [
      // Multiple Choice
      {
        id: "q1",
        questionType: "multiple_choice",
        instruction: "Choose the correct letter, A, B, C, or D.",
        questions: [
          {
            number: 1,
            question:
              "According to the passage, what percentage of sunlight can modern solar panels convert to electricity?",
            options: ["A) 15%", "B) 22%", "C) 25%", "D) 30%"],
            answer: "B",
          },
          {
            number: 2,
            question:
              "Where is the world's largest offshore wind farm located?",
            options: [
              "A) Atlantic Ocean",
              "B) Pacific Ocean",
              "C) North Sea",
              "D) Mediterranean Sea",
            ],
            answer: "C",
          },
        ],
      },
      // True/False/Not Given
      {
        id: "q2",
        questionType: "true_false_not_given",
        instruction:
          "Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.",
        questions: [
          {
            number: 3,
            statement:
              "Solar energy is now cheaper than fossil fuels in all countries.",
            answer: "false",
          },
          {
            number: 4,
            statement:
              "Micro-hydro systems are better for the environment than large dams.",
            answer: "true",
          },
          {
            number: 5,
            statement:
              "Wind energy storage technology has been completely solved.",
            answer: "not_given",
          },
        ],
      },
      // Sentence Completion
      {
        id: "q3",
        questionType: "sentence_completion",
        instruction:
          "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        questions: [
          {
            number: 6,
            sentenceWithBlank:
              "Offshore wind farms are effective because of consistent _______ over ocean surfaces.",
            correctAnswer: "wind patterns",
          },
          {
            number: 7,
            sentenceWithBlank:
              "_______ will be essential to achieve global climate goals.",
            correctAnswer: "International cooperation",
          },
        ],
      },
      // Matching Information
      {
        id: "q4",
        questionType: "matching_information",
        instruction:
          "Which paragraph contains the following information? Write the correct letter, A-F.",
        paragraphLabels: ["A", "B", "C", "D", "E", "F"],
        questions: [
          {
            number: 8,
            statement:
              "Information about the efficiency improvements in solar technology",
            correctParagraph: "B",
          },
          {
            number: 9,
            statement:
              "Details about government policy tools for renewable energy",
            correctParagraph: "F",
          },
        ],
      },
      // Short Answer
      {
        id: "q5",
        questionType: "short_answer",
        instruction:
          "Answer the questions below. Choose NO MORE THAN THREE WORDS from the passage for each answer.",
        maxWords: 3,
        wordLimitText: "NO MORE THAN THREE WORDS",
        questions: [
          {
            number: 10,
            question:
              "What percentage of global electricity production do experts predict renewable energy will account for by 2050?",
            correctAnswer: "80%",
          },
          {
            number: 11,
            question:
              "What are the three main pillars of sustainable energy production mentioned in the passage?",
            correctAnswer: "Solar, wind, hydroelectric",
          },
        ],
      },
    ],
  },

  // Section 2: Urban Planning and Smart Cities
  {
    passage: {
      id: "passage_2",
      title: "Smart Cities: The Urban Revolution",
      content: `Urban populations are growing at an unprecedented rate. By 2050, nearly 70% of the world's population will live in cities, placing enormous pressure on infrastructure, resources, and services. To address these challenges, urban planners are turning to smart city technologies that leverage data, sensors, and artificial intelligence to create more efficient and livable urban environments.
  
  Smart traffic management systems represent one of the most visible applications of urban technology. These systems use real-time data from traffic cameras, GPS devices, and road sensors to optimize traffic flow. Cities like Singapore and Barcelona have reduced traffic congestion by up to 25% through intelligent traffic light coordination and dynamic route planning. Emergency vehicles benefit particularly from these systems, as traffic lights can automatically change to green to provide clear pathways.
  
  Water management is another critical area where smart technology excels. IoT sensors monitor water quality, detect leaks, and track consumption patterns throughout the city. Amsterdam's smart water system has reduced water waste by 15% while improving service reliability. Predictive maintenance algorithms can identify potential pipe failures before they occur, preventing costly emergency repairs and service disruptions.
  
  Energy efficiency in smart cities relies heavily on smart grid technology. These advanced electrical grids can automatically balance supply and demand, integrate renewable energy sources, and provide detailed consumption data to residents. Copenhagen's smart grid initiative has achieved a 42% reduction in carbon emissions while maintaining reliable power supply. Smart meters allow citizens to monitor their energy usage in real-time and adjust their consumption accordingly.
  
  Public safety benefits significantly from smart city innovations. Facial recognition systems, predictive policing algorithms, and emergency response coordination platforms help law enforcement agencies prevent crime and respond more effectively to incidents. However, these technologies raise important questions about privacy and surveillance that cities must carefully address.
  
  The economic impact of smart city initiatives is substantial. Studies indicate that smart city technologies can increase urban GDP by 2-5% through improved efficiency and innovation. Job creation in technology sectors often accompanies smart city development, though some traditional jobs may become obsolete. Cities must invest in retraining programs to ensure their workforce can adapt to technological changes.
  
  Citizen engagement platforms represent a growing trend in smart city development. Mobile apps and digital platforms allow residents to report problems, access city services, and participate in decision-making processes. Boston's citizen engagement app has handled over 300,000 service requests, significantly improving government responsiveness and citizen satisfaction.`,
      difficulty: "hard",
    },
    questions: [
      // Multiple Choice Multiple Answers
      {
        id: "q6",
        questionType: "multiple_choice_multiple_answers",
        instruction:
          "Choose TWO letters, A-F. Which TWO benefits of smart traffic management systems are mentioned?",
        answersRequired: 2,
        options: [
          "A) Reduced traffic congestion",
          "B) Lower fuel costs",
          "C) Improved emergency vehicle access",
          "D) Fewer accidents",
          "E) Better air quality",
          "F) Increased parking availability",
        ],
        questions: [
          {
            number: 11,
            question:
              "Which TWO benefits of smart traffic management systems are mentioned?",
            answers: ["A", "C"],
          },
        ],
      },
      // Yes/No/Not Given
      {
        id: "q7",
        questionType: "yes_no_not_given",
        instruction:
          "Do the following statements agree with the views of the writer? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.",
        questions: [
          {
            number: 13,
            statement:
              "Smart city technologies will definitely solve all urban problems.",
            answer: "no",
          },
          {
            number: 14,
            statement:
              "Privacy concerns about smart city surveillance systems need careful consideration.",
            answer: "yes",
          },
          {
            number: 15,
            statement:
              "All citizens welcome smart city technologies without reservation.",
            answer: "not_given",
          },
        ],
      },
      // Summary Completion
      {
        id: "q8",
        questionType: "summary_completion",
        instruction:
          "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
        wordLimit: 1,
        wordLimitText: "ONE WORD ONLY",
        summaryText:
          "Smart cities use various technologies to improve urban life. Traffic management systems reduce (16)_______ and help emergency vehicles. Water management uses (17)_______ to monitor quality and detect problems. Energy systems can automatically balance supply and (18)_______ while integrating renewable sources.",
        questions: [
          {
            gapId: "16",
            correctAnswer: "congestion",
          },
          {
            gapId: "17",
            correctAnswer: "sensors",
          },
          {
            gapId: "18",
            correctAnswer: "demand",
          },
        ],
      },
      // Matching Features
      {
        id: "q9",
        questionType: "matching_features",
        instruction:
          "Match each city with the correct achievement. Write the correct letter, A-E, next to questions 19-21.",
        features: [
          { label: "A", description: "25% reduction in traffic congestion" },
          { label: "B", description: "15% reduction in water waste" },
          { label: "C", description: "42% reduction in carbon emissions" },
          { label: "D", description: "300,000 service requests handled" },
          { label: "E", description: "50% improvement in air quality" },
        ],
        questions: [
          {
            number: 19,
            statement: "Singapore",
            correctFeature: "A",
          },
          {
            number: 20,
            statement: "Amsterdam",
            correctFeature: "B",
          },
          {
            number: 21,
            statement: "Copenhagen",
            correctFeature: "C",
          },
        ],
      },
      // Table Completion
      {
        id: "q10",
        questionType: "table_completion",
        instruction:
          "Complete the table below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        tableStructure: [
          ["Smart City Area", "Technology Used", "Main Benefit"],
          ["Traffic Management", "Real-time data", "Reduced (22)_______"],
          ["Water Management", "(23)_______ sensors", "Leak detection"],
          ["Energy Systems", "(24)_______ grids", "Carbon reduction"],
        ],
        questions: [
          {
            cellId: "22",
            correctAnswer: "traffic congestion",
          },
          {
            cellId: "23",
            correctAnswer: "IoT",
          },
          {
            cellId: "24",
            correctAnswer: "smart",
          },
        ],
      },
    ],
  },

  // Section 3: Marine Biology and Ocean Conservation
  {
    passage: {
      id: "passage_3",
      title: "Coral Reef Ecosystems and Climate Change",
      content: `Coral reefs are among the most biodiverse ecosystems on Earth, often referred to as the "rainforests of the sea." These complex marine structures support approximately 25% of all marine species despite covering less than 1% of the ocean floor. The Great Barrier Reef alone hosts over 1,500 species of fish, 400 types of coral, and countless other marine organisms.
  
  The formation of coral reefs is a remarkable biological process. Coral polyps, tiny marine animals, form symbiotic relationships with microscopic algae called zooxanthellae. These algae live within the coral's tissues and provide up to 90% of the coral's nutritional needs through photosynthesis. In return, the coral provides the algae with protection and nutrients. This partnership is so efficient that coral reefs can thrive in nutrient-poor tropical waters.
  
  However, this delicate relationship is increasingly threatened by climate change. Rising ocean temperatures cause coral bleaching, a stress response where corals expel their zooxanthellae partners. Without these essential algae, corals lose their primary food source and their vibrant colors, appearing white or "bleached." If temperatures remain elevated for extended periods, the coral will eventually die.
  
  Ocean acidification presents another significant challenge. As seawater absorbs increasing amounts of carbon dioxide from the atmosphere, it becomes more acidic. This process, known as "the other CO2 problem," makes it difficult for corals to build and maintain their calcium carbonate skeletons. Young corals are particularly vulnerable, as they struggle to establish themselves in increasingly acidic conditions.
  
  The economic value of coral reefs extends far beyond their ecological importance. Reef tourism generates billions of dollars annually for coastal communities. In Australia, the Great Barrier Reef contributes approximately $6.4 billion to the national economy each year and supports over 64,000 jobs. Coral reefs also provide natural protection against storm surges and tsunamis, acting as underwater barriers that reduce wave energy by up to 97%.
  
  Conservation efforts are employing innovative approaches to protect and restore coral reefs. Coral gardening involves growing coral fragments in nurseries before transplanting them to degraded reef areas. Scientists are also developing heat-resistant coral varieties through selective breeding and genetic techniques. Some researchers are experimenting with "coral probiotics" – beneficial bacteria that may help corals resist bleaching and disease.
  
  Marine protected areas (MPAs) have proven effective in coral conservation. These designated zones restrict human activities such as fishing, anchoring, and coastal development. The Papahānaumokuākea Marine National Monument in Hawaii, one of the world's largest MPAs, has shown remarkable recovery in coral populations since its establishment. However, MPAs cannot address global threats like climate change and ocean acidification, which require international cooperation and reduced carbon emissions.
  
  Community involvement is crucial for successful coral conservation. Local fishing communities often serve as the first line of defense against reef degradation. Educational programs that teach sustainable fishing practices and alternative livelihoods help reduce pressure on reef ecosystems. In the Philippines, community-based coral restoration projects have successfully rehabilitated over 50 hectares of degraded reef areas.`,
      difficulty: "hard",
    },
    questions: [
      // Matching Headings
      {
        id: "q11",
        questionType: "matching_headings",
        instruction:
          "The passage has eight paragraphs, A-H. Choose the correct heading for each paragraph from the list of headings below.",
        headings: [
          "i. Economic benefits of coral reefs",
          "ii. The symbiotic relationship in coral formation",
          "iii. Introduction to coral reef biodiversity",
          "iv. Ocean acidification effects",
          "v. Conservation through marine protected areas",
          "vi. Climate change impacts on coral",
          "vii. Innovative restoration techniques",
          "viii. Community-based conservation efforts",
          "ix. Coral reef formation process",
          "x. Future of coral reefs",
        ],
        questions: [
          {
            paragraph: "A",
            correctHeading: "iii",
          },
          {
            paragraph: "B",
            correctHeading: "ii",
          },
          {
            paragraph: "C",
            correctHeading: "vi",
          },
          {
            paragraph: "E",
            correctHeading: "i",
          },
          {
            paragraph: "F",
            correctHeading: "vii",
          },
        ],
      },
      // Matching Sentence Endings
      {
        id: "q12",
        questionType: "matching_sentence_endings",
        instruction:
          "Complete each sentence with the correct ending, A-H, below.",
        endings: [
          { label: "A", text: "generates billions in tourism revenue." },
          { label: "B", text: "makes ocean water more acidic." },
          { label: "C", text: "provide 90% of coral nutrition." },
          { label: "D", text: "reduces wave energy significantly." },
          { label: "E", text: "requires international cooperation." },
          { label: "F", text: "have rehabilitated 50 hectares of reef." },
          { label: "G", text: "struggle in acidic conditions." },
          { label: "H", text: "support 25% of marine species." },
        ],
        questions: [
          {
            number: 27,
            sentenceStart: "Zooxanthellae algae",
            correctEnding: "C",
          },
          {
            number: 28,
            sentenceStart: "Carbon dioxide absorption",
            correctEnding: "B",
          },
          {
            number: 29,
            sentenceStart: "Natural coral barriers",
            correctEnding: "D",
          },
        ],
      },
      // Note Completion
      {
        id: "q13",
        questionType: "note_completion",
        instruction:
          "Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        noteText:
          "Coral Reef Threats:\n• Rising temperatures cause (30)_______\n• Ocean acidification affects (31)_______ skeletons\n• (32)_______ corals are most vulnerable to acidification",
        questions: [
          {
            gapId: "30",
            correctAnswer: "coral bleaching",
          },
          {
            gapId: "31",
            correctAnswer: "calcium carbonate",
          },
          {
            gapId: "32",
            correctAnswer: "Young",
          },
        ],
      },
      // Flow Chart Completion
      {
        id: "q14",
        questionType: "flow_chart_completion",
        chartType: "image",
        instruction:
          "Complete the flow chart below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        chartImage: "/images/ielts/flowchart.webp",
        inputPositions: [
          { stepId: "33", x: 55.5, y: 28.1 }, // First input position
          { stepId: "34", x: 77.4, y: 55.2 }, // Second input position
          { stepId: "35", x: 41.5, y: 85.5 }, // Third input position
        ],
        questions: [
          {
            stepId: "33",
            correctAnswer: "nurseries",
          },
          {
            stepId: "34",
            correctAnswer: "degraded",
          },
          {
            stepId: "35",
            correctAnswer: "heat-resistant",
          },
        ],
        options: [
          "nurseries",
          "degraded",
          "heat-resistant",
          "transplanted",
          "conservation",
          "breeding",
          "restoration",
          "fragments",
        ],
        instructions: "Follow the coral conservation process step by step.",
        totalGaps: 3,
      },
      // Diagram Label Completion
      {
        id: "q15",
        questionType: "diagram_label_completion",
        instruction:
          "Complete the labels on the diagram below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        wordLimit: 2,
        wordLimitText: "NO MORE THAN TWO WORDS",
        diagramImage: "/images/ielts/diagram.webp",
        inputPositions: [
          { labelId: "36", x: 20.0, y: 25.0 }, // Coral polyps position
          { labelId: "37", x: 60.0, y: 45.0 }, // Zooxanthellae position
          { labelId: "38", x: 40.0, y: 75.0 }, // Symbiotic relationship position
        ],
        questions: [
          {
            labelId: "36",
            correctAnswer: "coral polyps",
          },
          {
            labelId: "37",
            correctAnswer: "zooxanthellae",
          },
          {
            labelId: "38",
            correctAnswer: "symbiotic relationships",
          },
        ],
        options: [
          "coral polyps",
          "zooxanthellae",
          "symbiotic relationships",
          "marine animals",
          "algae partners",
          "calcium carbonate",
          "nutrients",
          "photosynthesis",
        ],
      },
    ],
  },
];

export default ieltsTestSections;
