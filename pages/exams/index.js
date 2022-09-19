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
import Translate from '../../src/components/Translate';
import FilterComponent from '../../src/page-components/exam/FilterComponent';
import { ExamService } from '../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import { useLanguage } from '../../src/store/LanguageStore';
import ExamTableView from '../../src/page-components/exam/ExamTableView';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';
import TableSkeleton from '../../src/components/Skeleton/TableSkeleton';
import { useUser } from '../../src/store/UserContext';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExamAddDialog from '../../src/page-components/exam/ExamAddDialog';
import { withExamCreateData } from '../../src/store/ExamCreateContext';

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
}));

// const color = ['yellow', 'orange', 'green', 'rgb(90,62,167)'];
// const [colorType, setColorType] = useState(0);
const AntTabs = withStyles({
    indicator: {
        backgroundColor: '#118ab2',
    },
})(Tabs);

const AntTab = withStyles(() => ({
    root: {
        background: '#fff',
        borderRadius: '5px 5px 0px 0px',
        width: '100%',
    },
    selected: { color: '#118ab2', background: '#fff' },
}))((props) => <Tab disableRipple {...props} />);

const Exam = () => {
    const Language = useLanguage('exams');
    const classes = useStyle();
    const [dialogValue, setDialogValue] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [course, setCourse] = useState(null);

    const [allExam, setAllExams] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [tableOpen, setTableOpen] = useState(false);
    const [type, setType] = useState(1);
    const [user] = useUser();
    const [subject, setSubject] = useState(null);
    const [startTimeAndDate, setStartTimeAndDate] = useState('');
    const [endTimeAndDate, setEndTimeAndDate] = useState('');

    const date1 = new Date(startTimeAndDate);
    const milliseconds1 = date1.getTime();
    const date2 = new Date(endTimeAndDate);
    const milliseconds2 = date2.getTime();

    // console.log('type', type);
    const query = {
        entityType: 'exam',
        status: type !== 4 ? type : ['4', '5'],
        $skip: allExam.length,
        $limit: 10,
        $sort: {
            createdAt: -1,
        },
        $populate: ['course', 'subject'],
    };
    const query2 = {
        status: type,
        $skip: allExam.length,
        $limit: 10,
        $sort: {
            createdAt: -1,
        },
        $populate: ['course', 'subject'],
    };
    if (search)
        query.title = {
            $regex: `.*${search}*.`,
            $options: 'i',
        };
    if (course) query.course = course?.course?._id;
    if (subject) query.syllabus = subject?._id;
    if (startTimeAndDate !== '' && endTimeAndDate !== '') {
        query.scheduledOn = {
            $gte: milliseconds1,
            $lte: milliseconds2,
        };
    }
    const LoadInst = () => {
        let _query = type > 1 ? query : query2;
        setLoading(true);
        ExamService.find({
            query: _query,
        })
            .then((response) => {
                // console.log('response',response.data);
                // console.log('query',_query);
                const { data, total } = response;
                const result = [...allExam, ...data];
                setHasMore(result.length < total);
                setAllExams(result);
                setLoading(false);
                // setStartTimeAndDate('');
                // setEndTimeAndDate('');
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setLoading(false);
                setHasMore(false);
            });
    };

    useEffect(() => {
        LoadInst();
    }, []);

    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }

    const handleChangeDialogValue = (event, newValue) => {
        // console.log('newValue',newValue);
        setDialogValue(newValue);
        // setColorType(newValue);
        setType(newValue + 1);
        setAllExams([]);
        setHasMore(true);
        // setStartTimeAndDate('');
        // setEndTimeAndDate('');
    };

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'exams'}>{'title'}</Translate>
                        </Typography>
                        <Box alignItems={'center'} display={'flex'}>
                            <Button
                                color="primary"
                                disabled={loading}
                                onClick={() => {
                                    setTableOpen(true);
                                }}
                                size="small"
                                variant="contained"
                            >
                                {loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <Translate root={'all-exams'}>{'Add Exams'}</Translate>
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <FilterComponent setAllExams={setAllExams} setHasMore={setHasMore} setSearch={setSearch} />
            <Box mt={2} />
            <AntTabs aria-label="disabled tabs example" onChange={handleChangeDialogValue} value={dialogValue}>
                <AntTab label="Drafted" {...a11yProps(0)} />
                <AntTab label="Scheduled" {...a11yProps(1)} />
                <AntTab label="Ongoing" {...a11yProps(3)} />
                <AntTab label="Completed" {...a11yProps(2)} />
            </AntTabs>
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadInst}
                loader={
                    <Box align={'center'} key={'allStudent'} pb={1} pt={1}>
                        <TableSkeleton />
                    </Box>
                }
                pageStart={0}
            >
                {allExam.length ? (
                    <div className={classes.mainDiv}>
                        <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                            <Table style={{ minWidth: '1200px' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Translate root={'exams'}>{'Title'}</Translate>
                                        </TableCell>
                                        {type !== 1 && (
                                            <TableCell align="center">
                                                <Translate root={'exams'}>{'Date'}</Translate>
                                            </TableCell>
                                        )}
                                        {type !== 1 && (
                                            <TableCell align="center">
                                                <Translate root={'exams'}>{'Time'}</Translate>
                                            </TableCell>
                                        )}

                                        <TableCell align="center">
                                            <Translate root={'exams'}>{'No Of Questions'}</Translate>
                                        </TableCell>
                                        <TableCell align="center" />
                                        <TableCell align="center" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allExam.map((each, index) => (
                                        <ExamTableView
                                            allExam={allExam}
                                            each={each}
                                            key={each._id}
                                            position={index}
                                            setAllExams={setAllExams}
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
                        mt={5}
                    >
                        <Box mt={3} width={450}>
                            <Typography align={'center'} variant={'h3'}>
                                <Translate root={'exams'}>{'noExams'}</Translate>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </InfiniteScroll>
            <ExamAddDialog
                allExam={allExam}
                setAllExams={setAllExams}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
        </React.Fragment>
    );
};

export default withExamCreateData(Exam);
