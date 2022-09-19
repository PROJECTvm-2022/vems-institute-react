import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Translate from '../../../src/components/Translate';
import { ExamService, StudentExamService } from '../../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import { useLanguage } from '../../../src/store/LanguageStore';
import ExamTableView from '../../../src/page-components/students-in-exam/ExamTableView';
import { useRouter } from 'next/router';
import useHandleError from '../../../src/hooks/useHandleError';

const StudentInExam = () => {
    const Router = useRouter();
    const { id } = Router.query;
    const Language = useLanguage('students-in-exam/[id]');
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [allExam, setAllExams] = useState([]);
    const [examDetails, setExamDetails] = useState();
    const handleError = useHandleError();

    useEffect(() => {
        if (!id) return;
        ExamService.get(id, {
            query: {
                $populate: ['subject', 'syllabus', 'course'],
            },
        })
            .then((res) => {
                setExamDetails(res);
            })
            .catch((error) => {
                handleError()(error);
            });
    }, [id]);

    const LoadInst = () => {
        let query = {};
        if (!examDetails) return;
        if (examDetails?.status === 2) {
            query = {
                exam: id,
                status: examDetails?.status,
                $populate: 'student',
            };
        } else if (examDetails?.status === 3) {
            query = {
                exam: id,
                status: examDetails?.status,
                attendanceStatus: { $in: [2, 3] },
                $populate: 'student',
            };
        } else {
            query = {
                exam: id,
                status: examDetails?.status,
                attendanceStatus: 3,
                $populate: 'student',
            };
        }
        StudentExamService.find({ query })
            .then((response) => {
                const { data, total } = response;
                const result = [...allExam, ...data];
                setHasMore(result.length < total);
                setAllExams(result);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
            });
    };

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'students-in-exam/[id]'}>{'title'}</Translate>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box mt={2} />
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadInst}
                loader={
                    <Box align={'center'} key={'allStudent'} pb={1} pt={1}>
                        <CircularProgress size={28} />
                    </Box>
                }
                pageStart={0}
            >
                {allExam.length ? (
                    <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Translate root={'students-in-exam/[id]'}>{'avatar'}</Translate>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Translate root={'students-in-exam/[id]'}>{'examName'}</Translate>
                                    </TableCell>
                                    <TableCell>
                                        <Translate root={'students-in-exam/[id]'}>{'email'}</Translate>
                                    </TableCell>
                                    <TableCell>
                                        <Translate root={'students-in-exam/[id]'}>{'phone'}</Translate>
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allExam.map((each, index) => (
                                    <ExamTableView
                                        allExam={allExam}
                                        each={each}
                                        id={id}
                                        key={each._id}
                                        position={index}
                                        setAllExams={setAllExams}
                                        setHasMore={setHasMore}
                                        type={examDetails?.status}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box
                        alignItems={'center'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        mt={5}
                    >
                        <Box mt={3} width={450}>
                            <Typography align={'center'} variant={'h3'}>
                                <Translate root={'exams'}>{'No Student Found'}</Translate>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </InfiniteScroll>
        </React.Fragment>
    );
};

export default StudentInExam;
