import React, { useEffect, useState } from 'react';
import Translate from '../../../src/components/Translate';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { takeAttendanceService } from '../../apis/rest.app';
import useHandleError from '../../../src/hooks/useHandleError';
import PropTypes from 'prop-types';
import { Checkbox, Dialog, DialogActions, DialogContent, InputBase } from '@material-ui/core/index';
import Typography from '@material-ui/core/Typography';
import TextSkeleton from '../../components/Skeleton/TextSkeleton';
import SearchIcon from '@material-ui/icons/Search';
import DialogTitle from '../../components/DialogTitle';

function GetAttendanceDialog({ each, open, setOpen }) {
    const handleError = useHandleError();
    const [loading, setLoading] = React.useState(false);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (open) {
            setLoading(true);
            takeAttendanceService
                .find({
                    query: {
                        liveClass: each._id,
                        $populate: ['student'],
                        status: { $in: [1, 2] },
                    },
                })
                .then((response) => {
                    setStudents(response);
                })
                .catch((error) => {
                    handleError()(error);
                })
                .finally(() => setLoading(false));
        }
    }, [open]);

    return (
        <Dialog fullWidth maxWidth={'sm'} onClose={() => setOpen(false)} open={open}>
            <DialogTitle onClose={() => setOpen(false)}>
                <Translate>{'Attendance'}</Translate>
            </DialogTitle>
            <DialogContent>
                <Box display={'flex'} justifyContent={'flex-end'}>
                    <Box
                        alignItems={'center'}
                        bgcolor={'common.white'}
                        borderRadius={'borderRadius'}
                        boxShadow={1}
                        display={'flex'}
                        height={{ xs: '40px' }}
                        justifyContent={'space-between'}
                        mb={{ xs: 2, sm: 0, md: 0 }}
                        p={1.5}
                        width={{ xs: 1, sm: 300, md: 300 }}
                    >
                        <InputBase
                            autoFocus
                            onChange={(e) => {
                                setSearch(e.target.value.trim());
                            }}
                            placeholder={'search by name'}
                            value={search}
                        />
                        <Box alignItems={'center'} color={'primary.main'} display={'flex'} fontSize={19} ml={1}>
                            <SearchIcon />
                        </Box>
                    </Box>
                </Box>
                <Box component={Grid} container mt={2} spacing={0}>
                    {students && students.length !== 0 ? (
                        students.filter((each) => each?.student?.name?.toLowerCase().includes(search.toLowerCase()))
                            .length ? (
                            students
                                .filter((each) => each?.student?.name?.toLowerCase().includes(search.toLowerCase()))
                                .map((data) => (
                                    <Grid item key={data._id} md={6} sm={6} xs={12}>
                                        <Box display={'flex'} mt={1}>
                                            <Checkbox checked={data?.status === 1} color="primary" />
                                            <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                                <Typography>{data?.student?.name}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))
                        ) : (
                            <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
                                <Translate root={'institute-attendance/[id]'}>{'No student present'}</Translate>
                            </Box>
                        )
                    ) : loading ? (
                        <TextSkeleton />
                    ) : (
                        <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
                            <Translate root={'institute-attendance/[id]'}>{'No student present'}</Translate>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Box mb={1} mr={1}>
                    <Button
                        color="primary"
                        onClick={() => {
                            setOpen(false);
                        }}
                        size="medium"
                    >
                        {'Cancel'}
                        {/*<Translate root={'institute-attendance/[id]'}>{'button-cancel'}</Translate>*/}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
GetAttendanceDialog.propTypes = {
    each: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    position: PropTypes.any,
    batchId: PropTypes.any,
};

export default GetAttendanceDialog;
