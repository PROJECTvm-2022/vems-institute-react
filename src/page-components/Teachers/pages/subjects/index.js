/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Subjects Page
 * @createdOn 26-Dec-20 5:36 PM
 */
import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { createSubject, getAllSubjects } from '../../src/apis/subjects';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pageheadercomponent from '../../src/components/PageHeaderComponent';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Pagination from '@material-ui/lab/Pagination';
import TableContainer from '@material-ui/core/TableContainer';
import DialogTitle from '../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useSnackbar } from 'notistack';
import SubjectsRow from '../../src/page-components/subjects/SubjectRow';
import TableSkeleton from '../../src/components/Skeleton/TableSkeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useLanguage } from '../../src/store/LanguageStore';
import CropperDialog from '../../src/components/cropper/CropperDialog';
import Avatar from '@material-ui/core/Avatar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { uploadFile } from '../../src/apis/rest.app';
import useHandleError from '../../src/hooks/useHandleError';

const useStyle = makeStyles(() => ({
    root: {
        width: '100px',
    },
    image: {
        width: '100%',
        height: '100%',
    },
}));

export default function ServerPaginationGrid() {
    const classes = useStyle();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const [page, setPage] = React.useState(1);
    const [pageRows, setPageRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [allSubjects, setAllSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages] = useState(0);
    const [pageLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [value, setValue] = useState('');
    const [shortName, setShortName] = useState('');
    const [creating, setCreating] = useState(false);
    const [show, setShow] = useState(false);
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [src, setSrc] = useState();

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const validate = () => {
        if (imageFile === '') {
            enqueueSnackbar(Language.get('subjects.form.validate.image'), { variant: 'warning' });
            return false;
        } else if (value.trim() === '') {
            enqueueSnackbar(Language.get('subjects.form.validate.name'), { variant: 'warning' });
            return false;
        } else {
            return true;
        }
    };

    const handleCreate = async () => {
        if (validate()) {
            setCreating(true);
            let _logo;
            await uploadFile(imageFile).then((response) => {
                _logo = response.cloudfrontPath;
            });
            await createSubject(value, _logo)
                .then((res) => {
                    setPageRows([...pageRows, res]);
                    setValue('');
                    setShortName('');
                    setImage('');
                    setImageFile('');
                    enqueueSnackbar(<Translate>{'snackbarMessages.createSubjectSuccess'}</Translate>, {
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
        if (value * pageLimit > allSubjects.length) {
            setPageRows([]);
            if (allSubjects.length === total) {
                let _allSubjects = allSubjects;
                setPageRows(_allSubjects.slice((value - 1) * pageLimit, total));
            } else {
                loadSubjects((value - 1) * pageLimit);
            }
        } else {
            let _allSubjects = allSubjects;
            setPageRows([]);
            setPageRows(_allSubjects.slice((value - 1) * pageLimit, value * pageLimit));
        }
    };

    const loadSubjects = (skip) => {
        setLoading(true);
        getAllSubjects(skip, pageLimit, search ? search : '')
            .then((response) => {
                if (response.data) {
                    setPageRows(response.data);
                    let _allSubjects = allSubjects;
                    let currentDAta = response.data;
                    _allSubjects = [..._allSubjects, ...currentDAta];
                    setAllSubjects(_allSubjects);
                }
            })
            .catch((error) => handleError()(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        getAllSubjects(0, pageLimit, search ? search : '')
            .then((res) => {
                setTotal(res.total);
                setAllSubjects(res.data);
                setPageRows(res.data);
            })
            .catch((error) => handleError()(error))
            .finally(() => {
                setLoading(false);
            });
    }, [search]);

    return (
        <>
            <Pageheadercomponent
                addButtonText={<Translate>{'subjects.addButton'}</Translate>}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPageRows([]);
                }}
                searchPlaceholder={Language.get('subjects.searchPlaceholder')}
                setOpenCreate={setOpenCreate}
                setSearch={setSearch}
                title={<Translate>{'subjects.title'}</Translate>}
                value={search}
            />
            <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className={classes.root}>
                                <Translate>{'tableHeading.serialNumber'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'tableHeading.logo'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'tableHeading.name'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'tableHeading.status'}</Translate>
                            </TableCell>
                            <TableCell align="center" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.length > 0 ? (
                            pageRows.map((each, i) => (
                                <SubjectsRow
                                    deleteCallback={(elementToDelete, objIndex) => {
                                        setPageRows(pageRows.filter((each) => each._id !== elementToDelete._id));
                                        let _allSubjects = allSubjects;
                                        _allSubjects.splice(objIndex, 1);
                                        setAllSubjects(_allSubjects);
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = pageRows;
                                        _pageRows[objIndex].name = editedElement.name;
                                        _pageRows[objIndex].shortName = editedElement.shortName;
                                        _pageRows[objIndex].avatar = editedElement.avatar;
                                        setPageRows(_pageRows);
                                    }}
                                    i={i}
                                    key={each._id}
                                    page={page}
                                    pageLimit={pageLimit}
                                />
                            ))
                        ) : !loading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={6}>
                                    <Translate>{'tableHeading.noSubjects'}</Translate>
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
                    <Translate>{'subjects.addButton'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'} my={2}>
                        <Box
                            alignItems={'flex-end'}
                            display={'flex'}
                            justifyContent={'center'}
                            position={'relative'}
                            width={{ xs: 200, sm: 250 }}
                        >
                            <Avatar alt={'Img'} className={classes.image} src={image} variant={'square'} />
                            <IconButton
                                bgcolor={'common.white'}
                                bottom={10}
                                component={Box}
                                onClick={() => setShow(true)}
                                position={'absolute'}
                                right={10}
                            >
                                <AddAPhotoIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={<Translate>{'subjects.nameLabel'}</Translate>}
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
                                    <Translate>{'subjects.addButton'}</Translate>
                                </Typography>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <CropperDialog
                aspectRatio={1}
                cancel={() => {
                    setShow(false);
                    setSrc(null);
                }}
                cancelLabel={'Cancel'}
                dismiss={() => {
                    setShow(false);
                }}
                okLabel={'Save'}
                onCropped={(data) => {
                    setShow(false);
                    setImage(data);
                    setImageFile(dataURLtoFile(data, 'imageToUpload.png'));
                }}
                onSelected={(s) => {
                    setSrc(s);
                }}
                show={show}
                src={src}
            />
        </>
    );
}
