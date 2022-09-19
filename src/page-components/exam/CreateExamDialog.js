import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Translate from '../../components/Translate';
import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useExamCreateData } from '../../store/ExamCreateContext';
import { useSnackbar } from 'notistack';

function CreateExamDialog({ tableOpen, handleClose, setGradeTable, setTableOpen, each }) {
    const Language = useLanguage('all-exams');
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState(each && each.title ? each.title : '');
    const [description, setDescription] = useState(each && each.description ? each.description : '');
    const [questionRequiredCount, setQuestionRequiredCount] = useState(
        each && each.questionRequiredCount ? each.questionRequiredCount : '0',
    );

    const [type] = useState('none');

    const validate = () => {
        if (name.trim() === '') {
            enqueueSnackbar(Language.get('validate.name'), { variant: 'warning' });
            return false;
        }
        if (description.trim() === '') {
            enqueueSnackbar(Language.get('validate.description'), { variant: 'warning' });
            return false;
        }
        if (questionRequiredCount.trim() === '' || parseInt(questionRequiredCount) <= 0) {
            enqueueSnackbar('Please give valid questions count', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const [data, setData] = useExamCreateData();

    const saveExamDetails = () => {
        if (validate()) {
            if (!each) {
                setData({
                    title: name,
                    description: description,
                    type: type,
                    questionRequiredCount,
                });
            } else {
                setData({
                    title: name,
                    description: description,
                    type: type,
                    questionRequiredCount,
                });
            }
            setTableOpen(false);
            setGradeTable(true);
            setName('');
            setDescription('');
        }
    };

    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'xs'}
                onClose={() => {
                    handleClose();
                }}
                open={tableOpen}
            >
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    <Translate root={'all-exams'}>{'Create Exam'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label={<Translate root={'all-exams'}>{'Name'}</Translate>}
                        margin={'dense'}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        variant={'outlined'}
                    />
                    <Box mt={2} />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        value={description}
                        variant="outlined"
                    />
                    <Box mt={2} />
                    <TextField
                        fullWidth
                        label="Total Number of Questions"
                        onChange={(e) => setQuestionRequiredCount(e.target.value)}
                        rows={2}
                        type={'number'}
                        value={questionRequiredCount}
                        variant="outlined"
                    />
                    <Box mt={2} />
                </DialogContent>
                <DialogActions>
                    <Button color={'secondary'} variant={'outlined'}>
                        <Translate root={'all-exams'}>{'cancel'}</Translate>
                    </Button>
                    <Button color={'primary'} onClick={saveExamDetails} variant={'contained'}>
                        <Translate root={'all-exams'}>{'next'}</Translate>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateExamDialog;

CreateExamDialog.propTypes = {
    each: PropTypes.any,
    position: PropTypes.number,
    tableOpen: PropTypes.any,
    setGradeTable: PropTypes.any,
    setTableOpen: PropTypes.any,
    setHasMore: PropTypes.any,
    handleClose: PropTypes.any,
    saveExamDetails: PropTypes.any,
};
