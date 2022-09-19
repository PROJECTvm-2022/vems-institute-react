import * as React from 'react';
import { useEffect, useState } from 'react';
import { createCourse, getAllCourses, getAllCoursesOfInstitutes } from '../../src/apis/course';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pageheadercomponent from '../../src/components/PageHeaderComponent';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Pagination from '@material-ui/lab/Pagination';
import useStateObject from '../../src/hooks/useStateObject';
import { useSnackbar } from 'notistack';
import DialogTitle from '../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CourseRow from '../../src/page-components/courses/CourseRow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableSkeleton from '../../src/components/Skeleton/TableSkeleton';
import { useLanguage } from '../../src/store/LanguageStore';
import useHandleError from '../../src/hooks/useHandleError';
import CropperDialog from '../../src/components/cropper/CropperDialog';
import { InstituteService, uploadFile } from '../../src/apis/rest.app';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useRouter } from 'next/router';

const useStyle = makeStyles(() => ({
    root: {
        width: '100px',
    },
}));

export default function ServerPaginationGrid() {
    const classes = useStyle();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [pageRows, setPageRows] = useStateObject([]);
    const [allCourses, setAllCourses] = useStateObject([]);
    const [total, setTotal] = useState(0);
    const [pageLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [value, setValue] = useState('');
    const [commission, setCommission] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [image, setImage] = useState(null);
    const [src, setSrc] = useState(null);
    const [show, setShow] = useState();
    const [edited, setEdited] = useState(false);
    const [imageFile, setImageFile] = useState('');

    const [creating, setCreating] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [selected, setSelected] = useState(false);

    const Router = useRouter();

    const { institute } = Router.query;
    const [instituteData, setInstituteData] = useState([]);
    const [instituteNameLoading, setInstituteNameLoading] = useState(false);

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
        if (image === null) {
            enqueueSnackbar(Language.get('courses.form.validate.avatar'), { variant: 'warning' });
            return false;
        } else if (value.trim() === '') {
            enqueueSnackbar(Language.get('courses.form.validate.name'), { variant: 'warning' });
            return false;
        } else if (commission.trim() === '') {
            enqueueSnackbar(Language.get('courses.form.validate.commissionName'), { variant: 'warning' });
            return false;
        } else if (!/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(commission)) {
            enqueueSnackbar(Language.get('courses.form.validate.validCommissionName'), { variant: 'warning' });
            return false;
        } else if (maxPrice.trim() === '') {
            enqueueSnackbar(Language.get('courses.form.validate.maxPrice'), { variant: 'warning' });
            return false;
        } else if (!/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(maxPrice)) {
            enqueueSnackbar(Language.get('courses.form.validate.validMaxPrice'), { variant: 'warning' });
            return false;
        } else {
            return true;
        }
    };

    const handleCreate = async () => {
        if (validate()) {
            setCreating(true);
            let _logo = image;
            if (edited) {
                await uploadFile(imageFile).then((response) => {
                    _logo = response.cloudfrontPath;
                });
            }
            await createCourse(value, _logo, commission, maxPrice)
                .then((res) => {
                    let _rows = pageRows;
                    _rows.push(res);
                    setPageRows(_rows);
                    setValue('');
                    setCommission('');
                    setMaxPrice('');
                    setSrc(null);
                    setImage('');
                    setImageFile(null);
                    setEdited(false);
                    enqueueSnackbar(<Translate>{'snackbarMessages.createCourseSuccess'}</Translate>, {
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
        if (value * pageLimit > allCourses.length) {
            setPageRows([]);
            if (allCourses.length === total) {
                let _allCourses = allCourses;
                setPageRows(_allCourses.slice((value - 1) * pageLimit, total));
            } else {
                loadCourses((value - 1) * pageLimit);
            }
        } else {
            let _allSemester = allCourses;
            setPageRows([]);
            setPageRows(_allSemester.slice((value - 1) * pageLimit, value * pageLimit));
        }
    };

    const loadCourses = (skip) => {
        setLoading(true);
        if (institute) {
            getAllCoursesOfInstitutes(skip, pageLimit, search ? search : '', institute)
                .then((response) => {
                    if (response.data) {
                        setPageRows(response.data);
                        let _allCourses = allCourses;
                        let currentDAta = response.data;
                        _allCourses = [..._allCourses, ...currentDAta];
                        setAllCourses(_allCourses);
                    }
                })
                .catch((error) => handleError()(error))
                .finally(() => setLoading(false));
        } else {
            getAllCourses(skip, pageLimit, search ? search : '')
                .then((response) => {
                    if (response.data) {
                        setPageRows(response.data);
                        let _allCourses = allCourses;
                        let currentDAta = response.data;
                        _allCourses = [..._allCourses, ...currentDAta];
                        setAllCourses(_allCourses);
                    }
                })
                .catch((error) => handleError()(error))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        setInstituteNameLoading(true);
        InstituteService.find({
            query: {
                _id: institute,
            },
        })
            .then((res) => {
                setInstituteData(res.data);
            })
            .catch((error) => {
                handleError()(error);
            })
            .finally(() => {
                setInstituteNameLoading(false);
            });
    }, []);

    useEffect(() => {
        if (institute) {
            setLoading(true);
            getAllCoursesOfInstitutes(0, pageLimit, search ? search : '', institute)
                .then((res) => {
                    setTotal(res.total);
                    setAllCourses(res.data);
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
        } else {
            setLoading(true);
            getAllCourses(0, pageLimit, search ? search : '')
                .then((res) => {
                    setTotal(res.total);
                    setAllCourses(res.data);
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
        }
    }, [search]);

    const getTitle = () => {
        if (!institute) {
            return `${Language.get('courses.title')}`;
        } else {
            return `${
                Language.get('courses.title') + ' ' + Language.get('courses.of') + ' ' + instituteData?.[0]?.name
            }`;
        }
    };

    return (
        <React.Fragment>
            {!instituteNameLoading && (
                <Pageheadercomponent
                    addButtonText={institute ? false : Language.get('courses.addButton')}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageRows([]);
                    }}
                    searchPlaceholder={Language.get('courses.searchPlaceholder')}
                    selected={selected}
                    setOpenCreate={setOpenCreate}
                    setSearch={setSearch}
                    setSelected={setSelected}
                    title={getTitle()}
                    value={search}
                />
            )}
            <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className={classes.root}>
                                <Translate>{'courses.serialNumber'}</Translate>
                            </TableCell>
                            {!institute && (
                                <TableCell align="center">
                                    <Translate>{'courses.avatar'}</Translate>
                                </TableCell>
                            )}
                            <TableCell align="center">
                                <Translate>{'courses.nameLabel'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'courses.commissionName'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate>{'courses.maxPrice'}</Translate>
                            </TableCell>
                            {institute && (
                                <TableCell align="center">
                                    <Translate>{'courses.priceByInstitute'}</Translate>
                                </TableCell>
                            )}
                            <TableCell align="center">
                                <Translate>{'courses.status'}</Translate>
                            </TableCell>
                            {!institute && <TableCell align="center" />}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.length > 0 ? (
                            pageRows.map((each, i) => (
                                <CourseRow
                                    deleteCallback={(elementToDelete, objIndex) => {
                                        setPageRows(pageRows.filter((each) => each._id !== elementToDelete._id));
                                        let _allCourses = allCourses;
                                        _allCourses.splice(objIndex, 1);
                                        setAllCourses(_allCourses);
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = pageRows;
                                        _pageRows[objIndex].name = editedElement.name;
                                        _pageRows[objIndex].avatar = editedElement.avatar;
                                        _pageRows[objIndex].commission = editedElement.commission;
                                        _pageRows[objIndex].maxPrice = editedElement.maxPrice;
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
                                <TableCell align="center" colSpan={7}>
                                    <Translate>{'tableHeading.noCourses'}</Translate>
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
                    <Translate>{'courses.addButton'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box alignItems={'center'} component={Box} display={'flex'} flexDirection={'column'}>
                        {image && (
                            <Box display={'flex'} height={{ xs: 200, sm: 300 }} my={2} width={{ xs: 200, sm: 300 }}>
                                <img alt="" src={image} width={'100%'} />
                                <Box ml={-5}>
                                    <IconButton
                                        onClick={() => {
                                            setImage(null);
                                        }}
                                    >
                                        <DeleteIcon color={'secondary'} />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}
                    </Box>
                    {!image && (
                        <Button
                            bgcolor={theme.palette.background.cropper}
                            border={1}
                            borderColor={'primary.main'}
                            borderRadius={'borderRadius'}
                            component={Box}
                            fullWidth
                            height={200}
                            my={2}
                            onClick={() => setShow(true)}
                        >
                            <Typography>
                                <Translate>{'upload'}</Translate>
                            </Typography>
                        </Button>
                    )}
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={<Translate>{'courses.nameLabel'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                            variant={'outlined'}
                        />
                        <TextField
                            label={<Translate>{'courses.commissionName'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setCommission(e.target.value)}
                            type={'number'}
                            value={commission}
                            variant={'outlined'}
                        />
                        <TextField
                            label={<Translate>{'courses.commissionName'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            type={'number'}
                            value={maxPrice}
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
                                    <Translate>{'courses.addButton'}</Translate>
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
                    setEdited(true);
                    setImageFile(dataURLtoFile(data, 'imageToUpload.png'));
                }}
                onSelected={(s) => {
                    setSrc(s);
                }}
                show={show}
                src={src}
            />
        </React.Fragment>
    );
}
