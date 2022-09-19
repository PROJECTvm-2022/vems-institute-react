import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import D1 from '../../../src/assets/DateOfJoining.svg';
import D2 from '../../../src/assets/TotalExams.svg';
import D3 from '../../../src/assets/TotalStudents.svg';
import D4 from '../../../src/assets/TotalQuestions.svg';
import moment from 'moment';
import {useUser} from "../../store/UserContext";

const useStyles = makeStyles((theme) => ({
    headerCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rootCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1),
        },
    },
    contentCard: {
        padding: theme.spacing(1),
    },
    viewAllButton: {
        fontSize: 13,
    },
    cardMain: {
        height: '160px',
    },
    viewButton: {
        borderRadius: '0px',
        color: theme.palette.common.white,
    },
    iconDiv: {
        width: '90px',
        height: '90px',
        borderRadius: '5px',
    },
    chapterIcon: {
        width: '100%',
        height: 'auto',
    },
    coursesButton: {
        background: theme.palette.common.white,
    },
    image: {
        height: '60px',
        width: '60px',
        marginRight: theme.spacing(1.5),
        borderRadius: '5px',
    },
    secondaryText: {
        lineHeight: '15px',
    },
}));

export default function DetailsRightProfile({ allDashBoardData }) {
    const [data] = useInstituteDetailsData();
    const [user] = useUser();
    const classes = useStyles();

    // console.log('data', user);
    return (
        <>
            <Paper className={classes.rootCard}>
                <Grid container spacing={2}>
                    <Grid item key={'key'} md={6} sm={12} xs={12}>
                        <Card
                            className={classes.cardMain}
                            elevation={0}
                            style={{ border: `1px solid ${user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary}` }}
                        >
                            <Box display={'flex'} flexDirection={'column'}>
                                <Box display={'flex'} height={'120px'}>
                                    <Box alignItems={'center'} display={'flex'} flex={3} justifyContent={'center'}>
                                        <Box
                                            alignItems={'center'}
                                            className={classes.iconDiv}
                                            display={'flex'}
                                            justifyContent={'center'}
                                            pt={0.9}
                                            style={{
                                                background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                            }}
                                        >
                                            <img alt={'Batch Icon'} src={D1} />
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} flex={5} flexDirection={'column'} justifyContent={'center'}>
                                        {/*<Typography className={classes.title} variant={'body2'}>*/}
                                        {/*    {'title'}*/}
                                        {/*</Typography>*/}
                                        {/*<Box mt={0.3} />*/}
                                        <Typography variant={'h3'}>{moment(user?.institute?.createdAt).format('LL')}</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    className={classes.viewButton}
                                    // component={Link}
                                    // href={}
                                    style={{
                                        background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                    }}
                                    variant={'contained'}
                                >
                                    {'Date of joining'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item key={'key'} md={6} sm={12} xs={12}>
                        <Card
                            className={classes.cardMain}
                            elevation={0}
                            style={{ border: `1px solid ${user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary}` }}
                        >
                            <Box display={'flex'} flexDirection={'column'}>
                                <Box display={'flex'} height={'120px'}>
                                    <Box alignItems={'center'} display={'flex'} flex={3} justifyContent={'center'}>
                                        <Box
                                            alignItems={'center'}
                                            className={classes.iconDiv}
                                            display={'flex'}
                                            justifyContent={'center'}
                                            pt={0.9}
                                            style={{
                                                background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                            }}
                                        >
                                            <img alt={'Batch Icon'} src={D2} />
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} flex={5} flexDirection={'column'} justifyContent={'center'}>
                                        {/*<Typography className={classes.title} variant={'body2'}>*/}
                                        {/*    {'title'}*/}
                                        {/*</Typography>*/}
                                        {/*<Box mt={0.3} />*/}
                                        <Typography variant={'h3'}>{allDashBoardData.totalStudentsAppeared}</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    className={classes.viewButton}
                                    // component={Link}
                                    // href={}
                                    style={{
                                        background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                    }}
                                    variant={'contained'}
                                >
                                    {'Total Students'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item key={'key'} md={6} sm={12} xs={12}>
                        <Card
                            className={classes.cardMain}
                            elevation={0}
                            style={{ border: `1px solid ${user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary}` }}
                        >
                            <Box display={'flex'} flexDirection={'column'}>
                                <Box display={'flex'} height={'120px'}>
                                    <Box alignItems={'center'} display={'flex'} flex={3} justifyContent={'center'}>
                                        <Box
                                            alignItems={'center'}
                                            className={classes.iconDiv}
                                            display={'flex'}
                                            justifyContent={'center'}
                                            pt={0.9}
                                            style={{
                                                background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                            }}
                                        >
                                            <img alt={'Batch Icon'} src={D3} />
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} flex={5} flexDirection={'column'} justifyContent={'center'}>
                                        {/*<Typography className={classes.title} variant={'body2'}>*/}
                                        {/*    {'title'}*/}
                                        {/*</Typography>*/}
                                        {/*<Box mt={0.3} />*/}
                                        <Typography variant={'h3'}>{allDashBoardData.totalExams}</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    className={classes.viewButton}
                                    // component={Link}
                                    // href={}
                                    style={{
                                        background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                    }}
                                    variant={'contained'}
                                >
                                    {'Total Exams'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item key={'key'} md={6} sm={12} xs={12}>
                        <Card
                            className={classes.cardMain}
                            elevation={0}
                            style={{ border: `1px solid ${user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary}` }}
                        >
                            <Box display={'flex'} flexDirection={'column'}>
                                <Box display={'flex'} height={'120px'}>
                                    <Box alignItems={'center'} display={'flex'} flex={3} justifyContent={'center'}>
                                        <Box
                                            alignItems={'center'}
                                            className={classes.iconDiv}
                                            display={'flex'}
                                            justifyContent={'center'}
                                            pt={0.9}
                                            style={{
                                                background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                            }}
                                        >
                                            <img alt={'Batch Icon'} src={D4} />
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} flex={5} flexDirection={'column'} justifyContent={'center'}>
                                        {/*<Typography className={classes.title} variant={'body2'}>*/}
                                        {/*    {'title'}*/}
                                        {/*</Typography>*/}
                                        {/*<Box mt={0.3} />*/}
                                        <Typography variant={'h3'}>{allDashBoardData.totalQuestions}</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    className={classes.viewButton}
                                    // component={Link}
                                    // href={}
                                    style={{
                                        background: user && user?.institute?.colorCode && user && user?.institute?.colorCode?.primary,
                                    }}
                                    variant={'contained'}
                                >
                                    {'Total Questions'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}
