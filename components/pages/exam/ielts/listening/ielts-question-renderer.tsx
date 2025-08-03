"use client";

import {
  IELTSListeningQuestionGroup,
  ListeningMultipleChoiceGroup,
  ListeningMultipleChoiceMultipleAnswersGroup,
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
  MultipleChoiceRenderer,
  MultipleChoiceMultipleAnswersRenderer,
  SentenceCompletionRenderer,
  FormCompletionRenderer,
  NoteCompletionRenderer,
  TableCompletionRenderer,
  FlowChartCompletionRenderer,
  DiagramLabelCompletionRenderer,
  MatchingRenderer,
  ShortAnswerRenderer,
} from "./question-types";

interface IELTSQuestionRendererProps {
  questionGroup: IELTSListeningQuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function IELTSQuestionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: IELTSQuestionRendererProps) {
  const renderQuestionByType = () => {
    const commonProps = {
      answers,
      onAnswerChange,
    };

    switch (questionGroup.questionType) {
      case "multiple_choice":
        return (
          <MultipleChoiceRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningMultipleChoiceGroup}
          />
        );
      case "multiple_choice_multiple_answers":
        return (
          <MultipleChoiceMultipleAnswersRenderer
            {...commonProps}
            questionGroup={
              questionGroup as ListeningMultipleChoiceMultipleAnswersGroup
            }
          />
        );
      case "sentence_completion":
        return (
          <SentenceCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningSentenceCompletionGroup}
          />
        );
      case "form_completion":
        return (
          <FormCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningFormCompletionGroup}
          />
        );
      case "note_completion":
        return (
          <NoteCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningNoteCompletionGroup}
          />
        );
      case "table_completion":
        return (
          <TableCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningTableCompletionGroup}
          />
        );
      case "flow_chart_completion":
        return (
          <FlowChartCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningFlowChartCompletionGroup}
          />
        );
      case "diagram_label_completion":
        return (
          <DiagramLabelCompletionRenderer
            {...commonProps}
            questionGroup={
              questionGroup as ListeningDiagramLabelCompletionGroup
            }
          />
        );
      case "matching":
        return (
          <MatchingRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningMatchingGroup}
          />
        );
      case "short_answer":
        return (
          <ShortAnswerRenderer
            {...commonProps}
            questionGroup={questionGroup as ListeningShortAnswerGroup}
          />
        );
      default:
        return (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-muted-foreground">
              Question type &quot;{questionGroup.questionType}&quot; is not yet
              supported.
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
