/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@#gmail.com\
 * @description Subject page
 * @createdOn 19-Feb-21 9:31 PM
 */
import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../../src/components/Translate';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { createSpecialization, getAllSpecializationsByCourseId } from '../../../src/apis/specialization';
import Pageheadercomponent from '../../../src/components/PageHeaderComponent';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import { useSnackbar } from 'notistack';
import DialogTitle from '../../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useRouter } from 'next/router';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getCourseById } from '../../../src/apis/course';
import SubjectRow from '../../../src/page-components/subject/SubjectRow';
import { useLanguage } from '../../../src/store/LanguageStore';
import TableSkeleton from '../../../src/components/Skeleton/TableSkeleton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useHandleError from '../../../src/hooks/useHandleError';
import { getAllSubjectByCourseId, getAllSubjects } from '../../../src/apis/subjects';
import CropperDialog from '../../../src/components/cropper/CropperDialog';
import theme from '../../../src/theme';
import { uploadFile } from '../../../src/apis/rest.app';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyle = makeStyles(() => ({
    root: {
        width: '100px',
    },
}));

export default function ServerPaginationGrid() {
    const classes = useStyle();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const Router = useRouter();
    const { courseId } = Router.query;
    const Language = useLanguage('courses/[courseId]');
    const [page, setPage] = React.useState(1);
    const [pageRows, setPageRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [allSubjects, setAllSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [value, setValue] = useState('');
    const [shortName, setShortName] = useState('');
    const [creating, setCreating] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentCourse, setCurrentCourse] = useState('');
    const [image, setImage] = useState(null);
    const [src, setSrc] = useState(null);
    const [show, setShow] = useState();
    const [edited, setEdited] = useState(false);
    const [imageFile, setImageFile] = useState('');

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
        if (value.trim() === '') {
            enqueueSnackbar(Language.get('form.validate.name'), { variant: 'warning' });
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
            await createSpecialization(value, _logo, courseId)
                .then((res) => {
                    let _rows = pageRows;
                    _rows.push(res);
                    setPageRows(_rows);
                    setValue('');
                    setSrc(null);
                    setImage('');
                    setImageFile(null);
                    setEdited(false);
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
        getAllSubjectByCourseId(skip, pageLimit, courseId, search ? search : '')
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
        getCourseById(courseId).then((res) => setCurrentCourse(res.name));
        getAllSubjectByCourseId(0, pageLimit, courseId, search ? search : '')
            .then((res) => {
                setTotal(res.total);
                setAllSubjects(res.data);
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
        <React.Fragment>
            <Pageheadercomponent
                addButtonText={<Translate root="courses/[courseId]">{'addButton'}</Translate>}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPageRows([]);
                }}
                searchPlaceholder={<Translate root="courses/[courseId]">{'searchPlaceholder'}</Translate>}
                setOpenCreate={setOpenCreate}
                setSearch={setSearch}
                title={<Translate root="courses/[courseId]">{'title'}</Translate>}
                value={search}
            />
            <Box my={2}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                    <Link color="inherit" href="/courses">
                        <Typography>
                            <Translate root="courses/[courseId]">{'courses.title'}</Translate>
                        </Typography>
                    </Link>
                    <Typography color="textPrimary">{currentCourse}</Typography>
                </Breadcrumbs>
            </Box>
            <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className={classes.root}>
                                <Translate root="courses/[courseId]">{'serialNumber'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root="courses/[courseId]">{'name'}</Translate>
                            </TableCell>
                            <TableCell align="center">
                                <Translate root="courses/[courseId]">{'status'}</Translate>
                            </TableCell>
                            <TableCell align="center" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.length > 0 ? (
                            pageRows.map((each, i) => (
                                <SubjectRow
                                    deleteCallback={(elementToDelete) => {
                                        setPageRows(pageRows.filter((each) => each._id !== elementToDelete._id));
                                    }}
                                    each={each}
                                    editCallback={(editedElement, objIndex) => {
                                        let _pageRows = pageRows;
                                        _pageRows[objIndex].name = editedElement.name;
                                        _pageRows[objIndex].shortName = editedElement.shortName;
                                        _pageRows[objIndex].course.name = editedElement.course.name;
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
                                <TableCell align="center" colSpan={4}>
                                    <Translate root="courses/[courseId]">{'noSubjects'}</Translate>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
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
                    <Translate root="courses/[courseId]">{'addButton'}</Translate>
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
                            label={<Translate root="courses/[courseId]">{'nameLabel'}</Translate>}
                            margin="dense"
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
                                <CircularProgress size={17} />
                            ) : (
                                <Typography variant={'button'}>
                                    <Translate root="courses/[courseId]">{'addButton'}</Translate>
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
