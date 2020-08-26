import { Student} from './student';
import { Assessment } from './assessment';

export interface AssessmentLog {
    id: number;
    is_complete: boolean;
    start_time: Date;
    total_time: number;
    student: Student;
    assessment: Assessment;
}