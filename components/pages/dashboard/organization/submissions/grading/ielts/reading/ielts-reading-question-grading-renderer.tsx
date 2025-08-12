"use client";

import { IELTSReadingQuestionGroup } from "@/types/exam/ielts-academic/reading/question/question";
import MultipleChoiceGradingRenderer from "./question-types/multiple-choice-grading-renderer";
import MultipleChoiceMultipleAnswersGradingRenderer from "./question-types/multiple-choice-multiple-answers-grading-renderer";
import TrueFalseNotGivenGradingRenderer from "./question-types/true-false-not-given-grading-renderer";
import YesNoNotGivenGradingRenderer from "./question-types/yes-no-not-given-grading-renderer";
import MatchingInformationGradingRenderer from "./question-types/matching-information-grading-renderer";
import MatchingHeadingsGradingRenderer from "./question-types/matching-headings-grading-renderer";
import MatchingFeaturesGradingRenderer from "./question-types/matching-features-grading-renderer";
import MatchingSentenceEndingsGradingRenderer from "./question-types/matching-sentence-endings-grading-renderer";
import SentenceCompletionGradingRenderer from "./question-types/sentence-completion-grading-renderer";
import SummaryCompletionGradingRenderer from "./question-types/summary-completion-grading-renderer";
import NoteCompletionGradingRenderer from "./question-types/note-completion-grading-renderer";
import TableCompletionGradingRenderer from "./question-types/table-completion-grading-renderer";
import FlowChartCompletionGradingRenderer from "./question-types/flow-chart-completion-grading-renderer";
import DiagramLabelCompletionGradingRenderer from "./question-types/diagram-label-completion-grading-renderer";
import ShortAnswerGradingRenderer from "./question-types/short-answer-grading-renderer";

import {
  MultipleChoiceGroup,
  MultipleChoiceMultipleAnswersGroup,
  TrueFalseNotGivenGroup,
  YesNoNotGivenGroup,
  MatchingInformationGroup,
  MatchingHeadingsGroup,
  MatchingFeaturesGroup,
  MatchingSentenceEndingsGroup,
  SentenceCompletionGroup,
  SummaryCompletionGroup,
  NoteCompletionGroup,
  TableCompletionGroup,
  FlowChartCompletionGroup,
  DiagramLabelCompletionGroup,
  ShortAnswerGroup,
} from "@/types/exam/ielts-academic/reading/question/question";

type ManualGradeStatus = "correct" | "incorrect" | "auto";

interface ManualGrades {
  [questionNumber: number]: ManualGradeStatus;
}

interface IELTSReadingQuestionGradingRendererProps {
  questionGroup: IELTSReadingQuestionGroup;
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

export default function IELTSReadingQuestionGradingRenderer({
  questionGroup,
  userAnswers,
  manualGrades,
  onManualGradeChange,
  getFinalGradeStatus,
}: IELTSReadingQuestionGradingRendererProps) {
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
            questionGroup={questionGroup as MultipleChoiceGroup}
          />
        );

      case "multiple_choice_multiple_answers":
        return (
          <MultipleChoiceMultipleAnswersGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as MultipleChoiceMultipleAnswersGroup}
          />
        );

      case "true_false_not_given":
        return (
          <TrueFalseNotGivenGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as TrueFalseNotGivenGroup}
          />
        );

      case "yes_no_not_given":
        return (
          <YesNoNotGivenGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as YesNoNotGivenGroup}
          />
        );

      case "matching_information":
        return (
          <MatchingInformationGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingInformationGroup}
          />
        );

      case "matching_headings":
        return (
          <MatchingHeadingsGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingHeadingsGroup}
          />
        );

      case "matching_features":
        return (
          <MatchingFeaturesGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingFeaturesGroup}
          />
        );

      case "matching_sentence_endings":
        return (
          <MatchingSentenceEndingsGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as MatchingSentenceEndingsGroup}
          />
        );

      case "sentence_completion":
        return (
          <SentenceCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as SentenceCompletionGroup}
          />
        );

      case "summary_completion":
        return (
          <SummaryCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as SummaryCompletionGroup}
          />
        );

      case "note_completion":
        return (
          <NoteCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as NoteCompletionGroup}
          />
        );

      case "table_completion":
        return (
          <TableCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as TableCompletionGroup}
          />
        );

      case "flow_chart_completion":
        return (
          <FlowChartCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as FlowChartCompletionGroup}
          />
        );

      case "diagram_label_completion":
        return (
          <DiagramLabelCompletionGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as DiagramLabelCompletionGroup}
          />
        );

      case "short_answer":
        return (
          <ShortAnswerGradingRenderer
            {...commonProps}
            questionGroup={questionGroup as ShortAnswerGroup}
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
