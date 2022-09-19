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
        width: '40%',
    },
    divider: {
        width: '100%',
        background: theme?.palette?.divider,
    },
}));

const ExamDetailsSkeleton = () => {
    const classes = useStyle();

    const data = new Array(1).fill(0);

    return (
        <Grid container spacing={1}>
            {data.map((each, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'}>
                            <Box width={'100%'}>
                                <Typography className={classes.text} component="div" key={'h4'} variant={'h4'}>
                                    <Skeleton className={classes.root} variant="rect" width={'100%'} />
                                </Typography>
                                <Typography className={classes.text} component="div" key={'h4'} variant={'caption'}>
                                    <Box mt={0.4} />
                                    <Skeleton className={classes.root} variant="rect" width={'60%'} />
                                </Typography>
                            </Box>
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={40} variant="rect" width={80} />
                            <Box ml={0.5} />
                            <Skeleton className={classes.root} height={40} variant="rect" width={80} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'} mt={0.5}>
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={3} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                            <Skeleton className={classes.root} height={30} variant="rect" width={'6%'} />
                            <Box ml={1} />
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box display={'flex'} mt={0.5}>
                            <Typography className={classes.text} component="div" key={'h4'} variant={'body1'}>
                                <Skeleton className={classes.root} variant="rect" width={'40%'} />
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Typography component="div" key={'caption'} variant={'caption'}>
                            <Skeleton className={classes.root} variant="rect" width={'100%'} />
                            <Box mt={0.5} />
                            <Skeleton className={classes.root} variant="rect" width={'100%'} />
                            <Box mt={0.5} />
                            <Skeleton className={classes.root} variant="rect" width={'100%'} />
                            <Box mt={0.5} />
                            <Skeleton className={classes.root} variant="rect" width={'100%'} />
                            <Box mt={0.5} />
                            <Skeleton className={classes.root} variant="rect" width={'100%'} />
                            <Box mt={0.5} />
                            <Skeleton className={classes.root} variant="rect" width={'100%'} />
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default ExamDetailsSkeleton;
