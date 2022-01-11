interface ReducerInterface {
    id: string;
}
interface ActionInterface {
    type: string;
    data: any;
    key?: string;
}

const Reducer = <S extends ReducerInterface>(state: S[], action: ActionInterface): S[] => {
    const {type, data, key} = action;
    const ReducerActions = {
        load: (state: S[], action: ActionInterface) => {
            return data;
        },
        add: (state: S[], action: ActionInterface) => {
            state = [...state, data];
            return state;
        },
        edit: (state: S[], action: ActionInterface) => {
            const id = key || 'id';
            state = state.map((d: Record<string, any>) => (d[id] === data[id] ? data : d)) as S[];
            return state;
        },
        delete: (state: S[], action: ActionInterface) => {
            const id = key || 'id';
            state = state.filter((i: Record<string, any>) => i[id] !== data[id]);
            return state;
        }
    };

    return (ReducerActions as Record<string, any>)[type]
        ? (ReducerActions as Record<string, any>)[type](state, action)
        : state;
};

export default Reducer;
