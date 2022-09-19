import React, { useEffect, useState } from 'react';
import 'date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import Translate from '../../components/Translate';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import Box from '@material-ui/core/Box';
import InstituteAutocomplete from '../../components/Autocompletes/InstituteAutocomplete';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { AssignmentService, InstituteBatchService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import TableContainer from '@material-ui/core/TableContainer';
import ScheduledTableItem from './AssignmentScheduledTableItem';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
    chip: {
        borderRadius: 4,
        width: 120,
    },
    red: {
        backgroundColor: 'red',
    },
    tableHeading: {
        minWidth: 0,
    },
}));

function AssignmentScheludedDialog({ each, openScheduleDialog, setOpenScheduleDialog }) {
    const Language = useLanguage('all-exams');
    const handleError = useHandleError();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [batches, setBatches] = useState([]);
    const [batchesLoading, setBatchesLoading] = useState(false);
    const [institute, setInstitute] = useState(null);
    const [clear, setClear] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allScheduleArray, setAllScheduleArray] = useState([]);
    const [startTimeAndDate, setStartTimeAndDate] = useState(new Date());
    const [values, setValues] = useState(['']);
    const [time, setTime] = useState('');

    const handleClose = () => {
        setOpenScheduleDialog(false);
    };

    useEffect(() => {
        if (!institute) return;
        setBatchesLoading(true);
        InstituteBatchService.find({
            query: { institute: institute?._id },
        })
            .then((response) => {
                setBatches(
                    response?.data.map((each) => ({
                        ...each,
                        chipEnabled: allScheduleArray.some((each1) => each1._id === each._id),
                    })),
                );
            })
            .catch(() => setBatches(null))
            .finally(() => {
                setBatchesLoading(false);
            });
    }, [institute]);

    const changeColor = (batch) => {
        setBatches(
            batches.map((each) => ({
                ...each,
                chipEnabled: each._id === batch._id ? !each.chipEnabled : each.chipEnabled,
            })),
        );
    };
    const validate = () => {
        if (institute === '') {
            enqueueSnackbar('Select a franchise', {
                variant: 'warning',
            });
            return false;
        }
        if (
            !batches?.filter((each) => {
                return each?.chipEnabled === true;
            }).length
        ) {
            enqueueSnackbar('Select a batch', {
                variant: 'warning',
            });
            return false;
        }
        return true;
    };
    const setToAnArray = () => {
        if (validate()) {
            setAllScheduleArray(
                allScheduleArray
                    .filter((each3) => {
                        const index = batches.findIndex((each4) => each3._id === each4._id);
                        if (index === -1) return true;
                        return batches[index].chipEnabled;
                    })
                    .concat(
                        batches
                            ?.filter((each) => each?.chipEnabled === true)
                            .filter((each1) => !allScheduleArray.some((s) => s._id === each1._id))
                            .map((each2) => ({ ...each2, institute })),
                    ),
            );
        }
    };

    const deleteOption = (index) => {
        let _vals = values;
        _vals.splice(index, 1);
        setValues([..._vals]);
    };

    const scheduleTheExam = () => {
        if (validate()) {
            setLoading(true);
            AssignmentService.create({
                entityId: each._id,
                entityType: 'assignment',
                deadLine: new Date(startTimeAndDate),
                instituteBatches: allScheduleArray.map((each) => each._id),
                instructions: values,
            })
                .then(() => {
                    setLoading(false);
                    setOpenScheduleDialog(false);
                    enqueueSnackbar('Scheduled successfully', { variant: 'success' });
                })
                .catch(() => {
                    handleError();
                    setOpenScheduleDialog(false);
                });
        }
    };
    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    handleClose();
                }}
                open={openScheduleDialog}
            >
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    {'Schedule Assignment'}
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={startTimeAndDate}
                            fullWidth
                            id="datetime-local"
                            label="Select schedule date"
                            onChange={(e) => setStartTimeAndDate(e.target.value)}
                            size={'small'}
                            type="datetime-local"
                            value={startTimeAndDate}
                            variant={'outlined'}
                        />
                    </Box>
                    <Box mt={2} />
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant={'body1'}>{'Enter Instructions for the assignments'}</Typography>
                        {values?.length &&
                            values.map((each, index) => (
                                <Box display={'flex'} justifyContent={'space-between'} key={each?._id} mt={1}>
                                    <TextField
                                        fullWidth
                                        onChange={(e) => {
                                            let _values = values;
                                            _values[index] = e.target.value;
                                            setValues([..._values]);
                                        }}
                                        placeholder={index + 1 + '. Instruction for the submission of assignment'}
                                        size="small"
                                        value={each}
                                        variant={'outlined'}
                                    />
                                    {index > 0 && (
                                        <IconButton onClick={() => deleteOption(index)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                        <Box mb={2} />
                        <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                            <Button
                                color={'primary'}
                                disabled={values?.length === 7}
                                onClick={() => {
                                    let _values = values;
                                    _values.push('');
                                    setValues([..._values]);
                                }}
                                size={'small'}
                                variant={'outlined'}
                            >
                                {'Add Options'}
                            </Button>
                        </Box>
                    </Box>
                    <Box mt={2} />
                    <InstituteAutocomplete clear={clear} onSelect={(ins) => setInstitute(ins || null)} size={'small'} />
                    <Box mt={2} />
                    {institute && (
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant={'body2'}>
                                {'Batches'}
                                {/*<Translate root={'all-exams'}>{'batches'}</Translate>*/}
                            </Typography>
                            <Box mt={0.5} />
                            <Box display={'flex'}>
                                {batches?.length ? (
                                    batches?.map((each) => (
                                        <Chip
                                            className={classes.chip}
                                            color={each?.chipEnabled ? 'primary' : 'default'}
                                            key={each._id}
                                            label={each?.name}
                                            onMouseDown={() => {
                                                changeColor(each);
                                            }}
                                            style={{ marginRight: 5 }}
                                            variant={each?.chipEnabled ? 'outlined' : 'default'}
                                        />
                                    ))
                                ) : batchesLoading ? (
                                    <CircularProgress size={22} />
                                ) : (
                                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'} m={1} mt={2}>
                                        <Typography variant={'subtitle2'}>
                                            <Translate root={'all-exams'}>{'noBatch'}</Translate>
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                    <Box mb={2} />
                    <Button color={'primary'} fullWidth onClick={setToAnArray} variant={'outlined'}>
                        {'Add'}
                    </Button>
                    <Box mb={2} />
                    {allScheduleArray?.length !== 0 && (
                        <TableContainer
                            bgcolor={'common.white'}
                            borderRadius={'borderRadius'}
                            className={classes.tableHeading}
                            component={Box}
                            p={1}
                        >
                            {allScheduleArray?.length !== 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                {'Name'}
                                                {/*<Translate root={'all-exams'}>{'tableHeadings.name'}</Translate>*/}
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                {'Batches'}
                                                {/*<Translate root={'all-exams'}>{'tableHeadings.batches'}</Translate>*/}
                                            </TableCell>
                                            <TableCell align="center">
                                                {'Delete'}
                                                {/*<Translate root={'all-exams'}>{'tableHeadings.date'}</Translate>*/}
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allScheduleArray
                                            .filter(
                                                (each, i) =>
                                                    allScheduleArray.findIndex(
                                                        (each1) => each1.institute._id === each.institute._id,
                                                    ) === i,
                                            )
                                            .map((each, index) => (
                                                <ScheduledTableItem
                                                    allScheduleArray={allScheduleArray}
                                                    each={each}
                                                    key={each._id}
                                                    position={index}
                                                    setAllScheduleArray={setAllScheduleArray}
                                                />
                                            ))}
                                    </TableBody>
                                </Table>
                            ) : loading ? (
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>
                                        <TableSkeleton />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                    <Translate root={'all-exams'}>{'noInstitutesFound'}</Translate>
                                </Box>
                            )}
                        </TableContainer>
                    )}
                    {allScheduleArray?.length !== 0 && (
                        <>
                            <Box mb={2} />
                            <Button color={'primary'} fullWidth onClick={scheduleTheExam} variant={'contained'}>
                                {loading ? <CircularProgress size={20} /> : 'Schedule'}
                            </Button>
                            <Box mb={2} />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

AssignmentScheludedDialog.propTypes = {
    setOpenScheduleDialog: PropTypes.any,
    openScheduleDialog: PropTypes.any,
    each: PropTypes.any,
};

export default AssignmentScheludedDialog;
