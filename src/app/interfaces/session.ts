import { SessionFile } from './session-file';


export interface Session {
  _id?: string;
  title: string;
  date: Date;
  duration: any;
  documents?: SessionFile[];
  quizz?: any[];
  __v?: number;
}

