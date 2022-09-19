import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Translate from '../../components/Translate';
import CourseAutocomplete from '../../components/Autocompletes/CourseAutocomplete';
import SubjectAutocomplete from '../../components/Autocompletes/SubjectAutocomplete';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TeacherAutoComplete from '../../components/Autocompletes/TeacherAutocomplete';
import { useExamCreateData } from '../../store/ExamCreateContext';
import { useSnackbar } from 'notistack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CourseService, SyllabusesService } from '../../apis/rest.app';
import CircularProgress from '@material-ui/core/CircularProgress';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        backgroundColor: '#ebf5fc',
        fontSize: 12,
        color: theme.palette.primary.main,
        padding: '4px 10px 4px 10px',
        transition: theme.transitions.create(['box-shadow']),
    },
}))(InputBase);

function CreateExamDialog({ tableOpen, handleClose, setGradeTable, setTableOpen, each }) {
    const Language = useLanguage('all-exams');
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState(each?.title);
    const [description, setDescription] = useState(each && each.description ? each.description : '');
    const [course, setCourse] = useState(each?.course || '');
    const [subject, setSubject] = useState(each?.subject || '');
    const [loading, setLoading] = useState(false);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [options, setOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSubject, setOpenSubject] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const typeList = [
        {
            Type: 1,
            name: 'Fill In TheBlanks',
        },
        {
            Type: 2,
            name: 'Multiple Choice',
        },
    ];

    const [type, setType] = useState('none');
    const [teacherInSyllabus, setTeacherInSyllabus] = useState('');
    const validate = () => {
        if (name === '') {
            enqueueSnackbar(Language.get('validate.name'), { variant: 'warning' });
            return false;
        }
        if (course === '') {
            enqueueSnackbar(Language.get('validate.course'), { variant: 'warning' });
            return false;
        }
        if (subject === '') {
            enqueueSnackbar(Language.get('validate.subject'), { variant: 'warning' });
            return false;
        }
        if (description === '') {
            enqueueSnackbar(Language.get('validate.description'), { variant: 'warning' });
            return false;
        }
        if (type === 'none') {
            enqueueSnackbar(Language.get('validate.type'), { variant: 'warning' });
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
                        $regex: `.*${searchValue}.*`,
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

    const [data, setData] = useExamCreateData();
    const saveExamDetails = () => {
        if (validate()) {
            setData({
                name: name,
                description: description,
                syllabus: subject?._id,
                type: type,
                teacher: teacherInSyllabus?._id,
            });
            setTableOpen(false);
            setGradeTable(true);
            setCourse('');
            setSubject('');
            setName('');
            setDescription('');
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
                    <Translate root={'all-exams'}>{'CreateExam'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label={'Name'}
                        margin={'dense'}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        variant={'outlined'}
                    />
                    <Box mt={1} />
                    {/*{each ? (*/}
                    {/*    <Autocomplete*/}
                    {/*        getOptionLabel={(option) => option && option.name}*/}
                    {/*        loading={loading}*/}
                    {/*        onChange={onSelected}*/}
                    {/*        onClose={() => setOpen(false)}*/}
                    {/*        onOpen={() => {*/}
                    {/*            setOpen(true);*/}
                    {/*        }}*/}
                    {/*        open={open}*/}
                    {/*        options={options}*/}
                    {/*        renderInput={(params) => {*/}
                    {/*            return (*/}
                    {/*                <TextField*/}
                    {/*                    {...params}*/}
                    {/*                    InputProps={{*/}
                    {/*                        ...params.InputProps,*/}
                    {/*                        endAdornment: (*/}
                    {/*                            <React.Fragment>*/}
                    {/*                                {loading ? <CircularProgress color="inherit" size={20} /> : null}*/}
                    {/*                            </React.Fragment>*/}
                    {/*                        ),*/}
                    {/*                    }}*/}
                    {/*                    fullWidth*/}
                    {/*                    margin="dense"*/}
                    {/*                    onChange={handleChange}*/}
                    {/*                    placeholder="Search For Courses"*/}
                    {/*                    value={course?.name}*/}
                    {/*                    variant="outlined"*/}
                    {/*                />*/}
                    {/*            );*/}
                    {/*        }}*/}
                    {/*        style={{ width: '100%' }}*/}
                    {/*        value={course}*/}
                    {/*    />*/}
                    {/*) : (*/}
                    <CourseAutocomplete
                        onSelect={(ev) => setCourse(ev || null)}
                        // institute={institute && institute._id}
                        // searchOnEmpty={Boolean(institute)}
                        size="small"
                    />
                    {/*)}*/}
                    <Box mt={2} />
                    {/*{each ? (*/}
                    {/*    <Autocomplete*/}
                    {/*        getOptionLabel={(option) => option && option?.subject?.name}*/}
                    {/*        loading={loading}*/}
                    {/*        onChange={onSelectedSubject}*/}
                    {/*        onClose={() => setOpenSubject(false)}*/}
                    {/*        onOpen={() => {*/}
                    {/*            setOpenSubject(true);*/}
                    {/*        }}*/}
                    {/*        open={openSubject}*/}
                    {/*        options={subjectOptions}*/}
                    {/*        renderInput={(params) => {*/}
                    {/*            return (*/}
                    {/*                <TextField*/}
                    {/*                    {...params}*/}
                    {/*                    InputProps={{*/}
                    {/*                        ...params.InputProps,*/}
                    {/*                        endAdornment: (*/}
                    {/*                            <React.Fragment>*/}
                    {/*                                {loadingSubject ? (*/}
                    {/*                                    <CircularProgress color="inherit" size={20} />*/}
                    {/*                                ) : null}*/}
                    {/*                            </React.Fragment>*/}
                    {/*                        ),*/}
                    {/*                    }}*/}
                    {/*                    fullWidth*/}
                    {/*                    margin="dense"*/}
                    {/*                    onChange={handleChangeSubject}*/}
                    {/*                    placeholder="Search For Subject"*/}
                    {/*                    value={subject?.subject?.name}*/}
                    {/*                    variant="outlined"*/}
                    {/*                />*/}
                    {/*            );*/}
                    {/*        }}*/}
                    {/*        style={{ width: '100%' }}*/}
                    {/*        value={subject.name}*/}
                    {/*    />*/}
                    {/*) : (*/}
                    <SubjectAutocomplete
                        courseId={course?._id}
                        disabled={course === ''}
                        onSelect={(ev) => setSubject(ev || null)}
                        size="small"
                    />
                    {/*)}*/}
                    <Box mt={2} />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        value={description}
                        variant="outlined"
                    />
                    <Box mt={2} />
                    <Box>
                        <Typography variant={'body2'}>
                            <Translate root={'all-exams'}>{'TypeOfExam'}</Translate>
                        </Typography>
                        <Box mt={0.5} />
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <Select
                                input={<BootstrapInput />}
                                onChange={(e) => {
                                    setType(e?.target?.value);
                                }}
                                value={type}
                            >
                                <MenuItem value={'none'}>
                                    <Translate root={'all-exams'}>{'SelectOneType'}</Translate>
                                </MenuItem>
                                {typeList &&
                                    typeList.map((each) => (
                                        <MenuItem key={each?.Type} value={each?.Type}>
                                            {each?.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mt={2} />
                    <TeacherAutoComplete
                        disabled={subject === ''}
                        onSelect={(ev) => setTeacherInSyllabus(ev || null)}
                        size="small"
                        syllabusId={subject?._id}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color={'secondary'} variant={'outlined'}>
                        <Translate root={'all-exams'}>{'cancel'}</Translate>
                    </Button>
                    <Button color={'primary'} onClick={saveExamDetails} variant={'contained'}>
                        <Translate root={'all-exams'}>{'next'}</Translate>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateExamDialog;

CreateExamDialog.propTypes = {
    each: PropTypes.any,
    position: PropTypes.number,
    tableOpen: PropTypes.any,
    setGradeTable: PropTypes.any,
    setTableOpen: PropTypes.any,
    setHasMore: PropTypes.any,
    handleClose: PropTypes.any,
    saveExamDetails: PropTypes.any,
};
