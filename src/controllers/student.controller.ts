// Routes
import * as koa from 'koa';
import * as Router from 'koa-router';
import * as moment from 'moment';
import { studentRepo } from '../repos/student.repo';
import { logRepo } from '../repos/assessmentLog.repo';
import { getStudentId, getInvalidStudentIdMessage } from '../utils';

class StudentController {
    // constructor(){}

    async display(ctx: koa.Context, next: koa.Next) {
        const studentId = getStudentId(ctx.url);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

        ctx.body = selectedStudent.error ? getInvalidStudentIdMessage(studentId) : selectedStudent;
    }

    async displayUpcomingAssessments(ctx: koa.Context, next: koa.Next) {
        const studentId = getStudentId(ctx.url);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);


        if (selectedStudent.error) {
            ctx.body = getInvalidStudentIdMessage(studentId);
        } else {
            const studentAssessments: any[] = selectedStudent.assessments;

            // Retrieve upcoming assessments
            const currentDate = new Date().toISOString();
            const upcomingAssessments: any[] = studentAssessments.filter(assessment => {
                return moment(assessment.open_time).isAfter(currentDate);
            }).sort((first, second) => {
                return moment(first.open_time).diff(second.open_time);
            });

            ctx.body = upcomingAssessments;
        }
    }

    async displayOpenAssessments(ctx: koa.Context, next: koa.Next) {
        const studentId = getStudentId(ctx.url);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

        if (selectedStudent.error) {
            ctx.body = getInvalidStudentIdMessage(studentId);
        } else {
            const selectedLogs: any = await logRepo.getLogsByStudent(studentId);
            const studentAssessments: any[] = selectedStudent.assessments;
            const currentDate = new Date().toISOString();

            // First, find IDs for open assessment(s)
            const openAssessmentIds: any[] = selectedLogs.filter((log: any) => {
                return moment(log.start_time).isSame(moment(currentDate), 'day');
            }).map((assessment: any) => assessment.assessment); // assessment ID

            // Next, get the assessments based on log IDs
            const openAssessments = studentAssessments.filter(assessment => {
                return openAssessmentIds.includes(assessment.id);
            });

            ctx.body = openAssessments;
        }
    }

}
export const studentController = new StudentController();


//
// Simple routing logic
//
const router = new Router()

router.get('/student/display/:studentid', studentController.display)
router.get('/student/assessment/upcoming/:studentId', studentController.displayUpcomingAssessments)
router.get('/student/assessment/open/:studentId', studentController.displayOpenAssessments);

export const StudentRouters = router;
