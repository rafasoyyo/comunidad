const Sorters = {
    sortByString: (a: any, b: any, key: string) => {
        const valA = {...a} as unknown as Record<any, any>;
        const valB = {...b} as unknown as Record<any, any>;
        return String(valA[key]).toLowerCase() > String(valB[key]).toLowerCase() ? 1 : -1;
    },
    sortByStringDate: (a: any, b: any, key: string) => {
        const valA = {...a} as unknown as Record<any, any>;
        const valB = {...b} as unknown as Record<any, any>;
        return new Date(valA[key]).getTime() > new Date(valB[key]).getTime() ? -1 : 1;
    }
};

export default Sorters;
