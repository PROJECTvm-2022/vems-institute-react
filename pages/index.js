import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import D1 from '../src/assets/TotalInstitutions.svg';
import D2 from '../src/assets/TotalExams.svg';
import D3 from '../src/assets/TotalStudents.svg';
import D5 from '../src/assets/TotalQuestions.svg';
import {InstituteDashboardExamService, InstituteDashboardService} from '../src/apis/rest.app';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../src/store/LanguageStore';
import { useRouter } from 'next/router';
import { useUser } from '../src/store/UserContext';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { Chart } from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {useTheme} from "@material-ui/styles";

const useStyle = makeStyles((theme) => ({
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
        background: theme.palette.primary.main,
        height: '90px',
        width: '90px',
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
}));

export default function Index() {

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const classes = useStyle();
    const Router = useRouter();
    const [allDashBoardData, setAllDashboardData] = useState('');
    const [allDashBoardStatistics, setAllDashboardStatistics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = React.useState(0);
    const [user] = useUser();
    const [from, setFrom] = React.useState(moment().subtract(7, 'days').toDate());
    const [to, setTo] = React.useState(moment().toDate());

    const lineData = {
        labels: allDashBoardStatistics?.map((each) => moment(each?.day).format('DD MMM YYYY')),
        datasets: [
            {
                label: 'Exams',
                fill: true,
                lineTension: 0.1,
                backgroundColor: '#118ab2',
                borderColor: '#118ab2',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: theme?.palette?.primary?.main,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: allDashBoardStatistics?.map((each) => each?.totalExams),
            },
        ],
    };

    // useEffect(() => {
    //     if (user?.role === 128) {
    //         Router.push('/login');
    //     } else if (user?.role === 8) {
    //         Router.push('/login');
    //     } else if (user?.role === 1) {
    //         Router.push('/login');
    //     } else {
    //         return true;
    //     }
    // }, [user]);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        InstituteDashboardService.find()
            .then((res) => {
                setAllDashboardData(res);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setLoading(false);
            });
    }, []);

    const DashboardExam = () => {
        InstituteDashboardExamService.find({
            query: {
                from: from,
                to: to,
            },
        })
            .then((res) => {
                setAllDashboardStatistics(res);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setLoading(false);
            });
    };
    useEffect(() => {
        DashboardExam();
    }, [from, to]);

    // console.log(allDashBoardData);

    const card = [
        {
            img: D1,
            title: 'Established On',
            count: moment(user?.createdAt).format('DD MMM YYYY'),
        },
        {
            img: D2,
            title: 'Total Exams',
            count: allDashBoardData?.totalExams,
        },
        {
            img: D3,
            title: 'Students Appeared',
            count: allDashBoardData?.totalStudentsAppeared,
        },
        {
            img: D5,
            title: 'Total Questions',
            count: allDashBoardData?.totalQuestions,
        },
    ];

    // const goToAPAge = () => {
    //     Router.push('/login');
    // };

    return (
        <React.Fragment>
            {/*{'Dashboard'}*/}
            <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                        {card.map((each) => (
                            <Grid item key={each} md={6} sm={6} xs={12}>
                                <Paper>
                                    <Box display={'flex'} p={1}>
                                        <Box
                                            alignItems={'center'}
                                            className={classes.mainCard}
                                            display={'flex'}
                                            justifyContent={'center'}
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
                                                    <Typography style={{ fontWeight: 700, fontSize: '22px' }}>
                                                        {each.count}
                                                    </Typography>
                                                ) : loading ? (
                                                    <Skeleton animation="wave" />
                                                ) : (
                                                    <Typography style={{ fontWeight: 700, fontSize: '22px' }}>
                                                        {'0'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Paper component={Box} height={'auto'}>
                        <Box p={3}>
                            <Box alignItems={'center'} display={'flex'} flexDirection={'column'}>
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    width={'100%'}
                                >
                                    <Typography className={classes.graphText}> Day Wise Exam</Typography>
                                    <Box alignItems={'center'} display={'flex'}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justifyContent="space-around">
                                                <KeyboardDatePicker
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    format="MM/dd/yyyy"
                                                    id="date-picker-inline"
                                                    label="From"
                                                    margin="normal"
                                                    onChange={(date) => {
                                                        setFrom(date);
                                                    }}
                                                    value={from}
                                                />
                                                <Box mr={2} />
                                                <KeyboardDatePicker
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    format="MM/dd/yyyy"
                                                    id="date-picker-inline"
                                                    label="To"
                                                    margin="normal"
                                                    onChange={(date) => {
                                                        setTo(date);
                                                    }}
                                                    value={to}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    </Box>
                                </Box>
                            </Box>
                            {allDashBoardStatistics.length > 0 && (
                                <Box mt={2}>
                                    <Line data={lineData} height={'auto'} legend={false} type={'line'} width={439} />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
