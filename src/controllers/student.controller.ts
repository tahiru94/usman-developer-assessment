// Routes
import * as koa from 'koa';
import * as Router from 'koa-router';
import * as moment from 'moment';
import { studentRepo } from '../repos/student.repo';

class StudentController {
    // constructor(){}

    async display(ctx: koa.Context, next: koa.Next) {
        // Work starts here.
        const idFromUrl: any = ctx.url.match(/\d+/);
        const studentId: number = parseInt(idFromUrl[0]);
        const selectedStudent = await studentRepo.getLogsByStudent(studentId);
        ctx.body = selectedStudent;
    }

    async displayUpcomingAssessments(ctx: koa.Context, next: koa.Next) {
        const idFromUrl: any = ctx.url.match(/\d+/);
        const studentId: number = parseInt(idFromUrl[0]);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

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

    async displayOpenAssessments(ctx: koa.Context, next: koa.Next) {
        const idFromUrl: any = ctx.url.match(/\d+/);
        const studentId: number = parseInt(idFromUrl[0]);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

        const studentAssessments: any[] = selectedStudent.assessments;

        // Retrieve open assessments
        const currentDate = new Date().toISOString();
        const openAssessments: any[] = studentAssessments.filter(assessment => {
            // Make sure assessment is open (between open_time and close_time)
            return moment(currentDate).isAfter(assessment.open_time) && moment(currentDate).isBefore(assessment.close_time);
        }).sort((first, second) => {
            return moment(first.open_time).diff(second.open_time);
        });

        ctx.body = openAssessments;
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
