/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Student Onboarding
 * @createdOn 07/01/21 9:28 PM
 */

import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CoverImage from '../../src/assets/InstOnboardingBG.svg';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import StepConnector from '@material-ui/core/StepConnector';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ActiveBasicDetails from '../../src/assets/ActiveBasicDetails.svg';
import InstituteIcon from '../../src/assets/StudentInstituteVector.svg';
import ActiveInstituteIcon from '../../src/assets/ActiveInstituteLogo.svg';
import ActiveSubject from '../../src/assets/ActiveSubjectIcon.svg';
import SubjectIcon from '../../src/assets/Choosesubjects.svg';
import PropTypes from 'prop-types';
import { withStudentOnBoardingData } from '../../src/store/StudentOnBoardingContext';
import { useLanguage } from '../../src/store/LanguageStore';
import StudentBasicDetails from '../../src/page-components/StudentOnBoarding/StudentBasicDetails';
import StudentChooseInstitute from '../../src/page-components/StudentOnBoarding/StudentChooseInstitute';
import StudentChooseCourse from '../../src/page-components/StudentOnBoarding/StudentChooseCourse';
import { useUser } from '../../src/store/UserContext';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import Confirm from '../../src/components/Confirm';
import { authCookieName } from '../../src/apis/rest.app';

const useStyle = makeStyles((theme) => ({
    root: {
        minHeight: typeof window !== 'undefined' ? window.innerHeight : '-webkit-fill-available',
        display: 'flex',
        backgroundImage: `url(${CoverImage})`,
        backgroundSize: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        width: '80%',
        [theme.breakpoints.down('xs')]: {
            width: '90%',
        },
    },
    paper: {
        borderRadius: '0px',
        boxShadow: 'none',
        padding: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
    stepper: {
        width: '70%',
        padding: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            padding: theme.spacing(0),
            paddingTop: theme.spacing(2),
        },
    },
    title: {
        color: theme.palette.background.text,
    },
    activeTitle: {
        color: theme.palette.primary.main,
    },
}));

const ColorLibConnector = withStyles((theme) => ({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    completed: {
        '& $line': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    line: {
        backgroundColor: theme.palette.background.text,
        height: theme.spacing(0.5),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
}))(StepConnector);

const useColorLibStepIconStyles = makeStyles({
    root: {
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

function ColorLibStepIcon(props) {
    const classes = useColorLibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <img alt={'Icon'} src={ActiveBasicDetails} />,
        2: <img alt={'Icon'} src={InstituteIcon} />,
        3: <img alt={'Icon'} src={SubjectIcon} />,
    };

    const activeIcons = {
        1: <img alt={'Icon'} src={ActiveBasicDetails} />,
        2: <img alt={'Icon'} src={ActiveInstituteIcon} />,
        3: <img alt={'Icon'} src={ActiveSubject} />,
    };

    return (
        <div className={classes.root}>
            {active || completed ? activeIcons[String(props.icon)] : icons[String(props.icon)]}
        </div>
    );
}

ColorLibStepIcon.propTypes = {
    active: PropTypes.bool.isRequired,
    completed: PropTypes.bool,
    icon: PropTypes.any.isRequired,
};

ColorLibStepIcon.defaultProps = {
    completed: true,
};

const StudentOnBoarding = () => {
    const classes = useStyle();
    const Language = useLanguage();
    const [activeStep, setActiveStep] = React.useState(0);

    function getSteps() {
        return [
            Language.get('student-onboarding.stepper.basicDetails'),
            Language.get('student-onboarding.stepper.chooseInstitute'),
            Language.get('student-onboarding.stepper.chooseSubject'),
        ];
    }

    const steps = getSteps();

    const [user] = useUser();

    const Router = useRouter();
    // console.log('Router', Router);
    //
    useEffect(() => {
        if (!user?.phone) {
            setActiveStep(0);
        } else if (!user?.institute) {
            setActiveStep(1);
        } else if (!user?.studentSeat) {
            setActiveStep(2);
        } else {
            return true;
        }
    }, []);

    const handleLogout = () => {
        Confirm(Language.get('logout.title'), Language.get('logout.message'), 'Ok')
            .then(() => {
                localStorage.removeItem(authCookieName);
                Router.reload();
            })
            .catch(() => {});
    };

    return (
        <div className={classes.root}>
            <Box className={classes.main}>
                <Paper className={classes.paper}>
                    <Grid container spacing={0}>
                        <Grid component={Box} display={'flex'} item justifyContent={'center'} md={12} sm={12} xs={12}>
                            <Box className={classes.stepper}>
                                <Stepper activeStep={activeStep} alternativeLabel connector={<ColorLibConnector />}>
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel StepIconComponent={ColorLibStepIcon}>
                                                <Box mt={-2.3}>
                                                    {activeStep >= index ? (
                                                        <Typography className={classes.activeTitle} variant={'caption'}>
                                                            {label}
                                                        </Typography>
                                                    ) : (
                                                        <Typography className={classes.title} variant={'caption'}>
                                                            {label}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box display={'flex'} justifyContent={'flex-end'} mr={5}>
                                <Button color={'primary'} onClick={handleLogout} size={'small'} variant={'contained'}>
                                    {'Logout'}
                                </Button>
                            </Box>
                            {activeStep === 0 && <StudentBasicDetails setActiveStep={setActiveStep} />}
                            {activeStep === 1 && <StudentChooseInstitute setActiveStep={setActiveStep} />}
                            {activeStep === 2 && <StudentChooseCourse setActiveStep={setActiveStep} />}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
};

StudentOnBoarding.layout = null;

export default withStudentOnBoardingData(StudentOnBoarding);
