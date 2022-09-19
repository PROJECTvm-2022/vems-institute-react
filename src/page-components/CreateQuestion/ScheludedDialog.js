import React, { useState } from 'react';
import 'date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ExamService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { useRouter } from 'next/router';
import * as Papa from 'papaparse';
import QuillEditor from '../../components/QuillComponents/QuillEditor';
import * as XLSX from 'xlsx';

const useStyles = makeStyles(() => ({
    chip: {
        borderRadius: 4,
        width: 120,
    },
    red: {
        backgroundColor: 'red',
    },
    tableHeading: {
        minWidth: 0,
    },
}));

function ScheludedDialog({ each, openScheduleDialog, setOpenScheduleDialog, schedule }) {
    const Language = useLanguage('all-exams');
    const handleError = useHandleError();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [batches, setBatches] = useState([]);
    // const [batchesLoading, setBatchesLoading] = useState(false);
    // const [institute, setInstitute] = useState(null);
    // const [clear, setClear] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [allScheduleArray, setAllScheduleArray] = useState([]);
    const [startTimeAndDate, setStartTimeAndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [values, setValues] = useState('');
    const [time, setTime] = useState('');
    const [students, setStudents] = useState([]);
    const Router = useRouter();

    const handleClose = () => {
        setOpenScheduleDialog(false);
    };

    const onSelectImageFile = (e) => {
        if (e.target.files) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (evt) => {
                    // evt = on_file_select event
                    /* Parse data */
                    const bstr = evt.target.result;

                    const workbook = XLSX.read(bstr, { type: 'binary' });

                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object
                        const sheet = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        setStudents(
                            sheet
                                .map((each) => {
                                    return { name: each?.Name, email: each?.Name_1 };
                                })
                                .filter((each) => each.email),
                        );
                    });
                };
                reader.readAsBinaryString(file);

                // reader.readAsDataURL(e.target.files[0]);
                // Papa.parse(file, {
                //     header: true,
                //     skipEmptyLines: true,
                //     complete: function (results) {
                //         // console.log('results', results.data.map((each) => {
                //         //     Object.keys(each).forEach((key) => {
                //         //         each[key] = breakDown(each[key]);
                //         //     });
                //         //     return each;
                //         // }),);
                //         // console.log('results',results)
                //         const lenses = results.data.map((each) => {
                //             Object.keys(each).forEach((key) => {
                //                 each[key.toLowerCase()] = breakDown(each[key]);
                //             });
                //             return each;
                //         });
                //         // setLensTypes(lenses);

                //         // console.log('data...',lenses);
                //     },
                // });
            }
        }
    };

    const breakDown = (mixedString) => {
        // ABCD(1)

        const match = mixedString.toString().match(/^([a-zA-Z0-9_ ]*)\(*([a-zA-Z0-9_ ]*)\)*$/);

        if (match && Array.isArray(match) && match.length === 3 && match[2] !== '') {
            // console.log(mixedString, match, {
            //     name: match[1],
            //     value: match[2],
            // });
            return {
                name: match[1],
                value: match[2],
            };
        } else {
            return {
                name: mixedString,
                value: mixedString,
            };
        }
    };

    // useEffect(() => {
    //     if (!institute) return;
    //     setBatchesLoading(true);
    //     InstituteBatchService.find({
    //         query: { institute: institute?._id },
    //     })
    //         .then((response) => {
    //             setBatches(
    //                 response?.data.map((each) => ({
    //                     ...each,
    //                     chipEnabled: allScheduleArray.some((each1) => each1._id === each._id),
    //                 })),
    //             );
    //         })
    //         .catch(() => setBatches(null))
    //         .finally(() => {
    //             setBatchesLoading(false);
    //         });
    // }, [institute]);

    const changeColor = (batch) => {
        setBatches(
            batches.map((each) => ({
                ...each,
                chipEnabled: each._id === batch._id ? !each.chipEnabled : each.chipEnabled,
            })),
        );
    };
    const validate = () => {
        if (time.trim() === '') {
            enqueueSnackbar(Language.get('Provide a time'), { variant: 'warning' });
            return false;
        }
        if (values === '') {
            enqueueSnackbar(Language.get('Provide instruction'), { variant: 'warning' });
            return false;
        }
        // if (institute === '') {
        //     enqueueSnackbar(Language.get('validate.institute'), {
        //         variant: 'warning',
        //     });
        //     return false;
        // }
        // if (
        //     !batches?.filter((each) => {
        //         return each?.chipEnabled === true;
        //     }).length
        // ) {
        //     enqueueSnackbar(Language.get('validate.batches'), {
        //         variant: 'warning',
        //     });
        //     return false;
        // }
        return true;
    };
    // const setToAnArray = () => {
    //     if (validate()) {
    //         setAllScheduleArray(
    //             allScheduleArray
    //                 .filter((each3) => {
    //                     const index = batches.findIndex((each4) => each3._id === each4._id);
    //                     if (index === -1) return true;
    //                     return batches[index].chipEnabled;
    //                 })
    //                 .concat(
    //                     batches
    //                         ?.filter((each) => each?.chipEnabled === true)
    //                         .filter((each1) => !allScheduleArray.some((s) => s._id === each1._id))
    //                         .map((each2) => ({ ...each2, institute })),
    //                 ),
    //         );
    //     }
    // };

    const deleteOption = (index) => {
        let _vals = values;
        _vals.splice(index, 1);
        setValues([..._vals]);
    };

    const scheduleTheExam = () => {
        if (validate()) {
            setLoading(true);
            ExamService.create({
                entityId: each._id,
                entityType: 'exam',
                endTime: new Date(endTime),
                scheduledOn: new Date(startTimeAndDate),
                // instituteBatches: allScheduleArray.map((each) => each._id),
                duration: time,
                instructions: [values],
                students: students,
                // students: [{"name":'Soumya',"email": "soumyaranjansahoo338@gmail.com"}]
            })

                .then((res) => {
                    console.log('resssss', res);
                    setLoading(false);
                    setOpenScheduleDialog(false);
                    enqueueSnackbar(Language.get('successMessage.scheduled'), { variant: 'success' });
                    if (schedule) {
                        Router.push({
                            pathname: `/exam-details/${each._id}`,
                            query: { scheduleExamId: res?._id },
                        });
                        // onClick={() => Router.push({
                        //     pathname: '/customer-order',
                        //     query: { status: 1 },
                        //     // asPath: /store/${marker.url_key},
                        // })}
                    }
                })
                .catch(() => {
                    handleError();
                    setLoading(false);
                    setOpenScheduleDialog(false);
                });
        }
    };
    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    handleClose();
                }}
                open={openScheduleDialog}
            >
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    <Translate root={'all-exams'}>{'Scheduled For'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            defaultValue={startTimeAndDate}
                            id="datetime-local"
                            label="Start Date and Time"
                            onChange={(e) => {
                                setStartTimeAndDate(e.target.value);
                                // console.log('e', e.target.value);
                            }}
                            size={'small'}
                            type="datetime-local"
                            value={startTimeAndDate}
                            variant={'outlined'}
                        />
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            defaultValue={endTime}
                            id="datetime-local"
                            label="Start Date and Time"
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                // console.log('e', e.target.value);
                            }}
                            size={'small'}
                            type="datetime-local"
                            value={endTime}
                            variant={'outlined'}
                        />
                    </Box>
                    <Box alignItems={'center'} display={'flex'} mt={2}>
                        <TextField
                            label="Duration (Minutes)"
                            onChange={(e) => {
                                if (e.target.value <= 0) {
                                    setTime('');
                                } else {
                                    setTime(e.target.value);
                                }
                            }}
                            size={'small'}
                            type={'number'}
                            value={time}
                            variant={'outlined'}
                        />

                        <Box ml={1} />
                        <Box
                            border={1}
                            borderColor={'#858585'}
                            borderRadius={5}
                            display={'flex'}
                            flexDirection={'column'}
                            mr={1}
                            p={1}
                            width={'232px'}
                        >
                            <input
                                accept="application/xlsx"
                                hidden
                                id="user-image"
                                onChange={onSelectImageFile}
                                type="file"
                            />
                        </Box>
                        <Button
                            color={'primary'}
                            onClick={() => {
                                window.open(`http://api.vems.smarttersstudio.in/samples/studentlist-sample.xlsx`);
                            }}
                            style={{ width: '150px' }}
                            variant={'outlined'}
                        >
                            Sample File
                        </Button>
                    </Box>
                    <Box mt={2} />
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography>{'Enter Instructions'}</Typography>
                        <QuillEditor
                            onChange={(e) => {
                                setValues(e);
                            }}
                            value={values}
                        />
                    </Box>
                    <Box mt={2} />

                    {/*<InstituteAutocomplete clear={clear} onSelect={(ins) => setInstitute(ins || null)} size={'small'} />*/}
                    {/*<Box mt={2} />*/}
                    {/*{institute && (*/}
                    {/*    <Box display={'flex'} flexDirection={'column'}>*/}
                    {/*        <Typography variant={'body2'}>*/}
                    {/*            <Translate root={'all-exams'}>{'batches'}</Translate>*/}
                    {/*        </Typography>*/}
                    {/*        <Box mt={0.5} />*/}
                    {/*        <Box display={'flex'}>*/}
                    {/*            {batches?.length ? (*/}
                    {/*                batches?.map((each) => (*/}
                    {/*                    <Chip*/}
                    {/*                        className={classes.chip}*/}
                    {/*                        color={each?.chipEnabled ? 'primary' : 'default'}*/}
                    {/*                        key={each._id}*/}
                    {/*                        label={each?.name}*/}
                    {/*                        onMouseDown={() => {*/}
                    {/*                            changeColor(each);*/}
                    {/*                        }}*/}
                    {/*                        variant={each?.chipEnabled ? 'outlined' : 'default'}*/}
                    {/*                    />*/}
                    {/*                ))*/}
                    {/*            ) : batchesLoading ? (*/}
                    {/*                <CircularProgress size={22} />*/}
                    {/*            ) : (*/}
                    {/*                <Box alignItems={'center'} display={'flex'} justifyContent={'center'} m={1} mt={2}>*/}
                    {/*                    <Typography variant={'subtitle2'}>*/}
                    {/*                        <Translate root={'all-exams'}>{'noBatch'}</Translate>*/}
                    {/*                    </Typography>*/}
                    {/*                </Box>*/}
                    {/*            )}*/}
                    {/*        </Box>*/}
                    {/*    </Box>*/}
                    {/*)}*/}
                    {/*<Box mb={2} />*/}
                    {/*<Button color={'primary'} fullWidth onClick={setToAnArray} variant={'outlined'}>*/}
                    {/*    <Translate root={'all-exams'}>{'Add Institute'}</Translate>*/}
                    {/*</Button>*/}
                    {/*<Box mb={2} />*/}
                    {/*{allScheduleArray?.length !== 0 && (*/}
                    {/*    <TableContainer*/}
                    {/*        bgcolor={'common.white'}*/}
                    {/*        borderRadius={'borderRadius'}*/}
                    {/*        className={classes.tableHeading}*/}
                    {/*        component={Box}*/}
                    {/*        p={1}*/}
                    {/*    >*/}
                    {/*        {allScheduleArray?.length !== 0 ? (*/}
                    {/*            <Table>*/}
                    {/*                <TableHead>*/}
                    {/*                    <TableRow>*/}
                    {/*                        <TableCell align="left">*/}
                    {/*                            <Translate root={'all-exams'}>{'tableHeadings.name'}</Translate>*/}
                    {/*                        </TableCell>*/}
                    {/*                        <TableCell align={'center'}>*/}
                    {/*                            <Translate root={'all-exams'}>{'tableHeadings.batches'}</Translate>*/}
                    {/*                        </TableCell>*/}
                    {/*                        <TableCell align="center">*/}
                    {/*                            <Translate root={'all-exams'}>{'tableHeadings.date'}</Translate>*/}
                    {/*                        </TableCell>*/}
                    {/*                        <TableCell />*/}
                    {/*                    </TableRow>*/}
                    {/*                </TableHead>*/}
                    {/*                <TableBody>*/}
                    {/*                    {allScheduleArray*/}
                    {/*                        .filter(*/}
                    {/*                            (each, i) =>*/}
                    {/*                                allScheduleArray.findIndex(*/}
                    {/*                                    (each1) => each1.institute._id === each.institute._id,*/}
                    {/*                                ) === i,*/}
                    {/*                        )*/}
                    {/*                        .map((each, index) => (*/}
                    {/*                            <ScheduledTableItem*/}
                    {/*                                allScheduleArray={allScheduleArray}*/}
                    {/*                                each={each}*/}
                    {/*                                key={each._id}*/}
                    {/*                                position={index}*/}
                    {/*                                setAllScheduleArray={setAllScheduleArray}*/}
                    {/*                            />*/}
                    {/*                        ))}*/}
                    {/*                </TableBody>*/}
                    {/*            </Table>*/}
                    {/*        ) : loading ? (*/}
                    {/*            <TableRow>*/}
                    {/*                <TableCell align="center" colSpan={5}>*/}
                    {/*                    <TableSkeleton />*/}
                    {/*                </TableCell>*/}
                    {/*            </TableRow>*/}
                    {/*        ) : (*/}
                    {/*            <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>*/}
                    {/*                <Translate root={'all-exams'}>{'noInstitutesFound'}</Translate>*/}
                    {/*            </Box>*/}
                    {/*        )}*/}
                    {/*    </TableContainer>*/}
                    {/*)}*/}
                    {/*{allScheduleArray?.length !== 0 && (*/}
                    <>
                        <Box mb={2} />
                        <Button color={'primary'} fullWidth onClick={scheduleTheExam} variant={'contained'}>
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate root={'all-exams'}>{'Schedule Exam'}</Translate>
                            )}
                        </Button>
                        <Box mb={2} />
                    </>
                    {/*)}*/}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ScheludedDialog;

ScheludedDialog.propTypes = {
    setOpenScheduleDialog: PropTypes.any,
    openScheduleDialog: PropTypes.any,
    each: PropTypes.any,
};
