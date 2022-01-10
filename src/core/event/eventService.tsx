import {AbstractService} from '../services';
import EventInterface from './eventInterface';

export const identifier = 'events';

export default class EventService extends AbstractService<EventInterface> {
    constructor() {
        super(identifier);
    }
}
