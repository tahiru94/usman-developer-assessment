import {
    getStudentId,
    // getEmptyAssessmentResponseMessage,
    // getInvalidStudentIdMessage
} from './utils';

test('should return the student ID, given a URL with an ID', () => {
    const url: string = '/student/assessment/open/1';
    const id: number = getStudentId(url);
    expect(id).toBe(1);
});

test('should return -1, given a URL with no ID', () => {
    const url: string = '/student/assessment/open/';
    const id: number = getStudentId(url);
    expect(id).toBe(-1);
});

