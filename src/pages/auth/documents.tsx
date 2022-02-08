import React, {useContext, useEffect, useState, useReducer} from 'react';
import {useTranslation} from 'react-i18next';
import {ArrowUpIcon, ArrowDownIcon, CloseIcon, DeleteIcon} from '@chakra-ui/icons';
import {
    Box,
    Button,
    Link,
    ModalBody,
    ModalFooter,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useDisclosure,
    Select,
    IconButton,
    Tooltip,
    FormControl,
    FormLabel,
    Input,
    SimpleGrid,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    InputRightElement,
    InputGroup
} from '@chakra-ui/react';

import {
    DocumentInterface,
    ErrorInterface,
    FullMetadata,
    StorageReference,
    UploadResult
} from '../../core/interfaces';
import {DocumentService} from '../../core/services';
import {UserContext} from '../../core/contexts';
import {Layout, UploadZone} from '../../components';
import {crudReducer} from '../../core/reducers';
import {Sorters, Filters, FilterInterface} from '../../helpers';

export default function Documents(props: {}): React.ReactElement {
    const {t} = useTranslation();
    const [isLoading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState('');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [displayDocuments, documentsDispatch] = useReducer(crudReducer, []);
    const [selectedDocument, setSelectedDocument] = useState({} as StorageReference);
    const [documentsFilter, setDocumentsFilter] = useState({
        type: '',
        parameter: ''
    });

    const userContext = useContext(UserContext);
    const documentService = new DocumentService(userContext);

    const getDocumentsList = () => {
        documentService
            .getAllFilesInfo()
            .then((docs: any[] | ErrorInterface) => {
                documentsDispatch({type: 'load', data: docs});
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const closeModal = (): void => {
        getDocumentsList();
        onClose();
    };

    const openModal = (d: StorageReference) => {
        setModalTitle(t(d.fullPath ? 'documents.modal.edit' : 'documents.modal.add'));
        setSelectedDocument(d);
        onOpen();
    };

    useEffect(() => {
        getDocumentsList();
    }, []);

    return (
        <Layout
            isLoading={isLoading}
            main={
                <DocumentPageComponent
                    displayDocuments={displayDocuments as DocumentInterface[]}
                    documentsDispatch={documentsDispatch}
                    documentService={documentService}
                    documentsFilter={documentsFilter}
                    openModal={openModal}
                />
            }
            lateral={
                <DocumentPageLateral
                    setDocumentsFilter={setDocumentsFilter}
                    openModal={openModal}
                />
            }
            modal={
                <HandleDocumentModal
                    isOpen={isOpen}
                    documentsDispatch={documentsDispatch}
                    documentData={selectedDocument}
                    documentService={documentService}
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

const SortingArrowIcon = (props: {isUp: boolean}): React.ReactElement => {
    return props.isUp ? <ArrowUpIcon /> : <ArrowDownIcon />;
};

const DocumentPageComponent = (props: {
    displayDocuments: DocumentInterface[];
    documentService: DocumentService;
    documentsDispatch: Function;
    documentsFilter: FilterInterface;
    openModal: Function;
}): React.ReactElement => {
    const {t, i18n} = useTranslation();
    const documentTypes = props.documentService.getDocumentTypes();
    const [sorting, setSorting] = useState({
        direction: true,
        attribute: '',
        function: ''
    });

    const setDocumetType = async (
        doc: DocumentInterface,
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const customMetadata = await props.documentService.updateFileInfo(doc.ref.fullPath, {
            customMetadata: {type: e.target.value}
        });
        doc.metadata = customMetadata as FullMetadata;
        props.documentsDispatch({type: 'edit', data: doc, key: 'url'});
    };

    const deleteDocumet = async (doc: DocumentInterface) => {
        await props.documentService.deleteFile(doc.ref.fullPath);
        props.documentsDispatch({type: 'delete', data: doc, key: 'url'});
    };

    const sortDocuments = (sortingType: string, sortingAttribute: string) => {
        setSorting({
            direction: !sorting.direction,
            attribute: sortingAttribute,
            function: sortingType
        });
    };

    return (
        <Box maxWidth="100vw" overflow="auto">
            <Table variant="simple" minWidth="800px">
                <Thead>
                    <Tr>
                        <Th cursor="pointer" onClick={() => sortDocuments('sortByString', 'name')}>
                            {t('documents.table.name')}
                            {sorting.attribute === 'name' && (
                                <SortingArrowIcon isUp={sorting.direction} />
                            )}
                        </Th>
                        <Th cursor="pointer" onClick={() => sortDocuments('sortByString', 'type')}>
                            {t('documents.table.type')}
                            {sorting.attribute === 'type' && (
                                <SortingArrowIcon isUp={sorting.direction} />
                            )}
                        </Th>
                        <Th
                            cursor="pointer"
                            onClick={() => sortDocuments('sortByStringDate', 'createdAt')}
                        >
                            {t('documents.table.date')}
                            {sorting.attribute === 'createdAt' && (
                                <SortingArrowIcon isUp={sorting.direction} />
                            )}
                        </Th>
                        <Th>{t('documents.table.actions')}</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props.displayDocuments.length > 0 &&
                        props.displayDocuments
                            .filter((i) => {
                                const docKey = i.metadata?.customMetadata?.type || 'notDefined';
                                return props.documentsFilter.type
                                    ? (Filters as Record<string, any>)[props.documentsFilter.type](
                                          {
                                              ...i.metadata,
                                              ...i.metadata.customMetadata,
                                              locale: t(
                                                  `documents.type.${documentTypes[docKey].id}`
                                              )
                                          },
                                          props.documentsFilter.parameter
                                      )
                                    : true;
                            })
                            .sort((a: DocumentInterface, b: DocumentInterface): number => {
                                const sorted = sorting.function
                                    ? (Sorters as Record<string, any>)[sorting.function](
                                          {...a.metadata, ...a.metadata.customMetadata},
                                          {...b.metadata, ...b.metadata.customMetadata},
                                          sorting.attribute
                                      )
                                    : 1;
                                return sorting.direction ? sorted : -sorted;
                            })
                            .map((d: any) => (
                                <Tr key={d.url}>
                                    <Td maxWidth="250px" isTruncated>
                                        {d.metadata.name}
                                    </Td>
                                    <Td width="200px">
                                        {/* {d.metadata.customMetadata?.type} */}
                                        <Select
                                            placeholder={t('form.select')}
                                            bg={props.documentService.getTagColor(
                                                d.metadata.customMetadata?.type
                                            )}
                                            borderColor={
                                                d.metadata.customMetadata?.type ? 'white' : 'black'
                                            }
                                            color={
                                                d.metadata.customMetadata?.type ? 'white' : 'black'
                                            }
                                            onChange={(e) => setDocumetType(d, e)}
                                            value={d.metadata.customMetadata?.type}
                                        >
                                            {Object.keys(documentTypes).map((docKey: string) => (
                                                <option
                                                    key={documentTypes[docKey].id}
                                                    value={documentTypes[docKey].id}
                                                >
                                                    {t(
                                                        `documents.type.${documentTypes[docKey].id}`
                                                    )}
                                                </option>
                                            ))}
                                        </Select>
                                    </Td>
                                    <Td width="200px">
                                        {/* {d.metadata.timeCreated}{' '} */}
                                        {Intl.DateTimeFormat(i18n.language, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        }).format(new Date(d.metadata.timeCreated))}
                                    </Td>
                                    <Td width="150px" align="center">
                                        <Tooltip label={t('download')}>
                                            <Link href={d.url} color="blue.500" isExternal pr="2">
                                                <IconButton
                                                    size="sm"
                                                    variant="outline"
                                                    colorScheme="blue"
                                                    aria-label="Download"
                                                    icon={<ArrowDownIcon w="5" h="5" />}
                                                />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip label={t('delete')}>
                                            <IconButton
                                                size="sm"
                                                variant="outline"
                                                colorScheme="red"
                                                aria-label="Delete"
                                                icon={<DeleteIcon w="5" h="5" />}
                                                onClick={() => deleteDocumet(d)}
                                            />
                                        </Tooltip>
                                    </Td>
                                </Tr>
                            ))}
                </Tbody>
            </Table>
        </Box>
    );
};

const DocumentPageLateral = (props: {
    setDocumentsFilter: Function;
    openModal: Function;
}): React.ReactElement => {
    const {t} = useTranslation();
    const document = {} as StorageReference;
    const {isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose} = useDisclosure();

    return (
        <>
            <SimpleGrid spacing="2" columns={{base: 2, md: 1}} w="100%">
                <Button w="100%" colorScheme="teal" onClick={() => props.openModal(document)}>
                    {t('documents.add')}
                </Button>
                <Button
                    w="100%"
                    colorScheme="teal"
                    display={{base: 'flex', md: 'none'}}
                    onClick={onDrawerOpen}
                >
                    {t('menu')}
                </Button>
            </SimpleGrid>
            <Box display={{base: 'flex', md: 'none'}}>
                <Drawer isOpen={isDrawerOpen} onClose={onDrawerClose} placement="right">
                    <DrawerOverlay />
                    <DrawerContent bg="gray.50" p="5">
                        <DrawerCloseButton />
                        <DocumentPageFilter setDocumentsFilter={props.setDocumentsFilter} />
                    </DrawerContent>
                </Drawer>
            </Box>
            <Box display={{base: 'none', md: 'block'}}>
                <DocumentPageFilter
                    // allDocuments={props.allDocuments}
                    setDocumentsFilter={props.setDocumentsFilter}
                />
            </Box>
        </>
    );
};

const DocumentPageFilter = (props: {setDocumentsFilter: Function}): React.ReactElement => {
    const {t} = useTranslation();
    const [filterValue, setFilterValue] = useState('');

    const cleanTypeFilter = () => {
        setFilterValue('');
        props.setDocumentsFilter({type: '', parameter: ''});
    };

    const typeFilter = (inputValue: string) => {
        setFilterValue(inputValue);
        props.setDocumentsFilter({type: 'filterByString', parameter: inputValue});
    };

    return (
        <>
            <Box pt="6">
                <Text fontSize="22" textAlign="center">
                    {t('lateral.filter')}
                </Text>
                <FormControl mt="2">
                    <FormLabel htmlFor="stringFilter" type="text">
                        {t('lateral.typetofilter')}
                    </FormLabel>

                    <InputGroup>
                        <Input
                            id="stringFilter"
                            placeholder={t('lateral.typetofilter')}
                            value={filterValue}
                            onChange={(e) => typeFilter(e.target.value)}
                        />
                        <InputRightElement
                            cursor="pointer"
                            onClick={cleanTypeFilter}
                            children={<CloseIcon color="gray.100" />}
                        />
                    </InputGroup>
                </FormControl>
            </Box>
        </>
    );
};

const HandleDocumentModal = (props: {
    isOpen: boolean;
    documentData: StorageReference;
    documentService: DocumentService;
    documentsDispatch: Function;
    closeModal: Function;
}): React.ReactElement => {
    const {t} = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const documentTypes = props.documentService.getDocumentTypes();
    const [documentsType, setDocumentsType] = useState('');

    const uploadFiles = async () => {
        setUploading(true);
        const uploads = await props.documentService.uploadUserFiles(documents);
        if (documentsType && documentsType.length) {
            await props.documentService.updateUserFilesInfo(
                {customMetadata: {type: documentsType}},
                documents
            );
        }
        const filesRef = await (uploads as UploadResult[]).map((d: any) => d.ref);
        const filesInfo = await props.documentService.getFilesInfo(filesRef);
        props.documentsDispatch({type: 'add', data: filesInfo});
        setUploading(false);
        props.closeModal();
    };

    return (
        <>
            <ModalBody>
                <UploadZone setFiles={setDocuments} uploading={uploading} />
                {documents.length > 0 && (
                    <>
                        <Text px="2" mt="5">
                            {t('documents.modal.chooseDocsType')}
                        </Text>
                        <Select
                            placeholder={t('form.select')}
                            onChange={(e) => setDocumentsType(e.target.value)}
                        >
                            {Object.keys(documentTypes).map((docKey: string) => (
                                <option
                                    key={documentTypes[docKey].id}
                                    value={documentTypes[docKey].id}
                                >
                                    {t(`documents.type.${documentTypes[docKey].id}`)}
                                </option>
                            ))}
                        </Select>
                    </>
                )}
            </ModalBody>

            <ModalFooter my="6">
                {documents.length > 0 && (
                    <Button
                        size="sm"
                        colorScheme="teal"
                        mr={2}
                        rightIcon={<ArrowUpIcon w={4} h={4} />}
                        onClick={uploadFiles}
                    >
                        {t('uploadZone.upload')}
                    </Button>
                )}
                <Button
                    size="sm"
                    colorScheme="red"
                    rightIcon={<CloseIcon w={3} h={3} />}
                    onClick={() => props.closeModal()}
                >
                    {t('form.close')}
                </Button>
            </ModalFooter>
        </>
    );
};
