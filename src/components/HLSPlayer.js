import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        // height: 'auto',
        background: '#000',
    },
}));

const HLSPlayer = ({ src, onEnded, ...props }) => {
    const ref = useRef();

    const classes = useStyles();

    useEffect(() => {
        if (Hls.isSupported() && ref.current) {
            const video = ref.current;
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            const Player = new Plyr(ref.current, { settings: ['captions', 'quality', 'speed', 'loop'] });
            if (onEnded) Player.on('ended', onEnded);
            Player.play();
        }
    }, []);

    return <video autoPlay className={classes.root} controls ref={ref} {...props} />;
};

HLSPlayer.propTypes = {
    src: PropTypes.string.isRequired,
    onEnded: PropTypes.func,
};

export default HLSPlayer;
