import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useLanguage } from '../../store/LanguageStore';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { QuestionsService } from '../../apis/rest.app';
import { useConfirm } from '../Confirm';
import useHandleError from '../../hooks/useHandleError';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../DialogTitle';
import Translate from '../Translate';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: '1px solid #EEEEEE',
        marginBottom: theme.spacing(2),
    },
}));

const QuestionListItem = ({ question, index, onDelete, onEdit }) => {
    const [deleting, setDeleting] = useState(false);

    const [questionTitle, setQuestionTitle] = useState(question.question);
    // eslint-disable-next-line no-unused-vars
    const [answerType, setAnswerType] = useState(question.answerType);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const [choices, setChoices] = useState(
        question.choices.map((value) => {
            const isCorrect = Boolean(question.answer.answerOfQuestion.find((answer) => answer === value));
            return {
                value,
                isCorrect,
            };
        }),
    );
    const { enqueueSnackbar } = useSnackbar();

    const Language = useLanguage('teacher-video-details/details/[videoId]');

    const classes = useStyles();

    const Confirm = useConfirm();

    const handleError = useHandleError();

    const handleDelete = () =>
        Confirm().then(() => {
            setDeleting(true);
            QuestionsService.remove(question._id)
                .then(onDelete)
                .catch(handleError())
                .finally(() => setDeleting(false));
        });
    const validate = () => {
        if (question.trim() === '') {
            enqueueSnackbar('Enter a Question', { variant: 'warning' });
            return false;
        }
        if (choices[0]?.value === '') {
            enqueueSnackbar('Option1 can' + "'" + 't be empty', { variant: 'warning' });
            return false;
        }
        if (choices[1]?.value === '') {
            enqueueSnackbar('Option2 can' + "'" + 't be empty', { variant: 'warning' });
            return false;
        }
        if (choices[choices?.length - 1]?.value === '') {
            enqueueSnackbar(`Option${choices?.length} can` + "'" + 't be empty ', { variant: 'warning' });
            return false;
        }
        if (choices.filter((each) => each.isCorrect === true)?.length === 0) {
            enqueueSnackbar('Please provide a correct answer', { variant: 'warning' });
            return false;
        }
        if (choices.filter((each) => each.isCorrect === true)?.length > 1) {
            enqueueSnackbar('You can' + "'" + 't select more than one correct answer', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleCreate = () => {
        if (validate()) {
            setEditing(true);
            QuestionsService.patch(question._id, {
                question: questionTitle,
                answer: {
                    answerOfQuestion: choices.filter((each) => each.isCorrect).map((each) => each.value),
                },
                answerType,
                choices: choices.map((each) => each.value),
            })
                .then((res) => {
                    onEdit(res);
                    setCreateModalOpen(false);
                })
                .catch(handleError())
                .finally(() => setEditing(false));
        }
    };

    return (
        <div className={classes.root}>
            <Box display="flex" justifyContent="space-between" my={1}>
                <Typography variant="h4">{`Q.${index}: ${question.question}`}</Typography>
            </Box>
            {question.answerType === 1 && (
                <Box mb={2} mt={1}>
                    <Grid container spacing={2}>
                        {question.choices.map((each) => {
                            const isCorrect = Boolean(
                                question.answer.answerOfQuestion.find((answer) => answer === each),
                            );
                            return (
                                <Grid item key={each} md={6} sm={12} xs={12}>
                                    <Box
                                        alignItems="center"
                                        bgcolor={isCorrect ? '#e8fbec' : '#eeeeee'}
                                        border={1}
                                        borderColor={isCorrect ? '#71c158' : 'transparent'}
                                        borderRadius={5}
                                        color={isCorrect ? '#71c158' : 'inherit'}
                                        display="flex"
                                        fontSize={16}
                                        minHeight={56}
                                        px={2}
                                        py={1}
                                    >
                                        {each}
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </div>
    );
};

QuestionListItem.propTypes = {
    question: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default QuestionListItem;
