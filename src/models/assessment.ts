import { Question } from './question';

export interface Assessment {
    id: number;
    name: string;
    description: string;
    open_time: Date;
    close_time: Date;
    time_limit: number;
    is_locked: boolean;
    questions: Question[];
}