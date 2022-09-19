import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core/index';
import Translate from '../../../src/components/Translate';
import { getTeacherDetails } from '../../../src/apis/teachers';
import TopHeaderProfile from '../../../src/page-components/teacher/TopHeaderProfile';
import BottomSectionProfile from '../../../src/page-components/teacher/BottomSectionProfile';
import { useTeacherDetailsData, withTeacherDetailsData } from '../../../src/store/TeacherDetailsContext';
import useHandleError from '../../../src/hooks/useHandleError';

function TeacherDetails() {
    const Router = useRouter();
    const [loading, setLoading] = useState(true);
    const [, setData] = useTeacherDetailsData();
    const handleError = useHandleError();

    const { id } = Router.query;
    useEffect(() => {
        getTeacherDetails(id)
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
                        <Translate>{'teacher.details.loading'}</Translate>
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

export default withTeacherDetailsData(TeacherDetails);
