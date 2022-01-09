import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Center, Icon, Table, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react';
import {ChevronUpIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {useDropzone} from 'react-dropzone';

export default function UploadZone(props: {
    uploading: boolean;
    setFiles: Function;
}): React.ReactElement {
    const {t} = useTranslation();
    const [files, setFiles] = useState([] as File[]);
    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles);
        setFiles(acceptedFiles);
        props.setFiles(acceptedFiles);
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <>
            <Center
                bg="blue.50"
                border="2px dashed"
                borderColor="blue.500"
                w="100%"
                h="150px"
                py="5"
                px="10"
                align="center"
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {props.uploading ? (
                    <Text>{t('uploadZone.uploading')}</Text>
                ) : isDragActive ? (
                    <Text>{t('uploadZone.drop')}</Text>
                ) : (
                    <Text>{t('uploadZone.drag_drop')}</Text>
                )}
            </Center>
            {files.length ? (
                <>
                    <Box maxHeight="40vh" overflowY={{md: 'auto'}}>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>{t('documents.table.name')}</Th>
                                    <Th>{t('documents.table.size')}</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(files || []).map((d: any) => (
                                    <Tr key={d.name}>
                                        <Td isTruncated maxWidth="250px">
                                            {d.name}
                                        </Td>
                                        <Td>{Math.round(d.size / 1024)} Kb</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                    <Center>
                        <Text fontSize="sm">
                            <Icon as={ChevronDownIcon} mr="2" />
                            {t('table.scroll')}
                            <Icon as={ChevronUpIcon} mr="2" />
                        </Text>
                    </Center>
                </>
            ) : null}
        </>
    );
}
