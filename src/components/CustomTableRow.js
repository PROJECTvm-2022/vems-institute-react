/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Table Row of the pages
 * @createdOn 28-Dec-20 11:06 PM
 */

import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
// import MoreHoriz from '@material-ui/icons/MoreHoriz';
// import Menu from '@material-ui/core/Menu';
// import Box from '@material-ui/core/Box';
// import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Translate from './Translate';
// import Dialog from '@material-ui/core/Dialog';
// import TextField from '@material-ui/core/TextField';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import ConfirmDialog from './Confirm/confirmDialog';
// import { deleteUnit, editUnit, switchUnit } from '../apis/units';
import PropTypes from 'prop-types';
// import { useSnackbar } from 'notistack';
// import DialogTitle from '../components/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
import { useRouter } from 'next/router';
// import { deleteChapter, editChapter, switchChapter } from '../apis/chapters';
// import { deleteTopic, editTopic, switchTopic } from '../apis/topics';
// import Switch from '@material-ui/core/Switch';
// import useHandleError from '../hooks/useHandleError';
// import { useLanguage } from '../store/LanguageStore';
// import Confirm from './Confirm';

const CustomTableRow = ({ each, i, pageLimit, page, title, syllabusId }) => {
    // const { enqueueSnackbar } = useSnackbar();
    const Router = useRouter();
    // const handleError = useHandleError();
    // const Language = useLanguage();
    // const UnitLanguage = useLanguage('syllabuses/[id]/[unitId]');
    // const ChapterLanguage = useLanguage('syllabuses/[id]/[unitId]/[chapterId]');
    // const TopicLanguage = useLanguage('syllabuses/[id]/[unitId]/[chapterId]/[topicId]');
    const { unitId, chapterId } = Router.query;
    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const open = Boolean(anchorEl);
    // const [openEdit, setOpenEdit] = useState(false);
    // const [value, setValue] = useState(each.name);
    // const [editing, setEditing] = useState(false);
    // const [openDelete, setOpenDelete] = useState(false);
    // const [status, setStatus] = useState(each.status);
    // const [handleSwitchLoading, setHandleSwitchLoading] = useState(false);

    // const handleSwitchChange = () => {
    //     setHandleSwitchLoading(true);
    //     if (title === 'units') {
    //         Confirm(
    //             UnitLanguage.get('form.confirmDialog.titleForDelete'),
    //             status === -1
    //                 ? UnitLanguage.get('form.confirmDialog.messageForActive')
    //                 : UnitLanguage.get('form.confirmDialog.messageForDeactivate'),
    //             UnitLanguage.get('form.confirmDialog.okLebel'),
    //             UnitLanguage.get('form.confirmDialog.options'),
    //         )
    //             .then(() => {
    //                 switchUnit(each._id, status === 1 ? -1 : 1)
    //                     .then((res) => {
    //                         setStatus(res.status);
    //                     })
    //                     .catch((error) => {
    //                         handleError()(error);
    //                     })
    //                     .finally(() => {
    //                         setHandleSwitchLoading(false);
    //                     });
    //             })
    //             .catch(() => {});
    //     } else if (title === 'chapters') {
    //         Confirm(
    //             ChapterLanguage.get('form.confirmDialog.titleForDelete'),
    //             status === -1
    //                 ? ChapterLanguage.get('form.confirmDialog.messageForActive')
    //                 : ChapterLanguage.get('form.confirmDialog.messageForDeactivate'),
    //             ChapterLanguage.get('form.confirmDialog.okLebel'),
    //             ChapterLanguage.get('form.confirmDialog.options'),
    //         )
    //             .then(() => {
    //                 switchChapter(each._id, status === 1 ? -1 : 1)
    //                     .then((res) => {
    //                         setStatus(res.status);
    //                     })
    //                     .catch((error) => {
    //                         handleError()(error);
    //                     })
    //                     .finally(() => {
    //                         setHandleSwitchLoading(false);
    //                     });
    //             })
    //             .catch(() => {});
    //     } else if (title === 'topics') {
    //         Confirm(
    //             TopicLanguage.get('form.confirmDialog.titleForDelete'),
    //             status === -1
    //                 ? TopicLanguage.get('form.confirmDialog.messageForActive')
    //                 : TopicLanguage.get('form.confirmDialog.messageForDeactivate'),
    //             TopicLanguage.get('form.confirmDialog.okLebel'),
    //             TopicLanguage.get('form.confirmDialog.options'),
    //         )
    //             .then(() => {
    //                 switchTopic(each._id, status === 1 ? -1 : 1)
    //                     .then((res) => {
    //                         setStatus(res.status);
    //                     })
    //                     .catch((error) => {
    //                         handleError()(error);
    //                     })
    //                     .finally(() => {
    //                         setHandleSwitchLoading(false);
    //                     });
    //             })
    //             .catch(() => {});
    //     }
    // };

    // const handleEdit = () => {
    //     if (title === 'units') {
    //         if (value.trim() === '') {
    //             enqueueSnackbar(UnitLanguage.get('form.validate.name'), { variant: 'warning' });
    //             return false;
    //         } else {
    //             setEditing(true);
    //             editUnit(each._id, value)
    //                 .then((res) => {
    //                     editCallback(res, i);
    //                     enqueueSnackbar(UnitLanguage.get('success.editedSuccessfully'), { variant: 'success' });
    //                 })
    //                 .catch((error) => {
    //                     handleError()(error);
    //                 })
    //                 .finally(() => {
    //                     setEditing(false);
    //                     setOpenEdit(false);
    //                 });
    //         }
    //     }
    //     if (title === 'chapters') {
    //         if (value.trim() === '') {
    //             enqueueSnackbar(ChapterLanguage.get('form.validate.name'), { variant: 'warning' });
    //             return false;
    //         } else {
    //             setEditing(true);
    //             editChapter(each._id, value)
    //                 .then((res) => {
    //                     editCallback(res, i);
    //                     enqueueSnackbar(ChapterLanguage.get('success.editedSuccessfully'), { variant: 'success' });
    //                 })
    //                 .catch((error) => {
    //                     handleError()(error);
    //                 })
    //                 .finally(() => {
    //                     setEditing(false);
    //                     setOpenEdit(false);
    //                 });
    //         }
    //     }
    //     if (title === 'topics') {
    //         if (value.trim() === '') {
    //             enqueueSnackbar(TopicLanguage.get('form.validate.name'), { variant: 'warning' });
    //             return false;
    //         } else {
    //             setEditing(true);
    //             editTopic(each._id, value)
    //                 .then((res) => {
    //                     editCallback(res, i);
    //                     enqueueSnackbar(TopicLanguage.get('success.editedSuccessfully'), { variant: 'success' });
    //                 })
    //                 .catch((error) => {
    //                     handleError()(error);
    //                 })
    //                 .finally(() => {
    //                     setEditing(false);
    //                     setOpenEdit(false);
    //                 });
    //         }
    //     }
    // };

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    //
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    // const deleteHandler = () => {
    //     if (title === 'units') {
    //         deleteUnit(each._id)
    //             .then((res) => {
    //                 deleteCallback(res, i);
    //                 enqueueSnackbar(UnitLanguage.get('success.deletedSuccessfully'), { variant: 'success' });
    //             })
    //             .catch((error) => {
    //                 handleError()(error);
    //             });
    //     }
    //     if (title === 'chapters') {
    //         deleteChapter(each._id)
    //             .then((res) => {
    //                 deleteCallback(res, i);
    //                 enqueueSnackbar(ChapterLanguage.get('success.deletedSuccessfully'), { variant: 'success' });
    //             })
    //             .catch((error) => {
    //                 handleError()(error);
    //             });
    //     }
    //     if (title === 'topics') {
    //         deleteTopic(each._id)
    //             .then((res) => {
    //                 deleteCallback(res, i);
    //                 enqueueSnackbar(TopicLanguage.get('success.deletedSuccessfully'), { variant: 'success' });
    //             })
    //             .catch((error) => {
    //                 handleError()(error);
    //             });
    //     }
    // };

    const clickHandler = () => {
        if (title === 'units') {
            Router.push(
                '/syllabuses/[id]/[unitId]/[chapterId]',
                `/syllabuses/${syllabusId}/${unitId}/${each._id}`,
            ).then(() => {});
        }
        if (title === 'chapters') {
            Router.push(
                `/syllabuses/[id]/[unitId]/[chapterId]/[topicId]`,
                `/syllabuses/${syllabusId}/${unitId}/${chapterId}/${each._id}`,
            ).then(() => {});
        }
    };

    return (
        <React.Fragment>
            <TableRow key={i}>
                <TableCell align="center">{pageLimit * (page - 1) + (i + 1)}</TableCell>
                <TableCell align="center">{each.name ? each.name : '---'}</TableCell>
                {each.chapter ? <TableCell align="center">{each.chapter ? each.chapter.name : '---'}</TableCell> : null}
                {each.unit ? <TableCell align="center">{each.unit ? each.unit.name : '---'}</TableCell> : null}
                {each.syllabus ? (
                    <TableCell align="center">{each.syllabus ? each.syllabus.name : '---'}</TableCell>
                ) : null}
                {each.course ? (
                    <TableCell align="center">{each.course.name ? each.course.name : '---'}</TableCell>
                ) : null}
                {title === 'units' || title === 'chapters' ? (
                    <TableCell align="center">
                        <Button color={'primary'} onClick={() => clickHandler()}>
                            <Typography variant={'button'}>
                                <Translate>{'view'}</Translate>
                            </Typography>
                        </Button>
                    </TableCell>
                ) : null}
                {/*<TableCell align="center">*/}
                {/*    <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>*/}
                {/*        <Switch*/}
                {/*            checked={status === 1}*/}
                {/*            color="primary"*/}
                {/*            disabled={handleSwitchLoading}*/}
                {/*            onChange={handleSwitchChange}*/}
                {/*        />*/}
                {/*        {handleSwitchLoading ? (*/}
                {/*            <Box alignItems={'center'} display={'flex'}>*/}
                {/*                <CircularProgress size={15} />*/}
                {/*            </Box>*/}
                {/*        ) : (*/}
                {/*            <Box m={1} />*/}
                {/*        )}*/}
                {/*    </Box>*/}
                {/*</TableCell>*/}
                {/*<TableCell align="right">*/}
                {/*    <Button onClick={handleClick}>*/}
                {/*        <MoreHoriz />*/}
                {/*    </Button>*/}
                {/*</TableCell>*/}
            </TableRow>
            {/*<Menu anchorEl={anchorEl} onClose={handleClose} open={open}>*/}
            {/*    <Box p={1}>*/}
            {/*        <MenuItem*/}
            {/*            component={Box}*/}
            {/*            display={'flex'}*/}
            {/*            justifyContent={'center'}*/}
            {/*            onClick={() => {*/}
            {/*                setOpenEdit(true);*/}
            {/*                setAnchorEl(null);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <Typography align={'center'} component={Box} px={3}>*/}
            {/*                <Translate>{'edit'}</Translate>*/}
            {/*            </Typography>*/}
            {/*        </MenuItem>*/}
            {/*        <MenuItem*/}
            {/*            component={Box}*/}
            {/*            display={'flex'}*/}
            {/*            justifyContent={'center'}*/}
            {/*            onClick={() => {*/}
            {/*                setOpenDelete(true);*/}
            {/*                setAnchorEl(null);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <Typography align={'center'} component={Box} px={3}>*/}
            {/*                <Translate>{'delete'}</Translate>*/}
            {/*            </Typography>*/}
            {/*        </MenuItem>*/}
            {/*    </Box>*/}
            {/*</Menu>*/}
            {/*<Dialog fullWidth maxWidth={'xs'} onClose={() => setOpenEdit(false)} open={openEdit}>*/}
            {/*    <DialogTitle onClose={() => setOpenEdit(false)}>*/}
            {/*        <Translate>{'edit'}</Translate>*/}
            {/*    </DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <Box display={'flex'} flexDirection={'column'} pb={1}>*/}
            {/*            <TextField*/}
            {/*                autoFocus*/}
            {/*                label={<Translate>{'nameLabel'}</Translate>}*/}
            {/*                margin={'dense'}*/}
            {/*                onChange={(e) => setValue(e.target.value)}*/}
            {/*                value={value}*/}
            {/*                variant={'outlined'}*/}
            {/*            />*/}
            {/*            <Box mb={2} />*/}
            {/*            <Button color={'primary'} disabled={editing} onClick={() => handleEdit()} variant={'contained'}>*/}
            {/*                {editing ? (*/}
            {/*                    <CircularProgress size={22} />*/}
            {/*                ) : (*/}
            {/*                    <Typography variant={'button'}>*/}
            {/*                        <Translate>{'done'}</Translate>*/}
            {/*                    </Typography>*/}
            {/*                )}*/}
            {/*            </Button>*/}
            {/*        </Box>*/}
            {/*    </DialogContent>*/}
            {/*</Dialog>*/}
            {/*<ConfirmDialog*/}
            {/*    cancel={() => setOpenDelete(false)}*/}
            {/*    confirmation={Language.get('common.confirm.delete')}*/}
            {/*    content={''}*/}
            {/*    dismiss={() => setOpenDelete(false)}*/}
            {/*    okLabel={<Translate>{'ok'}</Translate>}*/}
            {/*    proceed={() => deleteHandler()}*/}
            {/*    show={openDelete}*/}
            {/*    title={<Translate>{'delete'}</Translate>}*/}
            {/*/>*/}
        </React.Fragment>
    );
};

CustomTableRow.propTypes = {
    title: PropTypes.string.isRequired,
    each: PropTypes.any.isRequired,
    i: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    deleteCallback: PropTypes.func.isRequired,
    editCallback: PropTypes.func.isRequired,
    pageLimit: PropTypes.number.isRequired,
    coursesList: PropTypes.array,
    syllabusesList: PropTypes.array,
};

export default CustomTableRow;
