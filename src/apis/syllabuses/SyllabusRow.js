/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Table Row of the pages
 * @createdOn 28-Dec-20 11:06 PM
 */

import React, { useEffect, useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmDialog from '../../../src/components/Confirm/confirmDialog';
import PropTypes from 'prop-types';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useRouter } from 'next/router';
import Switch from '@material-ui/core/Switch';
import { deleteSyllabus, editSyllabus, switchSyllabus } from '../../apis/syllabuses';
import CreateAutocomplete from './CreateAutoComplete';
import { getAllCourses } from '../../apis/course';
import { getAllSubjects } from '../../apis/subjects';
import { useLanguage } from '../../store/LanguageStore';
import useHandleError from '../../hooks/useHandleError';
import { useSnackbar } from 'notistack';

const CustomTableRow = ({ each, i, pageLimit, page, deleteCallback, editCallback }) => {
    const handleError = useHandleError();
    const Router = useRouter();
    const Language = useLanguage();
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openEdit, setOpenEdit] = useState(false);
    const [editing, setEditing] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [courseValue, setCourseValue] = useState(each.course);
    const [subjectValue, setSubjectValue] = useState(each.subject);
    const [nameValue, setNameValue] = useState(each.name);
    const [courseSearch, setCourseSearch] = useState('');
    const [subjectSearch, setSubjectSearch] = useState('');
    const [coursesList, setCoursesList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [handleSwitchLoading, setHandleSwitchLoading] = useState(false);
    const [status, setStatus] = useState(each.status);

    const handleSwitchChange = () => {
        setHandleSwitchLoading(true);
        switchSyllabus(each._id, status === 1 ? -1 : 1)
            .then((res) => {
                setStatus(res.status);
                setHandleSwitchLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                setHandleSwitchLoading(false);
            });
    };

    useEffect(() => {
        if (courseSearch === '') return;
        getAllCourses(0, pageLimit, courseSearch ? courseSearch : '')
            .then((res) => setCoursesList(res.data))
            .catch((error) => handleError()(error));
    }, [courseSearch]);
    useEffect(() => {
        if (subjectSearch === '') return;
        getAllSubjects(0, pageLimit, subjectSearch ? subjectSearch : '')
            .then((res) => setSubjectsList(res.data))
            .catch((error) => handleError()(error));
    }, [subjectSearch]);

    const validate = () => {
        if (nameValue.trim() === '') {
            enqueueSnackbar(Language.get('syllabuses.form.validate.name'), {
                variant: 'warning',
            });
            return false;
        } else if (!courseValue) {
            enqueueSnackbar(Language.get('syllabuses.form.validate.course'), {
                variant: 'warning',
            });
            return false;
        } else if (!subjectValue) {
            enqueueSnackbar(Language.get('syllabuses.form.validate.subject'), {
                variant: 'warning',
            });
            return false;
        } else {
            return true;
        }
    };

    const handleEdit = () => {
        if (validate()) {
            setEditing(true);
            editSyllabus(each._id, nameValue, courseValue._id, subjectValue._id)
                .then((res) => {
                    editCallback(res, i);
                    setOpenEdit(false);
                })
                .catch((error) => handleError()(error))
                .finally(() => setEditing(false));
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteHandler = () => {
        deleteSyllabus(each._id).then((res) => deleteCallback(res, i));
    };

    const clickHandler = () => {
        Router.push(`/syllabuses/[unitId]`, `/syllabuses/${each._id}`);
    };

    return (
        <React.Fragment>
            <TableRow key={i}>
                <TableCell align="center">{pageLimit * (page - 1) + (i + 1)}</TableCell>
                <TableCell align="left">{each && each.name ? each.name : '---'}</TableCell>
                <TableCell align="left">{each && each.course && each.course.name ? each.course.name : '---'}</TableCell>
                <TableCell align="left">
                    {each && each.subject && each.subject.name ? each.subject.name : '---'}
                </TableCell>
                <TableCell align="center">
                    <Button color={'primary'} onClick={() => clickHandler()}>
                        <Typography variant={'button'}>
                            <Translate>{'view'}</Translate>
                        </Typography>
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                        <Switch
                            checked={status === 1}
                            color="primary"
                            disabled={handleSwitchLoading}
                            onChange={handleSwitchChange}
                        />
                        {handleSwitchLoading ? (
                            <Box alignItems={'center'} display={'flex'}>
                                <CircularProgress size={15} />
                            </Box>
                        ) : (
                            <Box m={1} />
                        )}
                    </Box>
                </TableCell>
                <TableCell align="right">
                    <Button onClick={handleClick}>
                        <MoreHoriz />
                    </Button>
                </TableCell>
            </TableRow>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                <Box p={1}>
                    <MenuItem
                        component={Box}
                        display={'flex'}
                        justifyContent={'center'}
                        onClick={() => {
                            setOpenEdit(true);
                            setAnchorEl(null);
                        }}
                    >
                        <Typography align={'center'} component={Box} px={3}>
                            <Translate>{'edit'}</Translate>
                        </Typography>
                    </MenuItem>
                    <MenuItem
                        component={Box}
                        display={'flex'}
                        justifyContent={'center'}
                        onClick={() => {
                            setOpenDelete(true);
                            setAnchorEl(null);
                        }}
                    >
                        <Typography align={'center'} component={Box} px={3}>
                            <Translate>{'delete'}</Translate>
                        </Typography>
                    </MenuItem>
                </Box>
            </Menu>
            <Dialog fullWidth maxWidth={'xs'} onClose={() => setOpenEdit(false)} open={openEdit}>
                <DialogTitle onClose={() => setOpenEdit(false)}>
                    <Translate>{'edit'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={Language.get('syllabuses.form.textField.name')}
                            margin={'dense'}
                            onChange={(e) => setNameValue(e.target.value)}
                            value={nameValue}
                            variant={'outlined'}
                        />
                        {/*<CreateAutocomplete*/}
                        {/*    label={Language.get('syllabuses.form.textField.courses')}*/}
                        {/*    list={coursesList}*/}
                        {/*    search={courseSearch}*/}
                        {/*    setSearch={setCourseSearch}*/}
                        {/*    setValue={setCourseValue}*/}
                        {/*    value={courseValue}*/}
                        {/*/>*/}
                        {/*<CreateAutocomplete*/}
                        {/*    label={Language.get('syllabuses.form.textField.subjects')}*/}
                        {/*    list={subjectsList}*/}
                        {/*    search={subjectSearch}*/}
                        {/*    setSearch={setSubjectSearch}*/}
                        {/*    setValue={setSubjectValue}*/}
                        {/*    value={subjectValue}*/}
                        {/*/>*/}
                        <Box mb={2} />
                        <Button color={'primary'} disabled={editing} onClick={() => handleEdit()} variant={'contained'}>
                            {editing ? (
                                <CircularProgress size={22} />
                            ) : (
                                <Typography variant={'button'}>
                                    <Translate>{'done'}</Translate>
                                </Typography>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <ConfirmDialog
                cancel={() => setOpenDelete(false)}
                cancelLabel={Language.get('cancel')}
                confirmation={Language.get('syllabuses.form.confirm.delete')}
                content={''}
                dismiss={() => setOpenDelete(false)}
                okLabel={Language.get('ok')}
                proceed={() => deleteHandler()}
                show={openDelete}
                title={Language.get('delete')}
            />
        </React.Fragment>
    );
};

CustomTableRow.propTypes = {
    each: PropTypes.any.isRequired,
    i: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    deleteCallback: PropTypes.func.isRequired,
    editCallback: PropTypes.func.isRequired,
    pageLimit: PropTypes.number.isRequired,
};

export default CustomTableRow;
