import { User } from './user';
export interface Training {
  _id?: string;
  title: string;
  subject: string;
  teacher?: any;
  students?: any[];
  sessions?: any[];
  __v?: number
}
