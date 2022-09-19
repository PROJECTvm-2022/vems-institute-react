import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Translate from '../../../src/components/Translate';
import Hidden from '@material-ui/core/Hidden';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../../src/store/LanguageStore';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import AllQuestions from '../../../src/page-components/createQuestion/AllQuestions';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import { useRouter } from 'next/router';
import { ExamService, QuestionService, QuestionsService } from '../../../src/apis/rest.app';
import useHandleError from '../../../src/hooks/useHandleError';
import QuillEditor from '../../../src/components/QuillComponents/QuillEditor';
// import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
// import Chip from '@material-ui/core/Chip';
// import AddBoxIcon from '@material-ui/icons/AddBox';
import { ExcelRenderer } from 'react-excel-renderer';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core/index';
import DialogContentText from '@material-ui/core/DialogContentText';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
// import EditExcelDialog from '../../../src/page-components/exam/EditExcelDialog';
import ScheludedDialog from '../../../src/page-components/createQuestion/ScheludedDialog';
// import * as Papa from 'papaparse';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: 24,
        },
    },
    input: {
        borderRadius: 8,
        position: 'relative',
        backgroundColor: '#ebfcf7',
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
    mainDiv: {
        marginTop: 24,
    },
    btn: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    },
    delete: {
        fontSize: '14px',
    },
}));

