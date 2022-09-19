import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Translate from '../../components/Translate';
import Grid from '@material-ui/core/Grid';
import BatchIcon from '../../assets/BatchIcon.svg';
import StudentIcon from '../../assets/StudentIcon.svg';
import ClassIcon from '../../assets/ClassIcon.svg';
import CourseBackgroundImg from '../../assets/CourseBackgroundImg.jpg';
import { InstituteCourse, InstitutionDashBoardService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import { useLanguage } from '../../store/LanguageStore';
import Link from '../../components/Link';
import CourseSkeleton from '../../components/Skeleton/CourseSkeleton';
import InfiniteScroll from 'react-infinite-scroller';
import theme from '../../theme';
import DialogTitle from '../../components/DialogTitle';
import CreateAutocomplete from '../syllabuses/CreateAutoComplete';
import TextField from '@material-ui/core/TextField';
import { getAllCourses } from '../../apis/course';
import { useSnackbar } from 'notistack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Confirm from '../../components/Confirm';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => {
    return {
        headerCard: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        rootCard: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(2),
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1),
            },
        },
        contentCard: {
            padding: theme.spacing(1),
        },
        viewAllButton: {
            fontSize: 13,
        },
        cardMain: {
            height: '130px',
        },
        viewButton: {
            borderRadius: '0px',
            color: theme.palette.common.white,
        },
        iconDiv: {
            width: '50px',
            height: '50px',
            borderRadius: '5px',
        },
        title: {
            fontSize: '20px',
            fontWeight: 500,
            color: theme.palette.text.other,
        },
        chapterIcon: {
            width: '100%',
            height: 'auto',
        },
        coursesButton: {
            background: theme.palette.common.white,
        },
        courseDesc: {
            color: theme.palette.text.other,
        },
        image: {
            height: '60px',
            width: '60px',
            marginRight: theme.spacing(1.5),
            borderRadius: '5px',
        },
        secondaryText: {
            lineHeight: '15px',
        },
    };
});

