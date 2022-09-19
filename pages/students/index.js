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
import { CreateUser, StudentSeatService } from '../../src/apis/rest.app';
import StudentGridView from '../../src/page-components/Students/StudentGridView';
import FilterComponentForStudent from '../../src/page-components/Students/FilterComponentForStudent';
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
    const [search, setSearch] = useState('');
    const LoadTeacher = () => {
        let extraQuery = {};
        if (search !== '') {
            extraQuery = {
                name: {
                    $regex: `.*${search}.*`,
                    $options: 'i',
                },
            };
        }
        StudentSeatService.find({
            query: {
                ...extraQuery,
                $skip: studentData.length,
                $populate: 'student',
                status: 2,
            },
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
                            <Translate root={'students'}>{'allStudents'}</Translate>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <FilterComponentForStudent setHasMore={setHasMore} setSearch={setSearch} setStudentData={setStudentData} />
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
                    <Box mt={2} pl={1.2}>
                        <Translate root={'students'}>{'noStudent'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </>
    );
};

export default Student;
