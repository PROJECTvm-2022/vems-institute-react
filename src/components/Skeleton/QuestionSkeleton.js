/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Institute Skeleton Component
 * @createdOn 18/01/21 11:40 PM
 */

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyle = makeStyles((theme) => ({
    root: {
        borderRadius: '5px',
    },
    text: {
        width: '100%',
    },
    divider: {
        width: '100%',
        // background: theme.palette.divider,
    },
}));

const QuestionSkeleton = () => {
    const classes = useStyle();

    const data = new Array(4).fill(0);

    return (
        <Grid container spacing={1}>
            {data.map((each, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'}>
                            <Skeleton className={classes.root} height={40} variant="rect" width={70} />
                            <Box ml={1} />
                            <Typography className={classes.text} component="div" key={'body1'} variant={'caption'}>
                                <Box mt={0.1} />
                                <Skeleton variant="rect" width={'100%'} />
                                <Box mt={0.8} />
                                <Skeleton variant="rect" width={'60%'} />
                            </Typography>
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={40} variant="rect" width={80} />
                            <Box ml={0.5} />
                            <Skeleton className={classes.root} height={40} variant="rect" width={80} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'}>
                            <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'}>
                            <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'}>
                            <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'}>
                            <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'} my={1.5}>
                            <Divider className={classes.divider} />
                        </Box>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default QuestionSkeleton;
