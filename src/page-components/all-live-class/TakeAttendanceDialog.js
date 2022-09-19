import React, { useEffect, useState } from 'react';
import Translate from '../../../src/components/Translate';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { StudentInLiveClassService, StudentOfBatchService, takeAttendanceService } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';
import useHandleError from '../../../src/hooks/useHandleError';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core/index';
import InfiniteScroll from 'react-infinite-scroller';
import DialogTitle from '../../components/DialogTitle';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';

function TakeAttendanceDialog({ each, open, setOpen, setAttendanceTaken, page }) {
    const handleError = useHandleError();
    const [loading, setLoading] = React.useState(false);
    const [allStudent, setAllStudent] = useState([]);
    const [students, setStudents] = useState([]);
    const Language = useLanguage('');
    const [studentStatus, setStudentStatus] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [batchId, setBatchId] = useState([]);

    useEffect(() => {
        setLoading(true);
        StudentInLiveClassService.find({
            query: {
                liveClass: page ? each : each?._id,
            },
        })
            .then((response) => {
                setBatchId(response[0]?.instituteBatch);
                setLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                setLoading(false);
            });
    }, []);

    const LoadStudent = () => {
        if (batchId) {
            StudentOfBatchService.find({
                query: {
                    instituteBatch: batchId,
                    $populate: ['student'],
                },
            })
                .then((response) => {
                    const { data, total } = response;
                    const result = [...allStudent, ...data];
                    let values = result.map((e) => {
                        let val = {};
                        val.student = e.student._id;
                        val.status = studentStatus;
                        return val;
                    });
                    values = [...students, ...values];
                    // console.log('values', values);
                    setHasMore(result.length < total);
                    setStudents([...values]);
                    setAllStudent([...result]);
                })
                .catch((error) => {
                    handleError()(error);
                    setHasMore(false);
                });
        } else {
            setHasMore(false);
        }
    };

    const changeStatus = students?.some((each) => {
        return each?.status === 1;
    });
    const changeStatus1 = students?.some((each) => {
        return each?.status === 2;
    });

    useEffect(() => {
        if (allStudent.length === 0) return;
        let values = allStudent.map((e) => {
            let val = {};
            val.student = e.student._id;
            val.status = studentStatus;
            return val;
        });
        setStudents([...values]);
    }, [studentStatus]);

    const handleTakeAttendance = () => {
        setLoading(true);
        let _each = each && each._id ? each._id : each;
        takeAttendanceService
            .create({ students, liveClass: _each, instituteBatch: batchId })
            .then(() => {
                enqueueSnackbar(Language.get('takeAttendance'), {
                    variant: 'success',
                });
                setLoading(false);
                setAttendanceTaken(true);
                // setStatus(4);
                setOpen(false);
            })
            .catch((error) => {
                handleError()(error);
                setLoading(false);
                setHasMore(false);
            });
    };

    return (
        <Dialog fullWidth maxWidth={'xs'} onClose={() => setOpen(false)} open={open}>
            <DialogTitle>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Translate>{'attendance.dialogTitle'}</Translate>

                    <div>
                        {changeStatus === true ? (
                            <Button
                                color={'primary'}
                                onClick={() => setStudentStatus(2)}
                                size={'medium'}
                                style={{ height: '30px' }}
                                variant={'contained'}
                            >
                                <Translate>{'attendance.unSelectAll'}</Translate>
                            </Button>
                        ) : (
                            ''
                        )}
                        {changeStatus === false && changeStatus1 === true ? (
                            <Button
                                color={'primary'}
                                onClick={() => setStudentStatus(1)}
                                size={'medium'}
                                style={{ height: '30px' }}
                                variant={'contained'}
                            >
                                <Translate>{'attendance.selectAll'}</Translate>
                            </Button>
                        ) : (
                            ''
                        )}
                        {/*{studentStatus === 1 ? (*/}
                        {/*    <Button*/}
                        {/*        color={'primary'}*/}
                        {/*        onClick={() => setStudentStatus(2)}*/}
                        {/*        size={'medium'}*/}
                        {/*        style={{ height: '30px' }}*/}
                        {/*        variant={'contained'}*/}
                        {/*    >*/}
                        {/*        <Translate>{'attendance.unSelectAll'}</Translate>*/}
                        {/*    </Button>*/}
                        {/*) : (*/}
                        {/*    <Button*/}
                        {/*        color={'primary'}*/}
                        {/*        onClick={() => setStudentStatus(1)}*/}
                        {/*        size={'medium'}*/}
                        {/*        style={{ height: '30px' }}*/}
                        {/*        variant={'contained'}*/}
                        {/*    >*/}
                        {/*        <Translate>{'attendance.selectAll'}</Translate>*/}
                        {/*    </Button>*/}
                        {/*)}*/}
                    </div>
                </Box>
            </DialogTitle>

            <DialogContent>
                <InfiniteScroll
                    hasMore={hasMore}
                    loadMore={LoadStudent}
                    loader={
                        <Box align={'center'} key={'all-teacher'} p={2}>
                            <CircularProgress size={28} />
                        </Box>
                    }
                    pageStart={0}
                >
                    <Box component={Grid} container mt={2} spacing={0}>
                        {allStudent && allStudent.length !== 0 ? (
                            allStudent.map((data, position) => (
                                <Grid item key={data._id} md={12} sm={12} xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={students[position].status === 1}
                                                color="primary"
                                                onChange={() => {
                                                    let _students = students;
                                                    let eachStudent = _students[position];
                                                    if (eachStudent.status === 1) eachStudent.status = 2;
                                                    else eachStudent.status = 1;
                                                    _students[position] = eachStudent;
                                                    setStudents([..._students]);
                                                    // console.log('eachStudent', eachStudent);
                                                    // console.log('students', students);
                                                }}
                                            />
                                        }
                                        label={data?.student?.name}
                                    />
                                </Grid>
                            ))
                        ) : hasMore ? (
                            ''
                        ) : (
                            <Box
                                alignItems="center"
                                display="flex"
                                flexDirection="column"
                                height="80vh"
                                justifyContent="center"
                            >
                                <Translate>{'attendance.no_student'}</Translate>
                            </Box>
                        )}
                    </Box>
                </InfiniteScroll>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        setOpen(false);
                    }}
                    size="medium"
                >
                    <Translate>{'attendance.button-cancel'}</Translate>
                </Button>
                <Button
                    color="primary"
                    disabled={loading}
                    onClick={handleTakeAttendance}
                    size="medium"
                    variant="contained"
                >
                    {loading ? <CircularProgress size={20} /> : <Translate>{'attendance.dialogButton'}</Translate>}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
TakeAttendanceDialog.propTypes = {
    each: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    position: PropTypes.any,
    allStudentsInTheClass: PropTypes.any,
    setAttendanceTaken: PropTypes.any,
};

export default TakeAttendanceDialog;
