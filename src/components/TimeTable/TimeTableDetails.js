import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { useConfirm } from '../Confirm';
import { TimetableClassService } from '../../apis/rest.app';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useHandleError from '../../hooks/useHandleError';
import PropTypes from 'prop-types';
import Permit from '../Permit';
import Link from '../Link';
import CircularProgress from '@material-ui/core/CircularProgress';

const TimeTableDetails = ({ timeTable, onClose, onEdit, onDelete, showBatchDetails }) => {
    const [open, setOpen] = useState(Boolean(timeTable));
    const [openEdit, setOpenEdit] = useState(false);

    const [editing, setEditing] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    useEffect(() => {
        setOpen(Boolean(timeTable));
    }, [timeTable]);

    const Confirm = useConfirm();

    const handleError = useHandleError();

    const handleClose = () => {
        setOpen(false);
        setTimeout(onClose, 300);
    };

    const handleDelete = () =>
        Confirm().then(() => {
            setDeleting(true);
            TimetableClassService.remove(timeTable._id)
                .then(onDelete)
                .catch(handleError())
                .finally(() => setDeleting(false));
        });

    const handleSave = () => {
        setEditing(true);
        TimetableClassService.patch(timeTable._id, {
            startTime,
            endTime,
        })
            .then((res) => {
                onEdit(res);
                setOpenEdit(false);
            })
            .catch(handleError())
            .finally(() => setEditing(false));
    };

    const startTimeDate = new Date(0, 0, 0, Math.floor(timeTable.startTime / 60), timeTable.startTime % 60);

    const endTimeDate = new Date(0, 0, 0, Math.floor(timeTable.endTime / 60), timeTable.endTime % 60);

    const [startTime, setStartTime] = useState(startTimeDate);
    const [endTime, setEndTime] = useState(endTimeDate);

    if (!timeTable) return <React.Fragment />;

    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
                <React.Fragment>
                    <Box
                        alignItems="center"
                        component={MuiDialogTitle}
                        disableTypography
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6">
                            {timeTable.type === 1 ? timeTable?.subject?.name : 'Break'}
                        </Typography>
                        <div>
                            <Permit.ADMIN>
                                {/*{onEdit ? (*/}
                                {/*    <IconButton aria-label="close" onClick={() => setOpenEdit(true)}>*/}
                                {/*        <CreateIcon />*/}
                                {/*    </IconButton>*/}
                                {/*) : null}*/}
                                {onDelete ? (
                                    <IconButton aria-label="close" disabled={deleting} onClick={handleDelete}>
                                        {deleting ? <CircularProgress size={22} /> : <DeleteIcon />}
                                    </IconButton>
                                ) : null}
                            </Permit.ADMIN>
                            {onClose ? (
                                <IconButton aria-label="close" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            ) : null}
                        </div>
                    </Box>
                    <DialogContent>
                        <Typography variant="subtitle2">
                            {moment(startTimeDate).format('LT')} - {moment(endTimeDate).format('LT')}
                        </Typography>
                        {timeTable.type === 1 && (
                            <Box
                                alignItems="center"
                                as={`/teachers/${timeTable?.teacher?._id}`}
                                component={Link}
                                display="flex"
                                href="/teachers/[id]"
                                mt={1}
                            >
                                <Avatar alt={timeTable?.teacher?.name} src={timeTable?.teacher?.avatar} />
                                <Box component="span" fontSize="12" ml={1}>
                                    By {timeTable?.teacher?.name}
                                </Box>
                            </Box>
                        )}
                        {showBatchDetails && (
                            <Permit.TEACHER>
                                <Box mt={1} />
                                <Typography variant="h5">Course: {timeTable.syllabus.course.name}</Typography>
                                <Typography variant="h5">
                                    Specialization: {timeTable.syllabus.specialization.name}
                                </Typography>
                                <Typography variant="h5">Semester: {timeTable.timetable.semester.name}</Typography>
                            </Permit.TEACHER>
                        )}
                    </DialogContent>
                </React.Fragment>
            </Dialog>

            <Dialog fullWidth maxWidth="xs" onClose={() => setOpenEdit(false)} open={openEdit}>
                <Box
                    alignItems="center"
                    component={MuiDialogTitle}
                    disableTypography
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography variant="h6">Edit</Typography>

                    <IconButton aria-label="close" onClick={() => setOpenEdit(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardTimePicker
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            ampm
                            id="time-picker"
                            inputVariant="outlined"
                            label="Start Time"
                            margin="normal"
                            onChange={(ev) => setStartTime(ev)}
                            value={startTime}
                        />

                        <KeyboardTimePicker
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            ampm
                            id="time-picker"
                            inputVariant="outlined"
                            label="End Time"
                            margin="normal"
                            onChange={(ev) => setEndTime(ev)}
                            value={endTime}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setOpenEdit(false)}>
                        Cancel
                    </Button>
                    <Button autoFocus color="primary" disabled={editing} onClick={handleSave}>
                        {editing ? <CircularProgress size={28} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

TimeTableDetails.propTypes = {
    timeTable: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    showBatchDetails: PropTypes.bool,
};

export default TimeTableDetails;
