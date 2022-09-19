import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';

const useStyle = makeStyles(() => ({
    root: {
        borderRadius: '6px',
    },
}));

const GridSkeleton = () => {
    const classes = useStyle();

    const data = [{ id: 1 }, { id: 2 }];

    return (
        <Grid container spacing={2}>
            {data.map((each) => (
                <Grid item key={each.id} md={6} sm={6} xs={12}>
                    <Box display={'flex'} mt={1}>
                        <Skeleton height={20} style={{ borderRadius: 3, marginRight: 4 }} variant={'rect'} width={20} />
                        <Skeleton width={'80%'} />{' '}
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default GridSkeleton;
