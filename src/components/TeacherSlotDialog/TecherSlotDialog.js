import DialogTitle from '../DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import Confirm from '../Confirm';
import { teacherSlotService, TimetableService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import { useSnackbar } from 'notistack';

export default function TeacherSlotDialog({
    openTimeTable,
    setOpenTimeTable,
    slotData,
    batchDataLoading,
    batchData,
}) {

    const getTime = (time) => {
        let _time = time;
        let hh = Math.floor(_time / 60);
        let mm = _time % 60;

        let AMPM = hh >= 12 ? 'PM' : 'AM';
        hh = hh > 12 ? hh - 12 : hh;

        return `${hh}:${mm} ${AMPM}`;
    };

    return (
        <Dialog
            fullWidth
            maxWidth={'md'}
            onClose={() => {
                setOpenTimeTable(false);
            }}
            open={openTimeTable}
        >
            <DialogTitle
                onClose={() => {
                    setOpenTimeTable(false);
                }}
            >
                {'Assign to the slot'}
            </DialogTitle>
            <DialogContent>
                {slotData && slotData.course && (
                    <>
                        <Box display={'flex'}>
                            <Typography color={'textSecondary'} variant={'h3'}>
                                {slotData && slotData.course && slotData.course.name}
                            </Typography>
                            <Box ml={1} />
                            {'-'}
                            <Box ml={1} />
                            <Typography color={'textSecondary'} variant={'h3'}>
                                {slotData && slotData.subject && slotData.subject.name}
                            </Typography>
                        </Box>
                        <Box mt={2} />
                    </>
                )}
                <Typography>{'Timing'}</Typography>
                <Box display={'flex'}>
                    <Typography variant={'body2'}>
                        {slotData && slotData.startTime && getTime(slotData.startTime)}
                    </Typography>
                    <Box ml={1} />
                    {'-'}
                    <Box ml={1} />
                    <Typography variant={'body2'}>
                        {slotData && slotData.endTime && getTime(slotData.endTime)}
                    </Typography>
                </Box>
                <Box mt={1} />
                {batchDataLoading ? (
                    'Please Wait'
                ) : (
                    <>
                        {batchData.filter((each) => each.status === 2).length !== 0 && (
                            <>
                                <Typography>{'Batches'}</Typography>
                                {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
                                <TableContainer component={Paper} style={{ minWidth: 0 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{'Institute'}</TableCell>
                                                <TableCell>{'Batch'}</TableCell>
                                                <TableCell>{'Subject'}</TableCell>
                                                <TableCell>{'Course'}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {batchData
                                                .filter((each) => each.status === 2)
                                                .map((each) => (
                                                    <TableRow key={each._id}>
                                                        <TableCell component="th" scope="row">
                                                            {each?.institute?.name}
                                                        </TableCell>
                                                        <TableCell>{each?.instituteBatch?.name}</TableCell>
                                                        <TableCell>{each?.subject?.name}</TableCell>
                                                        <TableCell>{each?.course?.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </>
                )}

                <Box mt={2} />
            </DialogContent>
        </Dialog>
    );
}
