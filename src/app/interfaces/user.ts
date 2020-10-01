import { Pole } from './pole';

export interface User {
    _id?: string;
    name: string;
    lastName: string;
    email?: string;
    password?: string;
    pole: Pole;
    roleName: string;
    __v?: number;
  }

//   interface UserPole {
//       _id: string;
//       name: string;
//   }