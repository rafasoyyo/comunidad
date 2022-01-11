import {AbstractInterface} from '../interfaces';

export default interface EventInterface extends AbstractInterface {
    id: string;
    title: string;
    description: string;
    color: string;
    type: string;
    start: string;
    end: string;
    allDay: boolean;
    startStr: string;
}
