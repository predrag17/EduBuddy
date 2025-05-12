export type UserDto = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
};

export type MaterialDto = {
  id: number;
  subject: string;
  description: string;
  file: string;
  isProcessed: boolean;
  category: CategoryDto;
  uploadedAt: string;
  user: UserDto;
};

export type CategoryDto = {
  id: number;
  name: string;
};

export type AnswerDto = {
  id: number;
  text: string;
  is_correct: boolean;
};

export type QuestionDto = {
  id: number;
  text: string;
  answers: AnswerDto[];
};

export type QuizDto = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user: UserDto;
  questions: QuestionDto[];
};

export type QuestionResultDto = {
  question_id: number;
  selected_answer: string;
  difficulty: string;
};

export type QuizSummaryDto = {
  id: number;
  quiz_id: number;
  title: string;
  difficulty: string;
  total_questions: number;
  score: number;
  submitted_at: string;
  question_results: QuestionResultDto[];
};
