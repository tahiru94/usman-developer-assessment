// Routes
import * as koa from 'koa';
import * as Router from 'koa-router';
import { studentRepo } from '../repos/student.repo';

class StudentController {
    // constructor(){}

    async display(ctx: koa.Context, next: koa.Next) {
        // Work starts here.
        const idFromUrl: any = ctx.url.match(/\d+/);
        const studentId: number = parseInt(idFromUrl[0]);
        const selectedStudent = await studentRepo.getLogsByStudent(studentId);
        console.log(selectedStudent);
    }

}
export const studentController = new StudentController();


//
// Simple routing logic
//
const router = new Router()

router.get('/student/display/:studentid', studentController.display)

export const StudentRouters = router;
