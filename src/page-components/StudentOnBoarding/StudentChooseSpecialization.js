/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Student OnBoarding ( Choose Specialization step 4 )
 * @createdOn 11/01/21 10:17 PM
 */

import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import VectorImage from '../../assets/StudentSelectCourseOnBoarding.svg';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import { useUser } from '../../store/UserContext';
import Chip from '@material-ui/core/Chip';
import { SpecializationService, UserInstituteAccessService } from '../../apis/rest.app';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStudentOnBoardingData } from '../../store/StudentOnBoardingContext';
import SpecializationAutoComplete from '../../components/SpecializationAutoComplete';
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
    specializationList: {
        height: '270px',
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
}));

const StudentChooseSpecialization = () => {
    const classes = useStyle();

    const Router = useRouter();

    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();

    const [user] = useUser();

    const [data] = useStudentOnBoardingData();

    const [loading, setLoading] = useState(false);
    const [specializationLoading, setSpecializationLoading] = useState(true);

    const [specializationList, setSpecializationList] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState({});

    useEffect(() => {
        SpecializationService.find({
            query: {
                $limit: 1,
                course: data && data.adminCourse,
            },
        })
            .then((response) => {
                setSpecializationList([...response.data]);
                setSpecializationLoading(false);
            })
            .catch(() => {
                setSpecializationLoading(false);
            });
    }, []);

    const handleSelectChip = (each) => {
        if (selectedSpecialization._id === each._id) setSelectedSpecialization({});
        else setSelectedSpecialization(each);
    };

    const validate = () => {
        if (!selectedSpecialization) {
            enqueueSnackbar(Language.get('student-onboarding.chooseSpecialization.error.courseRequired'), {
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
            UserInstituteAccessService.create({
                institute: data && data.institute,
                requestData: {
                    course: data && data.course,
                    specialization: selectedSpecialization._id,
                },
                user: user && user._id,
                accessType: 1,
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
                        <Translate>{'student-onboarding.chooseSpecialization.title'}</Translate>
                    </Typography>
                    <Box mt={4} />
                    <Grid container spacing={0}>
                        <Grid item md={12} sm={12} xs={12}>
                            <SpecializationAutoComplete
                                course={data && data.adminCourse}
                                institute={data && data.institute}
                                label={<Translate>{'student-onboarding.chooseSpecialization.form.search'}</Translate>}
                                onSelect={(data) => {
                                    let _specializationList = specializationList;
                                    if (_specializationList.filter((e) => e._id === data._id).length === 0)
                                        setSpecializationList([data, ..._specializationList]);
                                    setSelectedSpecialization(data);
                                }}
                            />
                        </Grid>
                        <Box className={classes.specializationList} mt={2}>
                            <Grid container spacing={1}>
                                {!specializationLoading && specializationList ? (
                                    specializationList.map((each) => (
                                        <Grid item key={each._id} md={6} sm={6} xs={12}>
                                            <Chip
                                                className={classes.activeChip}
                                                key={each._id}
                                                label={each.name}
                                                onClick={() => handleSelectChip(each)}
                                                variant={
                                                    selectedSpecialization._id !== each._id ? 'outlined' : 'default'
                                                }
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
                                    <Translate>{'student-onboarding.chooseSpecialization.button.next'}</Translate>
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

StudentChooseSpecialization.layout = null;

export default StudentChooseSpecialization;
