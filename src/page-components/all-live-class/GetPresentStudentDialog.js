import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import useHandleError from '../../../src/hooks/useHandleError';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/index';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { takeAttendanceService } from '../../apis/rest.app';

function GetAllStudentDialog({ each, open, setOpen, loading, classId }) {
    const handleError = useHandleError();
    const [student, setStudent] = useState([]);
    useEffect(() => {
        // setLoading(true);
        takeAttendanceService
            .find({
                query: {
                    liveClass: classId,
                    $populate: ['student'],
                    status: { $in: [1] },
                },
            })
            .then((response) => {
                setStudent(response);
            })
            .catch((error) => {
                handleError()(error);
            });
    }, []);

    return (
        <Dialog fullWidth maxWidth={'sm'} onClose={() => setOpen(false)} open={open}>
            <DialogTitle>{'All Students'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {student && student?.length !== 0 ? (
                        student?.map((data) => (
                            <>
                                <Grid item md={6} sm={6} xs={6}>
                                    <Box display={'flex'}>
                                        <Avatar alt="Name" src={data?.avatar}>
                                            {data?.student?.name?.charAt(0)}
                                        </Avatar>
                                        <Box ml={1}>
                                            <Typography variant={'body2'}>{data?.student?.name}</Typography>
                                            <Typography variant={'caption'}>{'student'}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </>
                        ))
                    ) : loading ? (
                        <CircularProgress />
                    ) : (
                        <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                            {'No students'}
                        </Box>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        setOpen(false);
                    }}
                    size="medium"
                >
                    {'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
GetAllStudentDialog.propTypes = {
    each: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    position: PropTypes.any,
};

export default GetAllStudentDialog;
