/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Unit page
 * @createdOn 26-Dec-20 5:48 PM
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import PageHeaderComponent from '../../../src/components/PageHeaderComponent';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import CustomTableRow from '../../../src/components/CustomTableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import { createUnit, getAllUnits } from '../../../src/apis/units';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import DialogTitle from '../../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { getSyllabusById } from '../../../src/apis/syllabuses';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Link from '../../../src/components/Link';
import { useLanguage } from '../../../src/store/LanguageStore';
import useHandleError from '../../../src/hooks/useHandleError';
import TableSkeleton from '../../../src/components/Skeleton/TableSkeleton';

export default function ServerPaginationGrid() {
    const Router = useRouter();
    const Language = useLanguage('syllabuses/[unitId]');
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const { unitId } = Router.query;
    const [page, setPage] = React.useState(1);
    const [pageRows, setPageRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [allUnits, setAllUnits] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [value, setValue] = useState('');
    const [creating, setCreating] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
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
            createUnit(value, unitId)
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
        if (value * pageLimit > allUnits.length) {
            setPageRows([]);
            if (allUnits.length === total) {
                let _allUnits = allUnits;
                setPageRows(_allUnits.slice((value - 1) * pageLimit, total));
            } else {
                loadUnits((value - 1) * pageLimit);
            }
        } else {
            let _allUnits = allUnits;
            setPageRows([]);
            setPageRows(_allUnits.slice((value - 1) * pageLimit, value * pageLimit));
        }
    };

    const loadUnits = (skip) => {
        setLoading(true);
        getAllUnits(skip, pageLimit, unitId, search ? search : '')
            .then((response) => {
                if (response.data) {
                    setPageRows(response.data);
                    let _allUnits = allUnits;
                    let currentDAta = response.data;
                    _allUnits = [..._allUnits, ...currentDAta];
                    setAllUnits(_allUnits);
                }
            })
            .catch((error) => handleError()(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        getSyllabusById(unitId).then((res) => setCurrentSyllabus(res.name));
        getAllUnits(0, pageLimit, unitId, search ? search : '')
            .then((res) => {
                setTotal(res.total);
                setAllUnits(res.data);
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
                addButtonText={<Translate root="syllabuses/[unitId]">{'addButton'}</Translate>}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPageRows([]);
                }}
                searchPlaceholder={Language.get('searchPlaceholder')}
                setOpenCreate={setOpenCreate}
                setSearch={setSearch}
                title={<Translate root="syllabuses/[unitId]">{'title'}</Translate>}
                value={search}
            />
            <Box my={2}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                    <Link as={`/syllabuses`} color="inherit" href={'/syllabuses'}>
                        <Typography>
                            <Translate root="syllabuses/[unitId]">{'breadcrumbs.allSyllabuses'}</Translate>
                        </Typography>
                    </Link>
                    <Typography color="textPrimary">{currentSyllabus}</Typography>
                </Breadcrumbs>
            </Box>
            <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]'}>{'table.heading.snNo'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]'}>{'table.heading.name'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]'}>{'table.heading.syllabus'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]'}>{'table.heading.chapter'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root={'syllabuses/[unitId]'}>{'table.heading.status'}</Translate>
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
                                        let _allUnits = allUnits;
                                        _allUnits.splice(objIndex, 1);
                                        setAllUnits(_allUnits);
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = pageRows;
                                        _pageRows[objIndex].name = editedElement.name;
                                        _pageRows[objIndex].syllabus.name = editedElement.syllabus.name;
                                        setPageRows(_pageRows);
                                    }}
                                    i={i}
                                    key={each._id}
                                    page={page}
                                    pageLimit={pageLimit}
                                    title={Language.get('units')}
                                />
                            ))
                        ) : !loading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={6}>
                                    <Translate root={'syllabuses/[unitId]'}>{'noUnits'}</Translate>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={6}>
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
                    <Translate root={'syllabuses/[unitId]'}>{'addButton'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={<Translate root={'syllabuses/[unitId]'}>{'form.field.name'}</Translate>}
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
                                <CircularProgress size={15} />
                            ) : (
                                <Typography variant={'button'}>
                                    <Translate root={'syllabuses/[unitId]'}>{'addButton'}</Translate>
                                </Typography>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
