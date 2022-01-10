import {AbstractInterface} from '../interfaces';

export default interface EventInterface extends AbstractInterface {
    title: string;
    start: string;
    end: Date;
    allDay: boolean;
    backgroundColor: string;
    error: boolean;
}
