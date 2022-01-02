import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone'
import { StorageReference } from 'firebase/storage';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableCaption, Tag, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';

import { ConfigInterface } from '../services/config';
import DocumentService from '../services/documents';
import { UserContext } from "../services/auth";
import { ErrorInterface } from '../services/abstractInterface';

import Layout from '../components/common/layout';

function Documents(props: {
    config: ConfigInterface
}): React.ReactElement {
    const [isLoading, setLoading] = useState(true);
    const [allDocuments, setAllDocuments] = useState([] as StorageReference[]);
    const [displayDocuments, setDisplayDocuments] = useState([] as StorageReference[]);
    const [selectedDocument, setSelectedDocument] = useState({} as StorageReference);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const userContext = useContext(UserContext);
    const documentService = new DocumentService(userContext);

    const getDocumentsList = () => {
        documentService
            .getAllFilesInfo()
            .then((docs: any[] | ErrorInterface) => {
                console.log({docs});
                setAllDocuments(docs as StorageReference[]);
                setDisplayDocuments(docs as StorageReference[]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    const closeModal = (): void => {
        getDocumentsList();
        onClose();
    };

    const openModal = (d: StorageReference) => {
        // console.log({ openModal });
        setSelectedDocument(d);
        onOpen();
    }

    useEffect(() => {
        getDocumentsList()
    }, [])

    return (
        <>
            <Layout
                isLoading={isLoading}
                main={
                    <DocumentPageComponent
                        displayDocuments={displayDocuments}
                        documentService={documentService}
                        openModal={openModal} />
                }
                lateral={
                    <DocumentPageFilter
                        allDocuments={allDocuments}
                        setDisplayDocuments={setDisplayDocuments}
                        openModal={openModal} />
                }
            />
            <HandleDocumentModal
                isOpen={isOpen}
                documentData={selectedDocument}
                documentService={documentService}
                closeModal={closeModal} />
        </>
    );
}

const DocumentPageComponent = (props: {
    displayDocuments: StorageReference[],
    documentService: DocumentService
    openModal: Function
}): React.ReactElement => {
    // console.log('displayDocuments: ', props.displayDocuments);
    return (
        <Table variant='simple'>
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Link</Th>
                </Tr>
            </Thead>
            <Tbody>
                {(props.displayDocuments || [])
                    .map((d: any, index) => (
                        <Tr key={index}>
                            <Td>{d.metadata.name}</Td>
                            <Td>
                                <Tag
                                    size="sm"
                                    variant='solid'
                                    colorScheme={props.documentService.getTagColor(d.metadata.customMetadata?.type)}>
                                    {d.metadata.customMetadata?.type}
                                </Tag>
                            </Td>
                            <Td><Link href={d.url} isExternal>download</Link></Td>
                        </Tr>
                    ))
                }
            </Tbody>
            <Tfoot>
                <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                </Tr>
            </Tfoot>
        </Table>)
}

const DocumentPageFilter = (props: {
    allDocuments: StorageReference[],
    setDisplayDocuments: Function,
    openModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    const document = {} as StorageReference;
    return (
        <Box>
            <Button
                w="100%"
                colorScheme='teal'
                onClick={() => props.openModal(document)}>
                {t('users.add')}
            </Button>
        </Box>
    )
}

const HandleDocumentModal = (props: {
    isOpen: boolean,
    documentData: StorageReference,
    documentService: DocumentService
    closeModal: Function
}): React.ReactElement => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={props.isOpen} onClose={() => props.closeModal()} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <MyDropzone documentService={props.documentService} />
                </ModalBody>

                <ModalFooter my="6">
                    <Button
                        colorScheme='red'
                        mx={3}
                        rightIcon={<CloseIcon w={3} h={3} />}
                        onClick={() => props.closeModal()} >
                        {t('form.close')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const MyDropzone = (props: {
    documentService: DocumentService
}): React.ReactElement => {
    const { t } = useTranslation();
    const [isUploading, setIsUploading] = useState(false);
    const onDrop = useCallback(async (acceptedFiles) => {
        setIsUploading(true);
        await props.documentService.uploadUserFiles(acceptedFiles);
        await props.documentService.updateUserFilesInfo({ customMetadata: { type: 'document' } }, acceptedFiles);
        setIsUploading(false);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <Center bg="blue.100" w="100%" h="150px" py="5" px="10" {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isUploading
                    ? <p>Uploading...</p>
                    : isDragActive
                        ? <p>Drop the files here ...</p>
                        : <p>Drag and drop some files here, or click to select files</p>
            }
        </Center>
    )
}

export default Documents;
