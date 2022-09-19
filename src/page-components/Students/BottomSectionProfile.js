import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import DetailsLeftProfile from './DetailsLeftProfile';
import DetailsRightProfile from './DetailsRightProfile';

export default function BottomSectionProfile({ id }) {
    const [subjects, setSubjects] = useState([]);
    const [studentProfileData, setStudentProfileData] = useState();

    return (
        <Grid container spacing={3}>
            <Grid item md={3} sm={5} xs={12}>
                <DetailsLeftProfile
                    setStudentProfileData={setStudentProfileData}
                    setSubjects={setSubjects}
                    studentProfileData={studentProfileData}
                    subjects={subjects}
                />
            </Grid>
            <Grid item md={9} sm={7} xs={12}>
                <DetailsRightProfile
                    id={id}
                    setStudentProfileData={setStudentProfileData}
                    setSubjects={setSubjects}
                    studentProfileData={studentProfileData}
                    subjects={subjects}
                />
            </Grid>
        </Grid>
    );
}
