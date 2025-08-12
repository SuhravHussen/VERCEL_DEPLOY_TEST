"use client";

import {
  IELTSListeningQuestionGroup,
  ListeningMultipleChoiceGroup,
  ListeningSentenceCompletionGroup,
  ListeningFormCompletionGroup,
  ListeningNoteCompletionGroup,
  ListeningTableCompletionGroup,
  ListeningFlowChartCompletionGroup,
  ListeningDiagramLabelCompletionGroup,
  ListeningMatchingGroup,
  ListeningShortAnswerGroup,
} from "@/types/exam/ielts-academic/listening/listening";
import {
  MultipleChoiceGradingRenderer,
  SentenceCompletionGradingRenderer,
  FormCompletionGradingRenderer,
  NoteCompletionGradingRenderer,
  TableCompletionGradingRenderer,
  FlowChartCompletionGradingRenderer,
  DiagramLabelCompletionGradingRenderer,
  MatchingGradingRenderer,
  ShortAnswerGradingRenderer,
} from "./question-types";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface IELTSQuestionGradingRendererProps {
  questionGroup: IELTSListeningQuestionGroup;
  userAnswers: Map<number, string>;
  manualGrades: ManualGrades;
  onManualGradeChange: (
    questionNumber: number,
    status: ManualGradeStatus
  ) => void;
  getFinalGradeStatus: (
    questionNumber: number
  ) => "correct" | "incorrect" | "unanswered";
}

export default function IELTSQuestionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: IELTSQuestionGradingRendererProps) {
  const renderQuestionByType = () => {
    const commonProps = {
      userAnswers,
      manualGrades,
      onManualGradeChange,
      getFinalGradeStatus,
    };

    switch (questionGroup.questionType) {
      case "multiple_choice":
        return (
          <MultipleChoiceGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningMultipleChoiceGroup}
          />
        );

      case "sentence_completion":
        return (
          <SentenceCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningSentenceCompletionGroup}
          />
        );

      case "form_completion":
        return (
          <FormCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningFormCompletionGroup}
          />
        );

      case "note_completion":
        return (
          <NoteCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningNoteCompletionGroup}
          />
        );

      case "table_completion":
        return (
          <TableCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningTableCompletionGroup}
          />
        );

      case "flow_chart_completion":
        return (
          <FlowChartCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningFlowChartCompletionGroup}
          />
        );

      case "diagram_label_completion":
        return (
          <DiagramLabelCompletionGradingRenderer
            {...commonProps}
            questionGroup={
              questionGroup as ListeningDiagramLabelCompletionGroup
            }
          />
        );

      case "matching":
        return (
          <MatchingGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningMatchingGroup}
          />
        );

      case "short_answer":
        return (
          <ShortAnswerGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningShortAnswerGroup}
          />
        );

      default:
        return (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-muted-foreground">
              Question type &quot;{questionGroup.questionType}&quot; grading is
              not yet supported.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {renderQuestionByType()}
    </div>
  );
}
