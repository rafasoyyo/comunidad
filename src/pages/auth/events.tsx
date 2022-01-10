import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import FullCalendar, {EventClickArg, EventDef, DateSelectArg} from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
    Avatar,
    Box,
    Button,
    Circle,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    StackDivider,
    Text,
    Textarea,
    useDisclosure,
    useRadio,
    useRadioGroup,
    VStack
} from '@chakra-ui/react';
import {ArrowForwardIcon, CloseIcon} from '@chakra-ui/icons';

import {Layout} from '../../components/';

import {EventService} from '../../core/services';
import {EventInterface} from '../../core/interfaces';

const todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

const eventService = new EventService();

function Events(): React.ReactElement {
    const {t} = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [allEvents, setAllEvents] = useState([] as EventInterface[]);
    const [displayEvents, setDisplayEvents] = useState([] as EventInterface[]);
    const [selectedEvent, setSelectedEvent] = useState({} as EventInterface);
    const [calendarEvent, setCalendarEvent] = useState({} as DateSelectArg);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const getEventsList = () => {
        eventService
            .getAll()
            .then((response: EventInterface[]) => {
                console.log({response});
                setAllEvents(response);
                setDisplayEvents(response);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    const openModal = () => {
        setLoading(false);
        onOpen();
    };

    const closeModal = (): void => {
        getEventsList();
        onClose();
    };

    useEffect(() => getEventsList(), []);

    return (
        <Layout
            isLoading={isLoading}
            main={
                <EventPageComponent
                    displayEvents={displayEvents}
                    setCalendarEvent={setCalendarEvent}
                    openModal={openModal}
                />
            }
            lateral={
                <EventList
                    displayEvents={displayEvents}
                    setDisplayEvents={setDisplayEvents}
                    openModal={openModal}
                />
            }
            modal={
                <HandleEventsModal
                    isOpen={isOpen}
                    calendarEvent={calendarEvent}
                    eventData={selectedEvent}
                    closeModal={closeModal}
                />
            }
            modalProps={{
                title: modalTitle,
                isOpen,
                onOpen,
                onClose
            }}
        />
    );
}

const EventPageComponent = (props: {
    openModal: Function;
    displayEvents: EventInterface[];
    setCalendarEvent: Function;
}): React.ReactElement => {
    const handleEventClick = (info: DateSelectArg) => {
        console.log(info);
        props.setCalendarEvent(info);
        props.openModal(info);
    };
    // console.log('displayEvents: ', props.displayEvents);
    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            select={handleEventClick}
            // eventClick={handleEventClick}
            initialEvents={props.displayEvents}
            events={props.displayEvents}
            // eventAdd={handleEventClick}
            // eventChange={handleEventClick}
            // eventRemove={handleEventClick}
        />
    );
};

const EventList = (props: {
    openModal: Function;
    displayEvents: EventInterface[];
    setDisplayEvents: Function;
}): React.ReactElement => {
    const {t} = useTranslation();
    const event = useState({} as EventInterface);

    return (
        <>
            <Button w="100%" colorScheme="teal" onClick={() => props.openModal(event)}>
                {t('notifications.add')}
            </Button>
            <Box pt="6">
                <Text fontSize="22" textAlign="center">
                    {t('filters.filter')}
                </Text>
                <VStack
                    spacing="2"
                    divider={<StackDivider borderColor="gray.200" />}
                    maxH="50vh"
                    overflowY="scroll"
                >
                    {props.displayEvents.map((event: EventInterface) => (
                        <Box key={event.id} align="left" spacing="1" w="100%">
                            <HStack>
                                {event.backgroundColor && (
                                    <Circle bg={event.backgroundColor} w="5" h="5" />
                                )}
                                <Text> Title: {event.title} </Text>
                            </HStack>

                            {event.start && <Text mt="0">Date: {event.start}</Text>}
                            {/* <Box my="2" h="2px" borderBottomWidth='1px' borderColor='gray.200'></Box> */}
                        </Box>
                    ))}
                </VStack>
            </Box>
        </>
    );
};

const HandleEventsModal = (props: {
    isOpen: boolean;
    eventData: EventInterface;
    calendarEvent: DateSelectArg;
    closeModal: Function;
}): React.ReactElement => {
    const {t} = useTranslation();
    const [event, setEvent] = useState({} as EventInterface);
    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);

    const save = async () => {
        setSaving(true);
        console.log({...event, start: props.calendarEvent.startStr, allDay: true});
        await eventService.edit({
            ...event,
            start: props.calendarEvent.startStr || todayStr,
            allDay: true
        });
        setSaving(false);
    };

    const saveAndClose = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingAndClosing(true);
        console.log({
            ...event,
            start: props.calendarEvent.startStr || todayStr,
            allDay: true
        });
        await eventService.edit({...event, start: props.calendarEvent.startStr, allDay: true});
        setSavingAndClosing(true);
        props.closeModal();
    };

    return (
        <Modal isOpen={props.isOpen} onClose={() => props.closeModal()}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={saveAndClose} noValidate>
                    <ModalBody>
                        {/* <Text>Owner name: {props.notificationData.owner.name}</Text>
                        <Text>Owner email: {props.notificationData.owner.email}</Text> */}
                        <FormControl isRequired mt="2">
                            <FormLabel htmlFor="notificationMsg" type="text">
                                {t('form.email')}
                            </FormLabel>
                            <Textarea
                                id="notificationMsg"
                                placeholder={t('form.email')}
                                value={event.title}
                                onChange={(e) => setEvent({...event, title: e.target.value.trim()})}
                            ></Textarea>
                            <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                        </FormControl>
                        <EventsSelector event={event} setEvent={setEvent} />
                    </ModalBody>

                    <ModalFooter my="6">
                        <Button
                            id="saveandclose"
                            type="submit"
                            colorScheme="teal"
                            isLoading={isSavingAndClosing}
                            rightIcon={<ArrowForwardIcon w={5} h={5} />}
                        >
                            {t('form.saveandclose')}
                        </Button>
                        <Button
                            id="save"
                            type="button"
                            colorScheme="teal"
                            isLoading={isSaving}
                            onClick={save}
                            rightIcon={<ArrowForwardIcon w={5} h={5} />}
                        >
                            {t('form.save')}
                        </Button>
                        <Button
                            colorScheme="red"
                            mx={3}
                            rightIcon={<CloseIcon w={3} h={3} />}
                            onClick={() => props.closeModal()}
                        >
                            {t('form.close')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

const EventsSelector = (props: {event: EventInterface; setEvent: Function}): React.ReactElement => {
    const {t} = useTranslation();
    const options = [
        {
            id: 0,
            name: 'Junta',
            backgroundColor: 'blue'
        },
        {
            id: 1,
            name: 'Cumpleaños',
            backgroundColor: 'red'
        },
        {
            id: 2,
            name: 'Mantenimiento',
            backgroundColor: 'green'
        },
        {
            id: 3,
            name: 'Otros',
            backgroundColor: 'yellow'
        }
    ];
    const [value, setValue] = useState(options[1]);

    const onChange = (e: string) => {
        console.log('onChange: ', e);
        props.setEvent({
            ...props.event,
            type: e,
            backgroundColor: (options.find((i) => i.name === e) || options[0]).backgroundColor
        });
    };

    return (
        <RadioGroup onChange={onChange} defaultValue={value.name}>
            <Stack direction="row">
                {options.map((option) => (
                    <Radio key={option.name} value={option.name}>
                        {t(option.name)}
                    </Radio>
                ))}
            </Stack>
        </RadioGroup>
    );
};

export default Events;
