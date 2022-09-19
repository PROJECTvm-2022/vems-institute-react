import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
// import Button from '@material-ui/core/Button';
// import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Translate from '../../../src/components/Translate';
import FilterComponent from '../../../src/page-components/all-exams/FilterComponent';
// import Hidden from '@material-ui/core/Hidden';
import { CitiesService, StudentExamService, StatesService } from '../../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import { useLanguage } from '../../../src/store/LanguageStore';
import ExamTableView from '../../../src/page-components/all-exams/ExamTableView';
// import ExamAddDialog from '../../src/page-components/exam/ExamAddDialog';
// import { withExamCreateData } from '../../src/store/ExamCreateContext';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import { withStyles } from '@material-ui/styles';
// import Paper from '@material-ui/core/Paper';
import { useRouter } from 'next/router';
// import useHandleError from '../../../src/hooks/useHandleError';

// const useStyle = makeStyles((theme) => ({
//     buttonDiv: {
//         fontWeight: 500,
//         fontSize: 13,
//     },
//     switchButtonIcon: {
//         marginLeft: theme.spacing(1),
//         color: theme.palette.primary.main,
//     },
//     mainDiv: {
//         marginTop: theme.spacing(3),
//     },
// }));

// const AntTabs = withStyles({
//     indicator: {
//         backgroundColor: '#495aff',
//     },
// })(Tabs);

// const AntTab = withStyles((theme) => ({
//     root: {
//         ackground: '#9A9A9A',
//         borderRadius: '5px 5px 0px 0px',
//         width: '100%',
// textTransform: 'none',
// fontWeight: theme?.typography?.fontWeightRegular,
// fontFamily: [
//     '-apple-system',
//     'BlinkMacSystemFont',
//     '"Segoe UI"',
//     'Roboto',
//     '"Helvetica Neue"',
//     'Arial',
//     'sans-serif',
//     '"Apple Color Emoji"',
//     '"Segoe UI Emoji"',
//     '"Segoe UI Symbol"',
// ].join(','),
// '&:hover': {
//     opacity: 1,
// },
// '&$selected': {
//     fontWeight: theme?.typography?.fontWeightMedium,
// },
//     },
//     selected: { color: '#037FFB', background: '#fff' },
// }))((props) => <Tab disableRipple {...props} />);

const AllExams = () => {
    const Language = useLanguage('all-exams/[id]');
    // const classes = useStyle();
    // const [dialogValue, setDialogValue] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [course, setCourse] = useState('none');

    const [stateId, setStateId] = useState('none');
    const [stateList, setStateList] = React.useState([]);
    const [state, setState] = useState('none');

    const [city, setCity] = useState('none');
    const [cityList, setCityList] = useState([]);
    // const [tableOpen, setTableOpen] = useState(false);
    const [allExam, setAllExams] = useState([]);
    const [search, setSearch] = useState('');
    // const [loading, setLoading] = useState(false);
    // const [type, setType] = useState(2);

    const Router = useRouter();
    // const handleError = useHandleError();
    const { id } = Router.query;

    const [syllabus, setSyllabus] = useState(null);

    // const handleButtonOpen = () => {
    //     setTableOpen(true);
    // };

    useEffect(() => {
        StatesService.find()
            .then((response) => {
                setStateList(response);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
            });
    }, []);

    useEffect(() => {
        if (stateId !== 'none')
            CitiesService.find({
                query: {
                    state: stateId,
                },
            })
                .then((response) => {
                    setCityList(response);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something Went Wrong!', { variant: 'error' });
                });
    }, [stateId]);

    const query = {
        status: 4,
        $skip: allExam.length,
        $limit: 10,
        $populate: ['exam'],
        student: id,
    };
    if (search)
        query.title = {
            $regex: `.*${search}*.`,
            $options: 'i',
            // student: id,
        };
    if (syllabus) query.syllabus = syllabus._id;
    const LoadStudent = () => {
        // setLoading(true);
        StudentExamService.find({
            query,
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...allExam, ...data];
                setHasMore(result.length < total);
                setAllExams(result);
                // setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setHasMore(false);
            });
    };

    useEffect(() => {
        setAllExams([]);
        setHasMore(true);
    }, [state]);
    useEffect(() => {
        setAllExams([]);
        setHasMore(true);
    }, [city]);
    // function a11yProps(index) {
    //     return {
    //         id: `scrollable-auto-tab-${index}`,
    //         'aria-controls': `scrollable-auto-tabpanel-${index}`,
    //     };
    // }

    // const handleChangeDialogValue = (event, newValue) => {
    //     setDialogValue(newValue);
    //     setType(newValue + 2);
    //     setAllExams([]);
    //     setHasMore(true);
    // };

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'all-exams/[id]'}>{'title'}</Translate>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <FilterComponent
                city={city}
                cityList={cityList}
                course={course}
                setAllExams={setAllExams}
                setCity={setCity}
                setCourse={setCourse}
                setHasMore={setHasMore}
                setSearch={setSearch}
                setState={setState}
                setStateId={setStateId}
                setSyllabus={setSyllabus}
                stateId={stateId}
                stateList={stateList}
            />
            <Box mt={2} />
            {/*<AntTabs aria-label="disabled tabs example" onChange={handleChangeDialogValue} value={dialogValue}>*/}
            {/*    <AntTab label="Scheduled" {...a11yProps(1)} />*/}
            {/*    <AntTab label="Ongoing" {...a11yProps(3)} />*/}
            {/*    <AntTab label="Completed" {...a11yProps(2)} />*/}
            {/*</AntTabs>*/}
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadStudent}
                loader={
                    <Box align={'center'} key={'allStudent'} pb={1} pt={1}>
                        <CircularProgress size={28} />
                    </Box>
                }
                pageStart={0}
            >
                {allExam.length ? (
                    <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        <Translate root={'all-exams/[id]'}>{'sl.no'}</Translate>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Translate root={'all-exams/[id]'}>{'examName'}</Translate>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Translate root={'all-exams/[id]'}>{'date'}</Translate>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Translate root={'all-exams/[id]'}>{'time'}</Translate>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Translate root={'all-exams/[id]'}>{'totalMark'}</Translate>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Translate root={'all-exams/[id]'}>{'no of questions'}</Translate>
                                    </TableCell>
                                    <TableCell align="center" />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allExam.map((each, index) => (
                                    <ExamTableView
                                        allExam={allExam}
                                        each={each}
                                        id={id}
                                        key={each._id}
                                        position={index}
                                        setAllExams={setAllExams}
                                        // type={type}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box
                        alignItems={'center'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        mt={5}
                    >
                        <Box mt={3} width={450}>
                            <Typography align={'center'} variant={'h3'}>
                                <Translate root={'all-exams/[id]'}>{'noExams'}</Translate>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </InfiniteScroll>
        </React.Fragment>
    );
};

export default AllExams;
