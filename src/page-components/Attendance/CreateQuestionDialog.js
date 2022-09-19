import React, { useState } from 'react';
import Translate from '../../../src/components/Translate';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import useHandleError from '../../../src/hooks/useHandleError';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core/index';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '../../components/DialogTitle';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import { MessageService } from '../../apis/rest.app';
import { useSnackbar } from 'notistack';

const BootstrapInput = withStyles(() => ({
    root: {
        'label + &': {
            marginTop: '12px',
        },
    },
    input: {
        borderRadius: 6,
        position: 'relative',
        backgroundColor: '#ebf5fc',
        fontSize: 12,
        // color: '',
        padding: '4px 10px 4px 10px',
    },
}))(InputBase);

function CreateQuestionDialog({ each, open, setOpen }) {
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const emptyQuizQuestion = {
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctOption: 'none',
        duration: '5',
    };
    const [quiz, setQuiz] = useState(emptyQuizQuestion);
    const [quizCreateLoading, setQuizCreateLoading] = useState(false);

    const handleSetValue = (key, value) => {
        let _quiz = { ...quiz };
        _quiz[`${key}`] = value;
        setQuiz(_quiz);
    };

    const validate = () => {
        if (quiz.question.trim() === '') {
            enqueueSnackbar('Question is required', {
                variant: 'warning',
            });
            return false;
        } else if (quiz.option1.trim() === '') {
            enqueueSnackbar('Option 1 is required', {
                variant: 'warning',
            });
            return false;
        } else if (quiz.option2.trim() === '') {
            enqueueSnackbar('Option 2 is required', {
                variant: 'warning',
            });
            return false;
        } else if (quiz.option3.trim() === '') {
            enqueueSnackbar('Option 3 is required', {
                variant: 'warning',
            });
            return false;
        } else if (quiz.option4.trim() === '') {
            enqueueSnackbar('Option 4 is required', {
                variant: 'warning',
            });
            return false;
        } else if (quiz.correctOption === 'none') {
            enqueueSnackbar('Select a correct option', {
                variant: 'warning',
            });
            return false;
        } else if (quiz.duration.trim() === '') {
            enqueueSnackbar('Duration is required', {
                variant: 'warning',
            });
            return false;
        } else {
            return true;
        }
    };

    const handleCreateQuiz = () => {
        if (validate()) {
            setQuizCreateLoading(true);
            MessageService.create({
                type: 2,
                entityType: 'liveClass',
                entityId: each?._id,
                duration: parseInt(quiz.duration),
                status: 2,
                text: quiz.question,
                options: [
                    {
                        name: quiz.option1,
                    },
                    {
                        name: quiz.option2,
                    },
                    {
                        name: quiz.option3,
                    },
                    {
                        name: quiz.option4,
                    },
                ],
                answerOfQuiz: quiz[`option${parseInt(quiz.correctOption)}`],
            })
                .then(() => {
                    setQuiz(emptyQuizQuestion);
                    enqueueSnackbar('Quiz question assigned', {
                        variant: 'success',
                    });
                    setQuizCreateLoading(false);
                    setOpen(false);
                })
                .catch((error) => {
                    handleError()(error);
                    setQuizCreateLoading(false);
                    setOpen(false);
                });
        }
    };

    return (
        <Dialog fullWidth maxWidth={'xs'} onClose={() => setOpen(false)} open={open}>
            <DialogTitle onClose={() => setOpen(false)}>
                <Translate>{'Create Quiz'}</Translate>
            </DialogTitle>
            <DialogContent>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} p={1}>
                    {/*<Card component={Box} elevation={2} p={1}>*/}
                    <Typography color={'textSecondary'} variant={'subtitle2'}>
                        {'Question'}
                    </Typography>
                    <Box mb={1} mt={0.5}>
                        <TextField
                            fullWidth
                            onChange={(event) => handleSetValue('question', event.target.value)}
                            placeholder={'Enter the question'}
                            size={'small'}
                            value={quiz.question}
                            variant={'outlined'}
                        />
                    </Box>
                    <Typography color={'textSecondary'} variant={'subtitle2'}>
                        {'Options'}
                    </Typography>
                    <Box mb={1} mt={0.5}>
                        <TextField
                            fullWidth
                            onChange={(event) => handleSetValue('option1', event.target.value)}
                            placeholder={'Enter option 1'}
                            size={'small'}
                            value={quiz.option1}
                            variant={'outlined'}
                        />
                    </Box>
                    <Box mb={1} mt={0.5}>
                        <TextField
                            fullWidth
                            onChange={(event) => handleSetValue('option2', event.target.value)}
                            placeholder={'Enter option 2'}
                            size={'small'}
                            value={quiz.option2}
                            variant={'outlined'}
                        />
                    </Box>
                    <Box mb={1} mt={0.5}>
                        <TextField
                            fullWidth
                            onChange={(event) => handleSetValue('option3', event.target.value)}
                            placeholder={'Enter option 3'}
                            size={'small'}
                            value={quiz.option3}
                            variant={'outlined'}
                        />
                    </Box>
                    <Box mb={1} mt={0.5}>
                        <TextField
                            fullWidth
                            onChange={(event) => handleSetValue('option4', event.target.value)}
                            placeholder={'Enter option 4'}
                            size={'small'}
                            value={quiz.option4}
                            variant={'outlined'}
                        />
                    </Box>
                    <Box display={'flex'} justifyContent={'space-between'} mt={1}>
                        <Box alignItems={'center'} display={'flex'}>
                            <Typography color={'textSecondary'} variant={'subtitle2'}>
                                {'Select right answer'}
                            </Typography>
                        </Box>
                        <FormControl margin="dense" variant="outlined">
                            <Select
                                input={<BootstrapInput />}
                                onChange={(e) => {
                                    handleSetValue('correctOption', e.target.value);
                                }}
                                value={quiz.correctOption}
                            >
                                <MenuItem value="none">{'Choose An Option '}</MenuItem>
                                <MenuItem value={'1'}>{'Option 1'}</MenuItem>
                                <MenuItem value={'2'}>{'Option 2'}</MenuItem>
                                <MenuItem value={'3'}>{'Option 3'}</MenuItem>
                                <MenuItem value={'4'}>{'Option 4'}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box display={'flex'} mt={1}>
                        <Box alignItems={'center'} display={'flex'}>
                            <Typography color={'textSecondary'} variant={'subtitle2'}>
                                {'Duration of quiz'}
                            </Typography>
                        </Box>
                        <span style={{ flexGrow: 1 }} />
                        <Box width={'68px'}>
                            <TextField
                                onChange={(event) => handleSetValue('duration', event.target.value)}
                                size={'small'}
                                type={'number'}
                                value={quiz.duration}
                                variant={'outlined'}
                            />
                        </Box>
                        <Box alignItems={'center'} display={'flex'} ml={1} mr={1}>
                            <Typography color={'textPrimary'} variant={'h6'}>
                                {'seconds'}
                            </Typography>
                        </Box>
                    </Box>
                    {/*</Card>*/}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        setOpen(false);
                    }}
                    size="medium"
                >
                    {'Cancel'}
                    {/*<Translate root={'institute-attendance/[id]'}>{'button-cancel'}</Translate>*/}
                </Button>
                <Button color={'primary'} onClick={handleCreateQuiz} variant={'contained'}>
                    {'Create Quiz'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
CreateQuestionDialog.propTypes = {
    each: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    position: PropTypes.any,
    batchId: PropTypes.any,
};

export default CreateQuestionDialog;
