export interface Question {
    _id?: string;
    question: string;
    choices: string[];
    correctAnswers: string[];
}