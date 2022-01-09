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
    Input
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
import {filters} from '../../helpers';

const documentsReducer = (
    state: DocumentInterface[],
    action: {
        type: string;
        data: any;
    }
): DocumentInterface[] => {
    switch (action.type) {
        case 'load': {
            return action.data;
        }
        case 'add': {
            state = [...state, ...action.data];
            return state;
        }
        case 'edit': {
            state = state.map((d) =>
                d.url === action.data.url ? action.data : d
            ) as DocumentInterface[];
            return state;
        }
        case 'delete': {
            state = state.filter((i: DocumentInterface) => i.url !== action.data.url);
            return state;
        }
        default: {
            return state;
        }
    }
};

export default function Documents(props: {}): React.ReactElement {
    const {t} = useTranslation();
    const [isLoading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState('');
    const [displayDocuments, documentsDispatch] = useReducer(documentsReducer, []);
    const [allDocuments, setAllDocuments] = useState([] as DocumentInterface[]);
    // const [displayDocuments, setDisplayDocuments] = useState([] as StorageReference[]);
    const [selectedDocument, setSelectedDocument] = useState({} as StorageReference);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const userContext = useContext(UserContext);
    const documentService = new DocumentService(userContext);

    const getDocumentsList = () => {
        documentService
            .getAllFilesInfo()
            .then((docs: any[] | ErrorInterface) => {
                console.log({docs});
                setAllDocuments(docs as DocumentInterface[]);
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
                    displayDocuments={displayDocuments}
                    documentsDispatch={documentsDispatch}
                    documentService={documentService}
                    openModal={openModal}
                />
            }
            lateral={
                <DocumentPageFilter
                    allDocuments={allDocuments}
                    documentsDispatch={documentsDispatch}
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

const DocumentPageComponent = (props: {
    displayDocuments: DocumentInterface[];
    documentService: DocumentService;
    documentsDispatch: Function;
    openModal: Function;
}): React.ReactElement => {
    const {t, i18n} = useTranslation();
    const documentTypes = props.documentService.getDocumentTypes();

    const setDocumetType = async (
        doc: DocumentInterface,
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const customMetadata = await props.documentService.updateFileInfo(doc.ref.fullPath, {
            customMetadata: {type: e.target.value}
        });
        doc.metadata = customMetadata as FullMetadata;
        props.documentsDispatch({type: 'edit', data: doc});
    };

    const deleteDocumet = async (doc: DocumentInterface) => {
        const customMetadata = await props.documentService.deleteFile(doc.ref.fullPath);
        props.documentsDispatch({type: 'delete', data: doc});
    };

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>{t('documents.table.name')}</Th>
                    <Th>{t('documents.table.type')}</Th>
                    <Th>{t('documents.table.date')}</Th>
                    <Th>{t('documents.table.actions')}</Th>
                </Tr>
            </Thead>
            <Tbody>
                {props.displayDocuments.length > 0 &&
                    props.displayDocuments.map((d: any) => (
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
                                    color={d.metadata.customMetadata?.type ? 'white' : 'black'}
                                    onChange={(e) => setDocumetType(d, e)}
                                    value={d.metadata.customMetadata?.type}
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
                            </Td>
                            <Td width="200px">
                                {/* {d.metadata.timeCreated}{' '} */}
                                {Intl.DateTimeFormat(i18n.language, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                }).format(new Date(d.metadata.timeCreated))}
                            </Td>
                            <Td width="120px" align="center">
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
    );
};

const DocumentPageFilter = (props: {
    allDocuments: DocumentInterface[];
    documentsDispatch: Function;
    openModal: Function;
}): React.ReactElement => {
    const {t} = useTranslation();
    const document = {} as StorageReference;

    const typeFilter = (inputValue: string) => {
        const userListDisplay = props.allDocuments.filter(filters.string, inputValue);
        props.documentsDispatch({type: 'load', data: userListDisplay});
    };

    return (
        <Box>
            <Box>
                <Button w="100%" colorScheme="teal" onClick={() => props.openModal(document)}>
                    {t('documents.add')}
                </Button>
            </Box>
            <Box pt="6">
                <Text fontSize="22" textAlign="center">
                    {t('filters.filter')}
                </Text>
                <FormControl mt="2">
                    <FormLabel htmlFor="stringFilter" type="text">
                        {t('filters.typetofilter')}
                    </FormLabel>

                    <Input
                        id="stringFilter"
                        placeholder={t('filters.typetofilter')}
                        onChange={(e) => typeFilter(e.target.value)}
                    />
                </FormControl>
            </Box>
        </Box>
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
        let metadata;
        if (documentsType && documentsType.length) {
            metadata = await props.documentService.updateUserFilesInfo(
                {customMetadata: {type: documentsType}},
                documents
            );
        }
        const filesRef = await (uploads as UploadResult[]).map((d: any) => d.ref);
        const filesInfo = await props.documentService.getFilesInfo(filesRef);
        await props.documentsDispatch({type: 'add', data: filesInfo});
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
                        colorScheme="teal"
                        mx={3}
                        rightIcon={<ArrowUpIcon w={4} h={4} />}
                        onClick={uploadFiles}
                    >
                        {t('uploadZone.upload')}
                    </Button>
                )}
                <Button
                    colorScheme="red"
                    mx={3}
                    rightIcon={<CloseIcon w={3} h={3} />}
                    onClick={() => props.closeModal()}
                >
                    {t('form.close')}
                </Button>
            </ModalFooter>
        </>
    );
};
