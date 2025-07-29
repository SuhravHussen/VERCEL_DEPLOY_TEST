import {
  IELTSWritingTask,
  IELTSAcademicTask1,
  IELTSGeneralTask1,
  IELTSTask2,
} from "@/types/exam/ielts-academic/writing/writing";

export const mockIeltsWritingTasks: IELTSWritingTask[] = [
  // Academic Task 1 - Line Graph
  {
    id: "academic-task1-line-001",
    taskType: "task_1",
    detailType: "line_graph",
    instruction:
      "The graph below shows the number of tourists visiting a particular Caribbean island between 2010 and 2017. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    prompt: "You should write at least 150 words.",
    timeLimit: 20,
    minimumWords: 150,
    visualData: {
      chartImage: "/images/ielts/diagram.webp",
      chartDescription:
        "Line graph showing tourist arrivals from 2010-2017, with visitors staying on cruise ships and visitors staying on island shown as separate lines",
    },
    keyFeatures: [
      "Total tourists increased from 1 million to 3.5 million",
      "Cruise ship visitors grew more rapidly than island visitors",
      "Sharp increase in cruise ship visitors after 2015",
    ],
    sampleAnswer:
      "The line graph illustrates the changes in tourist numbers visiting a Caribbean island over an eight-year period from 2010 to 2017, distinguishing between those staying on cruise ships and those staying on the island itself. Overall, total tourist arrivals increased significantly throughout the period, rising from approximately 1 million in 2010 to 3.5 million in 2017. Visitors staying on cruise ships showed the most dramatic growth, starting at around 0.25 million in 2010 and reaching 2 million by 2017. This represented an eight-fold increase, with particularly steep growth occurring after 2015. In contrast, tourists staying on the island showed more modest but steady growth, beginning at 0.75 million in 2010 and reaching 1.5 million in 2017, doubling over the period. The data reveals that cruise ship tourism became the dominant form of tourism for this destination, overtaking island-based tourism around 2015-2016.",
  } as IELTSAcademicTask1,

  // Academic Task 1 - Bar Chart
  {
    id: "academic-task1-bar-002",
    taskType: "task_1",
    detailType: "bar_chart",
    instruction:
      "The chart below shows the results of a survey about people's coffee and tea buying and drinking habits in five Australian cities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    prompt: "Write at least 150 words.",
    timeLimit: 20,
    minimumWords: 150,
    visualData: {
      chartImage: "/images/ielts/diagram.webp",
      chartDescription:
        "Bar chart comparing percentage of people who bought fresh coffee, bought instant coffee, and went to café for coffee or tea in Sydney, Melbourne, Brisbane, Adelaide, and Hobart",
    },
    keyFeatures: [
      "Going to café was most popular in all cities except Adelaide",
      "Instant coffee was more popular than fresh coffee in most cities",
      "Hobart had highest percentage for café visits",
    ],
  } as IELTSAcademicTask1,

  // Academic Task 1 - Process Diagram
  {
    id: "academic-task1-process-003",
    taskType: "task_1",
    detailType: "diagram_process",
    instruction:
      "The diagram below shows the process of making chocolate. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    prompt: "Write at least 150 words.",
    timeLimit: 20,
    minimumWords: 150,
    visualData: {
      chartImage: "/images/ielts/diagram.webp",
      chartDescription:
        "Flow diagram showing chocolate production from cacao tree to finished chocolate bars",
    },
    keyFeatures: [
      "Process begins with cacao trees grown in tropical regions",
      "Beans are fermented, dried, and roasted",
      "Final steps involve grinding, tempering, and molding",
    ],
  } as IELTSAcademicTask1,

  // General Training Task 1 - Formal Letter
  {
    id: "general-task1-formal-001",
    taskType: "task_1",
    detailType: "formal_letter",
    instruction:
      "You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager.",
    prompt: "Write at least 150 words. You do NOT need to write any addresses.",
    scenario:
      "Faulty kitchen equipment purchase with unresponsive customer service",
    bulletPoints: [
      "describe the problem with the equipment",
      "explain what happened when you phoned the shop",
      "say what you would like the manager to do",
    ],
    recipient: "Shop Manager",
    tone: "formal",
    timeLimit: 20,
    minimumWords: 150,
    sampleAnswer:
      "Dear Sir or Madam, I am writing to express my dissatisfaction with a recent purchase and the subsequent lack of customer service response. Three weeks ago, I purchased a KitchenMaster food processor from your store, order number KM2847. Unfortunately, the equipment has failed to function properly from the first use. The motor makes unusual grinding noises and stops working after just a few minutes of operation. When I contacted your customer service department by phone on two separate occasions, I was promised that a technician would call me back within 48 hours. However, no one has contacted me, and I remain without a working appliance despite paying £299 for this item. I would appreciate your immediate attention to resolve this matter. I request either a full replacement of the defective unit or a complete refund. I have kept all original packaging and receipts as proof of purchase. I look forward to your prompt response and a satisfactory resolution to this issue. Yours faithfully, [Your name]",
  } as IELTSGeneralTask1,

  // Academic Task 2 - Opinion Essay
  {
    id: "academic-task2-opinion-001",
    taskType: "task_2",
    detailType: "opinion_essay",
    instruction: "Write about the following topic:",
    topic: "Education and Technology",
    prompt:
      "Some people think that children should begin their formal education at a very early age and should spend most of their time on school studies. Others believe that young children should spend most of their time playing. Discuss both these views and give your own opinion.",
    backgroundInfo:
      "There is ongoing debate about the optimal balance between formal education and play in early childhood development.",
    specificQuestion: "Discuss both views and give your own opinion.",
    timeLimit: 40,
    minimumWords: 250,
    keyWords: [
      "early education",
      "formal learning",
      "play",
      "child development",
      "balance",
    ],
    sampleAnswer:
      "The question of whether young children should focus primarily on formal education or play has generated considerable debate among educators and parents. While both approaches have merit, I believe a balanced combination is essential for optimal child development. Proponents of early formal education argue that children's brains are most receptive to learning during their early years. They contend that structured academic instruction can accelerate cognitive development and provide children with fundamental skills in literacy and numeracy that will serve as building blocks for future learning. Countries like Singapore and South Korea, which emphasize early academic achievement, often demonstrate strong performance in international educational assessments. However, advocates for play-based learning present compelling counterarguments. Research in developmental psychology suggests that play is crucial for developing creativity, problem-solving skills, and emotional intelligence. Through play, children learn to interact socially, develop imagination, and process their experiences in a natural, stress-free environment. The Finnish education system, renowned for its success, delays formal academic instruction until age seven, prioritizing play and exploration in early years. In my opinion, the most effective approach combines structured learning with abundant opportunities for play. Early childhood education should introduce basic concepts through playful, interactive methods rather than rigid academic instruction. This balanced approach respects children's developmental needs while still providing educational foundation, ensuring they develop both cognitive skills and emotional well-being necessary for lifelong success.",
  } as IELTSTask2,

  // Academic Task 2 - Problem-Solution Essay
  {
    id: "academic-task2-problem-002",
    taskType: "task_2",
    detailType: "problem_solution_essay",
    instruction: "Write about the following topic:",
    topic: "Urban Traffic Congestion",
    prompt:
      "Traffic congestion is becoming a huge problem for many major cities. Suggest some measures that could be taken to reduce traffic in big cities.",
    backgroundInfo:
      "Urban areas worldwide are experiencing increasing traffic congestion due to population growth and urbanization.",
    specificQuestion: "Suggest measures to reduce traffic in big cities.",
    timeLimit: 40,
    minimumWords: 250,
    keyWords: [
      "traffic congestion",
      "urban planning",
      "public transport",
      "solutions",
      "cities",
    ],
  } as IELTSTask2,
];
