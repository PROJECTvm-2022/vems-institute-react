import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TakeAttendanceDialog from './TakeAttendanceDialog';
import Translate from '../../../src/components/Translate';
import Link from '../../components/Link';
import GetAttendanceDialog from './GetAttendanceDialog';
import moment from 'moment/moment';

const useStyle = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme?.palette?.background?.paper,
        padding: theme?.spacing(2),
        // cursor: 'pointer',
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

function CardForAttendance({ each, allStudentsInTheClass }) {
    const classes = useStyle();
    const [open, setOpen] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [status, setStatus] = useState(each && each.status ? each.status : 1);
    const [attendanceTaken, setAttendanceTaken] = useState(each?.attendanceTaken || false);
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
                {status !== 4 && (
                    <Button
                        color={'primary'}
                        component={Link}
                        disabled={status === 1}
                        fullWidth
                        href={`/live-classes?liveClassId=${each._id}&batchId=${allStudentsInTheClass}&attendanceTaken=${each.attendanceTaken}`}
                        size={'small'}
                        target={'_blank'}
                        variant={'outlined'}
                    >
                        <Translate root={'batch-details/[batchDetailsById]'}>{'link'}</Translate>
                    </Button>
                )}

                <Box mb={1} />
                {attendanceTaken !== true ? (
                    <>
                        <Button
                            color={'primary'}
                            disabled={status === 1}
                            fullWidth
                            onClick={() => setOpen(true)}
                            size={'small'}
                            variant={'contained'}
                        >
                            <Translate root={'batch-details/[batchDetailsById]'}>{'takeAttendanceButton'}</Translate>
                        </Button>
                    </>
                ) : (
                    <Button
                        color={'primary'}
                        disabled={status === 1}
                        fullWidth
                        onClick={() => setOpenViewDialog(true)}
                        size={'small'}
                        variant={'contained'}
                    >
                        <Translate root={'batch-details/[batchDetailsById]'}>{'ViewAttendance'}</Translate>
                    </Button>
                )}
            </Paper>
            <TakeAttendanceDialog
                allStudentsInTheClass={allStudentsInTheClass}
                each={each}
                open={open}
                setAttendanceTaken={setAttendanceTaken}
                setOpen={setOpen}
                setStatus={setStatus}
                status={status}
            />
            <GetAttendanceDialog each={each} open={openViewDialog} setOpen={setOpenViewDialog} />
        </Grid>
    );
}
CardForAttendance.propTypes = {
    each: PropTypes.any.isRequired,
    allStudentsInTheClass: PropTypes.any.isRequired,
};

export default CardForAttendance;
