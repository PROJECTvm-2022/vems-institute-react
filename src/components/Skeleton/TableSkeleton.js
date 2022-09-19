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

const useStyle = makeStyles(() => ({
    root: {
        borderRadius: '6px',
    },
}));

const TableSkeleton = () => {
    const classes = useStyle();

    const data = new Array(10).fill(0); //[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }];

    return (
        <Grid container spacing={1}>
            {data.map((each, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid item key={index} md={12} sm={12} xs={12}>
                    <Skeleton className={classes.root} height={50} variant="rect" width={'100%'} />
                </Grid>
            ))}
        </Grid>
    );
};

export default TableSkeleton;
