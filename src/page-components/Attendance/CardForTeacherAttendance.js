import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Translate from '../../../src/components/Translate';
import { startEndClassService } from '../../apis/rest.app';
import { useLanguage } from '../../store/LanguageStore';
import { useSnackbar } from 'notistack';
import useHandleError from '../../../src/hooks/useHandleError';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useUser } from '../../store/UserContext';
import { useConfirm } from '../../components/Confirm';
import Link from '../../components/Link';
import { useRouter } from 'next/router';
import moment from 'moment/moment';
import CreateQuestionDialog from './CreateQuestionDialog';

const useStyle = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        cursor: 'pointer',
    },
    date: {
        fontWeight: 300,
        fontSize: '20px',
    },
    time: {
        fontWeight: 700,
        fontSize: '35px',
    },
}));

function CardForTeacherAttendance({ each, position, attendanceData, setAttendanceData }) {
    const classes = useStyle();
    const [status, setStatus] = useState(each && each.status ? each.status : 1);
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage('teacher-attendance');
    const [startClassLoader, setStartClassLoader] = useState(false);
    const handleError = useHandleError();
    const [user] = useUser();
    const Router = useRouter();
    const Confirm = useConfirm();

    const changeToTakeAttendance = () => {
        Confirm(
            Language.get('Start Class'),
            Language.get('Are you sure to start the class ? '),
            Language.get('Yes'),
            {},
        ).then(() => {
            setStartClassLoader(true);
            startEndClassService
                .patch(each._id, {
                    status: 2,
                })
                .then(() => {
                    enqueueSnackbar(Language.get('Classes Started Successfully'), {
                        variant: 'success',
                    });
                    Router.push(`/live-classes?liveClassId=${each._id}`);
                    setStartClassLoader(false);
                    setStatus(2);
                })
                .catch((error) => {
                    handleError()(error);
                    setStartClassLoader(false);
                });
        });
    };
    const handleEndClass = () => {
        Confirm(
            Language.get('confirm.title'),
            Language.get('confirm.messageToEnd'),
            Language.get('confirm.yes'),
            {},
        ).then(() => {
            setStartClassLoader(true);
            startEndClassService
                .patch(each._id, { status: 4 })
                .then(() => {
                    enqueueSnackbar(Language.get('classEnded'), {
                        variant: 'success',
                    });
                    setStartClassLoader(false);
                    setStatus(4);
                    let _data = attendanceData;
                    _data.splice(position, 1);
                    setAttendanceData([..._data]);
                })
                .catch((error) => {
                    handleError()(error);
                    setStartClassLoader(false);
                });
        });
    };
    // const [open, setOpen] = useState(false);
    const ToQuestionComponent = () => {
        Router.push('/create-questions/[id]', '/create-questions/' + each._id);
    };
    return (
        <Grid item md={4} sm={6} xs={12}>
            <Paper className={classes.root}>
                <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'} mt={1}>
                    <Typography className={classes.time}>
                        {moment(each?.scheduledAt).utc(false).format('h:mm a')}
                    </Typography>
                    <Typography className={classes.date} variant={'caption'}>
                        {moment(each?.scheduledAt).utc(false).format('DD-MM-YYYY')}
                    </Typography>
                </Box>
                <Box mt={1.5} />
                <Divider />
                <Box mt={2} />
                <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'} mb={1}>
                    <Typography style={{ letterSpacing: 1 }} variant={'h4'}>
                        {each?.course?.name}
                    </Typography>
                    <Box display={'flex'}>
                        <Typography variant={'caption'}>{each?.syllabus?.name || 'N/A'}</Typography>
                        <Box ml={1} />
                        {' - '}
                        <Box ml={1} />
                        <Typography variant={'caption'}>{each?.subject?.name}</Typography>
                    </Box>
                </Box>
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'} mb={0.5}>
                    <Box component={Typography} mb={1} mr={0.5} variant={'caption'}>
                        {'By, '}
                    </Box>
                    <Box component={Typography} mb={1} variant={'caption'}>
                        <b>{each?.teacher?.name}</b>
                    </Box>
                </Box>
                <Button
                    color={'primary'}
                    component={Link}
                    disabled={status === 1}
                    fullWidth
                    href={`/live-classes?liveClassId=${each._id}`}
                    size={'small'}
                    variant={'outlined'}
                >
                    <Translate root={'teacher-attendance'}>{'join Class'}</Translate>
                </Button>
                <Box mb={1} />
                {user.role === 8 && status === 1 ? (
                    <>
                        <Button
                            color={'primary'}
                            disabled={startClassLoader}
                            fullWidth
                            onClick={changeToTakeAttendance}
                            size={'small'}
                            variant={'contained'}
                        >
                            {startClassLoader ? (
                                <CircularProgress size={25} />
                            ) : (
                                <Translate root={'teacher-attendance'}>{'Start Class'}</Translate>
                            )}
                        </Button>
                        <Box mt={1} />
                        <Button
                            color={'primary'}
                            disabled={startClassLoader}
                            fullWidth
                            onClick={ToQuestionComponent}
                            size={'small'}
                            variant={'outlined'}
                        >
                            {startClassLoader ? (
                                <CircularProgress size={25} />
                            ) : (
                                <Translate root={'teacher-attendance'}>{'Create Quiz'}</Translate>
                            )}
                        </Button>
                    </>
                ) : (
                    ''
                )}
                {user.role === 8 && status === 2 ? (
                    <Button
                        color={'primary'}
                        disabled={startClassLoader}
                        fullWidth
                        onClick={handleEndClass}
                        size={'small'}
                        variant={'contained'}
                    >
                        {startClassLoader ? (
                            <CircularProgress size={25} />
                        ) : (
                            <Translate root={'teacher-attendance'}>{'End Class'}</Translate>
                        )}
                    </Button>
                ) : (
                    ''
                )}
                {/*<CreateQuestionDialog each={each} open={open} setOpen={setOpen} />*/}
            </Paper>
        </Grid>
    );
}
CardForTeacherAttendance.propTypes = {
    each: PropTypes.any.isRequired,
    position: PropTypes.any.isRequired,
    setAttendanceData: PropTypes.any,
    attendanceData: PropTypes.any,
};

export default CardForTeacherAttendance;
