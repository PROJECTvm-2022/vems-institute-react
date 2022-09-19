/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description About Page
 * @createdOn 11/12/20 11:19 PM
 */

import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        color: theme.palette.primary.main,
    },
}));

const About = () => {
    const classes = useStyle();

    return (
        <React.Fragment>
            <div className={classes.root}>{'Start....!'}</div>
        </React.Fragment>
    );
};

export default About;
