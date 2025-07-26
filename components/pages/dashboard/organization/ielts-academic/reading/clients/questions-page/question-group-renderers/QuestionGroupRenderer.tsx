import {
  IELTSReadingQuestionGroup,
  MatchingFeaturesGroup,
  MatchingHeadingsGroup,
  MatchingInformationGroup,
  MatchingSentenceEndingsGroup,
  MultipleChoiceGroup,
  MultipleChoiceMultipleAnswersGroup,
} from "@/types/exam/ielts-academic/reading/question/question";
import { CompletionGroupView } from "./CompletionGroupView";
import { DefaultQuestionGroupView } from "./DefaultQuestionGroupView";
import { DiagramCompletionView } from "./DiagramCompletionView";
import { MatchingFeaturesGroupView } from "./MatchingFeaturesGroupView";
import { MatchingHeadingsGroupView } from "./MatchingHeadingsGroupView";
import { MatchingInformationGroupView } from "./MatchingInformationGroupView";
import { MatchingSentenceEndingsGroupView } from "./MatchingSentenceEndingsGroupView";
import { MultipleChoiceGroupView } from "./MultipleChoiceGroupView";
import { MultipleChoiceMultipleAnswersGroupView } from "./MultipleChoiceMultipleAnswersGroupView";
import { SentenceCompletionView } from "./SentenceCompletionView";
import { TableCompletionView } from "./TableCompletionView";
import { TrueFalseYesNoGroupView } from "./TrueFalseYesNoGroupView";

interface QuestionGroupRendererProps {
  group: IELTSReadingQuestionGroup;
  getQuestionTypeLabel: (type: string) => string;
}

export function QuestionGroupRenderer({
  group,
  getQuestionTypeLabel,
}: QuestionGroupRendererProps) {
  switch (group.questionType) {
    case "multiple_choice":
      return (
        <MultipleChoiceGroupView
          group={group as MultipleChoiceGroup}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );

    case "multiple_choice_multiple_answers":
      return (
        <MultipleChoiceMultipleAnswersGroupView
          group={group as MultipleChoiceMultipleAnswersGroup}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );

    case "matching_information":
      return (
        <MatchingInformationGroupView
          group={group as MatchingInformationGroup}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );

    case "matching_headings":
      return (
        <MatchingHeadingsGroupView
          group={group as MatchingHeadingsGroup}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );

    case "matching_features":
      return (
        <MatchingFeaturesGroupView
          group={group as MatchingFeaturesGroup}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );

    case "matching_sentence_endings":
      return (
        <MatchingSentenceEndingsGroupView
          group={group as MatchingSentenceEndingsGroup}
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

    case "diagram_label_completion":
    case "flow_chart_completion":
      return (
        <DiagramCompletionView
          group={group}
          getQuestionTypeLabel={getQuestionTypeLabel}
        />
      );

    case "summary_completion":
    case "note_completion":
      return (
        <CompletionGroupView
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

    case "true_false_not_given":
    case "yes_no_not_given":
      return (
        <TrueFalseYesNoGroupView
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
