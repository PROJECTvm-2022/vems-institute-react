/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Institute Skeleton Component
 * @createdOn 23/03/21 4:24 PM
 */

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyle = makeStyles(() => ({
    root: {
        borderRadius: '6px',
    },
}));

const CourseSkeleton = () => {
    const classes = useStyle();

    const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];

    return (
        <Grid container spacing={2}>
            {data.map((each) => (
                <Grid item key={each.id} md={3} sm={6} xs={12}>
                    <Skeleton animation={'wave'} className={classes.root} height={200} variant="rect" width={'100%'} />
                </Grid>
            ))}
        </Grid>
    );
};

export default CourseSkeleton;