export default function DetailsRightProfile() {
    const [data] = useInstituteDetailsData();
    const classes = useStyles();
    const handleError = useHandleError();
    const Language = useLanguage('institute/[id]');
    const { enqueueSnackbar } = useSnackbar();
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [open, setOpen] = useState(false);

    const [coursesList, setCoursesList] = useState([]);
    const [courseSearch, setCourseSearch] = useState('');

    const [courseValue, setCourseValue] = useState(courseValue ? courseValue.commission : '');
    const [courseAddLoading, setCourseAddLoading] = useState(false);
    const [price, setPrice] = useState('');

    const [allDashBoardData, setAllDashboardData] = useState('');

    const router = useRouter();

    const LoadCourses = () => {
        setCoursesLoading(true);
        InstituteCourse.find({
            query: {
                $skip: courses.length,
                $limit: 50,
                institute: data && data._id,
                $populate: ['course'],
            },
        })
            .then((res) => {
                const { data, total } = res;
                const result = [...courses, ...data];
                setHasMore(result.length < total);
                setCourses(result);
            })
            .catch((error) => {
                handleError()(error);
                setHasMore(false);
            })
            .finally(() => {
                setCoursesLoading(false);
            });
    };

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (courseSearch === '') return;
        getAllCourses(0, 10, courseSearch ? courseSearch : '')
            .then((res) => {
                setCoursesList(res.data);
                setPrice('');
            })
            .catch((error) => handleError()(error));
    }, [courseSearch]);

    const validate = () => {
        if (courseValue === '') {
            enqueueSnackbar(Language.get('details.addCourse.validate.selectCourse'), { variant: 'warning' });
            return false;
        } else if (price.trim() === '') {
            enqueueSnackbar(Language.get('details.addCourse.validate.enterPrice'), { variant: 'warning' });
            return false;
        } else if (!/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(price)) {
            enqueueSnackbar(Language.get('details.addCourse.validate.enterValidPrice'), {
                variant: 'warning',
            });
            return false;
        } else if (price < courseValue.commission || price > courseValue.maxPrice) {
            enqueueSnackbar(Language.get('details.addCourse.validate.validatePrice'), { variant: 'warning' });
            return false;
        } else {
            return true;
        }
    };

    const handleAdd = () => {
        if (validate()) {
            setCourseAddLoading(true);
            InstituteCourse.create({
                institute: data && data._id,
                price: price,
                name: courseValue && courseValue.name,
                course: courseValue && courseValue._id,
            })
                .then((res) => {
                    setCourses([...courses, res]);
                    setPrice('');
                    setCoursesList([]);
                    setCourseSearch('');
                    setCourseValue('');
                    setOpen(false);
                    enqueueSnackbar(Language.get('details.addCourse.success.createdSuccessfully'), {
                        variant: 'success',
                    });
                })
                .catch((error) => {
                    handleError()(error);
                })
                .finally(() => {
                    setCourseAddLoading(false);
                });
        }
    };

    const handleDelete = (index, each) => {
        Confirm(
            Language.get('details.addCourse.confirm.title'),
            Language.get('details.addCourse.confirm.message'),
            Language.get('details.addCourse.confirm.remove'),
            '',
        )
            .then(() => {
                InstituteCourse.remove(each._id)
                    .then(() => {
                        let _course = courses;
                        _course.splice(index, 1);
                        setCourses([]);
                        setCourses(_course);
                        enqueueSnackbar(Language.get('details.addCourse.success.deletedSuccessfully'), {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        handleError()(error);
                    });
            })
            .catch((error) => {
                handleError()(error);
            });
    };

    useEffect(() => {
        InstitutionDashBoardService.find({
            query: {
                institute: data && data._id,
            },
        })
            .then((res) => {
                setAllDashboardData(res);
            })
            .catch(() => {});
    }, []);

    const card = [
        {
            id: 1,
            title: <Translate root={'institute/[id]'}>{'details.batches'}</Translate>,
            icon: BatchIcon,
            value: allDashBoardData?.totalBatches,
            link: '/institute/batch',
        },
        {
            id: 2,
            title: <Translate root={'institute/[id]'}>{'details.students'}</Translate>,
            icon: StudentIcon,
            value: allDashBoardData?.totalStudents,
            link: '/students',
        },
        {
            id: 3,
            title: <Translate root={'institute/[id]'}>{'details.classes'}</Translate>,
            icon: ClassIcon,
            value: allDashBoardData?.totalClasses,
            link: '/all-live-class',
        },
    ];
    return (
        <>
            <Paper className={classes.rootCard}>
                <Grid container spacing={2}>
                    {card.map((each) => (
                        <Grid item key={each.id} md={4} sm={12} xs={12}>
                            <Card
                                className={classes.cardMain}
                                elevation={0}
                                style={{ border: `1px solid ${data && data.colorCode && data.colorCode.primary}` }}
                            >
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Box display={'flex'} height={'90px'}>
                                        <Box alignItems={'center'} display={'flex'} flex={3} justifyContent={'center'}>
                                            <Box
                                                alignItems={'center'}
                                                className={classes.iconDiv}
                                                display={'flex'}
                                                justifyContent={'center'}
                                                pt={0.9}
                                                style={{
                                                    background: data && data.colorCode && data.colorCode.primary,
                                                }}
                                            >
                                                <img alt={'Batch Icon'} src={each.icon} />
                                            </Box>
                                        </Box>
                                        <Box
                                            display={'flex'}
                                            flex={5}
                                            flexDirection={'column'}
                                            justifyContent={'center'}
                                        >
                                            <Typography className={classes.title} variant={'body2'}>
                                                {each.title}
                                            </Typography>
                                            <Box mt={0.3} />
                                            <Typography variant={'h3'}>{each.value}</Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        className={classes.viewButton}
                                        onClick={() => {
                                            router.push(each.link);
                                        }}
                                        style={{
                                            background: data && data.colorCode && data.colorCode.primary,
                                        }}
                                        variant={'contained'}
                                    >
                                        <Translate root={'institute/[id]'}>{'details.viewDetails'}</Translate>
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box className={classes.headerCard} mb={1} mt={3}>
                    <Typography variant={'h4'}>
                        <Translate root={'institute/[id]'}>{'details.courses'}</Translate>
                    </Typography>
                    <Box display={'flex'}>
                        {/*<Button*/}
                        {/*    className={classes.viewAllButton}*/}
                        {/*    component={Link}*/}
                        {/*    disabled={courses.length === 0}*/}
                        {/*    href={`/courses?institute=${data._id}`}*/}
                        {/*    style={{*/}
                        {/*        color: courses.length ? data && data.colorCode && data.colorCode.primary : '',*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Translate root={'institute/[id]'}>{'details.viewAll'}</Translate>*/}
                        {/*</Button>*/}
                        {/*<Box ml={1} />*/}
                        <Button
                            className={classes.viewAllButton}
                            onClick={() => {
                                handleOpen();
                            }}
                            style={{
                                background: data && data.colorCode && data.colorCode.primary,
                            }}
                            variant={'contained'}
                        >
                            <Translate root={'institute/[id]'}>{'details.addCourse.title'}</Translate>
                        </Button>
                    </Box>
                </Box>
                <InfiniteScroll
                    hasMore={hasMore}
                    loadMore={LoadCourses}
                    loader={
                        <Box align={'center'} key={'allInstitute'} mt={1} width={'100%'}>
                            <CourseSkeleton />
                        </Box>
                    }
                    pageStart={0}
                >
                    <Grid container spacing={2}>
                        {courses.length ? (
                            <>
                                {courses.map((each, index) => (
                                    <Grid item key={each._id} md={3} sm={6} xs={12}>
                                        <Card>
                                            <Box display={'flex'} flexDirection={'column'}>
                                                <img
                                                    alt={'Course Background Img'}
                                                    className={classes.chapterIcon}
                                                    src={CourseBackgroundImg}
                                                />
                                                <Card className={classes.coursesButton} component={Box} mt={-2}>
                                                    <List component={Box} dense m={-0.6}>
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="body2">{each.name}</Typography>
                                                                }
                                                                secondary={
                                                                    <Typography
                                                                        className={classes.courseDesc}
                                                                        variant="subtitle2"
                                                                    >
                                                                        {Language.get('details.price') +
                                                                            ': ' +
                                                                            each.price}
                                                                    </Typography>
                                                                }
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton
                                                                    color={'secondary'}
                                                                    edge="end"
                                                                    onClick={() => {
                                                                        handleDelete(index, each);
                                                                    }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    </List>
                                                </Card>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </>
                        ) : hasMore ? (
                            ''
                        ) : (
                            <Box m={1} mt={2}>
                                <Typography variant={'subtitle2'}>
                                    <Translate root={'institute/[id]'}>{'details.noCourses'}</Translate>
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </InfiniteScroll>
                <Dialog
                    fullWidth
                    maxWidth={'xs'}
                    onClose={() => {
                        setOpen(false);
                    }}
                    open={open}
                >
                    <DialogTitle
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        <Translate root={'institute/[id]'}>{'details.addCourse.title'}</Translate>
                    </DialogTitle>
                    <DialogContent>
                        <Box display={'flex'} flexDirection={'column'} pb={1}>
                            {!courseValue && (
                                <CreateAutocomplete
                                    label={Language.get('details.addCourse.form.course')}
                                    list={coursesList}
                                    search={courseSearch}
                                    setSearch={setCourseSearch}
                                    setValue={setCourseValue}
                                    value={courseValue}
                                />
                            )}
                            {courseValue && (
                                <List component={Box} m={-2}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <img alt={'Avatar'} className={classes.image} src={courseValue.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box mb={0.3} mt={-0.8}>
                                                    <Typography variant={'h5'}>
                                                        <Translate root={'institute/[id]'}>
                                                            {'details.addCourse.form.name'}
                                                        </Translate>
                                                        {': '}
                                                        {courseValue.name}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography className={classes.secondaryText} variant={'subtitle2'}>
                                                        <Translate root={'institute/[id]'}>
                                                            {'details.addCourse.form.minPrice'}
                                                        </Translate>
                                                        {': '}
                                                        {courseValue.commission}
                                                    </Typography>
                                                    <Typography className={classes.secondaryText} variant={'subtitle2'}>
                                                        <Translate root={'institute/[id]'}>
                                                            {'details.addCourse.form.maxPrice'}
                                                        </Translate>
                                                        {': '}
                                                        {courseValue.maxPrice}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                color={'secondary'}
                                                edge="end"
                                                onClick={() => {
                                                    setCoursesList([]);
                                                    setCourseSearch('');
                                                    setCourseValue('');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            )}
                            <Box mt={2} />
                            <TextField
                                InputProps={{
                                    inputProps: {
                                        min: courseValue ? courseValue.commission : 0,
                                        max: courseValue ? courseValue.maxPrice : 1000,
                                    },
                                }}
                                fullWidth
                                label={Language.get('details.addCourse.form.price')}
                                margin={'dense'}
                                onChange={(e) => setPrice(e.target.value)}
                                type={'number'}
                                value={price}
                                variant={'outlined'}
                            />
                        </Box>
                        <Box display={'flex'} mb={2} mt={3}>
                            <Button
                                fullWidth
                                onClick={() => {
                                    setOpen(false);
                                }}
                                variant={'outlined'}
                            >
                                <Translate root={'institute/[id]'}>{'details.addCourse.button.cancel'}</Translate>
                            </Button>
                            <Box ml={1} />
                            <Button
                                disabled={courseAddLoading}
                                fullWidth
                                onClick={() => {
                                    handleAdd();
                                }}
                                style={{
                                    background: data && data.colorCode && data.colorCode.primary,
                                }}
                                variant={'contained'}
                            >
                                {courseAddLoading ? (
                                    <CircularProgress color={'inherit'} size={17} />
                                ) : (
                                    <Typography variant={'button'}>
                                        <Translate root={'institute/[id]'}>{'details.addCourse.button.add'}</Translate>
                                    </Typography>
                                )}
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Paper>
        </>
    );
}
