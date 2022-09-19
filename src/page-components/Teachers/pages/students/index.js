import React from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppsIcon from '@material-ui/icons/Apps';
import StorageIcon from '@material-ui/icons/Storage';
import Box from '@material-ui/core/Box';
import Translate from '../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import StudentGridView from '../../src/page-components/student-component/StudentGridView';
import FilterComponentForStudent from '../../src/page-components/student-component/FilterComponentForStudent';
import { withStudentOnBoardingData } from '../../src/store/StudentOnBoardingContext';
import StudentListView from '../../src/page-components/StudentListView';
import { UserService } from '../../src/apis/rest.app';
import InstituteSkeleton from '../../src/components/Skeleton/InstituteSkeleton';

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
    const [course, setCourse] = useState('none');
    const [viewType, setViewType] = useState(null);
    const [studentData, setStudentData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    // const [studentType, setStudentType] = useState('none');
    const [status, setStatus] = useState('none');
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
        UserService.find({
            query: {
                ...extraQuery,
                $skip: studentData.length,
                role: 1,
                $populate: 'user',
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

    const switchToAllAprovedTeacher = (value) => {
        setStatus(value);
        setStudentData([]);
        setHasMore(true);
    };
    return (
        <>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate>{'student.title'}</Translate>
                        </Typography>
                        <Box alignItems="center" className={classes.buttonDiv} display="flex" justifyContent="center">
                            <Button
                                className={classes.buttonDiv}
                                onClick={() => {
                                    setViewType(!viewType);
                                }}
                            >
                                Switch To
                                {viewType ? (
                                    <AppsIcon className={classes.switchButtonIcon} />
                                ) : (
                                    <StorageIcon className={classes.switchButtonIcon} />
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <FilterComponentForStudent
                course={course}
                search={search}
                setCourse={setCourse}
                setHasMore={setHasMore}
                setSearch={setSearch}
                setStudentData={setStudentData}
                // setStudentType={setStudentType}
                // studentType={studentType}
                switchToAllAprovedTeacher={switchToAllAprovedTeacher}
            />
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
                        {!viewType ? (
                            <Grid container spacing={2}>
                                {studentData.map((each, index) => {
                                    return (
                                        <StudentGridView
                                            each={each}
                                            position={index}
                                            setStudentData={setStudentData}
                                            studentData={studentData}
                                        />
                                    );
                                })}
                            </Grid>
                        ) : (
                            <StudentListView setStudentData={setStudentData} studentData={studentData} />
                        )}
                    </div>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box mt={2} pl={1.2}>
                        <Translate>{'student.form.errors.noTeacher'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
        </>
    );
};

export default withStudentOnBoardingData(Student);
