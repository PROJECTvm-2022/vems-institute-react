import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import Translate from '../../components/Translate';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '../../components/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import { QuestionsService } from '../../apis/rest.app';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        backgroundColor: '#ebf5fc',
        fontSize: 12,
        color: theme.palette.primary.main,
        padding: '4px 10px 4px 10px',
        transition: theme.transitions.create(['box-shadow']),
    },
}))(InputBase);

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
    btn: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    textField: {
        width: 100,
    },
}));

function QuestionEditDialog({ setOpenDialog, openDialog, type, questionsCreated, id, setQuestionsCreated }) {
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const classes = useStyle();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(questionsCreated && questionsCreated.question);
    const [mark, setMark] = useState(questionsCreated && questionsCreated.mark);
    const [answer, setAnswer] = useState(questionsCreated && questionsCreated.answer.answerOfQuestion);
    const [values, setValues] = React.useState(
        // ['', ''],
        questionsCreated?.choices?.map((each, index) => questionsCreated?.choices[index]),
    );
    const deleteOption = (index) => {
        let _vals = values;
        _vals.splice(index, 1);
        setValues([..._vals]);
    };
    const [correctAnswer, setCorrectAnswer] = useState(
        questionsCreated && questionsCreated.answer && questionsCreated.answer.answerOfQuestion,
    );

    const validate = () => {
        if (questions.trim() === '') {
            enqueueSnackbar(Language.get('questionsRequired'), {
                variant: 'error',
            });
            return false;
        }
        if (mark.trim() === '') {
            enqueueSnackbar(Language.get('requiredAns'), {
                variant: 'error',
            });
            return false;
        }
        if (type === 2) {
            if (answer.trim() === '') {
                enqueueSnackbar(Language.get('answer'), {
                    variant: 'error',
                });
                return false;
            }
        } else {
            if (values[0].trim() === '') {
                enqueueSnackbar(Language.get('value1'), {
                    variant: 'error',
                });
                return false;
            }
            if (values[1].trim() === '') {
                enqueueSnackbar(Language.get('value2'), {
                    variant: 'error',
                });
                return false;
            }
            if (correctAnswer === 'none') {
                enqueueSnackbar(Language.get('correctAnswer'), {
                    variant: 'error',
                });
                return false;
            }
        }

        return true;
    };

    const handleEdit = async () => {
        if (validate()) {
            let _querry = {};
            if (type !== 2) {
                _querry = {
                    question: questions,
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: [correctAnswer] },
                    answerType: type,
                    choices: values,
                    mark: mark,
                };
            } else {
                _querry = {
                    question: questions,
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: answer },
                    answerType: type,
                    mark: mark,
                };
            }
            setLoading(true);
            QuestionsService.patch(questionsCreated?._id, {
                ..._querry,
            })
                .then((res) => {
                    setQuestionsCreated(res);
                    setOpenDialog(false);
                    setQuestions('');
                    setMark('');
                    setValues(['', '']);
                    setAnswer('');
                    setLoading(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
                    setLoading(false);
                });
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <div>
                <Dialog maxWidth={'sm'} onClose={handleClose} open={openDialog}>
                    <DialogTitle onClose={handleClose}>
                        {<Translate root={'create-questions/[id]'}>{'editQuestion'}</Translate>}
                    </DialogTitle>
                    <DialogContent>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <TextField
                                fullWidth
                                label={'Question'}
                                onChange={(e) => {
                                    setQuestions(e.target.value);
                                }}
                                size={'small'}
                                value={questions}
                                variant={'outlined'}
                            />
                            <Box ml={1} />
                            <TextField
                                className={classes.textField}
                                label={'Mark'}
                                onChange={(e) => {
                                    setMark(e.target.value);
                                }}
                                size={'small'}
                                type={'number'}
                                value={mark}
                                variant={'outlined'}
                            />
                        </Box>
                        <Box mt={1} />
                        {type === 2 ? (
                            <TextField
                                fullWidth
                                label={'Answer'}
                                onChange={(e) => {
                                    setAnswer(e.target.value);
                                }}
                                size={'small'}
                                value={answer}
                                variant={'outlined'}
                            />
                        ) : (
                            <>
                                {values?.map((each, index) => (
                                    <Box alignItems={'center'} display={'flex'} key={each._id} mt={1}>
                                        <Box display={'flex'}>
                                            <Radio
                                                checked={true}
                                                color={'black'}
                                                inputProps={{ 'aria-label': 'A' }}
                                                name="radio-button-demo"
                                                value="a"
                                            />
                                            <TextField
                                                fullWidth
                                                onChange={(e) => {
                                                    let _values = values;
                                                    _values[index] = e.target.value;
                                                    setValues([..._values]);
                                                }}
                                                placeholder={'Enter Option' + (index + 1)}
                                                size="small"
                                                value={each === {} ? '' : each}
                                            />
                                            {index > 1 && (
                                                <IconButton onClick={() => deleteOption(index)}>
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                                <Box mb={2} />
                                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                    <Button
                                        color={'primary'}
                                        disabled={values?.length === 5}
                                        onClick={() => {
                                            let _values = values;
                                            _values.push('');
                                            setValues([..._values]);
                                        }}
                                        variant={'outlined'}
                                    >
                                        {'Add Options'}
                                    </Button>
                                </Box>
                                <Box mb={1} />
                                <Box display={'flex'} justifyContent={'space-between'} mt={1}>
                                    <Box alignItems={'center'} display={'flex'}>
                                        <Typography variant={'body2'}>{'Select right answer'}</Typography>
                                    </Box>
                                    <FormControl margin="dense" variant="outlined">
                                        <Select
                                            input={<BootstrapInput />}
                                            onChange={(e) => {
                                                setCorrectAnswer(e.target.value);
                                            }}
                                            value={correctAnswer}
                                        >
                                            <MenuItem value="none">{'Choose An Option '}</MenuItem>
                                            {values &&
                                                values?.map((each) => (
                                                    <MenuItem key={each?.Type} value={each}>
                                                        {each}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleClose}>
                            {<Translate root={'create-questions/[id]'}>{'cancel'}</Translate>}
                        </Button>
                        <Button color="primary" onClick={handleEdit} variant={'contained'}>
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate root={'create-questions/[id]'}>{'edit'}</Translate>
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
QuestionEditDialog.propTypes = {
    type: PropTypes.any.isRequired,
    openDialog: PropTypes.any,
    setOpenDialog: PropTypes.any,
    questionsCreated: PropTypes.any,
    setQuestionsCreated: PropTypes.any,
    id: PropTypes.any,
};

export default QuestionEditDialog;
