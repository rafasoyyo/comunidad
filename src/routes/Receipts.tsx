import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableCaption, Tag, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone'

import { ConfigInterface } from '../services/config';
import DocumentService from '../services/documents';

import { UserContext } from "../services/auth";
import Layout from '../components/common/layout';
import { StorageReference } from 'firebase/storage';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import { t } from 'i18next';
import { ErrorInterface } from '../services/abstractInterface';

function Receipts(props: {
    config: ConfigInterface
}): React.ReactElement {
    const [isLoading, setLoading] = useState(true);
    const [allReceipts, setAllReceipts] = useState([] as StorageReference[]);
    const [displayReceipts, setDisplayReceipts] = useState([] as StorageReference[]);
    const [selectedReceipt, setSelectedReceipt] = useState({} as StorageReference);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const userContext = useContext(UserContext);
    const documentService = new DocumentService(userContext);

    const getReceiptsList = () => {
        documentService
            .getInvoices()
            .then((invoices: any[] | ErrorInterface) => {
                console.log({invoices});
                setAllReceipts(invoices as StorageReference[]);
                setDisplayReceipts(invoices as StorageReference[]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    const closeModal = (): void => {
        getReceiptsList();
        onClose();
    };

    const openModal = (d: StorageReference) => {
        // console.log({ openModal });
        setSelectedReceipt(d);
        onOpen();
    }

    useEffect(() => {
        getReceiptsList()
    }, [])

    return (
        <>
            <Layout
                isLoading={isLoading}
                main={
                    <ReceiptPageComponent
                        displayReceipts={displayReceipts}
                        documentService={documentService}
                        openModal={openModal} />
                }
                lateral={
                    <ReceiptPageFilter
                        allReceipts={allReceipts}
                        setDisplayReceipts={setDisplayReceipts}
                        openModal={openModal} />
                }
            />
            <HandleReceiptModal
                isOpen={isOpen}
                ReceiptData={selectedReceipt}
                documentService={documentService}
                closeModal={closeModal} />
        </>
    );
}

const ReceiptPageComponent = (props: {
    displayReceipts: StorageReference[],
    documentService: DocumentService
    openModal: Function
}): React.ReactElement => {
    // console.log('displayReceipts: ', props.displayReceipts);
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
                {(props.displayReceipts || [])
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

const ReceiptPageFilter = (props: {
    allReceipts: StorageReference[],
    setDisplayReceipts: Function,
    openModal: Function
}): React.ReactElement => {
    const Receipt = {} as StorageReference;
    return (
        <Box>
            <Button
                w="100%"
                colorScheme='teal'
                onClick={() => props.openModal(Receipt)}>
                {t('users.add')}
            </Button>
        </Box>
    )
}

const HandleReceiptModal = (props: {
    isOpen: boolean,
    ReceiptData: StorageReference,
    documentService: DocumentService
    closeModal: Function
}): React.ReactElement => {
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
        await props.documentService.updateUserFilesInfo({ customMetadata: { type: 'invoice' } }, acceptedFiles);
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

export default Receipts;
