import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppsIcon from '@material-ui/icons/Apps';
import StorageIcon from '@material-ui/icons/Storage';
import TeacherGridView from '../../src/page-components/teacher-components/TeacherGridView';
import InfiniteScroll from 'react-infinite-scroller';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../src/components/Translate';
import { getAllTeachers } from '../../src/apis/teachers';
import FilterComponent from '../../src/page-components/teacher-components/FilterComponent';
import TeacherAddDialog from '../../src/page-components/teacher-components/TeacherAddDialog';
import { withTeacherOnBoardingData } from '../../src/store/TeacherOnBoardingContext';
import TeacherListView from '../../src/page-components/teacher-components/TeacherListView';
import { CitiesService, StatesService } from '../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
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

const Teacher = () => {
    const classes = useStyle();
    const [hasMore, setHasMore] = useState(true);
    const [viewType, setViewType] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [teacherData, setTeacherData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [stateId, setStateId] = useState('none');
    const [stateList, setStateList] = React.useState([]);
    const [state, setState] = useState('none');
    const { enqueueSnackbar } = useSnackbar();

    const [city, setCity] = useState('none');
    const [cityList, setCityList] = useState([]);

    const handleButtonOpen = () => {
        setOpenAddDialog(true);
    };

    const updateTeacher = (data) => {
        let _teacherData = teacherData;
        _teacherData = [data, ..._teacherData];
        setTeacherData(_teacherData);
    };
    const LoadTeachers = () => {
        setLoading(true);
        getAllTeachers(teacherData.length, {
            name: {
                $regex: search.trim() !== '' ? `.*${search}.*` : '',
                $options: 'i',
            },
            state: {
                $regex: state !== 'none' ? `.*${state}.*` : '',
                $options: 'i',
            },
            city: {
                $regex: city !== 'none' ? `.*${city}.*` : '',
                $options: 'i',
            },
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...teacherData, ...data];
                setHasMore(result.length < total);
                setTeacherData(result);
                setLoading(false);
            })
            .catch(() => {
                setHasMore(false);
            });
    };
    useEffect(() => {
        StatesService.find()
            .then((response) => {
                setStateList(response);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
            });
    }, []);

    useEffect(() => {
        if (stateId !== 'none')
            CitiesService.find({
                query: {
                    state: stateId,
                },
            })
                .then((response) => {
                    setCityList(response);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something Went Wrong!', { variant: 'error' });
                });
    }, [stateId]);

    return (
        <>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate>{'teacher.title'}</Translate>
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

                            <Button
                                color="primary"
                                disabled={loading}
                                onClick={handleButtonOpen}
                                size="large"
                                variant="contained"
                            >
                                <Translate>{'teacher.form.button.addTeacher'}</Translate>
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <FilterComponent
                city={city}
                cityList={cityList}
                search={search}
                setCity={setCity}
                setHasMore={setHasMore}
                setSearch={setSearch}
                setState={setState}
                setStateId={setStateId}
                setTeacherData={setTeacherData}
                stateId={stateId}
                stateList={stateList}
            />
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadTeachers}
                loader={
                    <Box align={'center'} key={'allInstitute'} padding={2}>
                        <InstituteSkeleton />
                    </Box>
                }
                pageStart={0}
            >
                {teacherData && teacherData.length ? (
                    <div className={classes.mainDiv}>
                        {!viewType ? (
                            <Grid container spacing={2}>
                                {teacherData.map((each, index) => {
                                    return (
                                        <TeacherGridView
                                            each={each}
                                            isEdited={isEdited}
                                            key={each._id}
                                            openAddDialog={openAddDialog}
                                            position={index}
                                            setIsEdited={setIsEdited}
                                            setOpenAddDialog={setOpenAddDialog}
                                            setTeacherData={setTeacherData}
                                            teacherData={teacherData}
                                        />
                                    );
                                })}
                            </Grid>
                        ) : (
                            <TeacherListView
                                setTeacherData={setTeacherData}
                                teacherData={teacherData}
                                updateTeacher={updateTeacher}
                            />
                        )}
                    </div>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box alignItems="center" display={'flex'} height={'60vh'} justifyContent="center">
                        <Translate>{'teacher.form.errors.noTeacher'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
            <TeacherAddDialog
                open={openAddDialog}
                setHasMore={setHasMore}
                setOpen={setOpenAddDialog}
                setTeacherData={setTeacherData}
                teacherData={teacherData}
                updateTeacher={updateTeacher}
            />
        </>
    );
};
export default withTeacherOnBoardingData(Teacher);
