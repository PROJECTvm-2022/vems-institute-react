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
import Translate from '../../components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import InstituteSkeleton from '../../components/Skeleton/InstituteSkeleton';
import { StudentOfBatchService } from '../../apis/rest.app';
import StudentGridView from '../../page-components/Batch-details/StudentGridView';
import FilterComponentForStudent from '../../page-components/Students/FilterComponentForStudent';

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

const StudentOfABatch = ({ id }) => {
    const classes = useStyle();
    const [studentData, setStudentData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    let removingStudent = 1;

    const LoadStudent = () => {
        StudentOfBatchService.find({
            query: {
                $skip: studentData.length,
                instituteBatch: id,
                $limit: 50,
                role: 1,
                $populate: 'user',
            },
        })
            .then((response) => {
                const { data } = response;
                const result = [...studentData, ...data];
                setHasMore(false);
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
                            <Translate>{'student.allStudents'}</Translate>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <FilterComponentForStudent setSearch={setSearch} setStudentData={setStudentData} />
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadStudent}
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
                            {studentData
                                .filter((each) =>
                                    each?.student?.name.toLowerCase().includes(search?.toLowerCase() || ''),
                                )
                                .map((each, index) => {
                                    return (
                                        <StudentGridView
                                            each={each}
                                            key={each._id}
                                            position={index}
                                            removingStudent={removingStudent}
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
                        <Translate>{'No Students Found'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </>
    );
};

export default StudentOfABatch;
