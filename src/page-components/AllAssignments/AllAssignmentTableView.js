import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Translate from '../../../src/components/Translate';
import Confirm from '../../components/Confirm';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import { AssignmentService, ExamService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import Button from '@material-ui/core/Button';
import moment from 'moment/moment';
import Link from '../../components/Link';
import { useUser } from '../../store/UserContext';

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

function ExamTableView({ each, position, allAssignments, setAllAssignments, type }) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage('all-exams');
    const handleError = useHandleError();
    const [user] = useUser();

    const deleteExams = () => {
        Confirm(
            Language.get('confirmDialog.titleForDelete'),
            Language.get('confirmDialog.messageForDelete'),
            Language.get('confirmDialog.okLebel'),
            Language.get('confirmDialog.options'),
        )
            .then(() => {
                ExamService.remove(each._id)
                    .then(() => {
                        let _allExam = allAssignments;
                        _allExam.splice(position, 1);
                        setAllAssignments([]);
                        setAllAssignments(_allExam);
                        enqueueSnackbar(Language.get('successMessage.deletedSuccessFully'), {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        enqueueSnackbar(error.message ? error.message : Language.get('error.deleteError'), {
                            variant: 'error',
                        });
                    });
            })
            .catch(() => {});
    };

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);
    const [openScheduleDialog, setOpenScheduleDialog] = useState(false);

    const openToScheduledDialog = () => {
        setOpenScheduleDialog(true);
    };
    const [tableOpen, setTableOpen] = useState(false);

    const handleButtonOpen = () => {
        setTableOpen(true);
    };
    const cancelExam = () => {
        Confirm('Are you sure', 'Are you sure to cancel the Assignment', 'Remove', '')
            .then(() => {
                AssignmentService.patch(each._id, {
                    status: 5,
                })
                    .then(() => {
                        let _data = allAssignments;
                        _data.splice(position, 1);
                        setAllAssignments([]);
                        setAllAssignments(_data);
                        enqueueSnackbar('Assignment canceled successfully', {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        handleError()(error);
                    });
            })
            .catch((error) => {
                handleError()(error);
            });
    };

    return (
        <>
            <TableRow key={position}>
                <TableCell align="left">{each?.title || 'N/A'}</TableCell>
                {/*<TableCell align="left">{each?.description || 'N/A'}</TableCell>*/}
                {user && user.role === 128 && <TableCell align="center">{each?.course?.name || 'N/A'}</TableCell>}
                <TableCell align={'center'} className={classes.tableCell}>
                    {each?.subject?.name || 'N/A'}
                </TableCell>
                <TableCell align={'center'}>
                    {each?.deadLine ? moment(each?.deadLine).utc(false).format('MMMM Do YYYY, h:mm a') : '---'}
                </TableCell>
                <TableCell align={'center'}>{each?.totalMark || '---'}</TableCell>
                <TableCell align="center" className={classes.addressDiv}>
                    <Button
                        color={'primary'}
                        component={Link}
                        href={`/assignment/${each?._id}`}
                        size={'small'}
                        variant={'outlined'}
                    >
                        {'View Details'}
                    </Button>
                </TableCell>
                {/*<TableCell>*/}
                {/*    <IconButton onClick={handleToggle} ref={anchorRef} style={{ zIndex: 1 }}>*/}
                {/*        <MoreVertIcon />*/}
                {/*    </IconButton>*/}
                {/*</TableCell>*/}
                {/*<Popper*/}
                {/*    anchorEl={anchorRef.current}*/}
                {/*    disablePortal*/}
                {/*    open={open}*/}
                {/*    role={undefined}*/}
                {/*    style={{ zIndex: 2 }}*/}
                {/*    transition*/}
                {/*>*/}
                {/*    {({ TransitionProps, placement }) => (*/}
                {/*        <Grow*/}
                {/*            {...TransitionProps}*/}
                {/*            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}*/}
                {/*        >*/}
                {/*            <Paper style={{ zIndex: 2 }}>*/}
                {/*                <ClickAwayListener onClickAway={handleClose}>*/}
                {/*                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>*/}
                {/*                        {(type === 1 || type === 2) && (*/}
                {/*                            <>*/}
                {/*                                <MenuItem className={classes.menuItem} onClick={handleButtonOpen}>*/}
                {/*                                    <Typography variant="body2">*/}
                {/*                                        <Translate root={'all-exams'}>{'edit'}</Translate>*/}
                {/*                                    </Typography>*/}
                {/*                                </MenuItem>*/}
                {/*                                <Divider light />*/}
                {/*                            </>*/}
                {/*                        )}*/}
                {/*                        {type === 1 && (*/}
                {/*                            <>*/}
                {/*                                <MenuItem*/}
                {/*                                    onClick={() => {*/}
                {/*                                        openToScheduledDialog(each);*/}
                {/*                                    }}*/}
                {/*                                >*/}
                {/*                                    <Typography variant="body2">*/}
                {/*                                        <Translate root={'all-exams'}>{'schedule'}</Translate>*/}
                {/*                                    </Typography>*/}
                {/*                                </MenuItem>*/}
                {/*                                <Divider light />*/}
                {/*                                <MenuItem onClick={deleteExams}>*/}
                {/*                                    <Typography variant="body2">*/}
                {/*                                        <Translate root={'all-exams'}>{'delete'}</Translate>*/}
                {/*                                    </Typography>*/}
                {/*                                </MenuItem>*/}
                {/*                                <Divider light />*/}
                {/*                            </>*/}
                {/*                        )}*/}
                {/*                        {type !== 1 && type !== 5 && (*/}
                {/*                            <>*/}
                {/*                                <MenuItem*/}
                {/*                                    onClick={() => {*/}
                {/*                                        cancelExam();*/}
                {/*                                    }}*/}
                {/*                                >*/}
                {/*                                    <Typography variant="body2">*/}
                {/*                                        <Translate root={'all-exams'}>{'cancel'}</Translate>*/}
                {/*                                    </Typography>*/}
                {/*                                </MenuItem>*/}
                {/*                                <Divider light />*/}
                {/*                            </>*/}
                {/*                        )}*/}
                {/*                    </MenuList>*/}
                {/*                </ClickAwayListener>*/}
                {/*            </Paper>*/}
                {/*        </Grow>*/}
                {/*    )}*/}
                {/*</Popper>*/}
            </TableRow>
            {/*<Dialog*/}
            {/*    maxWidth={'lg'}*/}
            {/*    onClose={() => {*/}
            {/*        setQuestionOpen(false);*/}
            {/*    }}*/}
            {/*    open={questionOpen}*/}
            {/*>*/}
            {/*    <DialogTitle*/}
            {/*        onClose={() => {*/}
            {/*            setQuestionOpen(false);*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {`Question of ${each?.title || 'Assignment'}`}*/}
            {/*    </DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <img*/}
            {/*            alt={`${each?.title}`}*/}
            {/*            src={each?.questions?.[0]?.link}*/}
            {/*            style={{ width: '100%', height: 'auto' }}*/}
            {/*        />*/}
            {/*    </DialogContent>*/}
            {/*</Dialog>*/}
            {/*<AssignmentScheludedDialog*/}
            {/*    each={each}*/}
            {/*    openScheduleDialog={openScheduleDialog}*/}
            {/*    setOpenScheduleDialog={setOpenScheduleDialog}*/}
            {/*/>*/}
            {/*<AssignmentAddDialog*/}
            {/*    allAssignments={allAssignments}*/}
            {/*    each={each}*/}
            {/*    position={position}*/}
            {/*    setAllAssignments={setAllAssignments}*/}
            {/*    setTableOpen={setTableOpen}*/}
            {/*    tableOpen={tableOpen}*/}
            {/*    type={type}*/}
            {/*/>*/}
        </>
    );
}

ExamTableView.propTypes = {
    each: PropTypes.any,
    allAssignments: PropTypes.any,
    setAllAssignments: PropTypes.any,
    position: PropTypes.number,
    _id: PropTypes.number,
    type: PropTypes.any,
};

export default ExamTableView;
