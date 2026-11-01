export type UserRole = 'admin' | 'contributor' | 'analyst';

export type SurveyStatus = 'published' | 'draft' | 'paused' | 'closed';

export type QuestionType =
  | 'nps'
  | 'rating_stars'
  | 'multiple_choice'
  | 'checkboxes'
  | 'likert'
  | 'text'
  | 'thumbs';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  minLabel?: string;
  maxLabel?: string;
  scale?: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  responseTarget?: number;
  allowAnonymous: boolean;
  themeColor?: string;
}

export interface QuestionAnswer {
  questionId: string;
  value: string | number | string[];
}

export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface SurveyResponse {
  id: string;
  surveyId: string;
  surveyTitle: string;
  respondentName: string;
  respondentEmail: string;
  respondentCompany?: string;
  submittedAt: string;
  answers: QuestionAnswer[];
  npsScore?: number;
  csatRating?: number;
  sentiment: SentimentType;
  reviewed: boolean;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
  lastActive: string;
}

export interface WorkspaceMetrics {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  avgCompletionRate: number;
  npsScore: number;
  avgCsat: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
