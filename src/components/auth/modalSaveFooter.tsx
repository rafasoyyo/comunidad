import React, {Ref, useImperativeHandle, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, ModalFooter} from '@chakra-ui/react';
import {ArrowForwardIcon, CloseIcon, DeleteIcon} from '@chakra-ui/icons';

import {AbstractInterface} from '../../core/interfaces';
import {AbstractService} from '../../core/services';

const ModalSaveFooter = <I extends AbstractInterface>(props: {
    item: I;
    service: AbstractService<I>;
    onSubmit: Ref<unknown> | undefined;
    dispatch: Function;
    isValid: Function;
    closeModal: Function;
}): React.ReactElement => {
    const {t} = useTranslation();
    const [isSaving, setSaving] = useState(false);
    const [isSavingAndClosing, setSavingAndClosing] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const type = props.item.id ? 'edit' : 'add';

    useImperativeHandle(props.onSubmit, () => ({
        triggerSubmit(e: any) {
            saveAndClose(e);
        }
    }));

    const save = async () => {
        if (props.isValid()) {
            setSaving(true);
            await props.service.edit(props.item);
            setSaving(false);
            props.dispatch({type: type, data: props.item});
        }
    };

    const saveAndClose = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.isValid()) {
            setSavingAndClosing(true);
            await props.service.edit(props.item);
            setSavingAndClosing(true);
            props.dispatch({type: type, data: props.item});
            props.closeModal();
        }
    };

    const remove = async () => {
        setDeleting(true);
        await props.service.delete(props.item.id);
        setDeleting(false);
        props.dispatch({type: 'delete', data: props.item});
        props.closeModal();
    };

    return (
        <ModalFooter my="6">
            <Button
                id="saveandclose"
                size="sm"
                type="submit"
                colorScheme="teal"
                mr="2"
                isLoading={isSavingAndClosing}
                rightIcon={<ArrowForwardIcon w={5} h={5} />}
            >
                {t('form.saveandclose')}
            </Button>
            <Button
                id="save"
                size="sm"
                type="button"
                colorScheme="teal"
                mr="2"
                isLoading={isSaving}
                onClick={save}
                rightIcon={<ArrowForwardIcon w={5} h={5} />}
            >
                {t('form.save')}
            </Button>
            {props.item.id && (
                <Button
                    colorScheme="orange"
                    size="sm"
                    mr="2"
                    isLoading={isDeleting}
                    onClick={remove}
                    rightIcon={<DeleteIcon w={3} h={3} />}
                >
                    {t('form.delete')}
                </Button>
            )}
            <Button
                colorScheme="red"
                size="sm"
                rightIcon={<CloseIcon w={3} h={3} />}
                onClick={() => props.closeModal()}
            >
                {t('form.close')}
            </Button>
        </ModalFooter>
    );
};

export default ModalSaveFooter;
