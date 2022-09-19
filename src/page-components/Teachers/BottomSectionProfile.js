import React from 'react';
import Grid from '@material-ui/core/Grid';
import DetailsLeftProfile from './DetailsLeftProfile';
import DetailsRightProfile from './DetailsRightProfile';

export default function BottomSectionProfile() {
    return (
        <Grid container spacing={3}>
            <Grid item md={3} sm={5} xs={12}>
                <DetailsLeftProfile />
            </Grid>
            <Grid item md={9} sm={7} xs={12}>
                <DetailsRightProfile />
            </Grid>
        </Grid>
    );
}
