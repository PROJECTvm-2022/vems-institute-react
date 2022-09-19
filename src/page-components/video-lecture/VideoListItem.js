import Link from '../../components/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from '../../assets/styles/common.module.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyle = makeStyles((theme) => ({
    correctButton: {
        height: '21px',
        width: '60px',
        borderRadius: '50px',
        background: theme.palette.success.main,
        color: theme.palette.common.white,
    },
    incorrectButton: {
        height: '21px',
        width: '80px',
        borderRadius: '50px',
        background: theme.palette.error.main,
        color: theme.palette.common.white,
    },
    marksDiv: {
        height: '21px',
        width: '50px',
        borderRadius: '50px',
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    videoImage: {
        height: '150px',
        width: '100%',
        borderRadius: 3,
    },
    videoImage1: {
        height: '0px',
        width: '0px',
        borderRadius: 0,
    },
}));

const VideoListItem = ({ each, video, onProfile = false }) => {
    const [open, setOpen] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(true);

    const classes = useStyle();

    return (
        <Grid item key={video._id} lg={2} md={3} sm={3} xs={12}>
            <Link as={`/video-lecture/details/${video._id}`} href="/video-lecture/details/[videoId]">
                {loadingThumbnail && <Skeleton className={classes.videoImage} variant="rect" />}
                <Box
                    alt={video.title}
                    className={loadingThumbnail ? classes.videoImage1 : classes.videoImage}
                    component="img"
                    maxWidth="100%"
                    onLoad={() => {
                        setLoadingThumbnail(false);
                    }}
                    src={video.thumbnail}
                />
                <Box mb={0.2} />
                <Typography className={style.ellipsis} color="textPrimary" variant="h4">
                    {video.title}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                    {video.viewCount} <Translate root="video-lecture/[syllabusId]">{'form.labels.views'}</Translate>
                    {' · '}
                    {video.questionCount}{' '}
                    <Translate root="video-lecture/[syllabusId]">{'form.labels.comments'}</Translate>
                </Typography>
            </Link>
            {onProfile && each?.answers && each.answers.length !== 0 && (
                <Box>
                    <Button
                        color={'primary'}
                        fullWidth
                        onClick={() => {
                            setOpen(true);
                        }}
                        size={'small'}
                        variant={'outlined'}
                    >
                        {'View Results'}
                    </Button>
                </Box>
            )}
            {each && (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
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
                        <Box display={'flex'}>
                            {'Total mark: '}
                            <Box className={classes.marksDiv} display={'flex'} justifyContent={'center'} ml={0.5}>
                                {each && each.answers && each.answers.filter((each) => each.status === 1).length}/10
                            </Box>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {each &&
                            each.answers &&
                            each.answers.map((answers, index) => (
                                <Box key={answers._id}>
                                    <List component={Box} dense={true} m={-2}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar variant={'rounded'}>{index + 1}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant={'body2'}>
                                                        {answers?.question?.question
                                                            ? answers.question.question
                                                            : 'N/A'}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box display={'flex'}>
                                                        {'Answer: '}
                                                        {answers?.answer ? answers.answer + ' ' : 'N/A'}
                                                        {answers && answers.status === 1 ? (
                                                            <Box
                                                                className={classes.correctButton}
                                                                display={'flex'}
                                                                justifyContent={'center'}
                                                                mx={0.5}
                                                            >
                                                                {'correct'}
                                                            </Box>
                                                        ) : (
                                                            <>
                                                                <Box
                                                                    className={classes.incorrectButton}
                                                                    display={'flex'}
                                                                    justifyContent={'center'}
                                                                    mx={0.5}
                                                                >
                                                                    {'Incorrect'}
                                                                </Box>
                                                                <Typography color={'primary'} variant={'body2'}>
                                                                    {'Correct answer: '}
                                                                    {answers?.question?.answer?.answerOfQuestion &&
                                                                        answers?.question?.answer?.answerOfQuestion[0]}
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Box>
                            ))}
                    </DialogContent>
                </Dialog>
            )}
        </Grid>
    );
};

VideoListItem.propTypes = {
    each: PropTypes.object.isRequired,
    video: PropTypes.object.isRequired,
    onProfile: PropTypes.bool,
};

export default VideoListItem;
