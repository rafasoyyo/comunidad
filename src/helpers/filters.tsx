import { UserInterface } from "../services/users";

const filters = {
    // date: (a, b) => {
    //     return (a: any, b: any) => {
    //         return (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime();
    //     }
    // },
    string: function (o: any): boolean {
        return Object.values(o).some((v) => (new RegExp(String(this), 'i')).test(String(v)) );
    }
}

export default filters;