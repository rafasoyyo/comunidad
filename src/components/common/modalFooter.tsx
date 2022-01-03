import React, { MutableRefObject, useImperativeHandle, useState } from 'react';

import {
    Button,
    ModalFooter,
} from '@chakra-ui/react';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import { t } from 'i18next';

import AuthService from '../../services/auth';
import UserService from '../../services/users';
import { ref } from 'firebase/database';
const authService: AuthService = new AuthService();
const userService: UserService = new UserService();

export default function ModalFooterSaver(props: {
    itemData: any,
    closeModal: Function
    onSubmit: any
}): React.ReactElement {
    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);

    const save = async (): Promise<void> => {
        console.log('save', props.itemData)
        setSaving(true);
        // typeof props.itemData.id === 'undefined'
        //     ? await authService.createUser(props.itemData)
        //     : await userService.edit(props.itemData);
        setSaving(false);
    }

    const saveAndClose = async (e?: any): Promise<void> => {
        console.log('saveAndClose', props.itemData)
        e.preventDefault();
        setSavingAndClosing(true);
        typeof props.itemData.id === 'undefined'
            ? await authService.createUser(props.itemData.email)
            : await userService.edit(props.itemData);
        setSavingAndClosing(false);
        props.closeModal()
    }

    useImperativeHandle(props.onSubmit, () => ({
        triggerSubmit(e: any) {
            saveAndClose(e)
        }
    }));

    return (
        <ModalFooter my="6">
            <Button
                type='submit'
                colorScheme='teal'
                isLoading={isSavingAndClosing}
                onClick={(e) => saveAndClose(e)}
                rightIcon={<ArrowForwardIcon w={5} h={5} />} >
                {t('form.saveandclose')}
            </Button>
            <Button
                mx={3}
                colorScheme='teal'
                isLoading={isSaving}
                onClick={save}
                rightIcon={<ArrowForwardIcon w={5} h={5} />} >
                {t('form.save')}
            </Button>
            <Button
                colorScheme='red'
                rightIcon={<CloseIcon w={3} h={3} />}
                onClick={() => props.closeModal()} >
                {t('form.close')}
            </Button>
        </ModalFooter>
    );
}
