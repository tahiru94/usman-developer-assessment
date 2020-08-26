export const getStudentId = (url: string): number => {
    const idFromUrl: string[] = url.match(/\d+/) || [];
    if (idFromUrl.length) {
        return parseInt(idFromUrl[0]);
    }

    return -1;
}

export const getInvalidStudentIdMessage = (id: number): string => {
    return `No student was found for ID ${id}. Please try again.`;
}