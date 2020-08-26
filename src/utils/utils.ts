import { Context, Next } from 'koa';

export const getStudentId = (url: string): number => {
    const idFromUrl: string[] = url.match(/\d+/) || [];
    if (idFromUrl.length) {
        return parseInt(idFromUrl[0]);
    }

    return -1;
}