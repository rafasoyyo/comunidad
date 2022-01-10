interface ReducerInterface {
    id: string;
}
interface ActionInterface {
    type: string;
    data?: any;
    key?: string;
    direction?: boolean;
}

const Reducer = <S extends ReducerInterface>(state: S[], action: ActionInterface): S[] => {
    const {type, data, key, direction} = action;
    const ReducerActions = {
        load: (state: S[], action: ActionInterface) => {
            return data;
        },
        add: (state: S[], action: ActionInterface) => {
            state = [...state, ...data];
            return state;
        },
        edit: (state: S[], action: ActionInterface) => {
            const id = key || 'id';
            state = state.map((d: Record<string, any>) =>
                d[id] === data[id] ? action.data : d
            ) as S[];
            return state;
        },
        delete: (state: S[], action: ActionInterface) => {
            const id = key || 'id';
            state = state.filter((i: Record<string, any>) => i[id] !== data[id]);
            return state;
        },
        filterByString: (state: S[], action: ActionInterface) => {
            const id = key || 'id';
            state = state.filter((o) => {
                return Object.values(o).some((v) => new RegExp(id, 'i').test(String(v)));
            });
            return state;
        },
        sortByString: (state: S[], action: ActionInterface) => {
            const dir = typeof direction === 'undefined' ? true : direction;
            const id = key || 'id';
            return state.sort((a: S, b: S): number => {
                const valA = ({...a} as unknown as Record<any, any>).data;
                const valB = ({...b} as unknown as Record<any, any>).data;
                const comparison = String(valA[id]).toLowerCase() > String(valB[id]).toLowerCase();
                return dir ? (comparison ? 1 : -1) : comparison ? -1 : 1;
            });
        },
        sortByStringDate: (state: S[], action: ActionInterface) => {
            const dir = typeof direction === 'undefined' ? true : direction;
            const id = key || 'id';
            return state.sort((a: S, b: S): number => {
                const valA = ({...a} as unknown as Record<any, any>).data;
                const valB = ({...b} as unknown as Record<any, any>).data;
                const comparison = new Date(valA[id]).getTime() > new Date(valB[id]).getTime();
                return dir ? (comparison ? 1 : -1) : comparison ? -1 : 1;
            });
        }
    };

    return (ReducerActions as Record<string, any>)[type]
        ? (ReducerActions as Record<string, any>)[type](state, action)
        : state;
};

export default Reducer;
