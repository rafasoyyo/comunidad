import { store } from '../firebaseSetup';
import { collection, getDocs, query, where } from "firebase/firestore";

import abstractService from "./abstract";
import { AbstractInterface } from "./abstractInterface";

const identifier = "events";

export interface EventInterface extends AbstractInterface {
    title: string;
    start: string;
    end: Date;
    allDay: boolean;
    backgroundColor: string;
    error: boolean;
}

export default class EventService extends abstractService<EventInterface> {

    constructor() {
        super(identifier);
    }
}
