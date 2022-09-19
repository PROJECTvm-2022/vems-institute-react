import React, { useEffect, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Translate from '../../../src/components/Translate';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Loader from '../../../src/components/loaders/Loader';
import { useRouter } from 'next/router';
import { SyllabusesService, VideoLectureService } from '../../../src/apis/rest.app';
import Error from 'next/error';
import UnitAutocomplete from '../../../src/components/Autocompletes/UnitAutocomplete';
import ChapterAutocomplete from '../../../src/components/Autocompletes/ChapterAutocomplete';
import InfiniteScroll from 'react-infinite-scroller';
import Skeleton from '@material-ui/lab/Skeleton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import dynamic from 'next/dynamic';
import CircularProgress from '@material-ui/core/CircularProgress';
import useHandleError from '../../../src/hooks/useHandleError';
import { useLanguage } from '../../../src/store/LanguageStore';
import { useSnackbar } from 'notistack';
import VideoListItem from '../../../src/page-components/video-lecture/VideoListItem';
import { createPageStore } from '../../../src/store/PageGlobalContext';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import style from '../../../src/assets/styles/common.module.css';

const FileUploader = dynamic(() => import('../../../src/components/FileUploader'));

const CreateVideoLecture = () => {
    const usePageState = createPageStore();

    const [syllabus, setSyllabus] = useState();
    const [unit, setUnit] = useState(null);
    const [searchedChapter, setSearchedChapter] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [videos, setVideos] = usePageState('videos', []);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [chapter, setChapter] = useState(null);
    const uppy = useRef();
    const [creating, setCreating] = useState(false);

    const Router = useRouter();

    const handleError = useHandleError();
    const Language = useLanguage('video-lecture/[syllabusId]');
    const { enqueueSnackbar } = useSnackbar();

    const { syllabusId } = Router.query;

    const loadVideos = () => {
        if (loading) return;
        setLoading(true);
        VideoLectureService.find({
            query: {
                syllabus: syllabusId,
                ...(unit && unit._id ? { unit: unit._id } : {}),
                ...(searchedChapter && searchedChapter._id ? { chapter: searchedChapter._id } : {}),
            },
        })
            .then((response) => {
                const { data, total } = response;
                const _videos = [...videos, ...data];
                setVideos(_videos);
                setHasMore(total > _videos.length);
            })
            .finally(() => setLoading(false));
    };

    const handleOnUpload = async () => {
        try {
            const items = uppy.current.getFiles();
            if (!items.length) throw new Error(Language.get('form.errors.video'));

            setCreating(true);
            const response = await uppy.current.upload();

            if (!response.successful.length) {
                setCreating(false);
                return;
            }

            const [uploadedVideo] = response.successful.map((each) => each.uploadURL);

            const result = await VideoLectureService.create({ uploadedVideo, title: name, chapter: chapter._id });

            setVideos([...videos, result]);
            setCreating(false);
            uppy.current.reset();
            setName('');
            setChapter(null);
            setCreateModalOpen(false);

            enqueueSnackbar(<Translate>{'snackbarMessages.createCourseSuccess'}</Translate>, {
                variant: 'success',
            });
        } catch (e) {
            handleError()(e);
        }
    };

    useEffect(() => {
        SyllabusesService.get(syllabusId, {
            query: {
                $populate: ['institute', 'course', 'specialization', 'subject', 'semester'],
            },
        })
            .then((response) => setSyllabus(response))
            .catch(() => setSyllabus(null));
    }, [syllabusId]);

    useEffect(() => {
        setVideos([]);
        setHasMore(true);
    }, [searchedChapter, unit]);

    if (syllabus === undefined) return <Loader />;
    if (syllabus === null) return <Error statusCode={404} />;

    return (
        <React.Fragment>
            <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
                <Typography variant={'h3'}>
                    <Translate root="video-lecture/[syllabusId]">{'title'}</Translate>
                </Typography>
                <Button color="primary" onClick={() => setCreateModalOpen(true)} variant="contained">
                    <Translate root="video-lecture/[syllabusId]">{'form.button.create'}</Translate>
                </Button>
            </Box>

            <Box display="flex" flexWrap="wrap" mb={1}>
                <Box maxWidth="100%" mb={1} mr={1} mt={2} width={250}>
                    <UnitAutocomplete
                        onSelect={(ev) => setUnit(ev || null)}
                        searchOnEmpty
                        size="small"
                        syllabus={syllabusId}
                    />
                </Box>
                <Box maxWidth="100%" mb={1} mr={1} mt={2} width={250}>
                    <ChapterAutocomplete
                        disabled={!unit}
                        onSelect={(ev) => {
                            setSearchedChapter(ev || null);
                            setChapter(ev || null);
                        }}
                        searchOnEmpty={Boolean(unit)}
                        size="small"
                        syllabus={syllabusId}
                        unit={unit && unit._id}
                    />
                </Box>
            </Box>

            <Box mb={1.5}>
                <Breadcrumbs aria-label="breadcrumb">
                    {Boolean(syllabus?.institute?.name) && (
                        <Typography color="textSecondary">{syllabus.institute.name}</Typography>
                    )}
                    {Boolean(syllabus?.course?.name) && (
                        <Typography color="textSecondary">{syllabus.course.name}</Typography>
                    )}
                    {Boolean(syllabus?.specialization?.name) && (
                        <Typography color="textSecondary">{syllabus.specialization.name}</Typography>
                    )}
                    {Boolean(syllabus?.semester?.name) && (
                        <Typography color="textSecondary">{syllabus.semester.name}</Typography>
                    )}
                    {Boolean(syllabus?.subject?.name) && (
                        <Typography color="textSecondary">{syllabus.subject.name}</Typography>
                    )}
                </Breadcrumbs>
            </Box>

            <Grid
                component={InfiniteScroll}
                container
                hasMore={hasMore}
                loadMore={loadVideos}
                loader={
                    <React.Fragment>
                        {new Array(8).fill(0).map((each, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Grid item key={index} lg={2} md={3} sm={3} xs={12}>
                                <Skeleton className={style['auto-skeleton']} component={'div'} variant="rect" />
                                <Box mb={0.8} mt={1.5}>
                                    <Skeleton variant="text" width="100%" />
                                </Box>
                                <Box display="flex">
                                    <Skeleton variant="text" width="60px" />
                                    <Box mr={1} />
                                    <Skeleton variant="text" width="60px" />
                                </Box>
                            </Grid>
                        ))}
                    </React.Fragment>
                }
                pageStart={0}
                spacing={2}
            >
                {videos.map((video) => (
                    <VideoListItem key={video._id} video={video} />
                ))}
            </Grid>

            <Dialog fullWidth maxWidth={'xs'} onClose={() => setCreateModalOpen(false)} open={createModalOpen}>
                <DialogTitle onClose={() => setCreateModalOpen(false)}>
                    <Translate root="video-lecture/[syllabusId]">{'form.button.create'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            label={<Translate root="video-lecture/[syllabusId]">{'form.labels.title'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            variant={'outlined'}
                        />
                        <Box mb={2} />
                        <ChapterAutocomplete
                            margin={'dense'}
                            onSelect={(ev) => setChapter(ev || null)}
                            searchOnEmpty={Boolean(unit)}
                            size="small"
                            syllabus={syllabusId}
                            unit={unit && unit._id}
                            value={chapter && chapter.name}
                        />
                        <Box mb={2} />
                        <FileUploader
                            doneButtonHandler={() => {}}
                            fieldName={'video'}
                            // onUpload={handleOnUpload}
                            height={250}
                            hideUploadButton
                            options={{
                                restrictions: {
                                    allowedFileTypes: ['video/*'],
                                    maxNumberOfFiles: 1,
                                },
                            }}
                            path={'/upload-video'}
                            responseUrlFieldName={'_id'}
                            uppyRef={uppy}
                        />
                        <Box mb={2} />
                        <Button color={'primary'} disabled={creating} onClick={handleOnUpload} variant={'contained'}>
                            {creating ? (
                                <CircularProgress size={15} />
                            ) : (
                                <Translate root="video-lecture/[syllabusId]">{'form.button.create'}</Translate>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default CreateVideoLecture;
