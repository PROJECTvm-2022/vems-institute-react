import React, { useEffect, useState } from 'react';
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
import QuillEditor from '../../components/QuillComponents/QuillEditor';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: 14,
        },
    },
    input: {
        borderRadius: 8,
        position: 'relative',
        backgroundColor: '#ebf5fc',
        fontSize: 12,
        color: 'rgb(90,62,167)',
        padding: '4px 10px 4px 10px',
        transition: theme?.transitions?.create(['box-shadow']),
    },
}))(InputBase);

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: 8,
        color: 'rgb(90,62,167)',
    },
    mainDiv: {
        marginTop: 24,
    },
    btn: {
        backgroundColor: 'rgb(90,62,167)',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#000',
        },
    },
    textField: {
        width: 100,
    },
}));

function QuestionEditDialogForDetailsPage({
    setOpenDialog,
    openDialog,
    examDetails,
    id,
    setExamDetails,
    index,
    allQuestions,
    setAllQuestions,
}) {
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const classes = useStyle();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(examDetails?.question);
    const [mark, setMark] = useState(examDetails && examDetails.mark);
    const [negativeMark, setNegativeMark] = useState(examDetails && examDetails.negativeMark);
    const [answer, setAnswer] = useState((examDetails && examDetails.answer?.answerOfQuestion[0]) || 'none');
    const [correctAnswer, setCorrectAnswer] = useState(
        examDetails && examDetails.answer ? examDetails.answer.answerOfQuestion[0] : ['none'],
    );

    const [values, setValues] = React.useState(examDetails?.choices || ['', '']);

    // console.log('examDetails',correctAnswer);
    // console.log('correct answer',typeof correctAnswer[0])
    useEffect(() => {
        if (examDetails) {
            setQuestions(examDetails?.question);
            setMark(examDetails?.mark);
            setNegativeMark(examDetails?.negativeMark);
            setValues([...examDetails?.choices] || ['', '']);
            setAnswer(examDetails?.answer?.answerOfQuestion || 'none');
            setCorrectAnswer(examDetails?.answer?.answerOfQuestion || []);
        }
    }, [examDetails]);

    const deleteOption = (index) => {
        let _vals = values;
        _vals.splice(index, 1);
        setValues([..._vals]);
    };

    const validate = () => {
        if (questions.trim() === '') {
            enqueueSnackbar(Language.get('questionsRequired'), {
                variant: 'error',
            });
            return false;
        }
        if (mark === '') {
            enqueueSnackbar(Language.get('requiredAns'), {
                variant: 'error',
            });
            return false;
        }
        if (examDetails?.answerType === 2) {
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
            if (examDetails?.answerType !== 2) {
                _querry = {
                    question: questions,
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: correctAnswer },
                    choices: values,
                    mark: mark,
                    negativeMark: negativeMark,
                };
            } else {
                _querry = {
                    question: questions,
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: [answer] },
                    mark: mark,
                    negativeMark: negativeMark,
                };
            }
            setLoading(true);
            QuestionsService.patch(examDetails?._id, {
                ..._querry,
            })
                .then((res) => {
                    // console.log('res',res);
                    let _allQuestions = allQuestions;
                    _allQuestions[index] = res;
                    setAllQuestions([..._allQuestions]);
                    setOpenDialog(false);
                    setLoading(false);
                    enqueueSnackbar('Question Edited Successfully', {
                        variant: 'success',
                    });
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
                            <Box display={'flex'} flexDirection={'column'}>
                                <Typography>{'Question'}</Typography>
                                <QuillEditor
                                    onChange={(e) => {
                                        // console.log('on change', e)
                                        // setQuestions(e);
                                    }}
                                    value={questions}
                                />
                            </Box>
                            {/*<TextField*/}
                            {/*    fullWidth*/}
                            {/*    label={'Question'}*/}
                            {/*    onChange={(e) => {*/}
                            {/*        setQuestions(e.target.value);*/}
                            {/*    }}*/}
                            {/*    size={'small'}*/}
                            {/*    value={questions}*/}
                            {/*    variant={'outlined'}*/}
                            {/*/>*/}
                            <Box ml={2} />
                        </Box>
                        <Box display={'flex'} marginTop={2} justifyContent={'space-evenly'}>
                            <TextField
                                className={classes.textField}
                                fullWidth
                                label={'Mark'}
                                onChange={(e) => {
                                    setMark(e.target.value);
                                }}
                                type={'number'}
                                value={mark}
                                variant={'outlined'}

                            />
                            <TextField
                                className={classes.textField}
                                fullWidth
                                label={'Negative Mark'}
                                onChange={(e) => {
                                    setNegativeMark(e.target.value);
                                }}
                                size={'medium'}
                                type={'number'}
                                value={negativeMark}
                                variant={'outlined'}
                            />
                        </Box>
                        <Box mt={1} />
                        {examDetails?.answerType === 2 ? (
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
                                {values.map((each, index) => (
                                    <Box alignItems={'center'} display={'flex'} mt={1}>
                                        <Box display={'flex'}>
                                            <Radio
                                                checked={true}
                                                color={'black'}
                                                inputProps={{ 'aria-label': 'A' }}
                                                name="radio-button-demo"
                                                value="a"
                                            />
                                            <QuillEditor
                                                onChange={(e) => {
                                                    let _values = values;
                                                    _values[index] = e;
                                                    setValues([..._values]);
                                                }}
                                                value={each === {} ? '' : each}
                                            />

                                            {/*<TextField*/}
                                            {/*    fullWidth*/}
                                            {/*    onChange={(e) => {*/}
                                            {/*        let _values = values;*/}
                                            {/*        _values[index] = e.target.value;*/}
                                            {/*        setValues([..._values]);*/}
                                            {/*    }}*/}
                                            {/*    placeholder={'Enter Option' + (index + 1)}*/}
                                            {/*    size="small"*/}
                                            {/*    value={each === {} ? '' : each}*/}
                                            {/*/>*/}
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
                                                setCorrectAnswer(e);
                                            }}
                                            value={correctAnswer}
                                        >
                                            <MenuItem value="none">{'Choose An Option '}</MenuItem>
                                            {values &&
                                                values.map((each) => (
                                                    <MenuItem key={each?.Type} value={each}>
                                                        <QuillEditor
                                                            onChange={(e) => {
                                                                console.log('e...', e);
                                                                let _values = values;
                                                                _values[index] = e;
                                                                setValues([..._values]);
                                                            }}
                                                            value={each}
                                                        />
                                                        {/*{each}*/}
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
                        <Button color="primary" disabled={loading} onClick={handleEdit} variant={'contained'}>
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
QuestionEditDialogForDetailsPage.propTypes = {
    openDialog: PropTypes.any,
    setOpenDialog: PropTypes.any,
    examDetails: PropTypes.any,
    setExamDetails: PropTypes.any,
    id: PropTypes.any,
};

export default QuestionEditDialogForDetailsPage;
