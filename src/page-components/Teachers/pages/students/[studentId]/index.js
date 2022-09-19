import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core/index';
import Translate from '../../../src/components/Translate';
import { getTeacherDetails } from '../../../src/apis/teachers';
import useHandleError from '../../../src/hooks/useHandleError';
import { useStudentDetailsData, withStudentDetailsData } from '../../../src/store/StudentDetailsContext';
import TopHeaderProfile from '../../../src/page-components/StudentProfile/TopHeaderProfile';
import BottomSectionProfile from '../../../src/page-components/StudentProfile/BottomSectionProfile';

function StudentDetails() {
    const Router = useRouter();
    const [loading, setLoading] = useState(true);
    const [, setData] = useStudentDetailsData();
    const handleError = useHandleError();

    const { studentId } = Router.query;
    useEffect(() => {
        getTeacherDetails(studentId)
            .then((response) => {
                setData(response);
            })
            .catch((error) => {
                handleError()(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            {loading ? (
                <Box alignItems="center" display="flex" flexDirection="column" height="80vh" justifyContent="center">
                    <CircularProgress />
                    <Box mt={2} />
                    <Typography>
                        <Translate>{'student.details.loading'}</Translate>
                    </Typography>
                </Box>
            ) : (
                <>
                    <TopHeaderProfile />
                    <Box mt={2} />
                    <BottomSectionProfile />
                </>
            )}
        </>
    );
}

export default withStudentDetailsData(StudentDetails);
