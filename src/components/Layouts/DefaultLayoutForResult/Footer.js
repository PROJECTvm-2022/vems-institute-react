import * as React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles((theme) => ({
    main: {
        backgroundColor: '#118ab2',
        height: '30px',
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        color: '#fff',
        fontWeight: 600,
    },
}));

export default function Footer() {
    const classes = useStyle();
    return (
        <Box className={classes.main} >
        <Typography className={classes.content}>
        {'© 2021-2022 Vernacular Medium Educational Services Private Limited. All Rights Reserved.'}
        </Typography>
        </Box>
);
}
