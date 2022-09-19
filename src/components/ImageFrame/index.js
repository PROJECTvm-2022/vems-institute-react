/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Common Frame for all without login pages
 * @createdOn 27/01/21 3:41 PM
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Translate from '../Translate';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import CoverImage from '../../assets/Login/Background.svg';
import OnlineVideoLectures from '../../assets/Login/OnlineVideoLectures.svg';
import OnlineLiveClasses from '../../assets/Login/OnlineLiveClasses.svg';
import OnlineNotesMaterials from '../../assets/Login/OnlineNotesMaterials.svg';
import OnlineExams from '../../assets/Login/OnlineExams.svg';
import OnlineAttendanceSystem from '../../assets/Login/OnlineAttendanceSysetm.svg';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: typeof window !== 'undefined' ? window.innerHeight : '-webkit-fill-available',
        display: 'flex',
    },
    paper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: '598',
    },
    bgImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${CoverImage})`,
        backgroundSize: 'cover',
        flex: '768',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    subTitle: {
        fontSize: '19px',
    },
}));

const ImageFrame = ({ children }) => {
    const classes = useStyles();
    const Language = useLanguage();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <div className={classes.bgImage}>
                <Box color={theme.palette.common.white} maxWidth="650px" width="90%">
                    <Box mt={3} />
                </Box>
            </div>
            <div className={classes.paper}>{children}</div>
        </div>
    );
};

ImageFrame.propTypes = {
    children: PropTypes.element.isRequired,
};

export default ImageFrame;
