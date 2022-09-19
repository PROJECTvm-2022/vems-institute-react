/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Speacialixzation page
 * @createdOn 26-Dec-20 5:48 PM
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import PageHeaderComponent from '../../../../src/components/PageHeaderComponent';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import CustomTableRow from '../../../../src/components/CustomTableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import DialogTitle from '../../../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { createChapter, getAllChapters } from '../../../../src/apis/chapters';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Link from '../../../../src/components/Link';
import { getUnitById } from '../../../../src/apis/units';
import { getSyllabusById } from '../../../../src/apis/syllabuses';
import { useLanguage } from '../../../../src/store/LanguageStore';
import useHandleError from '../../../../src/hooks/useHandleError';
import TableSkeleton from '../../../../src/components/Skeleton/TableSkeleton';

export default function ServerPaginationGrid() {
    const Router = useRouter();
    const Language = useLanguage('syllabuses/[unitId]/[chapterId]');
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const { chapterId, unitId } = Router.query;

    const [page, setPage] = React.useState(1);
    const [pageRows, setPageRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [allChapters, setAllChapters] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [value, setValue] = useState('');
    const [creating, setCreating] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentUnit, setCurrentUnit] = useState('');
    const [currentSyllabus, setCurrentSyllabus] = useState('');

    const validate = () => {
        if (value.trim() === '') {
            enqueueSnackbar(Language.get('form.validate.name'), { variant: 'warning' });
            return false;
        } else {
            return true;
        }
    };

    const handleCreate = () => {
        if (validate()) {
            setCreating(true);
            createChapter(value, chapterId)
                .then((res) => {
                    let _rows = pageRows;
                    _rows.push(res);
                    setPageRows(_rows);
                    setValue('');
                    enqueueSnackbar(Language.get('success.createdSuccessfully'), {
                        variant: 'success',
                    });
                })
                .catch((error) => {
                    handleError()(error);
                })
                .finally(() => {
                    setCreating(false);
                    setOpenCreate(false);
                });
        }
    };

    const handleChange = (event, value) => {
        setPage(value);
        if (value * pageLimit > allChapters.length) {
            setPageRows([]);
            if (allChapters.length === total) {
                let _allChapters = allChapters;
                setPageRows(_allChapters.slice((value - 1) * pageLimit, total));
            } else {
                loadChapters((value - 1) * pageLimit);
            }
        } else {
            let _allChapters = allChapters;
            setPageRows([]);
            setPageRows(_allChapters.slice((value - 1) * pageLimit, value * pageLimit));
        }
    };

    const loadChapters = (skip) => {
        setLoading(true);
        getAllChapters(skip, pageLimit, chapterId, search ? search : '')
            .then((response) => {
                if (response.data) {
                    setPageRows(response.data);
                    let _allChapters = allChapters;
                    let currentDAta = response.data;
                    _allChapters = [..._allChapters, ...currentDAta];
                    setAllChapters(_allChapters);
                }
            })
            .catch((error) => handleError()(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        getSyllabusById(unitId).then((res) => setCurrentSyllabus(res.name));
        getUnitById(chapterId).then((res) => setCurrentUnit(res.name));
        getAllChapters(0, pageLimit, chapterId, search ? search : '')
            .then((res) => {
                setTotal(res.total);
                setAllChapters(res.data);
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

    return (
        <>
            <PageHeaderComponent
                addButtonText={Language.get('addButton')}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPageRows([]);
                }}
                searchPlaceholder={Language.get('searchPlaceholder')}
                setOpenCreate={setOpenCreate}
                setSearch={setSearch}
                title={Language.get('title')}
                value={search}
            />
            <Box my={2}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                    <Link color="inherit" href={`/syllabuses`}>
                        <Typography>
                            <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'allSyllabuses'}</Translate>
                        </Typography>
                    </Link>
                    <Link color="inherit" href={`/syllabuses/${unitId}`}>
                        <Typography>
                            <Translate>{currentSyllabus}</Translate>
                        </Typography>
                    </Link>
                    <Typography color="textPrimary">{currentUnit}</Typography>
                </Breadcrumbs>
            </Box>
            <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'table.heading.snNo'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'table.heading.name'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'table.heading.unit'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]/[chapterId]'}>
                                    {'table.heading.syllabus'}
                                </Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'table.heading.topic'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'table.heading.status'}</Translate>
                            </TableCell>
                            <TableCell align="center" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.length > 0 ? (
                            pageRows.map((each, i) => (
                                <CustomTableRow
                                    deleteCallback={(elementToDelete, objIndex) => {
                                        setPageRows(pageRows.filter((each) => each._id !== elementToDelete._id));
                                        let _allChapters = allChapters;
                                        _allChapters.splice(objIndex, 1);
                                        setAllChapters(_allChapters);
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = pageRows;
                                        _pageRows[objIndex].name = editedElement.name;
                                        _pageRows[objIndex].unit.name = editedElement.unit.name;
                                        setPageRows(_pageRows);
                                    }}
                                    i={i}
                                    key={each._id}
                                    page={page}
                                    pageLimit={pageLimit}
                                    title={Language.get('chapters')}
                                />
                            ))
                        ) : !loading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={9}>
                                    <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'noChapters'}</Translate>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={9}>
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
                    <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'form.title.create'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={<Translate root={'syllabuses/[unitId]/[chapterId]'}>{'form.field.name'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                            variant={'outlined'}
                        />
                        <Box mb={2} />
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
                                    <Translate root={'syllabuses/[unitId]/[chapterId]'}>{'addButton'}</Translate>
                                </Typography>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
