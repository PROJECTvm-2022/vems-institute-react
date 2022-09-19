/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description test table
 * @createdOn 28-Dec-20 9:24 PM
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { createSemester, getAllSemesters } from '../../src/apis/semesters';
import useStateObject from '../../src/hooks/useStateObject';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import PageHeaderComponent from '../../src/components/PageHeaderComponent';
import Translate from '../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import DialogTitle from '../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import SemesterRow from '../../src/page-components/semesters/SemesterRow';
import InfiniteScroll from 'react-infinite-scroller';
import TableSkeleton from '../../src/components/Skeleton/TableSkeleton';
import useHandleError from '../../src/hooks/useHandleError';
import { useLanguage } from '../../src/store/LanguageStore';

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        color: theme.palette.primary.main,
    },
}));

const Semesters = () => {
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = React.useState(false);
    const [allSemester, setAllSemester] = useStateObject([]);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [semesterName, setSemesterName] = useState('');
    const [creating, setCreating] = useState(false);

    const handleError = useHandleError();

    const Language = useLanguage();

    const validate = () => {
        if (semesterName.trim() === '') {
            enqueueSnackbar(Language.get('semesters.form.errors.name'), { variant: 'warning' });
            return false;
        } else {
            return true;
        }
    };

    const loadSemester = () => {
        setLoading(true);
        if (loading) return;
        getAllSemesters(allSemester.length, search ? search : '')
            .then((response) => {
                const _allSemester = [...allSemester, ...response.data];
                setAllSemester(_allSemester);
                setLoading(false);
                setHasMore(response.total > _allSemester.length);
            })
            .catch(handleError())
            .finally(() => setLoading(false));
    };

    const handleCreate = () => {
        if (validate()) {
            setCreating(true);
            createSemester(semesterName)
                .then((res) => {
                    setAllSemester([...allSemester, res]);
                    enqueueSnackbar(Language.get('semesters.messages.create'), { variant: 'success' });
                    setSemesterName('');
                })
                .catch(handleError())
                .finally(() => {
                    setCreating(false);
                    setOpenCreate(false);
                });
        }
    };

    return (
        <React.Fragment>
            <PageHeaderComponent
                addButtonText={<Translate>{'semesters.addButton'}</Translate>}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setAllSemester([]);
                }}
                searchPlaceholder={<Translate>{'semesters.searchPlaceholder'}</Translate>}
                setOpenCreate={setOpenCreate}
                setSearch={setSearch}
                title={<Translate>{'semesters.title'}</Translate>}
                value={search}
            />

            <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <Translate>{'tableHeading.serialNumber'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'tableHeading.name'}</Translate>
                            </TableCell>
                            <TableCell align="center" />
                            <TableCell align="center" />
                        </TableRow>
                    </TableHead>
                    <TableBody
                        component={InfiniteScroll}
                        hasMore={hasMore}
                        loadMore={loadSemester}
                        loader={
                            <TableRow>
                                <TableCell align="center" colSpan={6}>
                                    <TableSkeleton />
                                </TableCell>
                            </TableRow>
                        }
                        pageStart={0}
                    >
                        {allSemester.length > 0 ? (
                            allSemester.map((each, i) => (
                                <SemesterRow
                                    deleteCallback={(elementToDelete) => {
                                        setAllSemester(allSemester.filter((each) => each._id !== elementToDelete._id));
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = [...allSemester];
                                        _pageRows[objIndex].name = editedElement.name;
                                        setAllSemester(_pageRows);
                                    }}
                                    i={i}
                                    key={each._id}
                                    page={1}
                                    pageLimit={10}
                                />
                            ))
                        ) : !loading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={5}>
                                    <Translate>{'tableHeading.noSemesters'}</Translate>
                                </TableCell>
                            </TableRow>
                        ) : (
                            ''
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog fullWidth maxWidth={'xs'} onClose={() => setOpenCreate(false)} open={openCreate}>
                <DialogTitle onClose={() => setOpenCreate(false)}>
                    <Translate>{'semesters.addButton'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={<Translate>{'semesters.form.nameLabel'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setSemesterName(e.target.value)}
                            value={semesterName}
                            variant={'outlined'}
                        />
                        <Box mb={2} />
                        <Button color={'primary'} disabled={creating} onClick={handleCreate} variant={'contained'}>
                            {creating ? (
                                <CircularProgress size={28} />
                            ) : (
                                <Translate>{'semesters.form.addButton'}</Translate>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default Semesters;
