import { QuestionAnswer } from "./question-answer";

export interface QuizzResult {
    id?: string;
    user: any;
    session: any;
    quizzAnswers: QuestionAnswer[];
    score?: number;
}
