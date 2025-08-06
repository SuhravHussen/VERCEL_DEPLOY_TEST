"use client";

import {
  IELTSReadingQuestionGroup,
  MultipleChoiceGroup,
  MultipleChoiceMultipleAnswersGroup,
  TrueFalseNotGivenGroup,
  YesNoNotGivenGroup,
  SentenceCompletionGroup,
  SummaryCompletionGroup,
  NoteCompletionGroup,
  TableCompletionGroup,
  FlowChartCompletionGroup,
  DiagramLabelCompletionGroup,
  MatchingInformationGroup,
  MatchingHeadingsGroup,
  MatchingFeaturesGroup,
  MatchingSentenceEndingsGroup,
  ShortAnswerGroup,
} from "@/types/exam/ielts-academic/reading/question/question";
import {
  MultipleChoiceRenderer,
  MultipleChoiceMultipleAnswersRenderer,
  TrueFalseNotGivenRenderer,
  YesNoNotGivenRenderer,
  SentenceCompletionRenderer,
  SummaryCompletionRenderer,
  NoteCompletionRenderer,
  TableCompletionRenderer,
  FlowChartCompletionRenderer,
  DiagramLabelCompletionRenderer,
  MatchingInformationRenderer,
  MatchingHeadingsRenderer,
  MatchingFeaturesRenderer,
  MatchingSentenceEndingsRenderer,
  ShortAnswerRenderer,
} from "./question-types";

interface ReadingQuestionRendererProps {
  questionGroup: IELTSReadingQuestionGroup;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
}

export default function ReadingQuestionRenderer({
  questionGroup,
  answers,
  onAnswerChange,
}: ReadingQuestionRendererProps) {
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
            questionGroup={questionGroup as MultipleChoiceGroup}
          />
        );
      case "multiple_choice_multiple_answers":
        return (
          <MultipleChoiceMultipleAnswersRenderer
            {...commonProps}
            questionGroup={questionGroup as MultipleChoiceMultipleAnswersGroup}
          />
        );
      case "true_false_not_given":
        return (
          <TrueFalseNotGivenRenderer
            {...commonProps}
            questionGroup={questionGroup as TrueFalseNotGivenGroup}
          />
        );
      case "yes_no_not_given":
        return (
          <YesNoNotGivenRenderer
            {...commonProps}
            questionGroup={questionGroup as YesNoNotGivenGroup}
          />
        );
      case "sentence_completion":
        return (
          <SentenceCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as SentenceCompletionGroup}
          />
        );
      case "summary_completion":
        return (
          <SummaryCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as SummaryCompletionGroup}
          />
        );
      case "note_completion":
        return (
          <NoteCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as NoteCompletionGroup}
          />
        );
      case "table_completion":
        return (
          <TableCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as TableCompletionGroup}
          />
        );
      case "flow_chart_completion":
        return (
          <FlowChartCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as FlowChartCompletionGroup}
          />
        );
      case "diagram_label_completion":
        return (
          <DiagramLabelCompletionRenderer
            {...commonProps}
            questionGroup={questionGroup as DiagramLabelCompletionGroup}
          />
        );
      case "matching_information":
        return (
          <MatchingInformationRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingInformationGroup}
          />
        );
      case "matching_headings":
        return (
          <MatchingHeadingsRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingHeadingsGroup}
          />
        );
      case "matching_features":
        return (
          <MatchingFeaturesRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingFeaturesGroup}
          />
        );
      case "matching_sentence_endings":
        return (
          <MatchingSentenceEndingsRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingSentenceEndingsGroup}
          />
        );
      case "short_answer":
        return (
          <ShortAnswerRenderer
            {...commonProps}
            questionGroup={questionGroup as ShortAnswerGroup}
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
