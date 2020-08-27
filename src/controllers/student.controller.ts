// Routes
import * as koa from 'koa';
import * as Router from 'koa-router';
import * as moment from 'moment';
import { studentRepo } from '../repos/student.repo';
import { logRepo } from '../repos/assessmentLog.repo';
import {
    getStudentId,
    getInvalidStudentIdMessage,
    getEmptyAssessmentResponseMessage
} from '../utils';

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

            ctx.body = upcomingAssessments.length ?
                upcomingAssessments :
                getEmptyAssessmentResponseMessage('upcoming', selectedStudent.name);
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

            // First, get all assessment log IDs
            const assessmentLogIds = selectedLogs.map((log: any) => {
                return log.assessment
            });

            const openAssessments = studentAssessments.filter(assessment => {
                const isOpen: boolean = moment(assessment.open_time).isBefore(moment(currentDate)) &&
                    moment(assessment.close_time).isAfter(moment(currentDate));
                return isOpen && !assessmentLogIds.includes(assessment.id);
            }).sort((first, second) => {
                return moment(first.open_time).diff(moment(second.open_time));
            });

            ctx.body = openAssessments.length ?
                openAssessments :
                getEmptyAssessmentResponseMessage('open', selectedStudent.name);
        }
    }

    async displayExpiredAssessments(ctx: koa.Context, next: koa.Next) {
        const studentId = getStudentId(ctx.url);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

        if (selectedStudent.error) {
            ctx.body = getInvalidStudentIdMessage(studentId);
        } else {
            const studentAssessments: any[] = selectedStudent.assessments;
            const currentDate = new Date().toISOString();

            // Get all expired assignments
            // (no logs exist for these assessments, since they were never attempted)
            const expiredAssessments = studentAssessments.filter(assessment => {
                return moment(assessment.close_time).isBefore(moment(currentDate));
            }).sort((first, second) => {
                return moment(first.open_time).diff(moment(second.open_time));
            });;

            ctx.body = expiredAssessments.length ?
                expiredAssessments :
                getEmptyAssessmentResponseMessage('expired', selectedStudent.name);
        }
    }

    async displayInProgressAssessments(ctx: koa.Context, next: koa.Next) {
        const studentId = getStudentId(ctx.url);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

        if (selectedStudent.error) {
            ctx.body = getInvalidStudentIdMessage(studentId);
        } else {
            const currentDate = new Date().toISOString();
            const selectedLogs: any = await logRepo.getLogsByStudent(studentId);
            const studentAssessments: any[] = selectedStudent.assessments;
            const inProgressLogs = selectedLogs.filter((log: any) => log.is_complete === false);
            const inProgressAssessments: any[] = [];

            inProgressLogs.forEach((log: any) => {
                studentAssessments.forEach((assessment: any) => {
                    if (log.assessment === assessment.id) {
                        const hasNotExpired: boolean = moment(currentDate).isBefore(moment(assessment.close_time));
                        const timeElapsed: boolean = (moment(log.start_time).add(parseInt(assessment.time_limit), 'minutes')).isBefore(moment(currentDate))
                        if (hasNotExpired && !timeElapsed) {
                            inProgressAssessments.push(assessment);
                        }
                    }
                });
            });

            inProgressAssessments.sort((first, second) => {
                return moment(first.open_time).diff(moment(second.open_time));
            });

            ctx.body = inProgressAssessments.length ?
                inProgressAssessments :
                getEmptyAssessmentResponseMessage('in progress', selectedStudent.name);
        }
    }

    async displayCompletedAssessments(ctx: koa.Context, next: koa.Next) {
        const studentId = getStudentId(ctx.url);
        const selectedStudent: any = await studentRepo.getLogsByStudent(studentId);

        if (selectedStudent.error) {
            ctx.body = getInvalidStudentIdMessage(studentId);
        } else {
            const selectedLogs: any = await logRepo.getLogsByStudent(studentId);
            const completedAssessmentIds = selectedLogs.filter((log: any) => log.is_complete).map((log: any) => log.assessment);
            const studentAssessments: any[] = selectedStudent.assessments;

            const completedAssessments = studentAssessments.filter(assessment => {
                return completedAssessmentIds.includes(assessment.id);
            }).sort((first, second) => {
                return moment(first.open_time).diff(moment(second.open_time));
            });

            ctx.body = completedAssessments.length ?
                completedAssessments :
                getEmptyAssessmentResponseMessage('completed', selectedStudent.name);
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
router.get('/student/assessment/expired/:studentId', studentController.displayExpiredAssessments);
router.get('/student/assessment/inprogress/:studentId', studentController.displayInProgressAssessments);
router.get('/student/assessment/completed/:studentId', studentController.displayCompletedAssessments);

export const StudentRouters = router;
