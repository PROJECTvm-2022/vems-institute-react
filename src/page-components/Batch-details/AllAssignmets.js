import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import { AssignmentService, SyllabusesService } from '../../apis/rest.app';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import { useLanguage } from '../../store/LanguageStore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import AllAssignmentTableView from '../../page-components/AllAssignments/AllAssignmentTableView';
import DialogTitle from '../../components/DialogTitle';
import Translate from '../../components/Translate';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import CourseAutoComplete from '../../page-components/all-live-class/CourseAutoComplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { useUser } from '../../store/UserContext';
import FilterListIcon from '@material-ui/icons/FilterList';
import useHandleError from '../../hooks/useHandleError';

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
        // marginTop: theme.spacing(3),
    },
}));

const AntTabs = withStyles(() => ({
    indicator: {
        backgroundColor: '#495aff',
    },
}))(Tabs);

const AntTab = withStyles(() => ({
    root: {
        background: '#9A9A9A',
        borderRadius: '5px 5px 0px 0px',
        width: '100%',
    },
    selected: {
        color: '#037FFB',
        background: '#fff',
    },
}))((props) => <Tab disableRipple {...props} />);

const AllAssignments = ({ id }) => {
    const Language = useLanguage('all-exams');
    const classes = useStyle();
    const [dialogValue, setDialogValue] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [course, setCourse] = useState('');
    // const [tableOpen, setTableOpen] = useState(false);
    const [allAssignments, setAllAssignments] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(2);
    const [openDialog, setOpenDialog] = useState(false);
    const [startTimeAndDate, setStartTimeAndDate] = useState('');
    const [endTimeAndDate, setEndTimeAndDate] = useState('');
    const [user] = useUser();
    const [subject, setSubject] = useState(null);
    const [openSubject, setOpenSubject] = useState(false);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const handleError = useHandleError();

    const validate = () => {
        if (startTimeAndDate === '' && endTimeAndDate !== '') {
            enqueueSnackbar('Provide A Start Date With Time', { variant: 'warning' });
            return false;
        }
        if (endTimeAndDate === '' && startTimeAndDate !== '') {
            enqueueSnackbar('Provide A End Date With Time', { variant: 'warning' });
            return false;
        }
        return true;
    };

    let query = {
        status: type,
        $skip: allAssignments.length,
        $limit: 10,
        $populate: ['course', 'subject'],
        'instituteBatches.instituteBatch': { $in: [id] },
    };
    if (search.trim() !== '')
        query.title = {
            $regex: `.*${search}*.`,
            $options: 'i',
        };
    // if (syllabus) query.syllabus = syllabus._id;
    if (course) query.course = course?.course?._id;
    if (subject) query.syllabus = subject?._id;
    const LoadInst = () => {
        setLoading(true);
        AssignmentService.find({
            query,
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...allAssignments, ...data];
                setHasMore(result.length < total);
                setAllAssignments(result);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setHasMore(false);
                setLoading(false);
            });
    };

    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }

    const handleChangeDialogValue = (event, newValue) => {
        setDialogValue(newValue);
        setType(newValue === 0 ? newValue + 2 : newValue === 1 ? newValue + 3 : newValue === 2 ? newValue + 3 : '');
        setAllAssignments([]);
        setHasMore(true);
    };

    useEffect(() => {
        if (!course) return;
        SyllabusesService.find({
            query: {
                $limit: 50,
                $skip: 0,
                $populate: 'subject',
                course: course?.course?._id,
            },
        })
            .then((res) => {
                setSubjectOptions(res.data);
                setOpenSubject(true);
            })
            .catch((error) => {
                handleError()(error);
            });
    }, []);
    const onSelectedSubject = (event, value) => {
        if (value) {
            setSubject(value);
            setOpenSubject(false);
            setSubjectOptions(subjectOptions.filter((each) => each._id !== value._id));
        }
    };
    const handleChangeSubject = (e) => {
        let searchQuery = e.target.value;
        setOpenSubject(false);
        setSubjectOptions([]);
        if (searchQuery && searchQuery !== '') {
            setLoadingSubject(true);
            SyllabusesService.find({
                query: {
                    name: {
                        $regex: `.*${searchQuery}.*`,
                        $options: 'i',
                    },
                    $limit: 50,
                    $populate: 'subject',
                    course: course?.course?._id,
                },
            }).then((res) => {
                setSubjectOptions(res.data);
                setLoadingSubject(false);
                setOpenSubject(true);
            });
        }
    };

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>{'All Assignments'}</Typography>
                        <Button
                            color={'primary'}
                            onClick={() => {
                                setOpenDialog(true);
                            }}
                            size={'small'}
                            variant={'contained'}
                        >
                            <FilterListIcon />
                            <Box ml={1} />
                            <Translate root={'exams'}>{'Filter By'}</Translate>
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Box mt={2} />
            <AntTabs aria-label="disabled tabs example" onChange={handleChangeDialogValue} value={dialogValue}>
                <AntTab label="Scheduled" {...a11yProps(1)} />
                <AntTab label="Completed" {...a11yProps(2)} />
                <AntTab label="Cancelled" {...a11yProps(4)} />
            </AntTabs>
            <Paper>
                <InfiniteScroll
                    hasMore={hasMore}
                    loadMore={LoadInst}
                    loader={
                        <Box align={'center'} key={'allInstitute'} m={1} width={'100%'}>
                            <TableSkeleton />
                        </Box>
                    }
                    pageStart={0}
                >
                    {allAssignments.length ? (
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
                                            <TableCell align="left">{'Title'}</TableCell>
                                            <TableCell align={'center'}>{'Course'}</TableCell>
                                            <TableCell align={'center'}>{'Subject'}</TableCell>
                                            <TableCell align="center">{'Submission date'}</TableCell>
                                            <TableCell align="center">{'Total mark'}</TableCell>
                                            <TableCell align="center" />
                                            <TableCell align="left" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allAssignments.map((each, index) => (
                                            <AllAssignmentTableView
                                                allAssignments={allAssignments}
                                                each={each}
                                                key={each._id}
                                                position={index}
                                                setAllAssignments={setAllAssignments}
                                                type={type}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    ) : hasMore ? (
                        ''
                    ) : (
                        <Box
                            alignItems={'center'}
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            p={5}
                        >
                            <Typography align={'center'} variant={'h2'}>
                                {'No Assignments'}
                            </Typography>
                        </Box>
                    )}
                </InfiniteScroll>
            </Paper>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    setOpenDialog(false);
                }}
                open={openDialog}
            >
                <DialogTitle
                    onClose={() => {
                        setOpenDialog(false);
                    }}
                >
                    <Translate>{'Filter Assignments'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/*<Grid item md={6} sm={12} xs={12}>*/}
                        {/*    <TextField*/}
                        {/*        InputLabelProps={{*/}
                        {/*            shrink: true,*/}
                        {/*        }}*/}
                        {/*        className={classes.textField}*/}
                        {/*        fullWidth*/}
                        {/*        id="datetime-local"*/}
                        {/*        label="Start Date And Time"*/}
                        {/*        onChange={(e) => setStartTimeAndDate(e.target.value)}*/}
                        {/*        size={'small'}*/}
                        {/*        type="datetime-local"*/}
                        {/*        value={startTimeAndDate}*/}
                        {/*        variant={'outlined'}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid item md={6} sm={12} xs={12}>*/}
                        {/*    <TextField*/}
                        {/*        InputLabelProps={{*/}
                        {/*            shrink: true,*/}
                        {/*        }}*/}
                        {/*        className={classes.textField}*/}
                        {/*        fullWidth*/}
                        {/*        id="datetime-local"*/}
                        {/*        label="End Date And Time"*/}
                        {/*        onChange={(e) => setEndTimeAndDate(e.target.value)}*/}
                        {/*        size={'small'}*/}
                        {/*        type="datetime-local"*/}
                        {/*        value={endTimeAndDate}*/}
                        {/*        variant={'outlined'}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        <Grid item md={6} sm={12} xs={12}>
                            {course ? (
                                <Box
                                    bgcolor={'#ebf5fc'}
                                    borderRadius={6}
                                    display={'flex'}
                                    height={'40px'}
                                    justifyContent={'space-between'}
                                    width={'100%'}
                                >
                                    <Box alignItems={'center'} display={'flex'} ml={1}>
                                        <Typography variant={'subtitle2'}>{'Course: '}</Typography>
                                        <Box ml={1} />
                                        <Typography variant={'body2'}>{course?.course?.name}</Typography>
                                    </Box>
                                    <IconButton
                                        onClick={() => {
                                            setCourse(null);
                                            setSubject(null);
                                            setSubjectOptions([]);
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Box mt={-1}>
                                    <CourseAutoComplete
                                        institute={user?.institute?._id}
                                        label={'Filter by course'}
                                        onSelect={(ev) => setCourse(ev || null)}
                                        size="small"
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            {subject ? (
                                <Box
                                    bgcolor={'#ebf5fc'}
                                    borderRadius={6}
                                    display={'flex'}
                                    height={'40px'}
                                    justifyContent={'space-between'}
                                    width={'100%'}
                                >
                                    <Box alignItems={'center'} display={'flex'} ml={1}>
                                        <Typography variant={'subtitle2'}>{'Subject: '}</Typography>
                                        <Box ml={1} />
                                        <Typography variant={'body2'}>{subject?.subject?.name}</Typography>
                                    </Box>
                                    <IconButton
                                        onClick={() => {
                                            setSubject(null);
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Box>
                                    <Autocomplete
                                        disabled={course === ''}
                                        getOptionLabel={(option) =>
                                            (option && option?.subject?.name) || subject?.subject?.name
                                        }
                                        loading={loading}
                                        onChange={onSelectedSubject}
                                        onClose={() => setOpenSubject(false)}
                                        onOpen={() => {
                                            setOpenSubject(true);
                                        }}
                                        open={openSubject}
                                        options={subjectOptions}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loadingSubject ? (
                                                                    <CircularProgress color="inherit" size={20} />
                                                                ) : null}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                    disabled={course === ''}
                                                    fullWidth
                                                    margin="dense"
                                                    onChange={handleChangeSubject}
                                                    placeholder="Search For Subject"
                                                    value={subject?.subject?.name}
                                                    variant="outlined"
                                                />
                                            );
                                        }}
                                        style={{ width: '100%', marginTop: -8 }}
                                        value={subject?.subject?.name}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Box display={'flex'} justifyContent={'space-between'} mb={1} mt={1} mx={2} width={'100%'}>
                        <Button
                            color={'primary'}
                            disabled={
                                startTimeAndDate === '' && endTimeAndDate === '' && course === null && subject === null
                            }
                            onClick={() => {
                                setStartTimeAndDate('');
                                setEndTimeAndDate('');
                                setCourse(null);
                                setSubject(null);
                                setLoading(true);
                                setAllAssignments([]);
                                setHasMore(true);
                                // setResetLoading(true);
                                setOpenDialog(false);
                            }}
                            variant={'outlined'}
                        >
                            {'Reset'}
                        </Button>
                        <Box>
                            <Button
                                color={'primary'}
                                onClick={() => {
                                    setOpenDialog(false);
                                }}
                                style={{ marginRight: 10 }}
                            >
                                {'Cancel'}
                            </Button>
                            <Button
                                color={'primary'}
                                onClick={() => {
                                    if (validate()) {
                                        setAllAssignments([]);
                                        setHasMore(true);
                                        setOpenDialog(false);
                                    }
                                }}
                                style={{ width: '100px' }}
                                variant={'contained'}
                            >
                                {'Filter'}
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AllAssignments;
