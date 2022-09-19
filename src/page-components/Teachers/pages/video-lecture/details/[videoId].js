import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Translate from '../../../src/components/Translate';
import { VideoLectureService } from '../../../src/apis/rest.app';
import { useRouter } from 'next/router';
import Loader from '../../../src/components/loaders/Loader';
import Error from 'next/error';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useLanguage } from '../../../src/store/LanguageStore';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { useConfirm } from '../../../src/components/Confirm';
import useHandleError from '../../../src/hooks/useHandleError';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../../src/components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import QuestionsList from '../../../src/components/Questions/QuestionsList';
import HLSPlayer from '../../../src/components/HLSPlayer';
import CommentList from '../../../src/page-components/video-lecture/CommentList';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box bgcolor="common.white" hidden={value !== index} {...other} p={2}>
            {value === index && children}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const VideoDetails = () => {
    const [video, setVideo] = useState();

    const Router = useRouter();

    const { videoId } = Router.query;

    const [value, setValue] = useState(0);
    const [handleSwitchLoading, setHandleSwitchLoading] = useState(false);
    const [handleDeleteLoading, setHandleDeleteLoading] = useState(false);

    const [name, setName] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const Language = useLanguage('video-lecture/details/[videoId]');
    const Confirm = useConfirm();
    const handleError = useHandleError();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeActive = () => {
        Confirm().then(() => {
            setHandleSwitchLoading(true);
            VideoLectureService.patch(videoId, { status: video.status === 1 ? -1 : 1 })
                .then((res) => setVideo(res))
                .catch(handleError())
                .finally(() => setHandleSwitchLoading(false));
        });
    };

    const handleOnEdit = () => {
        setEditing(true);
        VideoLectureService.patch(videoId, { title: name })
            .then((response) => {
                setVideo(response);
                setName(response.title);
                setEditModalOpen(false);
            })
            .catch(handleError())
            .finally(() => setEditing(false));
    };

    const handleDelete = () => {
        setHandleDeleteLoading(true);
        VideoLectureService.remove(videoId)
            .then(() => {
                Router.push('/video-lecture/[syllabusId]', `/video-lecture/${video.syllabus}`);
            })
            .catch(handleError())
            .finally(() => setHandleDeleteLoading(false));
    };

    useEffect(() => {
        VideoLectureService.get(videoId)
            .then((response) => {
                setVideo(response);
                setName(response.title);
            })
            .catch(() => setVideo(null));
    }, []);

    if (video === undefined) return <Loader />;
    if (video === null) return <Error statusCode={404} />;

    return (
        <Grid container spacing={2}>
            <Grid item md={9} sm={12} xs={12}>
                <div>
                    <HLSPlayer src={video.video} />
                    <Box fontSize="h3.fontSize" mt={4}>
                        {video.title}
                    </Box>
                    <Box alignItems="center" display="flex" justifyContent="space-between">
                        <Typography color="textSecondary" variant="subtitle2">
                            {video.viewCount}{' '}
                            <Translate root="video-lecture/details/[videoId]">{'labels.views'}</Translate>
                        </Typography>
                        <Box alignItems="center" display="flex" justifyContent="space-around">
                            <FormControl component="fieldset">
                                <Box display="flex">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={video.status === 1}
                                                color="primary"
                                                disabled={
                                                    (video.status !== 1 && video.status !== -1) || handleSwitchLoading
                                                }
                                                name="checkedB"
                                                onChange={handleChangeActive}
                                            />
                                        }
                                        label={Language.get('labels.active')}
                                        labelPlacement="start"
                                    />
                                    <Box alignItems={'center'} display={'flex'} ml={1}>
                                        {handleSwitchLoading && <CircularProgress size={15} />}
                                    </Box>
                                </Box>
                            </FormControl>
                            <Button
                                color="primary"
                                component={Box}
                                ml={2}
                                onClick={setEditModalOpen}
                                size="small"
                                variant="outlined"
                            >
                                <Translate root="video-lecture/details/[videoId]">{'labels.edit'}</Translate>
                            </Button>
                            <Button
                                color="secondary"
                                component={Box}
                                ml={2}
                                onClick={handleDelete}
                                size="small"
                                variant="outlined"
                            >
                                {handleDeleteLoading ? (
                                    <CircularProgress size={22} />
                                ) : (
                                    <Translate root="video-lecture/details/[videoId]">{'labels.delete'}</Translate>
                                )}
                            </Button>
                        </Box>
                    </Box>
                </div>
                <Box>
                    <Tabs
                        aria-label="disabled tabs example"
                        indicatorColor="primary"
                        onChange={handleChange}
                        textColor="primary"
                        value={value}
                    >
                        <Tab label={`${video.commentCount} ${Language.get('tabs.comments')}`} />
                        <Tab label={`${video.questionCount} ${Language.get('tabs.questions')}`} />
                    </Tabs>
                    <TabPanel index={0} value={value}>
                        <CommentList entityId={video._id} entityType="videoLecture" />
                    </TabPanel>
                    <TabPanel index={1} value={value}>
                        <QuestionsList entityId={video._id} entityType="videoLecture" />
                    </TabPanel>
                </Box>
            </Grid>

            <Dialog fullWidth maxWidth={'xs'} onClose={() => setEditModalOpen(false)} open={editModalOpen}>
                <DialogTitle onClose={() => setEditModalOpen(false)}>
                    <Translate root="video-lecture/details/[videoId]">{'labels.edit'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            autoFocus
                            label={<Translate root="video-lecture/details/[videoId]">{'labels.name'}</Translate>}
                            margin={'dense'}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            variant={'outlined'}
                        />

                        <Button color={'primary'} disabled={editing} onClick={handleOnEdit} variant={'contained'}>
                            {editing ? (
                                <CircularProgress size={15} />
                            ) : (
                                <Translate root="video-lecture/details/[videoId]">{'labels.done'}</Translate>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

export default VideoDetails;