const CreateQuestions = () => {
    const Language = useLanguage('create-questions/[id]');
    const classes = useStyle();
    const Router = useRouter();
    const { id } = Router.query;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState('');
    const [mark, setMark] = useState('');
    const [answer, setAnswer] = useState('');
    const [negativeMark, setNegativeMark] = useState('');
    const [values, setValues] = React.useState(['', '']);
    const [allQuestions, setAllQuestions] = useState([]);
    const [allQuestionsLoading, setAllQuestionsLoading] = useState(false);
    const handleError = useHandleError();
    const [file, setFile] = useState('');
    const [excel, setExcel] = useState('');
    const [tableOpen, setTableOpen] = useState(false);
    const [eachExcel, setEachExcel] = useState([]);
    const [position, setPosition] = useState('');
    const [eachExcelObject, setEachExcelObject] = useState([]);
    const [eachExamData, setEachExamData] = useState('');
    const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
    const [uploadExcelLoading, setUploadExcelLoading] = useState(false);
    const typeList = [
        {
            Type: 1,
            name: 'Multiple Choice',
        },
        {
            Type: 2,
            name: 'Fill In The Blanks',
        },
    ];

    const [type, setType] = useState(1);

    const [open, setOpen] = React.useState(false);
    const [questionDialog, setQuestionDialog] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleQuestionDialog = () => {
        setQuestionDialog(false);
    };

    const deleteOption = (index) => {
        let _vals = values;
        _vals.splice(index, 1);
        setValues([..._vals]);
    };
    const [correctAnswer, setCorrectAnswer] = useState('none');

    const validate = () => {
        if (questions.trim() === '') {
            enqueueSnackbar(Language.get('messages.questionsRequired'), {
                variant: 'error',
            });
            return false;
        }
        if (mark.trim() === '') {
            enqueueSnackbar(Language.get('messages.mark'), {
                variant: 'error',
            });
            return false;
        }
        if (type === 2) {
            if (answer.trim() === '') {
                enqueueSnackbar(Language.get('messages.correctAnswer'), {
                    variant: 'error',
                });
                return false;
            }
        } else {
            if (values[0].trim() === '') {
                enqueueSnackbar(Language.get('messages.value'), {
                    variant: 'error',
                });
                return false;
            }
            if (values[1].trim() === '') {
                enqueueSnackbar(Language.get('messages.value'), {
                    variant: 'error',
                });
                return false;
            }
            if (values[values.length - 1]?.trim() === '') {
                enqueueSnackbar(Language.get(`Option ${values.length} can` + "'" + 't be empty'), {
                    variant: 'error',
                });
                return false;
            }
            if (correctAnswer === 'none') {
                enqueueSnackbar(Language.get('messages.correctAnswer'), {
                    variant: 'error',
                });
                return false;
            }
        }

        return true;
    };

    const Excelvalidate = () => {
        if (excel?.cols?.length < 9 || excel?.cols?.length > 9) {
            enqueueSnackbar(Language.get('Please enter headings according to the format '), {
                variant: 'warning',
            });
            return false;
        }
        return true;
    };

    const [questionsCreated, setQuestionsCreated] = useState('');

    const addQuestion = () => {
        if (validate()) {
            let _querry = {};
            if (type !== 2) {
                _querry = {
                    question: questions,
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: [values[correctAnswer]] },
                    answerType: type,
                    choices: values,
                    mark: mark,
                    negativeMark: negativeMark ? negativeMark : 0,
                };
            } else {
                _querry = {
                    question: questions,
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: [answer] },
                    answerType: type,
                    mark: mark,
                    negativeMark: negativeMark ? negativeMark : 0,
                };
            }
            setLoading(true);
            QuestionsService.create({
                ..._querry,
            })
                .then((res) => {
                    setAllQuestions([res, ...allQuestions]);
                    setCorrectAnswer('none');
                    setQuestions('');
                    setMark('');
                    setValues(['', '']);
                    setAnswer('');
                    setNegativeMark('');
                    setLoading(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
                    setLoading(false);
                });
        }
    };

    // const onSelectImageFile = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         const file = e.target.files[0];
    //         const reader = new FileReader();
    //         reader.readAsDataURL(e.target.files[0]);
    //         Papa.parse(file, {
    //             header: true,
    //             complete: function (results) {
    //                 let _data = results.data;
    //                 _data.map((each) => {
    //                     let _each = each;
    //                     Object.keys(_each).forEach((key) => {
    //                         each[key.toLowerCase()] = each[key];
    //                         delete _each[key]
    //                     });
    //                     return _each;
    //                 })
    //                 console.log('results ---> > . ',results.data)
    //                 setExcel(results.data);
    //                 // setNewStudents(results.data);
    //             },
    //         });
    //     }
    // };

    const onSelectImageFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (!file) return;
        ExcelRenderer(file, (err, resp) => {
            if (err) {
                // console.log(err);
            } else {
                console.log('excel', { cols: resp.rows[0], rows: resp.rows.slice(1) });
                setExcel({ cols: resp.rows[0], rows: resp.rows.slice(1) });
                setOpen(true);
            }
        });
    }, [file]);

    useEffect(() => {
        if (!id) return;
        setAllQuestionsLoading(true);
        QuestionService.find({
            query: {
                entityId: id,
                '$sort[createdAt]': -1,
            },
        })
            .then((res) => {
                setAllQuestions([...res]);
                setAllQuestionsLoading(false);
            })
            .catch((error) => {
                setAllQuestionsLoading(false);
                handleError()(error);
            });
    }, [id]);

    useEffect(() => {
        if (!id) return;
        setAllQuestionsLoading(true);
        ExamService.get(id, {
            query: {
                $populate: ['course', 'subject'],
            },
        })
            .then((res) => {
                setEachExamData(res);
                setAllQuestionsLoading(false);
            })
            .catch((error) => {
                setAllQuestionsLoading(false);
                handleError()(error);
            });
    }, [id]);

    useEffect(() => {
        if (excel === '') return;
        // console.log('excel',excel);
        const eachExcelObject = [];
        for (let i = 0; i < excel?.rows?.length; i++) {
            if (excel?.rows[i][excel?.rows[i].length - 1] === 1) {
                eachExcelObject.push({
                    question: excel?.rows[i][0],
                    entityType: 'exam',
                    entityId: id,
                    answer: {
                        answerOfQuestion: [
                            excel?.rows[i][7] === 'A'
                                ? excel?.rows[i][3]
                                : excel?.rows[i][7] === 'B'
                                ? excel?.rows[i][4]
                                : excel?.rows[i][7] === 'C'
                                ? excel?.rows[i][5]
                                : excel?.rows[i][6],
                        ],
                    },
                    answerType: 1,
                    choices: [excel?.rows[i][3], excel?.rows[i][4], excel?.rows[i][5], excel?.rows[i][6]],
                    mark: excel?.rows[i][1],
                    negativeMark: excel?.rows[i][2],
                });
            } else {
                eachExcelObject.push({
                    question: excel?.rows[i][0],
                    entityType: 'exam',
                    entityId: id,
                    answer: { answerOfQuestion: [excel?.rows[i][3]] },
                    answerType: 2,
                    mark: excel?.rows[i][1],
                    negativeMark: excel?.rows[i][2],
                });
            }
            setEachExcelObject([...eachExcelObject]);
            setLoading(true);
        }
    }, [excel]);

    const [uploadLoading, setUploadLoading] = useState(false);

    const UploadExcel = () => {
        if (Excelvalidate()) {
            setUploadExcelLoading(true);
            QuestionsService.create(eachExcelObject)
                .then((res) => {
                    setAllQuestions([...res, ...allQuestions]);
                    setUploadExcelLoading(false);
                    setLoading(false);
                    setFile('');
                    setExcel('');
                    setUploadLoading(false);
                    setQuestionDialog(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
                    setLoading(false);
                    setUploadLoading(false);
                    setUploadExcelLoading(false);
                    setQuestionDialog(false);
                });
        }
    };

    const EditList = (each, index) => {
        setEachExcel([...each]);
        setPosition(index);
        setTableOpen(true);
    };

    const handleCloseEditDialog = () => {
        setTableOpen(false);
    };

    const deleteExcel = (each, index) => {
        setExcel((d) => {
            d.rows.splice(index, 1);
            return d;
        });
        setEachExcelObject((data) => {
            data.splice(index, 1);
            return data;
        });
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'create-questions/[id]'}>{'title'}</Translate> for {eachExamData?.title} (
                            {allQuestions.length}/{eachExamData?.questionRequiredCount})
                        </Typography>
                        <Box alignItems="center" className={classes.buttonDiv} display="flex" justifyContent="center">
                            <Hidden xsDown>
                                <Button
                                    color={'primary'}
                                    onClick={() => {
                                        window.open(
                                            'https://api.vems.smarttersstudio.in/samples/questionlist-sample.xlsx',
                                        );
                                    }}
                                    variant={'outlined'}
                                >
                                    Sample Questions
                                </Button>
                                <Box mr={2} />
                                <Button
                                    color={'primary'}
                                    disabled={allQuestions.length >= eachExamData?.questionRequiredCount}
                                    onClick={() => {
                                        setQuestionDialog(true);
                                    }}
                                    variant={'outlined'}
                                >
                                    Upload Questions
                                </Button>
                                <Box mr={2} />
                                <Box ml={1} />
                                <Button
                                    color="primary"
                                    disabled={loading}
                                    href={`/exam-details/${id}`}
                                    size="large"
                                    variant="contained"
                                >
                                    <Translate root={'create-questions/[id]'}>{'Draft'}</Translate>
                                </Button>
                                <Box ml={2} />
                                <Button
                                    color="primary"
                                    disabled={loading || allQuestions.length < eachExamData?.questionRequiredCount}
                                    onClick={() => {
                                        setOpenScheduleDialog(true);
                                    }}
                                    size="large"
                                    variant="contained"
                                >
                                    <Translate root={'create-questions/[id]'}>{'Schedule and Save'}</Translate>
                                </Button>
                            </Hidden>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Hidden smUp>
                        <Box mt={2} />
                        <Box ml={2} />
                        <Button
                            color="primary"
                            disabled={loading}
                            fullWidth
                            // onClick={() =>{
                            //     ExamService.patch
                            // }}
                            href={`/exam-details/${id}`}
                            size="medium"
                            variant="contained"
                        >
                            <Translate root={'create-questions/[id]'}>{'Draft'}</Translate>
                        </Button>
                        <Box mt={2} />
                        <Button
                            color="primary"
                            disabled={loading}
                            fullWidth
                            onClick={() => {
                                setOpenScheduleDialog(true);
                            }}
                            size="medium"
                            variant="contained"
                        >
                            <Translate root={'create-questions/[id]'}>{'Schedule and Save'}</Translate>
                        </Button>
                    </Hidden>
                </Grid>
            </Grid>
            <Box mt={2} />
            <Grid container spacing={2}>
                <Grid item md={6} sm={6} xs={12}>
                    <Box component={Paper} p={2}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Box alignItems={'center'} display={'flex'}>
                                <Typography variant={'h3'}>{`Q`}</Typography>
                            </Box>
                            <FormControl disabled={questionsCreated !== ''} margin="dense" variant="outlined">
                                <Select
                                    input={<BootstrapInput />}
                                    onChange={(e) => {
                                        setType(e?.target?.value);
                                    }}
                                    value={type}
                                >
                                    {typeList &&
                                        typeList.map((each) => (
                                            <MenuItem key={each?.Type} value={each?.Type}>
                                                {each?.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mb={2} />
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography>{'Question'}</Typography>
                            <QuillEditor
                                onChange={(e) => {
                                    setQuestions(e);
                                }}
                                value={questions}
                            />
                        </Box>
                        <Box mt={2} />
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <TextField
                                fullWidth
                                label={'Mark'}
                                onChange={(e) => {
                                    if (e.target.value <= 0) {
                                        setMark('');
                                    } else {
                                        setMark(e.target.value);
                                    }
                                }}
                                size={'small'}
                                type={'number'}
                                value={mark}
                                variant={'outlined'}
                            />
                            <TextField
                                disabled={!mark}
                                fullWidth
                                label={'Negative Mark'}
                                onChange={(e) => {
                                    if (parseInt(e.target.value) <= 0) {
                                        setNegativeMark('');
                                    } else if (parseInt(e.target.value) >= parseInt(mark)) {
                                        setNegativeMark('');
                                    } else {
                                        setNegativeMark(e.target.value);
                                    }
                                }}
                                size={'small'}
                                type={'number'}
                                value={negativeMark}
                                variant={'outlined'}
                            />
                        </Box>
                        <Box mt={1} />
                        {type === 2 ? (
                            <Box display={'flex'} flexDirection={'column'}>
                                <Typography>{'Answer'}</Typography>
                                <QuillEditor
                                    onChange={(e) => {
                                        setAnswer(e);
                                    }}
                                    value={answer}
                                />
                            </Box>
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
                                            <QuillEditor
                                                onChange={(e) => {
                                                    let _values = values;
                                                    _values[index] = e;
                                                    setValues([..._values]);
                                                }}
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
                                                values?.map((each, index) => (
                                                    <MenuItem key={each?.Type} value={index}>
                                                        {'Answer '}
                                                        {index + 1}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </>
                        )}
                        <Box mb={2} />
                        <Divider />
                        <Box mt={2} />
                        <Button
                            className={classes.btn}
                            disabled={
                                questionsCreated !== '' || allQuestions.length >= eachExamData?.questionRequiredCount
                            }
                            fullWidth
                            onClick={addQuestion}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress color={'#fff'} size={24} /> : 'Add Question'}
                        </Button>
                    </Box>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Box component={Paper} p={2}>
                        <AllQuestions
                            allQuestions={allQuestions}
                            allQuestionsLoading={allQuestionsLoading}
                            id={id}
                            questionsCreated={questionsCreated}
                            setAllQuestions={setAllQuestions}
                            setAllQuestionsLoading={setAllQuestionsLoading}
                            setQuestionsCreated={setQuestionsCreated}
                            type={type}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Dialog
                aria-describedby="alert-dialog-description"
                aria-labelledby="alert-dialog-title"
                fullWidth
                maxWidth={'xl'}
                onClose={handleClose}
                open={open}
            >
                <DialogTitle id="alert-dialog-title">{'Questions'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {excel ? (
                            <div className={classes.mainDiv}>
                                <TableContainer
                                    bgcolor={'common.white'}
                                    borderRadius={'borderRadius'}
                                    component={Box}
                                    p={1}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {excel &&
                                                    excel?.cols?.map((e) => (
                                                        <>
                                                            <TableCell align="left">
                                                                <Translate>{e}</Translate>
                                                            </TableCell>
                                                        </>
                                                    ))}
                                                <TableCell />
                                                <TableCell />
                                            </TableRow>
                                        </TableHead>
                                        {/*<Typography>{excel.rows}</Typography>*/}
                                        <TableBody>
                                            {excel?.rows?.map((each, index) => (
                                                <TableRow key={each}>
                                                    {/*{each.map((e) => (*/}
                                                    {/*    <>*/}
                                                    <TableCell>{each[0] ? each[0] : '--'}</TableCell>
                                                    <TableCell>{each[1] ? each[1] : '--'}</TableCell>
                                                    <TableCell>{each[2] ? each[2] : '--'}</TableCell>
                                                    <TableCell>{each[3] ? each[3] : '--'}</TableCell>
                                                    <TableCell>{each[4] ? each[4] : '--'}</TableCell>
                                                    <TableCell>{each[5] ? each[5] : '--'}</TableCell>
                                                    <TableCell>{each[6] ? each[6] : '--'}</TableCell>
                                                    <TableCell>{each[7] ? each[7] : '--'}</TableCell>
                                                    <TableCell>{each[8] ? each[8] : '--'}</TableCell>
                                                    {/*    </>*/}
                                                    {/*))}*/}
                                                    <TableCell>
                                                        <Button
                                                            color={'primary'}
                                                            onClick={() => {
                                                                EditList(each, index);
                                                            }}
                                                            variant={'contained'}
                                                        >
                                                            {'Edit'}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            className={classes.delete}
                                                            color={'secondary'}
                                                            onClick={() => {
                                                                deleteExcel(each, index);
                                                            }}
                                                            variant={'contained'}
                                                        >
                                                            {'Delete'}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        ) : (
                            <Box alignItems="center" display={'flex'} height={'60vh'} justifyContent="center">
                                <Translate>{'No Questions Found'}</Translate>
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            {/*<EditExcelDialog*/}
            {/*    eachExcel={eachExcel}*/}
            {/*    eachExcelObject={eachExcelObject}*/}
            {/*    excel={excel}*/}
            {/*    handleClose={handleCloseEditDialog}*/}
            {/*    id={id}*/}
            {/*    position={position}*/}
            {/*    setEachExcel={setEachExcel}*/}
            {/*    setEachExcelObject={setEachExcelObject}*/}
            {/*    setExcel={setExcel}*/}
            {/*    setTableOpen={setTableOpen}*/}
            {/*    tableOpen={tableOpen}*/}
            {/*/>*/}
            <ScheludedDialog
                each={eachExamData}
                openScheduleDialog={openScheduleDialog}
                schedule={true}
                setOpenScheduleDialog={setOpenScheduleDialog}
            />
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    handleQuestionDialog();
                }}
                open={questionDialog}
            >
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    <Translate root={'all-exams'}>{'Add Questions'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
                        <Box
                            border={1}
                            borderColor={'#858585'}
                            borderRadius={5}
                            display={'flex'}
                            flexDirection={'column'}
                            p={1.5}
                            width={'100%'}
                        >
                            <input hidden id="user-image" onChange={onSelectImageFile} type="file" />
                        </Box>
                    </Box>
                    <>
                        <Box mb={2} />
                        <Button
                            color={'primary'}
                            fullWidth
                            onClick={() => {
                                UploadExcel();
                            }}
                            variant={'contained'}
                        >
                            {uploadExcelLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate root={'all-exams'}>{'Add Questions'}</Translate>
                            )}
                        </Button>
                        <Box mb={2} />
                    </>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default CreateQuestions;
