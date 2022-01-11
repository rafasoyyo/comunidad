import {AbstractService} from '../services';
import {EventInterface, UserInterface} from '../interfaces';

export const identifier = 'events';

export default class EventService extends AbstractService<EventInterface> {
    constructor(currentUser?: UserInterface) {
        super(identifier, currentUser);
    }

    getTagColor = (tag: string): string => {
        return Object.values(this.getEventTypes()).find((e) => e.id === tag)?.color || '';
    };

    getEventTypes = (): Record<string, Record<string, string>> => {
        return {
            meetings: {
                id: 'meetings',
                color: '#4299E1' //blue.400+
            },
            birthday: {
                id: 'birthday',
                color: '#F56565' //red.400
            },
            maintenance: {
                id: 'maintenance',
                color: '#48BB78' //green.400
            },
            more: {
                id: 'more',
                color: '#ED8936' //orange.400
            }
        };
    };
}
