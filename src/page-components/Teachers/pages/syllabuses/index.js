/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description all syllabuses
 * @createdOn 26-Dec-20 10:27 PM
 */
import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createSyllabus, getAllSyllabuses } from '../../src/apis/syllabuses';
import PageHeaderComponent from '../../src/components/PageHeaderComponent';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Pagination from '@material-ui/lab/Pagination';
import { useSnackbar } from 'notistack';
import useStateObject from '../../src/hooks/useStateObject';
import { getAllCourses } from '../../src/apis/course';
import SyllabusRow from '../../src/page-components/syllabuses/SyllabusRow';
import { getAllSubjects } from '../../src/apis/subjects';
import CreateAutocomplete from '../../src/page-components/syllabuses/CreateAutoComplete';
import DialogTitle from '../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableSkeleton from '../../src/components/Skeleton/TableSkeleton';
import { useLanguage } from '../../src/store/LanguageStore';
import useHandleError from '../../src/hooks/useHandleError';

const useStyle = makeStyles(() => ({
    root: {
        minWidth: '1200px',
    },
    tableCell: {
        width: '80px',
    },
}));

export default function ServerPaginationGrid() {
    const classes = useStyle();
    const Language = useLanguage();
    const handleError = useHandleError();
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [allSyllabuses, setAllSyllabuses] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [pageRows, setPageRows] = useStateObject([]);
    const [totalPages, setTotalPages] = useState(0);
    const [coursesList, setCoursesList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [courseValue, setCourseValue] = useState('');
    const [subjectValue, setSubjectValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [courseSearch, setCourseSearch] = useState('');
    const [subjectSearch, setSubjectSearch] = useState('');

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

    const handleCreate = () => {
        if (validate()) {
            setCreating(true);
            createSyllabus(nameValue, courseValue._id, subjectValue._id)
                .then((res) => {
                    let _rows = pageRows;
                    _rows.push(res);
                    setPageRows(_rows);
                    setNameValue('');
                    enqueueSnackbar(<Translate>{'snackbarMessages.createSyllabusSuccess'}</Translate>, {
                        variant: 'success',
                    });
                    setCreating(false);
                })
                .catch((error) => {
                    handleError()(error);
                    setCreating(false);
                })
                .finally(() => {
                    setOpenCreate(false);
                });
        }
    };

    const handleChange = (event, value) => {
        setPage(value);
        if (value * pageLimit > allSyllabuses.length) {
            setPageRows([]);
            if (allSyllabuses.length === total) {
                let _allSyllabuses = allSyllabuses;
                setPageRows(_allSyllabuses.slice((value - 1) * pageLimit, total));
            } else {
                loadSyllabuses((value - 1) * pageLimit);
            }
        } else {
            let _allSyllabuses = allSyllabuses;
            setPageRows([]);
            setPageRows(_allSyllabuses.slice((value - 1) * pageLimit, value * pageLimit));
        }
    };

    const loadSyllabuses = (skip) => {
        setLoading(true);
        getAllSyllabuses(skip, pageLimit, search ? search : '')
            .then((response) => {
                if (response.data) {
                    setPageRows(response.data);
                    let _allSyllabuses = allSyllabuses;
                    let currentDAta = response.data;
                    _allSyllabuses = [..._allSyllabuses, ...currentDAta];
                    setAllSyllabuses(_allSyllabuses);
                }
            })
            .catch((error) => handleError()(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        getAllSyllabuses(0, pageLimit, search ? search : '')
            .then((res) => {
                setTotal(res.total);
                setAllSyllabuses(res.data);
                setPageRows(res.data);
                if (res.total % pageLimit === 0) {
                    setTotalPages(res.total / pageLimit);
                } else {
                    setTotalPages(Math.floor(res.total / pageLimit) + 1);
                }
            })
            .catch((error) => handleError()(error))
            .finally(() => {
                setLoading(false);
            });
    }, [search]);

    useEffect(() => {
        if (courseSearch === '') return;
        getAllCourses(0, pageLimit, courseSearch ? courseSearch : '')
            .then((res) => {
                setCoursesList(res.data);
                setSubjectValue('');
                setSubjectsList([]);
            })
            .catch((error) => handleError()(error));
    }, [courseSearch]);
    useEffect(() => {
        if (subjectSearch === '') return;
        getAllSubjects(0, pageLimit, subjectSearch ? subjectSearch : '')
            .then((res) => {
                setSubjectsList(res.data);
                setCoursesList([]);
            })
            .catch((error) => handleError()(error));
    }, [subjectSearch]);

    return (
        <>
            <PageHeaderComponent
                addButtonText={<Translate>{'syllabuses.addButton'}</Translate>}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPageRows([]);
                }}
                searchPlaceholder={Language.get('syllabuses.searchPlaceholder')}
                setOpenCreate={setOpenCreate}
                setSearch={setSearch}
                title={<Translate>{'syllabuses.title'}</Translate>}
                value={search}
            />
            <TableContainer
                bgcolor={'common.white'}
                borderRadius={'borderRadius'}
                className={classes.root}
                component={Box}
                p={1}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className={classes.tableCell}>
                                <Translate>{'tableHeading.serialNumber'}</Translate>
                            </TableCell>
                            <TableCell>
                                <Translate>{'tableHeading.name'}</Translate>
                            </TableCell>
                            <TableCell>
                                <Translate>{'tableHeading.course'}</Translate>
                            </TableCell>
                            <TableCell>
                                <Translate>{'tableHeading.subject'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'tableHeading.units'}</Translate>
                            </TableCell>
                            <TableCell align="center" />
                            <TableCell align="center" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.length > 0 ? (
                            pageRows.map((each, i) => (
                                <SyllabusRow
                                    deleteCallback={(elementToDelete, objIndex) => {
                                        setPageRows(pageRows.filter((each) => each._id !== elementToDelete._id));
                                        let _allSyllabuses = allSyllabuses;
                                        _allSyllabuses.splice(objIndex, 1);
                                        setAllSyllabuses(_allSyllabuses);
                                        enqueueSnackbar(Language.get('syllabuses.success.deletedSuccessfully'), {
                                            variant: 'success',
                                        });
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = pageRows;
                                        _pageRows[objIndex].name = editedElement.name;
                                        _pageRows[objIndex].course.name = editedElement.course.name;
                                        _pageRows[objIndex].subject.name = editedElement.subject.name;
                                        setPageRows(_pageRows);
                                        enqueueSnackbar(Language.get('syllabuses.success.editedSuccess'), {
                                            variant: 'success',
                                        });
                                    }}
                                    i={i}
                                    key={each._id}
                                    page={page}
                                    pageLimit={pageLimit}
                                />
                            ))
                        ) : !loading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={7}>
                                    <Translate>{'tableHeading.noSyllabuses'}</Translate>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={7}>
                                    <TableSkeleton />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Box display="flex" justifyContent="flex-end" m={3}>
                    <Pagination
                        color="primary"
                        count={totalPages}
                        onChange={handleChange}
                        page={page}
                        shape="rounded"
                    />
                </Box>
            </TableContainer>
            <Dialog fullWidth maxWidth={'xs'} onClose={() => setOpenCreate(false)} open={openCreate}>
                <DialogTitle onClose={() => setOpenCreate(false)}>
                    <Translate>{'syllabuses.addButton'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            fullWidth
                            label={Language.get('syllabuses.form.textField.name')}
                            margin={'dense'}
                            onChange={(e) => setNameValue(e.target.value)}
                            value={nameValue}
                            variant={'outlined'}
                        />
                        <CreateAutocomplete
                            label={Language.get('syllabuses.form.textField.courses')}
                            list={coursesList}
                            search={courseSearch}
                            setSearch={setCourseSearch}
                            setValue={setCourseValue}
                            value={courseValue}
                        />
                        <CreateAutocomplete
                            label={Language.get('syllabuses.form.textField.subjects')}
                            list={subjectsList}
                            search={subjectSearch}
                            setSearch={setSubjectSearch}
                            setValue={setSubjectValue}
                            value={subjectValue}
                        />
                        <Box mt={2} />
                        <Button
                            color={'primary'}
                            disabled={creating}
                            onClick={() => handleCreate()}
                            variant={'contained'}
                        >
                            {creating ? (
                                <CircularProgress size={22} />
                            ) : (
                                <Typography variant={'button'}>
                                    <Translate>{'syllabuses.addButton'}</Translate>
                                </Typography>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
