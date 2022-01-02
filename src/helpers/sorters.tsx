import { UserInterface } from "../services/users";

const byTimeStamp = (list: any[], direction: boolean, key: string): any[] => {
    direction = direction || true;
    return list.sort((a, b) => {
        const valA = { ...a } as unknown as Record<any, any>
        const valB = { ...b } as unknown as Record<any, any>

        return direction
            ? valA[key].toMillis() > valB[key].toMillis() ? 1 : -1
            : valA[key].toMillis() < valB[key].toMillis() ? 1 : -1;
    });
};

const byString = (list: any[], direction: boolean, key: string): any[] => {
    direction = typeof direction === 'undefined' ? true : direction;
    return list.sort((a, b) => {
        const valA = { ...a } as unknown as Record<any, any>
        const valB = { ...b } as unknown as Record<any, any>
        return direction
            ? valA[key] > valB[key] ? 1 : -1
            : valA[key] < valB[key] ? 1 : -1;
    });
};

const sort = (list: any[], direction: boolean, key: string, type?: string): any[] => {
    switch (type) {
        case 'string':
            return byString(list, direction, key);
        case 'timestamp':
            return byTimeStamp(list, direction, key);
        default:
            return byString(list, direction, key);
    }
}

export default sort;
export { byString, byTimeStamp };