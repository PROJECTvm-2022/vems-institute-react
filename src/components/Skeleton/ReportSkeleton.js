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
import Card from '@material-ui/core/Card';

const useStyle = makeStyles((theme) => ({
    root: {
        borderRadius: '5px',
    },
    text: {
        width: '40%',
    },
    divider: {
        background: theme?.palette?.divider,
    },
    secondDivider: {
        height: '30px',
        background: theme?.palette?.divider,
    },
}));

const ReportSkeleton = () => {
    const classes = useStyle();

    const data = new Array(7).fill(0);

    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item md={6} sm={6} xs={12}>
                    <Skeleton className={classes.root} height={70} variant="rect" width={'100%'} />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                    <Skeleton className={classes.root} height={70} variant="rect" width={'100%'} />
                </Grid>
            </Grid>
            <Box mt={2} />
            <Divider className={classes.divider} />
            <Box mt={2} />
            <Grid container justify="center" spacing={3}>
                {data.map((each, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Grid item md={3} sm={6} xs={12}>
                        <Card className={classes.secondaryCard} elevation={0}>
                            <Box width={'100%'}>
                                <Typography className={classes.title} color={'inherit'} variant={'h4'}>
                                    <Skeleton className={classes.root} height={'48px'} variant="rect" />
                                </Typography>
                            </Box>
                            <Box display={'flex'} p={1} pb={0}>
                                <Box alignItems={'center'} display={'flex'} flexDirection={'column'} width={'50%'}>
                                    <Skeleton className={classes.root} height={'12px'} variant="rect" width={'100%'} />
                                    <Box mt={0.5} />
                                    <Skeleton className={classes.root} height={'12px'} variant="rect" width={'60%'} />
                                </Box>
                                <Box ml={1} />
                                <Divider className={classes.divider} flexItem orientation="vertical" />
                                <Box ml={1} />
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    width={'50%'}
                                >
                                    <Skeleton className={classes.root} height={'12px'} variant="rect" width={'100%'} />
                                    <Box mt={0.5} />
                                    <Skeleton className={classes.root} height={'12px'} variant="rect" width={'60%'} />
                                </Box>
                            </Box>
                            <Box display={'flex'}>
                                <Box width={'50%'} />
                                <Divider className={classes.secondDivider} flexItem orientation="vertical" />
                                <Box width={'50%'} />
                            </Box>
                            <Box display={'flex'}>
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    width={'50%'}
                                >
                                    <Skeleton className={classes.root} height={'30px'} variant="rect" width={'60%'} />
                                </Box>
                                <Divider className={classes.divider} flexItem orientation="vertical" />
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    width={'50%'}
                                >
                                    <Skeleton className={classes.root} height={'30px'} variant="rect" width={'60%'} />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box mt={2} />
            <Divider className={classes.divider} />
            <Box mt={2} />
            <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                    <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Skeleton className={classes.root} height={40} variant="rect" width={'100%'} />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default ReportSkeleton;
