import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import D1 from '../../src/assets/Group.png';
import D2 from '../../src/assets/Group 746.png';
import D3 from '../../src/assets/Polygon 16.png';
import D5 from '../../src/assets/Union.png';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
// import Translate from '../src/components/Translate';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import { ExamService, startEndClassService, TeacherDashBoardService } from '../../src/apis/rest.app';
import Skeleton from '@material-ui/lab/Skeleton';
import Translate from '../../src/components/Translate';
import { useSnackbar } from 'notistack';
import ExamTableView from '../../src/page-components/exam/ExamTableView';
import InfiniteScroll from 'react-infinite-scroller';
import { useLanguage } from '../../src/store/LanguageStore';
import { useRouter } from 'next/router';
import TableSkeleton from '../../src/components/Skeleton/TableSkeleton';
import Button from '@material-ui/core/Button';
import Link from '../../src/components/Link';
import moment from 'moment/moment';
import TableSkeletonForDashBoard from '../../src/components/Skeleton/TableSkeletonForDashBoard';
import { useUser } from '../../src/store/UserContext';
import Loader from '../../src/components/loaders/Loader';

const useStyle = makeStyles(() => ({
    image: {
        height: '100%',
        width: '-webkit-fill-available',
        marginBottom: 40,
        marginTop: 40,
    },
    imageInMd: {
        height: 'auto',
        width: '50%',
        marginBottom: 10,
    },
    mainCard: {
        background: '#FFE3E0',
        height: '70px',
        width: '70px',
        borderRadius: 5,
    },
    img: {
        marginBottom: '-6px',
    },
    icon: {
        color: '#fff',
        width: 40,
        marginRight: 10,
        height: 40,
        marginLeft: 5,
    },
    typo: {
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#EA4335',
        '&:hover': {
            background: '#EA4335',
        },
    },
    link: {
        color: 'red',
    },
    typography: {
        fontWeight: 700,
        fontSize: '22px',
    },
}));

