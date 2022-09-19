import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AssignmentService, CourseService, SyllabusesService, UploadPdfFiles } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Chip from '@material-ui/core/Chip';
import AddBoxIcon from '@material-ui/icons/AddBox';
import useHandleError from '../../hooks/useHandleError';

function CreateExamDialog({ type, tableOpen, handleClose, allAssignments, setAllAssignments, position, each }) {
    const { enqueueSnackbar } = useSnackbar();
    const handleError = useHandleError();

    const [name, setName] = useState(each && each.title ? each.title : '');
    const [description, setDescription] = useState(each && each.description ? each.description : '');

    const [totalMark, setTotalMark] = useState(each?.totalMark || '');
    const [course, setCourse] = useState(each?.course || '');
    const [subject, setSubject] = useState(each?.subject ? { subject: each?.subject } : '');
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [options, setOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSubject, setOpenSubject] = useState(false);

    const [file, setFile] = useState(null);
    const [editFile, setEditFile] = useState(each?.questions?.[0]?.link);

    const handleButtonOpen = () => {
        setFile(null);
        document.getElementById('materialUpload').click();
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const validate = () => {
        if (name.trim() === '') {
            enqueueSnackbar('Title is required', { variant: 'warning' });
            return false;
        }
        if (description.trim() === '') {
            enqueueSnackbar('Description is required', { variant: 'warning' });
            return false;
        }
        if (course === '') {
            enqueueSnackbar('Course is required', { variant: 'warning' });
            return false;
        }
        if (subject === '') {
            enqueueSnackbar('Subject is required', { variant: 'warning' });
            return false;
        }
        if (file === null && !editFile) {
            enqueueSnackbar('Image of question is required', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const onSelected = (event, value) => {
        if (value) {
            setCourse(value);
            setOpen(false);
            setOptions(options.filter((each) => each._id !== value._id));
        }
    };

    const handleChange = (e) => {
        let searchQuery = e.target.value;
        setSubject('');
        setOpen(false);
        setOptions([]);
        if (searchQuery && searchQuery !== '') {
            setLoading(true);
            CourseService.find({
                query: {
                    name: {
                        $regex: `.*${searchQuery}.*`,
                        $options: 'i',
                    },
                },
            }).then((res) => {
                setOptions(res.data);
                setLoading(false);
                setOpen(true);
            });
        }
    };

    const onSelectedSubject = (event, value) => {
        if (value) {
            setSubject(value);
            setOpenSubject(false);
            setSubjectOptions(subjectOptions.filter((each) => each._id !== value._id));
        }
    };

    const handleChangeSubject = (e) => {
        let searchQuery = e.target.value;
        setOpenSubject(false);
        setSubjectOptions([]);
        if (searchQuery && searchQuery !== '') {
            setLoadingSubject(true);
            SyllabusesService.find({
                query: {
                    $limit: 50,
                    $populate: 'subject',
                    course: course?._id,
                },
            }).then((res) => {
                setSubjectOptions(res.data);
                setLoadingSubject(false);
                setOpenSubject(true);
            });
        }
    };

    const saveExamDetails = async () => {
        if (validate()) {
            setCreating(true);
            let _file = editFile;
            if (editFile === null || editFile === undefined) {
                await UploadPdfFiles(file, 'assignments')
                    .then((response) => {
                        _file = response?.cloudfrontPath;
                    })
                    .catch((err) => {
                        handleError()(err);
                        setLoading(false);
                    });
            }
            if (!each) {
                AssignmentService.create(
                    {
                        title: name,
                        description: description,
                        syllabus: subject?._id,
                        questions: [
                            {
                                type: 'image',
                                link: _file,
                            },
                        ],
                        totalMark: totalMark,
                    },
                    {
                        query: {
                            $populate: ['course', 'subject'],
                        },
                    },
                )
                    .then((res) => {
                        setCourse('');
                        setSubject('');
                        setName('');
                        setDescription('');
                        setTotalMark('');
                        setFile(null);
                        setCreating(false);
                        if (type === 1) {
                            setAllAssignments([...allAssignments, res]);
                        }
                        enqueueSnackbar('Assignment created successfully', { variant: 'success' });
                        handleClose();
                    })
                    .catch((error) => {
                        handleError()(error);
                        setCreating(false);
                    });
            } else {
                AssignmentService.patch(
                    each?._id,
                    {
                        title: name,
                        description: description,
                        syllabus: subject?._id,
                        questions: [
                            {
                                type: 'image',
                                link: _file,
                            },
                        ],
                        totalMark: totalMark,
                    },
                    {
                        query: {
                            $populate: ['course', 'subject'],
                        },
                    },
                )
                    .then((res) => {
                        setCreating(false);
                        if (type === 1) {
                            let _assignment = allAssignments;
                            _assignment[position] = res;
                            setAllAssignments([..._assignment]);
                        }
                        enqueueSnackbar('Assignment edited successfully', { variant: 'success' });
                        handleClose();
                    })
                    .catch((error) => {
                        handleError()(error);
                        setCreating(false);
                    });
            }
        }
    };

    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'xs'}
                onClose={() => {
                    handleClose();
                }}
                open={tableOpen}
            >
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    {'Create assignment'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label={'Title'}
                        margin={'dense'}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        variant={'outlined'}
                    />
                    <Box mt={1} />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        value={description}
                        variant="outlined"
                    />
                    <Box mt={1} />
                    <TextField
                        fullWidth
                        label="Total marks"
                        margin={'dense'}
                        onChange={(e) => setTotalMark(e.target.value)}
                        type={'number'}
                        value={totalMark}
                        variant="outlined"
                    />
                    <Box mt={1} />
                    <Autocomplete
                        getOptionLabel={(option) => (option ? option.name : subject?.subject?.name)}
                        loading={loading}
                        onChange={onSelected}
                        onClose={() => setOpen(false)}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        open={open}
                        options={options}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            </React.Fragment>
                                        ),
                                    }}
                                    fullWidth
                                    margin="dense"
                                    onChange={handleChange}
                                    placeholder="Search For Courses"
                                    value={course?.name}
                                    variant="outlined"
                                />
                            );
                        }}
                        style={{ width: '100%' }}
                        value={course}
                    />
                    <Box mt={1} />
                    <Autocomplete
                        disabled={course === ''}
                        getOptionLabel={(option) => (option && option?.subject?.name) || subject?.subject?.name}
                        loading={loading}
                        onChange={onSelectedSubject}
                        onClose={() => setOpenSubject(false)}
                        onOpen={() => {
                            setOpenSubject(true);
                        }}
                        open={openSubject}
                        options={subjectOptions}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loadingSubject ? <CircularProgress color="inherit" size={20} /> : null}
                                            </React.Fragment>
                                        ),
                                    }}
                                    disabled={course === ''}
                                    fullWidth
                                    margin="dense"
                                    onChange={handleChangeSubject}
                                    placeholder="Search For Subject"
                                    value={subject?.subject?.name}
                                    variant="outlined"
                                />
                            );
                        }}
                        style={{ width: '100%' }}
                        value={subject?.subject?.name}
                    />
                    <Box mt={2} />
                    {file || editFile ? (
                        <>
                            <Box
                                alignItems={'center'}
                                display={'flex'}
                                flexDirection={'column'}
                                justfyContent={'center'}
                            >
                                {file && (
                                    <>
                                        <InsertDriveFileIcon color={'primary'} />
                                        <Box display="flex">
                                            <Chip
                                                label={file.name}
                                                onDelete={() => {
                                                    setFile(null);
                                                    setEditFile(null);
                                                }}
                                                style={{ width: '100px', marginTop: 8 }}
                                            />
                                        </Box>
                                    </>
                                )}
                                {editFile && (
                                    <>
                                        <img alt={'Image'} src={editFile} style={{ width: '100%' }} />
                                        <Box display="flex">
                                            <Chip
                                                color={'secondary'}
                                                label={'Clear'}
                                                onClick={() => {
                                                    setFile(null);
                                                    setEditFile(null);
                                                }}
                                                style={{ width: '100px', marginTop: 8 }}
                                            />
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </>
                    ) : (
                        <Box
                            alignItems="center"
                            bgcolor={'#EEF6FF'}
                            borderRadius={4}
                            display="flex"
                            justifyContent="center"
                            onClick={handleButtonOpen}
                            p={1}
                            style={{ cursor: 'pointer' }}
                        >
                            <AddBoxIcon />
                            <Typography variant={'body2'}>{'Attach question here'}</Typography>
                        </Box>
                    )}
                    <input
                        accept="image/jpg, image/jpeg, image/png"
                        id={'materialUpload'}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        type={'file'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{'cancel'}</Button>
                    <Button color={'primary'} disabled={creating} onClick={saveExamDetails} variant={'contained'}>
                        {each ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateExamDialog;

CreateExamDialog.propTypes = {
    type: PropTypes.any,
    each: PropTypes.any,
    position: PropTypes.number,
    tableOpen: PropTypes.any,
    allAssignments: PropTypes.any,
    setAllAssignments: PropTypes.any,
    setGradeTable: PropTypes.any,
    setTableOpen: PropTypes.any,
    setHasMore: PropTypes.any,
    handleClose: PropTypes.any,
    saveExamDetails: PropTypes.any,
};
