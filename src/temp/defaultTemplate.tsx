import React, {MouseEventHandler, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Box,
    Button,
    ModalBody,
    ModalContent,
    ModalFooter,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import Layout from '../components/auth/layout';

function Default(): React.ReactElement {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const {isOpen, onOpen, onClose} = useDisclosure();

    setTimeout(() => {
        setIsLoading(false);
    }, 1000);

    return (
        <Layout
            isLoading={isLoading}
            main={<Main />}
            lateral={<Lateral onOpen={onOpen} />}
            modal={<Modal />}
            modalProps={{
                title: t('default.modal.title', 'titulo'),
                isOpen,
                onOpen,
                onClose
            }}
        />
    );
}

const Main = (): React.ReactElement => {
    const {t} = useTranslation();
    return (
        <Box className="App">
            <Box className="App-header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Text>{t('welcome')}</Text>
                    <Text>Learn React</Text>
                </a>
            </Box>
        </Box>
    );
};

const Lateral = (props: {onOpen: MouseEventHandler<HTMLButtonElement>}): React.ReactElement => {
    return (
        <>
            <Button onClick={props.onOpen}> boton </Button>
            <Text>Learn React</Text>
        </>
    );
};

const Modal = (): React.ReactElement => {
    return (
        <>
            <ModalBody>Body</ModalBody>
            <ModalFooter>Footer</ModalFooter>
        </>
    );
};

export default Default;
