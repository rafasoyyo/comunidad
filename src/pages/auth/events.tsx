import React, {useCallback, useContext, useEffect, useReducer, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';

import FullCalendar, {EventClickArg, DateSelectArg, EventChangeArg} from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Center,
    Circle,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Icon,
    Input,
    ModalBody,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Textarea,
    Tooltip,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import {ChevronDownIcon, ChevronUpIcon, EditIcon, SearchIcon} from '@chakra-ui/icons';

import {Layout, ModalSaveFooter} from '../../components/';
import {EventService} from '../../core/services';
import {UserContext} from '../../core/contexts';
import {EventInterface} from '../../core/interfaces';
import {crudReducer} from '../../core/reducers';

registerLocale('es', es);

const now = new Date();
const nextYear = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
const halfHour = 30 * 60 * 1000;

export default function Events(): React.ReactElement {
    const [isLoading, setLoading] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [calendarApi, setCalendarApi] = useState<any>();
    const [modalTitle, setModalTitle] = useState('');
    const [displayEvents, documentsDispatch] = useReducer(crudReducer, []);
    const [selectedEvent, setSelectedEvent] = useState({} as EventInterface);

    const userContext = useContext(UserContext);
    const eventService = new EventService(userContext);

    const getEventsList = () => {
        eventService
            .getAll()
            .then((eventList: EventInterface[]) => {
                console.log({eventList});
                documentsDispatch({type: 'load', data: eventList});
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    };

    const openModal = (json: EventInterface, title: string) => {
        setModalTitle(title);
        // console.log({json});
        setSelectedEvent(json);
        onOpen();
    };

    const closeModal = (): void => {
        // getEventsList();
        onClose();
    };

    useEffect(() => getEventsList(), []);

    return (
        <Layout
            isLoading={isLoading}
            main={
                isLoading ? (
                    <></>
                ) : (
                    <EventPageComponent
                        setCalendarApi={setCalendarApi}
                        displayEvents={displayEvents as EventInterface[]}
                        eventDispatch={documentsDispatch}
                        eventService={eventService}
                        openModal={openModal}
                    />
                )
            }
            lateral={
                <EventList
                    calendarApi={calendarApi}
                    displayEvents={displayEvents as EventInterface[]}
                    eventDispatch={documentsDispatch}
                    eventService={eventService}
                    openModal={openModal}
                />
            }
            modal={
                <HandleEventsModal
                    selectedEvent={selectedEvent}
                    eventDispatch={documentsDispatch}
                    eventService={eventService}
                    isOpen={isOpen}
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
    setCalendarApi: Function;
    displayEvents: EventInterface[];
    eventDispatch: Function;
    eventService: EventService;
    openModal: Function;
}): React.ReactElement => {
    const {t, i18n} = useTranslation();
    const calendarRef = useRef<FullCalendar>(null);

    const calendarLoaded = useCallback((isLoaded: boolean) => {
        isLoaded && props.setCalendarApi(calendarRef.current?.getApi());
    }, []);

    const getEventData = (info: any) => {
        const data = info.event.toJSON();
        return {
            createdAt: data.extendedProps.createdAt,
            type: data.extendedProps.type,
            color: data.backgroundColor,
            end: data.end,
            id: data.id,
            start: data.start,
            title: data.title
        };
    };

    const handleClick = (clickInfo: EventClickArg) => {
        const data = getEventData(clickInfo);
        props.openModal(data, t('events.modal.edit'));
    };

    const handleChange = async (changeInfo: EventChangeArg) => {
        const data = getEventData(changeInfo);
        await props.eventService.edit(data as EventInterface);
        props.eventDispatch({type: 'edit', data: data});
    };

    const handleSelect = (selectInfo: DateSelectArg) => {
        // console.log({selectInfo});
        if (selectInfo.view.type === 'dayGridMonth') {
            selectInfo.view.calendar.changeView('timeGridDay');
            selectInfo.view.calendar.gotoDate(selectInfo.start);
        } else {
            const start = selectInfo.start;
            const end = new Date(selectInfo.end || start.getTime() + halfHour);
            props.openModal(
                {start: start.toISOString(), end: end.toISOString()},
                t('events.modal.add')
            );
        }
    };

    return (
        <FullCalendar
            loading={calendarLoaded}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale={(i18n.language === 'es' && esLocale) || undefined}
            plugins={[dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            select={handleSelect}
            eventClick={handleClick}
            events={props.displayEvents.map((ev) => {
                // console.log(ev);
                return {
                    backgroundColor: ev.color,
                    borderColor: ev.color,
                    ...ev
                };
            })}
            height="100%"
            ref={calendarRef}
            // eventAdd={handleEventClick}
            eventChange={handleChange}
            // eventRemove={handleEventClick}
            // ref={calendarRef}
        />
    );
};

const EventList = (props: {
    calendarApi: any;
    displayEvents: EventInterface[];
    eventDispatch: Function;
    eventService: EventService;
    openModal: Function;
}): React.ReactElement => {
    const {t, i18n} = useTranslation();
    const [event, setEvent] = useState({
        start: now.toISOString(),
        end: new Date(now.getTime() + halfHour).toISOString()
    } as EventInterface);
    // console.log(props.calendarApi);

    const goToDate = (e: EventInterface) => {
        // console.log(e);
        // console.log(props.calendarApi);
        props.calendarApi.changeView('timeGridDay');
        props.calendarApi.gotoDate(e.start);
    };

    return (
        <>
            <Button
                w="100%"
                colorScheme="teal"
                onClick={() => props.openModal(event, t('events.modal.add'))}
            >
                {t('events.modal.add')}
            </Button>
            <Box pt="6">
                <Text fontSize="22" textAlign="center">
                    {t('lateral.list')}
                </Text>
                <Box maxH="50vh" overflowY="scroll">
                    {props.displayEvents
                        .sort((a, b) => {
                            return new Date(a.start).getTime() - new Date(b.start).getTime();
                        })
                        .map((e: EventInterface) => (
                            <Accordion key={e.id} w="100%" allowToggle allowMultiple>
                                <AccordionItem>
                                    <AccordionButton _expanded={{bg: 'gray.100'}} px="2">
                                        <Tooltip
                                            placement="right"
                                            bg="gray.600"
                                            hasArrow
                                            label={t(`events.type.${e.type}`) + ' - ' + e.title}
                                        >
                                            <HStack spacing="2" flex="1" textAlign="left">
                                                <Circle
                                                    bg={e.color}
                                                    w="4"
                                                    h="4"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        goToDate(e);
                                                    }}
                                                />
                                                <Text
                                                    isTruncated
                                                    maxWidth={{base: '100%', md: 'calc(100vw / 6)'}}
                                                >
                                                    {e.title}
                                                </Text>
                                            </HStack>
                                        </Tooltip>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel px="1">
                                        <VStack>
                                            <VStack align="left" spacing="1px">
                                                <Text>{e.title}</Text>
                                                <Box py="1">
                                                    <Divider />
                                                </Box>
                                                {e.description && (
                                                    <>
                                                        <Text noOfLines={3}>{e.description}</Text>
                                                        <Box py="1">
                                                            <Divider />
                                                        </Box>
                                                    </>
                                                )}

                                                <Text fontSize="sm" my="10">
                                                    {t('events.startDate') + ':'}
                                                    {Intl.DateTimeFormat(i18n.language, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    }).format(new Date(e.start))}
                                                </Text>
                                                <Text fontSize="sm">
                                                    {t('events.endDate') + ':'}
                                                    {Intl.DateTimeFormat(i18n.language, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    }).format(new Date(e.start))}
                                                </Text>
                                            </VStack>

                                            <HStack width="100%">
                                                <Button
                                                    size="xs"
                                                    w="50%"
                                                    colorScheme="blue"
                                                    aria-label="Open event"
                                                    variant="outline"
                                                    onClick={() => goToDate(e)}
                                                    rightIcon={<SearchIcon w="3" h="3" />}
                                                >
                                                    {t('form.open')}
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    w="50%"
                                                    colorScheme="blue"
                                                    aria-label="Edit event"
                                                    variant="outline"
                                                    onClick={() =>
                                                        props.openModal(e, t('events.modal.edit'))
                                                    }
                                                    rightIcon={<EditIcon w="3" h="3" />}
                                                >
                                                    {t('form.edit')}
                                                </Button>
                                            </HStack>
                                        </VStack>
                                        {/* <Box my="2" h="2px" borderBottomWidth='1px' borderColor='gray.200'></Box> */}
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        ))}
                </Box>
                <Center>
                    <Text fontSize="sm">
                        <Icon as={ChevronDownIcon} mr="2" />
                        {t('table.scroll')}
                        <Icon as={ChevronUpIcon} mr="2" />
                    </Text>
                </Center>
            </Box>
        </>
    );
};

const HandleEventsModal = (props: {
    selectedEvent: EventInterface;
    eventDispatch: Function;
    eventService: EventService;
    isOpen: boolean;
    closeModal: Function;
}): React.ReactElement => {
    const {t, i18n} = useTranslation();
    const eventTypes = props.eventService.getEventTypes();
    const [event, setEvent] = useState(props.selectedEvent as EventInterface);
    const [errors, setErrors] = useState({
        title: false,
        type: false,
        start: false,
        end: false
    });

    const validate = (): boolean => {
        const isValid = event.title && event.type && event.start && event.end;
        if (!isValid) {
            setErrors({
                title: !event.title,
                type: !event.type,
                start: !event.start,
                end: !event.end
            });
        }
        // console.log(isValid, !!isValid, errors);
        return !!isValid;
    };

    const footerRef = useRef<any>(null);
    const triggerRef = (e: React.FormEvent<HTMLFormElement>) => {
        if (footerRef.current) {
            footerRef.current?.triggerSubmit(e);
        }
    };

    useEffect(() => {
        const start = new Date(event.start);
        if (!event.end || new Date(event.end) < start) {
            setEvent({
                ...event,
                end: new Date(start.getTime() + halfHour).toISOString()
            });
        }
    }, [event.start, event.end]);

    return (
        <form onSubmit={triggerRef} noValidate>
            <ModalBody>
                {/* <Text>Owner name: {props.notificationData.owner.name}</Text>
                        <Text>Owner email: {props.notificationData.owner.email}</Text> */}
                <FormControl isRequired mt="2" isInvalid={errors.title}>
                    <FormLabel htmlFor="title" type="text">
                        {t('form.title') + ': '}
                    </FormLabel>
                    <Input
                        id="title"
                        placeholder={t('form.title')}
                        defaultValue={event.title}
                        onChange={(e) => setEvent({...event, title: e.target.value})}
                        onFocus={() => setErrors({...errors, title: false})}
                    ></Input>
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>

                <FormControl mt="2">
                    <FormLabel htmlFor="description" type="text">
                        {t('form.description') + ': '}
                    </FormLabel>
                    <Textarea
                        id="description"
                        placeholder={t('form.description')}
                        defaultValue={event.description}
                        onChange={(e) => setEvent({...event, description: e.target.value})}
                    ></Textarea>
                </FormControl>

                <FormControl isRequired mt="4" isInvalid={errors.start}>
                    <Stack spacing={2} direction="row">
                        <FormLabel htmlFor="title" type="text" w="200px">
                            {t('events.startDate') + ': '}
                        </FormLabel>
                        <DatePicker
                            locale={i18n.language}
                            customInput={<Input />}
                            selected={event.start ? new Date(event.start) : now}
                            onChange={(date) =>
                                setEvent({...event, start: (date || new Date()).toISOString()})
                            }
                            todayButton={t('form.today', 'today')}
                            showTimeSelect
                            dateFormat="Pp"
                            minDate={now}
                            maxDate={nextYear}
                        />
                    </Stack>
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired mt="2" isInvalid={errors.end}>
                    <Stack spacing={2} direction="row">
                        <FormLabel htmlFor="title" type="text" w="200px">
                            {t('events.endDate') + ': '}
                        </FormLabel>
                        <DatePicker
                            locale={i18n.language}
                            customInput={<Input />}
                            selected={event.end ? new Date(event.end) : now}
                            onChange={(date) =>
                                setEvent({...event, end: (date || new Date()).toISOString() || ''})
                            }
                            todayButton={t('form.today', 'today')}
                            showTimeSelect
                            dateFormat="Pp"
                            minDate={new Date(event.start)}
                            maxDate={nextYear}
                        />
                    </Stack>
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired mt="2" isInvalid={errors.type}>
                    <FormLabel>{t('events.modal.chooseType')}</FormLabel>
                    <RadioGroup
                        onChange={(e) => {
                            setErrors({...errors, type: false});
                            setEvent({
                                ...event,
                                type: e,
                                color: props.eventService.getTagColor(e)
                            });
                        }}
                        value={event.type}
                    >
                        <Stack direction="column">
                            {Object.keys(eventTypes).map((ekey) => (
                                <Radio key={eventTypes[ekey].id} value={eventTypes[ekey].id}>
                                    {t(`events.type.${eventTypes[ekey].id}`)}
                                </Radio>
                            ))}
                        </Stack>
                    </RadioGroup>
                    <FormErrorMessage>{t('error.required')}</FormErrorMessage>
                </FormControl>
            </ModalBody>

            <ModalSaveFooter
                item={event}
                service={props.eventService}
                dispatch={props.eventDispatch}
                onSubmit={footerRef}
                isValid={validate}
                closeModal={props.closeModal}
            />
        </form>
    );
};
