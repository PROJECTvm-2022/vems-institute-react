import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import ExamMoreDetails from '../../src/page-components/Exam-details/ExamMoreDetails';
import { useRouter } from 'next/router';
import { StudentExamResultService } from '../../src/apis/rest.app';
import useHandleError from '../../src/hooks/useHandleError';
// import Button from '@material-ui/core/Button';
import ExamDetailsSkeleton from '../../src/components/Skeleton/ExamDetailsSkeleton';
// import ExamAddDialog from '../../src/page-components/exam/ExamAddDialog';
// import ExamEditDialog from '../../src/page-components/Exam-details/ExamEditDialog';
import { withExamCreateData } from '../../src/store/ExamCreateContext';
import StudentExamMoreDetails from '../../src/page-components/StudentExamDetails/StudentExamMoreDetails';
// import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import DefaultLayout from '../../src/components/Layouts/DefaultLayoutForResult';

const useStyle = makeStyles((theme) => ({
    main: {
        padding: 24,
    },
    gradeDiv: {
        width: '84px',
        height: '30px',
        borderRadius: '5px',
        color: '#fff',
    },
}));

const Index = () => {
    const classes = useStyle();
    const Router = useRouter();
    const handleError = useHandleError();
    const [resultStatus, setResultStatus] = useState(false);
    const { id: studentId } = Router.query;

    // const [examDetails, setExamDetails] = useState(null);
    // const [examDetailsLoading, setExamDetailsLoading] = useState(false);

    // useEffect(() => {
    //     if (!examId) return;
    //     setExamDetailsLoading(true);
    //     ExamService.get(examId, {
    //         query: {
    //             $populate: ['subject', 'syllabus', 'course'],
    //         },
    //     })
    //         .then((res) => {
    //             setExamDetails(res);
    //             setExamDetailsLoading(false);
    //         })
    //         .catch((error) => {
    //             setExamDetailsLoading(false);
    //             handleError()(error);
    //         });
    // }, [examId]);
    const [studentDetails, setStudentDetails] = useState('');
    const [studentLoading, setStudentLoading] = useState(false);
    useEffect(() => {
        if (!studentId) return;
        setStudentLoading(true);
        StudentExamResultService.get(studentId, {
            query: {
                // status: 4,
                // student: studentId,
                // exam: examId,
            },
        })
            .then((res) => {
                setStudentDetails(res);
                // console.log('res',res);
                setStudentLoading(false);
                setResultStatus(true);
            })
            .catch((error) => {
                setStudentLoading(false);
                handleError()(error);
                setResultStatus(false);
            });
    }, [studentId]);
    // console.log('studentDetails', studentDetails);

    const gradeColor = ['#373737', '#003760', '#35931D', '#938E1D', '#FFB800', '#FC8415', '#C73414'];

    // const [tableOpen, setTableOpen] = useState(false);

    // const handleButtonOpen = () => {
    //     setTableOpen(true);
    // };

    return (
        <React.Fragment>
            {resultStatus ? (
                <>
                    <Card className={classes.main}>
                        {studentDetails && !studentLoading ? (
                            <Grid container spacing={1}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <Typography variant={'h4'}>{studentDetails?.exam?.title}</Typography>
                                    <Typography variant="body2">{studentDetails?.exam?.description}</Typography>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography color="textSecondary" variant="body2">
                                                {`Conducted on ${moment(studentDetails.exam.scheduledOn).format(
                                                    'DD/MM/YYYY hh:mm a',
                                                )}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography variant={'h4'}>Name : {studentDetails?.studentName}</Typography>{' '}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography variant="body2">{studentDetails?.description}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography color="textSecondary" variant="body2">
                                                {'Mark: :'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography variant="body2">
                                                {studentDetails?.mark}/{studentDetails?.exam?.mark?.total}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography color="textSecondary" variant="body2">
                                                {'Secured Grade: '}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box display="flex">
                                        <Box alignSelf={'center'} height={'100%'} mr={2}>
                                            <Typography variant="body2">{studentDetails?.grade}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            <ExamDetailsSkeleton />
                        )}
                    </Card>
                    <Box mt={2} />
                    <StudentExamMoreDetails id={studentDetails?.exam?._id} studentDetails={studentDetails} />
                </>
            ) : (
                <Box alignItems={'center'} display={'flex'} height={'100vh'} justifyContent={'center'}>
                    <Typography variant={'h3'}>{'No Result Found'}</Typography>
                </Box>
            )}
        </React.Fragment>
    );
};

Index.layout = DefaultLayout;

export default withExamCreateData(Index);
