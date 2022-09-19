import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
// import MenuItem from '@material-ui/core/MenuItem';
// import Paper from '@material-ui/core/Paper';
// import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import theme from '../../theme';
// import Translate from '../../../src/components/Translate';
// import Confirm from '../../components/Confirm';
// import { useSnackbar } from 'notistack';
// import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
// import Grow from '@material-ui/core/Grow';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// import MenuList from '@material-ui/core/MenuList';
// import { ExamService, InstituteCourse } from '../../apis/rest.app';
// // import ScheludedDialog from './ScheludedDialog';
// // import ExamAddDialog from './ExamAddDialog';
// import useHandleError from '../../hooks/useHandleError';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import moment from 'moment/moment';
// import { useUser } from '../../store/UserContext';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../components/DialogTitle';
import Translate from '../../components/Translate';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ExamService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 65,
        width: 65,
    },
    avatarDiv: {
        height: 75,
        width: 75,
    },
    button: {
        color: theme.palette.primary.main,
    },
    cameraIcon: {
        height: 15,
        width: 20,
    },
    editIcon: {
        height: 20,
        width: 25,
        color: theme.palette.common.white,
    },
    editIconDiv: {
        height: 60,
        width: 60,
        borderRadius: 7,
    },
    tableCell: {
        wordBreak: 'break-all',
        minWidth: '50px',
        maxWidth: '100px',
    },
    addressDiv: {
        wordBreak: 'break-all',
        // width: '100%',
        minWidth: '200px',
        maxWidth: '300px',
    },
}));

function ExamTableView({ each, position, setAllExams, allExam, type }) {
    const classes = useStyles();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [publishDate, setPublishDate] = useState();

    const [publishDialogOpen, setPublishDialogOpen] = useState(false);

    const ClosepublishDialogOpen = () => {
        setPublishDialogOpen(false);
    };

    const publishResult = (resultPublishDate) => {
        ExamService.patch(each?._id, {
            resultPublishDate,
            status: resultPublishDate ? undefined : 6,
        })

            .then((res) => {
                setLoading(false);
                // console.log('res',res);
                allExam[position] = res;
                setAllExams([...allExam]);
                enqueueSnackbar('Published Result Successfully..', { variant: 'success' });
                setPublishDialogOpen(false);
            })
            .catch((err) => {
                // console.log('err',err)
                handleError()(err);
                setLoading(false);
            });
    };
    // const { enqueueSnackbar } = useSnackbar();
    // const Language = useLanguage('all-exams');
    // const handleError = useHandleError();

    return (
        <>
            <TableRow key={position}>
                {/*<TableCell align="center">{each?.title || 'N/A'}</TableCell>*/}
                {/*{user && user.role === 128 && <TableCell align="left">{each?.course?.name || 'N/A'}</TableCell>}*/}
                <TableCell align={'center'}>{each?.title || 'N/A'}</TableCell>
                {type !== 1 && (
                    <TableCell align={'center'} component="th" scope="row">
                        {moment(each?.scheduledOn).format('DD-MM-YYYY')}
                    </TableCell>
                )}

                {type !== 1 && (
                    <TableCell align={'center'} component="th" scope="row">
                        {moment(each?.scheduledOn).format('h:mm a')}
                    </TableCell>
                )}

                <TableCell align="center" className={classes.addressDiv}>
                    {each?.questionCount || '0'}
                </TableCell>
                <TableCell align={'center'} component="th" scope="row">
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                        {/*<Button*/}
                        {/*    color={'primary'}*/}
                        {/*    href={`/students-in-exam/${each._id}`}*/}
                        {/*    size={'small'}*/}
                        {/*    variant={'outlined'}*/}
                        {/*>*/}
                        {/*    {'View Students'}*/}
                        {/*</Button>*/}
                        {/*<Box mt={0.5} />*/}
                        <Button
                            color={'primary'}
                            href={`/exam-details/${each._id}`}
                            size={'small'}
                            variant={'outlined'}
                        >
                            {'View Details'}
                        </Button>
                        <Box ml={2}>
                            {(each.status === 4 || each.status === 6) && (
                                <Button
                                    color={'primary'}
                                    disabled={each?.status !== 4}
                                    onClick={() => {
                                        setPublishDialogOpen(true);
                                    }}
                                    size={'small'}
                                    variant={'contained'}
                                >
                                    {each?.status !== 4 ? 'Result Published' : 'Publish Result'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </TableCell>
                {/*<Box component={TableCell}>*/}
                {/*    <Button color={'primary'} href={`/students-in-exam/${each._id}`} variant={'outlined'}>*/}
                {/*        {'View Students'}*/}
                {/*    </Button>*/}
                {/*</Box>*/}
                {/*<Box component={TableCell}>*/}
                {/*    <Button color={'primary'} href={`/exam-details/${each._id}`} variant={'contained'}>*/}
                {/*        {'View Details'}*/}
                {/*    </Button>*/}
                {/*</Box>*/}
            </TableRow>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    ClosepublishDialogOpen();
                }}
                open={publishDialogOpen}
            >
                <DialogTitle
                    onClose={() => {
                        ClosepublishDialogOpen();
                    }}
                >
                    <Translate root={'all-exams'}>{'Result Publish Date'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} width={'100%'}>
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            defaultValue={publishDate}
                            id="datetime-local"
                            label="Date and time"
                            onChange={(e) => setPublishDate(e.target.value)}
                            size={'small'}
                            style={{ width: '75%' }}
                            type="datetime-local"
                            value={publishDate}
                            variant={'outlined'}
                        />
                        <Box mr={1} />
                        <Button
                            color={'primary'}
                            onClick={() => {
                                // setPublished(true);
                                // console.log('date',_date);
                                publishResult();
                            }}
                            variant={'outlined'}
                        >
                            {'Publish Now'}
                        </Button>
                    </Box>
                    <Box mt={2} />
                    <>
                        <Box mb={2} />
                        <Button
                            color={'primary'}
                            fullWidth
                            // disabled={}
                            onClick={() => {
                                let _date = null;
                                publishResult(_date);
                            }}
                            variant={'contained'}
                        >
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate root={'all-exams'}>{'Publish Result'}</Translate>
                            )}
                        </Button>
                        <Box mb={2} />
                    </>
                    {/*)}*/}
                </DialogContent>
            </Dialog>
        </>
    );
}

ExamTableView.propTypes = {
    each: PropTypes.any,
    allExam: PropTypes.any,
    setAllExams: PropTypes.any,
    position: PropTypes.number,
    _id: PropTypes.number,
    type: PropTypes.any,
};

export default ExamTableView;
