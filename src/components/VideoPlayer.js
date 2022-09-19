import React, { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
// import ShakaPlayer from 'shaka-player-react';

const ShakaPlayer = dynamic(() => import('shaka-player-react'), { ssr: false });

const VideoPlayer = ({ src }) => {
    const ref = useRef();

    useEffect(() => {
        // if (ref.current && src) {
        //     const player = new Plyr(ref.current, { settings: ['captions', 'quality', 'speed', 'loop'] });
        //     player.source = {
        //         type: type,
        //         sources: [
        //             {
        //                 src: src,
        //                 //provider: 'html5' , 'youtube'
        //                 provider: provider,
        //             },
        //         ],
        //     };
        // }
    }, [ref.current, src]);

    // return <video id="myMainVideoPlayer" controls ref={ref} />;

    return <ShakaPlayer autoPlay src={src} />;
};

VideoPlayer.propTypes = {
    type: PropTypes.any,
    provider: PropTypes.any,
    src: PropTypes.any,
};

export default VideoPlayer;
