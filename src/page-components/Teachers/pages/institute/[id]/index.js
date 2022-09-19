import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TopHeaderProfile from '../../../src/page-components/institute/TopHeaderProfile';
import { getInstituteDetail } from '../../../src/apis/institutes';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core/index';
import Translate from '../../../src/components/Translate';
import BottomSectionProfile from '../../../src/page-components/institute/BottomSectionProfile';
import { useInstituteDetailsData, withInstituteDetailsData } from '../../../src/store/InstitutionDetailsContext';
import useHandleError from '../../../src/hooks/useHandleError';

function InstituteDetails() {
    const Router = useRouter();
    const [loading, setLoading] = useState(true);
    const [, setData] = useInstituteDetailsData();
    const handleError = useHandleError();
    const { id } = Router.query;
    useEffect(() => {
        getInstituteDetail(id)
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
                        <Translate>{'institute.details.loading'}</Translate>
                    </Typography>
                </Box>
            ) : (
                <>
                    <TopHeaderProfile id={id} />
                    <Box mt={2} />
                    <BottomSectionProfile />
                </>
            )}
        </>
    );
}

export default withInstituteDetailsData(InstituteDetails);