export default function Index() {
    const Router = useRouter();
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [allExam, setAllExams] = useState([]);
    const [allDashBoardData, setAllDashboardData] = useState('');
    const [loading, setLoading] = useState(false);
    const Language = useLanguage('');
    const [user] = useUser();
    const [mainLoading, setMainLoading] = useState(true);

    useEffect(() => {
        setMainLoading(true);
        if (user?.role === 1) {
            Router.push('/student-dashboard');
        } else {
            if (user?.role === 128) {
                Router.push('/');
            } else {
                setMainLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        if (mainLoading) return;
        setLoading(true);
        TeacherDashBoardService.find()
            .then((res) => {
                setAllDashboardData(res);
                setLoading(false);
            })
            .catch(() => {
                enqueueSnackbar('Something went wrong', {
                    variant: 'error',
                });
                setLoading(false);
            });
    }, [mainLoading]);
    const card = [
        {
            img: D1,
            title: 'Total Classes',
            count: allDashBoardData?.totalClasses,
            href: '/teacher-subject',
        },
        {
            img: D2,
            title: 'Total Exams',
            count: allDashBoardData?.totalExams,
            href: '/teacher-subject',
        },
        {
            img: D3,
            title: 'Total Subjects',
            count: allDashBoardData?.totalSubjects,
            href: '/teacher-subject',
        },
        {
            img: D5,
            title: 'UpComing Classes',
            count: allDashBoardData?.upComingClasses?.length,
            href: '/teacher-subject',
        },
    ];

    const goToTHePage = (each) => {
        Router.push(each?.href);
    };

    const toExamPage = () => {
        Router.push('/exams');
    };

    const query = {
        entityType: 'exam',
        status: 2,
        $skip: allExam.length,
        $limit: 10,
        $populate: ['course', 'subject'],
    };
    const LoadExam = () => {
        setLoading(true);
        ExamService.find({
            query,
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...allExam, ...data];
                setHasMore(result.length < total);
                setAllExams(result);
                setLoading(false);
            })
            .catch(() => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setLoading(false);
            });
    };

    const [attendanceData, setAttendanceData] = useState([]);
    const [loadingClass, setLoadingClass] = useState(false);

    useEffect(() => {
        setLoadingClass(true);
        startEndClassService
            .find({
                query: {
                    $populate: ['course', 'subject', 'syllabus', 'teacher'],
                    status: { $in: [1, 2] },
                },
            })
            .then((response) => {
                setAttendanceData(response);
                setLoadingClass(false);
            })
            .catch(() => {})
            .finally(() => {
                setLoadingClass(false);
            });
    }, []);

    return (
        <React.Fragment>
            {!mainLoading ? (
                <>
                    <Grid container spacing={2}>
                        {card.map((each) => (
                            <Grid item key={each} md={3} sm={6} xs={12}>
                                <Paper>
                                    <Box display={'flex'} p={1} style={{ cursor: 'pointer' }}>
                                        <Box
                                            alignItems={'center'}
                                            className={classes.mainCard}
                                            display={'flex'}
                                            justifyContent={'center'}
                                            onClick={() => {
                                                goToTHePage(each);
                                            }}
                                        >
                                            <img alt={'each.img'} className={classes.img} src={each.img} />
                                        </Box>
                                        <Box m={1}>
                                            <Box>
                                                <Typography color={'textSecondary'} style={{ fontWeight: 500 }}>
                                                    {each.title}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                {each?.count ? (
                                                    <Typography className={classes.typography}>{each.count}</Typography>
                                                ) : loading ? (
                                                    <Skeleton animation="wave" />
                                                ) : (
                                                    <Typography className={classes.typography}>{'0'}</Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Typography variant={'h4'}>{'All Scheduled Exams'}</Typography>
                                <Button className={classes.link} onClick={toExamPage}>
                                    {'View All'}
                                </Button>
                            </Box>
                            <InfiniteScroll
                                hasMore={hasMore}
                                loadMore={LoadExam}
                                loader={
                                    <Box align={'center'} key={'allStudent'} pb={1} pt={1}>
                                        <TableSkeleton />
                                    </Box>
                                }
                                pageStart={0}
                            >
                                {allExam?.length ? (
                                    <div>
                                        <TableContainer
                                            bgcolor={'common.white'}
                                            borderRadius={'borderRadius'}
                                            component={Box}
                                            p={1}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="left">
                                                            <Translate>{'ExamName'}</Translate>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Translate>{'Course'}</Translate>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Translate>{'Subject'}</Translate>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Translate>{'Assigned Teacher'}</Translate>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Translate>{'No of questions'}</Translate>
                                                        </TableCell>
                                                        <TableCell align="left" />
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {/*{allExam?.length ? (*/}
                                                    {allExam?.map((each, index) => (
                                                        <ExamTableView
                                                            allExam={allExam}
                                                            each={each}
                                                            key={each._id}
                                                            position={index}
                                                            setAllExams={setAllExams}
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
                                                <Translate root={'all-exams/[id]'}>{'No Exams'}</Translate>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </InfiniteScroll>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            {attendanceData ? (
                                <Paper>
                                    <TableContainer
                                        bgcolor={'common.white'}
                                        borderRadius={'borderRadius'}
                                        component={Box}
                                        p={1}
                                        style={{ minWidth: 0 }}
                                    >
                                        <Box display={'flex'} justifyContent={'space-between'} mb={1}>
                                            <Typography>{'All Scheduled Classes'}</Typography>
                                            <Typography
                                                className={classes.link}
                                                component={Link}
                                                href={'/teacher-attendance'}
                                            >
                                                {'View All'}
                                            </Typography>
                                        </Box>

                                        <Table style={{ minWidth: 0 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">{'Subject'}</TableCell>
                                                    <TableCell align="center">{'Teacher '}</TableCell>
                                                    <TableCell align="center">{'Date'}</TableCell>
                                                    <TableCell align="center">{'Time'}</TableCell>
                                                    <TableCell align="center">{'Attended Students'}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {attendanceData &&
                                                    attendanceData?.map(
                                                        (each, index) =>
                                                            index < 5 && (
                                                                <TableRow key={each?.name}>
                                                                    <TableCell
                                                                        align={'center'}
                                                                        component="th"
                                                                        scope="row"
                                                                    >
                                                                        {each?.subject?.name}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align={'center'}
                                                                        component="th"
                                                                        scope="row"
                                                                    >
                                                                        {each?.teacher?.name}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align={'center'}
                                                                        component="th"
                                                                        scope="row"
                                                                    >
                                                                        {moment(each?.scheduledAt).format('YYYY-MM-DD')}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align={'center'}
                                                                        component="th"
                                                                        scope="row"
                                                                    >
                                                                        {moment(each?.scheduledAt).format('h:mm:ss a')}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align={'center'}
                                                                        component="th"
                                                                        scope="row"
                                                                    >
                                                                        {each?.totalAttendances
                                                                            ? each?.totalAttendances
                                                                            : '0'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                    )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            ) : loadingClass ? (
                                <TableSkeletonForDashBoard />
                            ) : (
                                <Typography>{'No Classes Found'}</Typography>
                            )}
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Loader />
            )}
        </React.Fragment>
    );
}
