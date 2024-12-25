export interface Question {
  question: string;
  choices: string[];
  correctAnswer: number;
}

export interface TestState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  questionsAnswered: number;
}