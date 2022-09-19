import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TopHeaderProfile from '../../../src/page-components/profile/TopHeaderProfile';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core/index';
import Translate from '../../../src/components/Translate';
import BottomSectionProfile from '../../../src/page-components/profile/BottomSectionProfile';
import { useInstituteDetailsData } from '../../../src/store/InstitutionDetailsContext';
import useHandleError from '../../../src/hooks/useHandleError';
import {InstituteDashboardService} from '../../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import {getInstituteDetail} from "../../../src/apis/institutes";
import {useUser} from "../../../src/store/UserContext";

function InstituteDetails() {
    const { enqueueSnackbar } = useSnackbar();
    const Router = useRouter();
    const [loading, setLoading] = useState(true);
    const [, setData] = useInstituteDetailsData();
    const handleError = useHandleError();
    const { id } = Router.query;
    const [allDashBoardData, setAllDashboardData] = useState('');

    // useEffect(() => {
    //     if (!id) return;
    //     getInstituteDetail(id)
    //         .then((response) => {
    //             console.log('response',response);
    //             setData(response);
    //         })
    //         .catch((error) => {
    //             handleError()(error);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, []);

    useEffect(() => {
        setLoading(true);
        InstituteDashboardService.find()
            .then((res) => {
                // console.log('res....--',res);
                setAllDashboardData(res);
                setLoading(false);
            })
            .catch((error) => {
                // console.log('error',error);
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setLoading(false);
            });
    }, [id]);

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
                    <TopHeaderProfile />
                    <Box mt={2} />
                    <BottomSectionProfile allDashBoardData={allDashBoardData} />
                </>
            )}
        </>
    );
}

export default InstituteDetails;
