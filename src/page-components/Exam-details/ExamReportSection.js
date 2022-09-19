/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 08/04/21 02:34 PM
 */

import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import useHandleError from '../../hooks/useHandleError';
import { ExamReportService } from '../../apis/rest.app';
import GradeImage from '../../assets/GradeImg.svg';
import PercentageImage from '../../assets/percentage.svg';
import Divider from '@material-ui/core/Divider';
import ReportSkeleton from '../../components/Skeleton/ReportSkeleton';

// const useStyle = makeStyles((theme) => ({
//     divider: {
//         background: theme?.palette?.divider2,
//     },
//     mainCard: {
//         border: `1px solid ${theme?.palette?.background?.cropper}`,
//         background: theme?.palette?.background?.other,
//     },
//     blueCard: {
//         background: 'linear-gradient(180deg, #037FFB 0%, #54A9FF 100%)',
//         borderRadius: '5px',
//     },
//     mainCardImage: {
//         width: '40px',
//         height: '40px',
//     },
//     title: {
//         letterSpacing: 0.5,
//         fontWeight: 500,
//         fontSize: '19px',
//     },
//     subTitle: {
//         letterSpacing: 0.5,
//         fontWeight: 700,
//         fontSize: '25px',
//     },
//     secondaryCard: {
//         border: `1px solid ${theme?.palette?.background?.other}`,
//     },
//     secondaryCardHead: {
//         color: '#fff',
//     },
// }));

const ExamReportSection = () => {
    // const classes = useStyle();
    const Router = useRouter();
    const handleError = useHandleError();

    const { id: examId } = Router.query;
    console.log('Router.query',Router.query);

    const [allGrades, setAllGrades] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        ExamReportService.find({
            query: {
                scheduledExam: examId,
            },
        })
            .then((res) => {
                console.log('response',res);
                setAllGrades(res);
                setLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                setLoading(false);
            });
    }, []);

    const gradeColor = ['#373737', '#003760', '#35931D', '#938E1D', '#FFB800', '#FC8415', '#C73414'];

    const data = [
        {
            id: 1,
            title: 'Average Marks',
            image: GradeImage,
            value: `${allGrades.averageScore}`,
        },
        {
            id: 2,
            title: 'Average percentage',
            image: PercentageImage,
            value: `${allGrades.averagePercentage}%`,
        },
    ];

    return (
        <React.Fragment>
            {allGrades?.gradeReports?.length ? (
                <React.Fragment>
                    <Grid container spacing={2}>
                        {data.map((each) => (
                            <Grid item key={each.id} md={6} sm={6} xs={12}>
                                <Card
                                    // className={classes.mainCard}
                                    style={{
                                        border: `1px solid ${theme?.palette?.background?.cropper}`,
                                        background: theme?.palette?.background?.other,
                                    }}
                                    elevation={0}>
                                    <Box display={'flex'} m={2}>
                                        <Box
                                            alignItem={'center'}
                                            // className={classes.blueCard}
                                            style={{
                                                background: 'linear-gradient(180deg, #037FFB 0%, #54A9FF 100%)',
                                                borderRadius: '5px',
                                            }}
                                            display={'flex'}
                                            justifyContent={'center'}
                                            p={2}
                                        >
                                            <img
                                                alt={'GradeImage'}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                                // className={classes.mainCardImage}
                                                src={each.image}
                                            />
                                        </Box>
                                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} ml={3}>
                                            <Typography
                                                // className={classes.title}
                                                style={{
                                                    letterSpacing: 0.5,
                                                    fontWeight: 500,
                                                    fontSize: '19px',
                                                }}
                                                color={'textSecondary'}
                                                variant={'h4'}
                                            >
                                                {each.title}
                                            </Typography>
                                            <Box mt={0.4} />
                                            <Typography
                                                // className={classes.subTitle}
                                                style={{
                                                    letterSpacing: 0.5,
                                                    fontWeight: 700,
                                                    fontSize: '25px',
                                                }}
                                                variant={'h3'}>
                                                {each.value}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={3} />
                    <Divider
                        // className={classes?.divider}
                        style={{
                            background: rgba(0, 0, 0, 0.12),
                        }}
                    />
                    <Box mt={3} />
                    <Grid container justify="center" spacing={2}>
                        {allGrades?.gradeReports.map((each, index) => (
                            <Grid item key={each.grade} md={3} sm={6} xs={12}>
                                <Card
                                    className={classes.secondaryCard}
                                    style={{
                                        border: `1px solid '#F3F3F3'`,
                                    }}
                                    elevation={0}>
                                    <Box
                                        alignItems={'center'}
                                        // className={classes.secondaryCardHead}
                                        display={'flex'}
                                        height={'48px'}
                                        justifyContent={'center'}
                                        style={{
                                            background: `${gradeColor[index]}`,
                                            color: '#fff',
                                        }}
                                        width={'100%'}
                                    >
                                        <Typography
                                            // className={classes.title}
                                            style={{
                                                letterSpacing: 0.5,
                                                fontWeight: 500,
                                                fontSize: '19px',
                                            }}
                                            color={'inherit'} variant={'h4'}>
                                            {`Grade ${each.grade}`}
                                        </Typography>
                                    </Box>
                                    <Box p={1}>
                                        <Box display={'flex'}>
                                            <Box flex={1} p={1}>
                                                <Typography align={'center'} color={'textSecondary'} variant={'body2'}>
                                                    {'No. of Students'}
                                                </Typography>
                                            </Box>
                                            <Divider
                                                // className={classes?.divider}
                                                style={{
                                                    background: rgba(0, 0, 0, 0.12),
                                                }}
                                                flexItem orientation="vertical"
                                            />
                                            <Box flex={1} p={1}>
                                                <Typography align={'center'} color={'textSecondary'} variant={'body2'}>
                                                    {'Percentage of Students'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box display={'flex'} mt={-1}>
                                            <Box flex={1} p={1}>
                                                <Typography
                                                    align={'center'}
                                                    // className={classes.subTitle}
                                                    style={{
                                                        letterSpacing: 0.5,
                                                        fontWeight: 700,
                                                        fontSize: '25px',
                                                    }}
                                                    variant={'h3'}
                                                >
                                                    {each.students}
                                                </Typography>
                                            </Box>
                                            <Divider
                                                // className={classes?.divider}
                                                style={{
                                                    background: rgba(0, 0, 0, 0.12),
                                                }}
                                                flexItem orientation="vertical" />
                                            <Box flex={1} p={1}>
                                                <Typography
                                                    align={'center'}
                                                    // className={classes.subTitle}
                                                    style={{
                                                        letterSpacing: 0.5,
                                                        fontWeight: 700,
                                                        fontSize: '25px',
                                                    }}
                                                    variant={'h3'}
                                                >
                                                    {each.percentage}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </React.Fragment>
            ) : !loading ? (
                <Box display={'flex'} justifyContent={'center'} m={3}>
                    <Typography variant={'h2'}>{'Exam not conducted'}</Typography>
                </Box>
            ) : (
                <ReportSkeleton />
            )}
        </React.Fragment>
    );
};

export default ExamReportSection;
