import { IELTSListeningQuestionGroup } from "@/types/exam/ielts-academic/listening/listening";

import { FlowChartCompletionView } from "./FlowChartCompletionView";
import { DiagramLabelCompletionView } from "./DiagramLabelCompletionView";
import { MatchingGroupView } from "./MatchingGroupView";
import { ShortAnswerGroupView } from "./ShortAnswerGroupView";
import { MultipleChoiceGroupView } from "./MultipleChoiceGroupView";
import { MultipleChoiceMultipleAnswersGroupView } from "./MultipleChoiceMultipleAnswersGroupView";
import { SentenceCompletionView } from "./SentenceCompletionView";
import { FormCompletionView } from "./FormCompletionView";
import { NoteCompletionView } from "./NoteCompletionView";
import { TableCompletionView } from "./TableCompletionView";
import { DefaultQuestionGroupView } from "./DefaultQuestionGroupView";

interface QuestionGroupRendererProps {
  group: IELTSListeningQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function QuestionGroupRenderer({
  group,
  getQuestionTypeLabel,
}: QuestionGroupRendererProps) {
  // Render specific component based on question type
  switch (group.questionType) {
    case "multiple_choice":
      return (
        <MultipleChoiceGroupView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "multiple_choice_multiple_answers":
      return (
        <MultipleChoiceMultipleAnswersGroupView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "sentence_completion":
      return (
        <SentenceCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "form_completion":
      return (
        <FormCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "note_completion":
      return (
        <NoteCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "table_completion":
      return (
        <TableCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "flow_chart_completion":
      return (
        <FlowChartCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "diagram_label_completion":
      return (
        <DiagramLabelCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "matching":
      return (
        <MatchingGroupView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    case "short_answer":
      return (
        <ShortAnswerGroupView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
    default:
      return (
        <DefaultQuestionGroupView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );
  }
}
