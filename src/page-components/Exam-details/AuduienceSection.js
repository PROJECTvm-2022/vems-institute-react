/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 08/04/21 02:34 PM
 */

import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import useHandleError from '../../hooks/useHandleError';
import { StudentExamService } from '../../apis/rest.app';
import ReportSkeleton from '../../components/Skeleton/ReportSkeleton';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import Translate from '../../components/Translate';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import * as XLSX from 'xlsx';

const AuduienceSection = ({ examDetails }) => {
    const Language = useLanguage();
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();

    const { id: examId } = Router.query;
    const { scheduleExamId } = Router.query;

    const [allGrades, setAllGrades] = useState([]);
    const [newStudents, setNewStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    // console.log('examId',examId,'scheduleExamId',scheduleExamId);
    const onSelectImageFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                // evt = on_file_select event
                /* Parse data */
                const bstr = evt.target.result;

                const workbook = XLSX.read(bstr, { type: 'binary' });

                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    const sheet = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    setNewStudents(
                        sheet
                            .map((each) => {
                                return { name: each?.Name, email: each?.Name_1 };
                            })
                            .filter((each) => each.email),
                    );
                });
            };
            reader.readAsBinaryString(file);
        }
    };

    // console.log('new students',newStudents);
    const scheduleTheExam = () => {
        setLoading(true);
        StudentExamService.create({
            exam: scheduleExamId,
            // exam: examDetails?._id,
            // entityType: 'exam',
            // students: [{name: 'sisira', email: 'coolSisira1998@gmail.com'}],
            students: newStudents,
        })
            .then(() => {
                setLoading(false);
                setOpen(false);
                enqueueSnackbar(Language.get('successMessage.scheduled'), { variant: 'success' });
                // if (schedule) {
                //     Router.push(`/exam-details/${each._id}`);
                // }
            })
            .catch((err) => {
                handleError()(err);
                setLoading(false);
                setOpen(false);
            });
    };

    // const breakDown = (mixedString) => {
    //     // ABCD(1)
    //
    //     const match = mixedString.toString().match(/^([a-zA-Z0-9_ ]*)\(*([a-zA-Z0-9_ ]*)\)*$/);
    //
    //     if (match && Array.isArray(match) && match.length === 3 && match[2] !== '') {
    //         // console.log(mixedString, match, {
    //         //     name: match[1],
    //         //     value: match[2],
    //         // });
    //         return {
    //             name: match[1],
    //             value: match[2],
    //         };
    //     } else {
    //         return {
    //             name: mixedString,
    //             value: mixedString,
    //         };
    //     }
    // };

    // console.log('scheduledExam',scheduleExamId)
    // console.log('examId',examId);
    useEffect(() => {
        setLoading(true);
        StudentExamService.find({
            query: {
                exam: scheduleExamId,
                $populate: ['student', 'institute'],
                $limit: -1,
                $sort: {
                    createdAt: -1,
                },
            },
        })
            .then((res) => {
                // console.log('res....',res);
                setAllGrades(res);
                setLoading(false);
            })
            .catch((error) => {
                handleError()(error);
                setLoading(false);
            });
    }, []);

    // console.log('all',allGrades);
    // const gradeColor = ['#373737', '#003760', '#35931D', '#938E1D', '#FFB800', '#FC8415', '#C73414'];

    // const data = [
    //     {
    //         id: 1,
    //         title: 'Average Marks',
    //         image: GradeImage,
    //         value: `${allGrades.averageScore}`,
    //     },
    //     {
    //         id: 2,
    //         title: 'Average percentage',
    //         image: PercentageImage,
    //         value: `${allGrades.averagePercentage}%`,
    //     },
    // ];

    return (
        <React.Fragment>
            {examDetails?.status === 1 && (
                <Box display={'flex'} justifyContent={'flex-end'} width={'100%'}>
                    <Button
                        color={'primary'}
                        onClick={() => {
                            window.open(
                                `http://api.vems.smarttersstudio.in/uploads/2022/0628/1656397518117Exam Details - Sheet1 (2).csv`,
                            );
                        }}
                        variant={'outlined'}
                    >
                        Sample File
                    </Button>
                    <Box mr={2} />
                    <Button
                        color={'primary'}
                        onClick={() => {
                            setOpen(true);
                        }}
                        variant={'contained'}
                    >
                        Add More Students
                    </Button>
                </Box>
            )}
            {allGrades?.length ? (
                <React.Fragment>
                    <Typography>{'List of all Students'}</Typography>
                    <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{'SL. No'}</TableCell>
                                    <TableCell align="center">{'Name'}</TableCell>
                                    <TableCell align="center">{'Email'}</TableCell>
                                    <TableCell align="center">{'Marks'}</TableCell>
                                    {/*<TableCell align="center">{'Grade'}</TableCell>*/}
                                    {/*<TableCell align="center" />*/}
                                    {/*<TableCell align="center" />*/}
                                    {/*<TableCell align="center" />*/}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {allGrades?.map((each, index) => (
                                    <>
                                        <TableRow key={each?._id}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center">{each?.studentName}</TableCell>
                                            <TableCell align="center">{each?.student?.email}</TableCell>
                                            {/*<TableCell align="center">*/}
                                            {/*    {each?.instituteBatch?.institute?.name}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell align="center">*/}
                                            {/*    {each.instituteBatch.instituteBatch?.name}*/}
                                            {/*</TableCell>*/}
                                            <TableCell align="center">{each?.exam?.mark?.total || '---'}</TableCell>
                                            {/*<TableCell align="center">{each?.grade || '---'}</TableCell>*/}
                                            {/*<TableCell>*/}
                                            {/*    <Button*/}
                                            {/*        color={'primary'}*/}
                                            {/*        href={`/student-exam-details/${examId}?studentId=${each?.student?._id}`}*/}
                                            {/*    >*/}
                                            {/*        {'View Report'}*/}
                                            {/*    </Button>*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell>*/}
                                            {/*    <Button*/}
                                            {/*        as={'/students/[studentId]'}*/}
                                            {/*        color="primary"*/}
                                            {/*        href={`/students/${each?.student?._id}`}*/}
                                            {/*        variant="contained"*/}
                                            {/*    >*/}
                                            {/*        <Translate>{'student.view_profile'}</Translate>*/}
                                            {/*    </Button>*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell>*/}
                                            {/*    <Button*/}
                                            {/*        as={'/students/[studentId]'}*/}
                                            {/*        color="primary"*/}
                                            {/*        href={`/all-exams/${each?.student?._id}`}*/}
                                            {/*        variant="contained"*/}
                                            {/*    >*/}
                                            {/*        <Translate>{'Exams'}</Translate>*/}
                                            {/*    </Button>*/}
                                            {/*</TableCell>*/}
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </React.Fragment>
            ) : !loading ? (
                <Box display={'flex'} justifyContent={'center'} m={3}>
                    <Typography variant={'h2'}>{'No Audience'}</Typography>
                </Box>
            ) : (
                <ReportSkeleton />
            )}
            <Dialog
                fullWidth
                maxWidth={'sm'}
                onClose={() => {
                    handleClose();
                }}
                open={open}
            >
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    <Translate root={'all-exams'}>{'Add Students'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
                        <Box
                            border={1}
                            borderColor={'#858585'}
                            borderRadius={5}
                            display={'flex'}
                            flexDirection={'column'}
                            p={1.5}
                            width={'100%'}
                        >
                            <input  hidden id="user-image" onChange={onSelectImageFile} type="file" />
                        </Box>
                    </Box>
                    <>
                        <Box mb={2} />
                        <Button
                            color={'primary'}
                            fullWidth
                            onClick={() => {
                                scheduleTheExam();
                            }}
                            variant={'contained'}
                        >
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate root={'all-exams'}>{'Add Students'}</Translate>
                            )}
                        </Button>
                        <Box mb={2} />
                    </>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default AuduienceSection;
