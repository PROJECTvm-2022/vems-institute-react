import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const StrikedText = withStyles((theme) => ({
    typography: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        fontWeight: '400',
        fontSize: '15px',
        '&:after': {
            content: 'close-quote',
            width: '100%',
            borderBottom: `1px solid ${theme.palette.background.strike}`,
            position: 'absolute',
            top: '50%',
            zIndex: 1,
        },
        '& span': {
            zIndex: 2,
            position: 'inherit',
            paddingRight: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            color: theme.palette.common.black,
            background: theme.palette.common.white,
        },
        '&:before': {
            content: '',
        },
    },
}))((props) => {
    const { classes, children } = props;
    return (
        <Typography className={classes.typography} color="initial">
            <span>{children}</span>
        </Typography>
    );
});

export default StrikedText;
