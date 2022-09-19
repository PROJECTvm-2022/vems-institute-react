import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import style from '../../assets/styles/common.module.css';
import { makeStyles } from '@material-ui/core/styles';
import LockOverLay from '../../assets/LockOverlay.svg';

const useStyle = makeStyles((theme) => ({
    main: {
        position: 'relative',
        width: '100%',
        height: '150px',
    },
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '150px',
        width: '100%',
        objectFit: 'cover',
    },
}));

const VideoListItem = ({ video }) => {
    const classes = useStyle();

    return (
        <Grid item key={video._id} lg={2} md={3} sm={3} xs={12}>
            <Box className={classes.main}>
                <Box alt={video.title} className={classes.root} component="img" src={video.thumbnail} />
                <Box className={classes.root} component="img" src={LockOverLay} />
            </Box>
            <Box mb={1} />
            <Typography className={style.ellipsis} color="textPrimary" variant="h4">
                {video.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle2">
                {video.viewCount} <Translate root="video-lecture/[syllabusId]">{'form.labels.views'}</Translate>
                {' · '}
                {video.questionCount} <Translate root="video-lecture/[syllabusId]">{'form.labels.comments'}</Translate>
            </Typography>
        </Grid>
    );
};

VideoListItem.propTypes = {
    video: PropTypes.object.isRequired,
};

export default VideoListItem;
