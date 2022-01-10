export interface FilterInterface {
    type: string;
    parameter: string;
}

const Filters = {
    filterByString: (item: Record<string, any>, key: string) => {
        return Object.values(item.data).some((v) => new RegExp(key, 'i').test(String(v)));
    }
};

export default Filters;
