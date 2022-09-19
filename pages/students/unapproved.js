/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description Students
 * @createdOn 26/01/21 11:55 PM
 */
import React from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Translate from '../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import InstituteSkeleton from '../../src/components/Skeleton/InstituteSkeleton';
import { StudentSeatService } from '../../src/apis/rest.app';
import StudentGridView from '../../src/page-components/StudentRequests/StudentGridView';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import CourseAutoComplete from '../../src/page-components/Students/CourseAutoComplete';
import { useUser } from '../../src/store/UserContext';

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
}));

const Student = () => {
    const classes = useStyle();
    const [studentData, setStudentData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [course, setCourse] = useState(null);
    const [user] = useUser();

    const query = {
        $skip: studentData.length,
        status: 1,
        $populate: ['student', 'instituteCourse'],
    };
    if (course) query.instituteCourse = course?._id;
    const LoadTeacher = () => {
        StudentSeatService.find({
            query,
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...studentData, ...data];
                setHasMore(result.length < total);
                setStudentData(result);
            })
            .catch(() => {
                setHasMore(false);
            });
    };

    return (
        <>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate root={'students/unapproved'}>{'allStudents'}</Translate>
                        </Typography>
                        {/*<Grid item md={6} sm={12} xs={12}>*/}
                        {course ? (
                            <Box
                                bgcolor={'#ebf5fc'}
                                borderRadius={6}
                                display={'flex'}
                                height={'40px'}
                                justifyContent={'space-between'}
                                // width={'220px'}
                            >
                                <Box alignItems={'center'} display={'flex'} ml={2} mr={4}>
                                    <Typography variant={'subtitle2'}>{'Course: '}</Typography>
                                    <Box ml={1} />
                                    <Typography variant={'body2'}>{course?.course?.name}</Typography>
                                </Box>
                                <IconButton
                                    onClick={() => {
                                        setCourse(null);
                                        setStudentData([]);
                                        setHasMore(true);
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box mt={-1}>
                                <CourseAutoComplete
                                    institute={user?.institute?._id}
                                    label={'Filter by course'}
                                    onSelect={(ev) => setCourse(ev || null)}
                                    setHasMore={setHasMore}
                                    setStudentData={setStudentData}
                                    size="small"
                                />
                            </Box>
                        )}
                        {/*</Grid>*/}
                    </Box>
                </Grid>
            </Grid>
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadTeacher}
                loader={
                    <Box align={'center'} key={'allStudent'} p={2}>
                        <InstituteSkeleton />
                    </Box>
                }
                pageStart={0}
            >
                {studentData && studentData.length ? (
                    <div className={classes.mainDiv}>
                        <Grid container spacing={2}>
                            {studentData.map((each, index) => {
                                return (
                                    <StudentGridView
                                        each={each}
                                        key={each._id}
                                        position={index}
                                        setStudentData={setStudentData}
                                        studentData={studentData}
                                    />
                                );
                            })}
                        </Grid>
                    </div>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box alignItems={'center'} display={'flex'} justifyContent={'center'} mt={2} pl={1.2}>
                        <Translate root={'students/unapproved'}>{'noStudentRequest'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </>
    );
};

export default Student;
