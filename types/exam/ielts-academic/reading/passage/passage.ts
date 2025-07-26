export interface IELTSReadingPassage {
  id: string;
  title: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  organizationId: number;
  subTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
