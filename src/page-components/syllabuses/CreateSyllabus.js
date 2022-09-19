// import React, { useEffect, useState } from 'react';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
// import Translate from '../../components/Translate';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import DialogContent from '@material-ui/core/DialogContent';
// import TextField from '@material-ui/core/TextField';
// import CreateAutocomplete from './CreateAutoComplete';
// import Button from '@material-ui/core/Button';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import Dialog from '@material-ui/core/Dialog';
// import { createSyllabus, getAllSyllabuses } from '../../apis/syllabuses';
// import { useLanguage } from '../../store/LanguageStore';
// import { useSnackbar } from 'notistack';
// import { getAllCourses } from '../../apis/course';
// import { getAllSubjects } from '../../apis/subjects';
// import { getAllSpecializations } from '../../apis/specialization';
// import { getAllSemesters } from '../../apis/semesters';
// import { getAllInstitutes } from '../../apis/institutes';
//
// const CreateSyllabus = ({show, dismiss }) => {
//     const Language = useLanguage();
//     const { enqueueSnackbar } = useSnackbar();
//     const [creating, setCreating] = useState(false);
//     const [coursesList, setCoursesList] = useState([]);
//     const [semestersList, setSemestersList] = useState([]);
//     const [subjectsList, setSubjectsList] = useState([]);
//     const [specializationsList, setSpecializationsList] = useState([]);
//     const [instituteList, setInstituteList] = useState([]);
//     const [courseValue, setCourseValue] = useState('');
//     const [semesterValue, setSemesterValue] = useState('');
//     const [subjectValue, setSubjectValue] = useState('');
//     const [specializationValue, setSpecializationValue] = useState('');
//     const [nameValue, setNameValue] = useState('');
//     const [instituteValue, setInstituteValue] = useState('');
//     const [courseSearch, setCourseSearch] = useState('');
//     const [instituteSearch, setInstituteSearch] = useState('');
//     const [semesterSearch, setSemesterSearch] = useState('');
//     const [subjectSearch, setSubjectSearch] = useState('');
//     const [speacializationSearch, setSpecializationSearch] = useState('');
//     const [publishValue, setPublishValue] = useState('');
//
//     const validate = () => {
//         if (nameValue.trim() === '') {
//             enqueueSnackbar(Language.get('snackbarMessages.provideSyllabusName'), { variant: 'warning' });
//             return false;
//         } else if (!courseValue) {
//             enqueueSnackbar(Language.get('snackbarMessages.selectCourse'), { variant: 'warning' });
//             return false;
//         } else if (!subjectValue) {
//             enqueueSnackbar(Language.get('snackbarMessages.selectSubject'), { variant: 'warning' });
//             return false;
//         } else if (!semesterValue) {
//             enqueueSnackbar(Language.get('snackbarMessages.selectSemester'), { variant: 'warning' });
//             return false;
//         } else if (!specializationValue) {
//             enqueueSnackbar(Language.get('snackbarMessages.selectSpecialization'), { variant: 'warning' });
//             return false;
//         } else if (!instituteValue) {
//             enqueueSnackbar(Language.get('snackbarMessages.selectInstitute'), { variant: 'warning' });
//             return false;
//         } else if (publishValue.trim() === '') {
//             enqueueSnackbar(Language.get('snackbarMessages.providePublishValue'), { variant: 'warning' });
//             return false;
//         } else {
//             return true;
//         }
//     };
//
//     const handleCreate = () => {
//         if (validate()) {
//             setCreating(true);
//             createSyllabus(
//                 nameValue,
//                 courseValue._id,
//                 specializationValue._id,
//                 subjectValue._id,
//                 semesterValue._id,
//                 instituteValue._id,
//                 publishValue,
//             )
//                 .then((res) => {
//                     let _rows = pageRows;
//                     _rows.push(res);
//                     setPageRows(_rows);
//                     setNameValue('');
//                     setPublishValue('');
//                     enqueueSnackbar(Language.get('snackbarMessages.createSyllabusSuccess'), {
//                         variant: 'success',
//                     });
//                 })
//                 .catch((error) => {
//                     enqueueSnackbar(
//                         error.message && error.message
//                             ? error.message
//                             : Language.get('snackbarMessages.somethingWentWrong'),
//                         {
//                             variant: 'warning',
//                         },
//                     );
//                 })
//                 .finally(() => {
//                     setCreating(false);
//                     setOpenCreate(false);
//                 });
//         }
//     };
//
//     return (
//         <React.Fragment>
//             <Dialog fullWidth maxWidth={'xs'} onClose={() => setOpenCreate(false)} open={openCreate}>
//                 <DialogTitle>
//                     <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
//                         <Typography variant={'h6'}>
//                             <Translate>{'syllabuses.addButton'}</Translate>
//                         </Typography>
//                         <IconButton onClick={() => setOpenCreate(false)}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box pb={1} display={'flex'} flexDirection={'column'}>
//                         <TextField
//                             value={nameValue}
//                             onChange={(e) => setNameValue(e.target.value)}
//                             variant={'outlined'}
//                             label={Language.get('courses.nameLabel')}
//                         />
//                         <Box mb={2} />
//                         <CreateAutocomplete
//                             value={courseValue}
//                             setValue={setCourseValue}
//                             list={coursesList}
//                             search={courseSearch}
//                             setSearch={setCourseSearch}
//                             label={Language.get('tableHeading.courses')}
//                         />
//                         <CreateAutocomplete
//                             value={subjectValue}
//                             setValue={setSubjectValue}
//                             list={subjectsList}
//                             search={subjectSearch}
//                             setSearch={setSubjectSearch}
//                             label={Language.get('tableHeading.subjects')}
//                         />
//                         <CreateAutocomplete
//                             value={semesterValue}
//                             setValue={setSemesterValue}
//                             list={semestersList}
//                             search={semesterSearch}
//                             setSearch={setSemesterSearch}
//                             label={Language.get('tableHeading.semesters')}
//                         />
//                         <CreateAutocomplete
//                             value={specializationValue}
//                             setValue={setSpecializationValue}
//                             list={specializationsList}
//                             search={speacializationSearch}
//                             setSearch={setSpecializationSearch}
//                             label={Language.get('tableHeading.specializations')}
//                         />
//                         <CreateAutocomplete
//                             value={instituteValue}
//                             setValue={setInstituteValue}
//                             list={instituteList}
//                             search={instituteSearch}
//                             setSearch={setInstituteSearch}
//                             label={Language.get('tableHeading.institutes')}
//                         />
//                         <TextField
//                             value={publishValue}
//                             onChange={(e) => setPublishValue(e.target.value)}
//                             variant={'outlined'}
//                             label={Language.get('tableHeading.publishYear')}
//                             fullWidth
//                             type={'number'}
//                         />{' '}
//                         <Box mb={2} />
//                         <Button
//                             disabled={creating}
//                             onClick={() => handleCreate()}
//                             variant={'contained'}
//                             color={'primary'}
//                             size={'large'}
//                         >
//                             {creating ? (
//                                 <CircularProgress size={15} />
//                             ) : (
//                                 <Typography variant={'button'}>
//                                     <Translate>{'syllabuses.addButton'}</Translate>
//                                 </Typography>
//                             )}
//                         </Button>
//                     </Box>
//                 </DialogContent>
//             </Dialog>
//         </React.Fragment>
//     );
// };
//
// export default CreateSyllabus;
