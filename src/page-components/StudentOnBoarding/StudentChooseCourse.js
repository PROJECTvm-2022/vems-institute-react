/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Student onBoarding (Choose Course step 3)
 * @createdOn 11/01/21 12:16 AM
 */

import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import VectorImage from '../../assets/StudentSelectCourseOnBoarding.svg';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import CourseAutoComplete from '../../components/CourseAutoComplete';
import Chip from '@material-ui/core/Chip';
import {
    CoursesService,
    InstituteCoursesService,
    StudentSeatService,
    UserInstituteAccessService,
} from '../../apis/rest.app';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStudentOnBoardingData } from '../../store/StudentOnBoardingContext';
import PropTypes from 'prop-types';
import InstituteCourseAutoComplete from '../../components/InstituteCourseAutoComplete';
import { useRouter } from 'next/router';

const useStyle = makeStyles((theme) => ({
    main: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(8),
        },
        [theme.breakpoints.down('xs')]: {
            paddingTop: theme.spacing(4),
            padding: theme.spacing(1),
        },
    },
    image: {
        width: 'auto',
        height: '100%',
        [theme.breakpoints.down('md')]: {
            width: '90%',
            height: 'auto',
        },
        [theme.breakpoints.down('sm')]: {
            width: '70%',
        },
    },
    gridContainer: {
        alignItems: 'center',
    },
    detailDiv: {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        [theme.breakpoints.down('xs')]: {
            width: '95%',
        },
    },
    title: {
        color: theme.palette.background.secondary,
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(0),
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(2),
        },
    },
    description: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    activeChip: {
        width: '100%',
        borderRadius: '4px',
        height: '43px',
    },
    courseList: {
        height: '270px',
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
}));

const StudentChooseCourse = ({ setActiveStep }) => {
    const classes = useStyle();

    StudentChooseCourse.propTypes = {
        setActiveStep: PropTypes.any.isRequired,
    };

    const [data, setData] = useStudentOnBoardingData();

    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const [loading, setLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(true);

    const [courseList, setCourseList] = useState([]);
    const Router = useRouter();
    const [selectedCourse, setSelectedCourse] = useState({});

    useEffect(() => {
        InstituteCoursesService.find({
            query: {
                $limit: 5,
                institute: data && data.institute,
            },
        })
            .then((response) => {
                setCourseList([...response.data]);
                setCourseLoading(false);
            })
            .catch(() => {
                setCourseLoading(false);
            });
    }, []);

    const handleSelectChip = (each) => {
        if (selectedCourse._id === each._id) setSelectedCourse({});
        else setSelectedCourse(each);
    };

    const validate = () => {
        if (!selectedCourse) {
            enqueueSnackbar(Language.get('student-onboarding.chooseCourse.error.courseRequired'), {
                variant: 'error',
            });
            return false;
        } else {
            return true;
        }
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            // setData({
            //     ...data,
            //     instituteCourse: selectedCourse._id,
            // });
            // setTimeout(() => {
            //     setActiveStep(3);
            //     enqueueSnackbar(Language.get('student-onboarding.chooseCourse.success.courseAdded'), {
            //         variant: 'success',
            //     });
            //     setLoading(false);
            // }, 500);
            StudentSeatService.create({
                instituteCourse: selectedCourse._id,
                type: 2,
            })
                .then(() => {
                    enqueueSnackbar(Language.get('student-onboarding.chooseSpecialization.success.courseAdded'), {
                        variant: 'success',
                    });
                    setLoading(false);
                    Router.replace('/pending');
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('error.500'), {
                        variant: 'error',
                    });
                    setLoading(false);
                });
        }
    };

    return (
        <Grid container spacing={0}>
            <Grid className={classes.main} item md={6} sm={12} xs={12}>
                <img alt={'Vector image'} className={classes.image} src={VectorImage} />
            </Grid>
            <Grid
                className={classes.gridContainer}
                component={Box}
                display={'flex'}
                flexDirection={'column'}
                item
                md={6}
                sm={12}
                xs={12}
            >
                <Box className={classes.detailDiv}>
                    <Typography className={classes.title} variant="h3">
                        <Translate>{'student-onboarding.chooseCourse.title'}</Translate>
                    </Typography>
                    <Box mt={4} />
                    <Grid container spacing={0}>
                        <Grid item md={12} sm={12} xs={12}>
                            <InstituteCourseAutoComplete
                                institute={data && data.institute}
                                label={<Translate>{'student-onboarding.chooseCourse.form.search'}</Translate>}
                                onSelect={(data) => {
                                    let _courseList = courseList;
                                    if (_courseList.filter((e) => e._id === data._id).length === 0)
                                        setCourseList([data, ..._courseList]);
                                    setSelectedCourse(data);
                                }}
                            />
                        </Grid>
                        <Box className={classes.courseList} mt={2}>
                            <Grid container spacing={1}>
                                {!courseLoading && courseList ? (
                                    courseList.map((each) => (
                                        <Grid item key={each._id} md={6} sm={6} xs={12}>
                                            <Chip
                                                className={classes.activeChip}
                                                key={each._id}
                                                label={each.name}
                                                onClick={() => handleSelectChip(each)}
                                                variant={selectedCourse._id !== each._id ? 'outlined' : 'default'}
                                            />
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Box alignItems="center" display="flex" justifyContent="center">
                                            <CircularProgress size={'30px'} />
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box mt={3} />
                            <Button
                                color="primary"
                                component={Box}
                                disabled={loading}
                                fullWidth
                                height={'40px'}
                                onClick={handleNext}
                                variant="contained"
                            >
                                {loading ? (
                                    <CircularProgress size={'16px'} />
                                ) : (
                                    <Translate>{'student-onboarding.chooseCourse.button.next'}</Translate>
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

StudentChooseCourse.layout = null;

export default StudentChooseCourse;
