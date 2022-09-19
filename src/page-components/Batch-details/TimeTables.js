import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../../src/components/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { BatchService, TeacherSlotService, TeacherSubjectService, TimetableService } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';
import useHandleError from '../../../src/hooks/useHandleError';
import BatchTimeTable from '../../../src/components/TimeTable/BatchTimeTable';
import { useSnackbar } from 'notistack';
import Chip from '@material-ui/core/Chip';
import Link from '../../../src/components/Link';

const TimeTableClasses = ({ batchId }) => {
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const [slotList, setSlotList] = useState([]);
    const [loading, setLoading] = useState(false);

    //New changes
    //Latest

    const [open, setOpen] = React.useState(false);
    const [batchData, setBatchData] = useState(null);
    const [syllabus, setSyllabus] = useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };

    const [teacher, setTeacher] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const [allSlot, setAllSlot] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [openSlotLoading, setOpenSlotLoading] = useState(false);
    const [day, setDay] = React.useState('');

    const [openTimeTable, setOpenTimeTable] = useState(false);
    const [openTimeTableLoading, setOpenTimeTableLoading] = useState(false);
    const [slotData, setSlotData] = useState(null);
    // const [batchData, setBatchData] = useState([]);

    const handleOpenTimeTable = (each) => {
        setSlotData(each);
        setOpenTimeTable(true);
    };

    const getTime = (time) => {
        let _time = time;
        let hh = Math.floor(_time / 60);
        let mm = _time % 60;

        let AMPM = hh >= 12 ? 'PM' : 'AM';
        hh = hh > 12 ? hh - 12 : hh;

        return `${hh}:${mm} ${AMPM}`;
    };

    useEffect(() => {
        setLoading(true);
        TimetableService.find({
            query: {
                instituteBatch: batchId,
                $populate: ['teacherSlot', 'teacher', 'subject', 'course'],
            },
        })
            .then((res) => {
                setSlotList(res);
                setLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                setLoading(false);
            });
        BatchService.get(batchId, {
            query: {
                $populate: ['instituteCourse', 'syllabuses'],
            },
        })
            .then((res) => {
                setBatchData(res);
                setSyllabus('');
            })
            .catch((error) => {
                handleError()(error);
            });
    }, []);

    useEffect(() => {
        if (syllabus === '') return;
        TeacherSubjectService.find({
            query: {
                $limit: 50,
                syllabus: syllabus,
                $populate: ['teacher'],
            },
        })
            .then((res) => {
                setTeacher(res.data);
                setSelectedTeacher('');
                setDay('');
            })
            .catch((error) => {
                handleError()(error);
            });
    }, [syllabus]);

    useEffect(() => {
        if (selectedTeacher === '' || day === '') return;
        TeacherSlotService.find({
            query: {
                teacher: selectedTeacher,
                day: day,
            },
        })
            .then((res) => {
                setSelectedSlot('');
                setAllSlot(res);
            })
            .catch((error) => {
                handleError()(error);
            });
    }, [day]);

    const handleRequestSlot = () => {
        if (syllabus === '') {
            enqueueSnackbar('Select a subject', { variant: 'warning' });
        } else if (selectedTeacher === '') {
            enqueueSnackbar('Select a teacher', { variant: 'warning' });
        } else if (selectedSlot === '') {
            enqueueSnackbar('Select a slot', { variant: 'warning' });
        } else {
            setOpenSlotLoading(true);
            TimetableService.create(
                {
                    teacherSlot: selectedSlot,
                    syllabus: syllabus,
                    instituteBatch: batchId,
                },
                {
                    query: {
                        $populate: ['teacherSlot', 'teacher', 'subject', 'course'],
                    },
                },
            )
                .then((res) => {
                    setSlotList([...slotList, res]);
                    enqueueSnackbar('Requested Successfully', { variant: 'success' });
                    setOpenSlotLoading(false);
                    setOpen(false);
                })
                .catch((error) => {
                    handleError()(error);
                    setOpenSlotLoading(false);
                });
        }
    };

    return (
        <div>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>{'Timetable'}</Typography>
                        <Button color={'primary'} onClick={handleClickOpen} variant={'contained'}>
                            {'Add'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            {loading ? (
                <Box display={'flex'} justifyContent={'center'} m={3} width={'100%'}>
                    <CircularProgress size={22} />
                </Box>
            ) : (
                <BatchTimeTable
                    list={slotList}
                    onClick={(each) => {
                        handleOpenTimeTable(each);
                    }}
                />
            )}
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
            >
                <DialogTitle
                    onClose={() => {
                        setOpen(false);
                    }}
                >
                    {'Assign to slot'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Subject"
                        margin="normal"
                        onChange={(ev) => setSyllabus(ev.target.value)}
                        select
                        size="small"
                        value={syllabus}
                        variant="outlined"
                    >
                        {batchData &&
                            batchData.syllabuses &&
                            batchData.syllabuses.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                    </TextField>
                    {syllabus !== '' && (
                        <TextField
                            fullWidth
                            label="Teacher"
                            margin="normal"
                            onChange={(ev) => setSelectedTeacher(ev.target.value)}
                            select
                            size="small"
                            value={selectedTeacher}
                            variant="outlined"
                        >
                            {teacher.length &&
                                teacher.map((option) => (
                                    <MenuItem key={option._id} value={option?.teacher._id}>
                                        {option?.teacher?.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    )}
                    {selectedTeacher !== '' && (
                        <TextField
                            fullWidth
                            id="outlined-select-currency"
                            label="Day"
                            margin="normal"
                            onChange={(ev) => setDay(ev.target.value)}
                            select
                            size="small"
                            value={day}
                            variant="outlined"
                        >
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                                (option, index) => (
                                    <MenuItem key={option} value={index}>
                                        {option}
                                    </MenuItem>
                                ),
                            )}
                        </TextField>
                    )}
                    {day !== '' && (
                        <TextField
                            fullWidth
                            label="Slots"
                            margin="normal"
                            onChange={(ev) => setSelectedSlot(ev.target.value)}
                            select
                            size="small"
                            value={selectedSlot}
                            variant="outlined"
                        >
                            {allSlot.length ? (
                                allSlot
                                    .filter((slot) => slot.syllabus === syllabus || slot.status === 1)
                                    .map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            <Box display={'flex'}>
                                                <Typography variant={'body2'}>
                                                    {option && getTime(option.startTime)}
                                                </Typography>
                                                <Box ml={1} />
                                                {'-'}
                                                <Box ml={1} />
                                                <Typography variant={'body2'}>
                                                    {option && getTime(option.endTime)}
                                                </Typography>
                                                <Box ml={1} />
                                            </Box>
                                        </MenuItem>
                                    ))
                            ) : (
                                <MenuItem value={''}>{'No slots available'}</MenuItem>
                            )}
                        </TextField>
                    )}
                    <Box mt={5} />
                    <Box display={'flex'} my={1}>
                        <Button
                            color={'primary'}
                            fullWidth
                            onClick={() => {
                                setOpen(false);
                            }}
                            variant={'outlined'}
                        >
                            {'cancel'}
                        </Button>
                        <Box ml={1} />
                        <Button
                            color={'primary'}
                            disabled={openSlotLoading || selectedSlot === ''}
                            fullWidth
                            onClick={() => {
                                handleRequestSlot();
                                // handleAddTeacherSlot();
                                // handleAdd();
                            }}
                            variant={'contained'}
                        >
                            {openSlotLoading ? (
                                <CircularProgress color={'inherit'} size={17} />
                            ) : (
                                <Typography variant={'button'}>{'Add'}</Typography>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    setOpenTimeTable(false);
                }}
                open={openTimeTable}
            >
                <DialogTitle
                    onClose={() => {
                        setOpenTimeTable(false);
                    }}
                >
                    <Box display={'flex'}>
                        {'Slot Details'}
                        <Box ml={1} />
                        {slotData?.status === 1 ? (
                            <Chip color={'secondary'} label="Pending" size="small" />
                        ) : (
                            <Chip color={'primary'} label={'Confirmed'} size={'small'} />
                        )}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} my={1}>
                        <Typography color={'textSecondary'} variant={'h3'}>
                            {slotData && slotData.course && slotData.course.name}
                        </Typography>
                        <Box ml={1} />
                        {'-'}
                        <Box ml={1} />
                        <Typography color={'textSecondary'} variant={'h3'}>
                            {slotData && slotData.subject && slotData.subject.name}
                        </Typography>
                    </Box>
                    <Typography>{'Teacher'}</Typography>
                    <Box display={'flex'} mb={1}>
                        <Typography
                            // color={'textSecondary'}
                            component={Link}
                            href={`/teachers/${slotData?.teacher?._id}`}
                            variant={'body2'}
                        >
                            {slotData && slotData.teacher && slotData.teacher.name}
                        </Typography>
                    </Box>
                    <Typography>{'Timing'}</Typography>
                    <Box alignSelf={'center'} display="flex" justifyContent={'space-between'}>
                        <Box display={'flex'}>
                            <Typography variant={'body2'}>
                                {slotData &&
                                    slotData?.teacherSlot.startTime &&
                                    getTime(slotData?.teacherSlot.startTime)}
                            </Typography>
                            <Box ml={1} />
                            {'-'}
                            <Box ml={1} />
                            <Typography variant={'body2'}>
                                {slotData && slotData?.teacherSlot.endTime && getTime(slotData?.teacherSlot.endTime)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box mt={2} />
                    <Button
                        color={'secondary'}
                        disabled={openTimeTableLoading}
                        onClick={() => {
                            // handleAddTeacherSlot();
                            // handleAdd();
                            setOpenTimeTableLoading(true);
                            TimetableService.remove(slotData._id)
                                .then(() => {
                                    setSlotList(slotList.filter((each) => each._id !== slotData._id));
                                })
                                .finally(() => {
                                    setOpenTimeTableLoading(false);
                                    setOpenTimeTable(false);
                                });
                        }}
                        size={'small'}
                        variant={'contained'}
                    >
                        {openTimeTableLoading ? (
                            <CircularProgress color={'inherit'} size={17} />
                        ) : (
                            <Typography variant={'button'}>{'Delete'}</Typography>
                        )}
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TimeTableClasses;
