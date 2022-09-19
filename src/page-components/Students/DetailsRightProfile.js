import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Button, Typography } from '@material-ui/core/index';
import Translate from '../../components/Translate';
import Grid from '@material-ui/core/Grid';
import CardImage from '../../../public/back_course.png';
import { StudentProfileService, StudentSubjectService } from '../../apis/rest.app';
import Card from '@material-ui/core/Card';
import BatchIcon from '../../assets/BatchIcon.svg';
import StudentIcon from '../../assets/StudentIcon.svg';
import ClassIcon from '../../assets/ClassIcon.svg';
import useHandleError from '../../hooks/useHandleError';
import CourseSkeleton from '../../components/Skeleton/CourseSkeleton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useLanguage } from '../../store/LanguageStore';
import { useRouter } from 'next/router';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    headerCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: theme.spacing(0, 1),
    },
    rootCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    contentCard: {
        padding: theme.spacing(0, 1, 2, 1),
    },
    viewAllButton: {
        fontSize: 13,
    },
    subjectCard: {
        height: 120,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(47, 0, 0, 0.5)',
        backdropFilter: 'blur(6px)',
        borderRadius: 5,
        color: 'white',
    },
    grids: {
        backgroundImage: `url(${CardImage})`,
        backgroundSize: 'cover',
        height: 120,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
        borderRadius: 5,
    },
    cardMain: {
        height: '130px',
        border: `1px solid ${theme.palette.primary.main}`,
    },
    viewButton: {
        borderRadius: '0px',
    },
    iconDiv: {
        width: '50px',
        height: '50px',
        borderRadius: '5px',
        background: theme.palette.primary.main,
    },
    title: {
        fontSize: '20px',
        fontWeight: 500,
        color: theme.palette.text.other,
    },
    chapterIcon: {
        width: '100%',
        height: 'auto',
    },
    coursesButton: {
        background: theme.palette.common.white,
    },
    courseDesc: {
        color: theme.palette.text.other,
    },
}));

export default function DetailsRightProfile({ setSubjects, subjects, setStudentProfileData, studentProfileData }) {
    const classes = useStyles();
    const handleError = useHandleError();
    const Language = useLanguage('students/[id]');
    const Router = useRouter();
    const { id } = Router.query;
    const [subjectLoading, setSubjectLoading] = useState(true);

    const LoadSubject = () => {
        setSubjectLoading(true);
        StudentSubjectService.find({
            query: {
                $populate: ['subject', 'course'],
                student: id,
            },
        })
            .then((res) => {
                setSubjects(res);
            })
            .catch((error) => {
                handleError()(error);
            })
            .finally(() => {
                setSubjectLoading(false);
            });
    };

    useEffect(() => {
        LoadSubject();
    }, []);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        StudentProfileService.find({
            query: {
                student: id,
            },
        })
            .then((res) => {
                setStudentProfileData(res);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const card = [
        {
            id: 1,
            title: <Translate root={'students/[id]'}>{'details.classesAttended'}</Translate>,
            icon: BatchIcon,
            value: studentProfileData?.attendedClasses,
            link: `/Student-live-class/${id}`,
        },
        {
            id: 2,
            title: <Translate root={'students/[id]'}>{'details.attendance'}</Translate>,
            icon: StudentIcon,
            value: studentProfileData?.attendancePercentage + '%',
            link: '/',
        },
        {
            id: 3,
            title: <Translate root={'students/[id]'}>{'details.upcomingClasses'}</Translate>,
            icon: ClassIcon,
            value: studentProfileData?.upcomingLiveClasses,
            link: `/Student-live-class/${id}`,
        },
        {
            id: 4,
            title: <Translate root={'exams/[id]'}>{'Avg. exams percentage '}</Translate>,
            icon: ClassIcon,
            value: studentProfileData?.averagePercentage + '%',
            link: `/all-exams/${id}`,
        },
    ];

    const goToThePage = (each) => {
        Router.push(each?.link);
    };

    return (
        <>
            <Paper className={classes.rootCard}>
                <Grid container spacing={2}>
                    {card.map((each) => (
                        <Grid item key={each.id} md={3} sm={12} xs={12}>
                            <Card
                                className={classes.cardMain}
                                elevation={0}
                                onClick={() => {
                                    goToThePage(each);
                                }}
                            >
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Box display={'flex'} height={'90px'}>
                                        <Box alignItems={'center'} display={'flex'} flex={3} justifyContent={'center'}>
                                            <Box
                                                alignItems={'center'}
                                                className={classes.iconDiv}
                                                display={'flex'}
                                                justifyContent={'center'}
                                                pt={0.9}
                                            >
                                                <img alt={'Batch Icon'} src={each.icon} />
                                            </Box>
                                        </Box>
                                        <Box
                                            display={'flex'}
                                            flex={5}
                                            flexDirection={'column'}
                                            justifyContent={'center'}
                                        >
                                            <Typography className={classes.title} variant={'body2'}>
                                                {each.title}
                                            </Typography>
                                            <Box mt={0.3} />
                                            {loading ? (
                                                <Skeleton variant="text" width={50} />
                                            ) : (
                                                <Typography variant={'h3'}>{each.value}</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Button className={classes.viewButton} color={'primary'} variant={'contained'}>
                                        <Translate root={'students/[id]'}>{'details.viewDetails'}</Translate>
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box className={classes.headerCard} mb={1} mt={2}>
                    <Typography variant={'h4'}>
                        <Translate root={'students/[id]'}>{'details.subjects'}</Translate>
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {subjects.length ? (
                        <>
                            {subjects.map((each) => (
                                <Grid item key={each._id} md={3} sm={6} xs={12}>
                                    <Card>
                                        <Box display={'flex'} flexDirection={'column'}>
                                            <img
                                                alt={'Course Background Img'}
                                                className={classes.chapterIcon}
                                                src={each && each.subject && each.subject.avatar}
                                            />
                                            <Card className={classes.coursesButton} component={Box} mt={-8}>
                                                <List component={Box} dense m={-0.6}>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    {each && each.subject && each.subject.name}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    className={classes.courseDesc}
                                                                    variant="subtitle2"
                                                                >
                                                                    {Language.get('details.course') + ': '}
                                                                    {each && each.course && each.course.name}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                </List>
                                            </Card>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </>
                    ) : subjectLoading ? (
                        <Box align={'center'} key={'allInstitute'} mt={1} width={'100%'}>
                            <CourseSkeleton />
                        </Box>
                    ) : (
                        <Box m={1} mt={2}>
                            <Typography variant={'subtitle2'}>
                                <Translate root={'students/[id]'}>{'details.noSubjects'}</Translate>
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Paper>
        </>
    );
}
