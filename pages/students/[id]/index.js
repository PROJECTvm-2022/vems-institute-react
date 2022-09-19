import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core/index';
import Translate from '../../../src/components/Translate';
import TopHeaderProfile from '../../../src/page-components/Students/TopHeaderProfile';
import BottomSectionProfile from '../../../src/page-components/Students/BottomSectionProfile';
import { UserService } from '../../../src/apis/rest.app';
import { useStudentDetailsData, withStudentDetailsData } from '../../../src/store/StudentDetailsContext';

function StudentDetails() {
    const Router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [, setData] = useStudentDetailsData();
    const { id } = Router.query;

    useEffect(() => {
        UserService.get(id, {
            query: {
                $populate: ['user', 'institute', 'modules'],
            },
        })
            .then((response) => {
                setData(response);
            })
            .catch((error) => {
                setError(error);
                setData({});
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading)
        return (
            <Box alignItems="center" display="flex" flexDirection="column" height="80vh" justifyContent="center">
                <CircularProgress />
                <Box mt={2} />
                <Typography>
                    <Translate root={'students/[id]'}>{'loading'}</Translate>
                </Typography>
            </Box>
        );
    if (error)
        return (
            <Box alignItems="center" display="flex" flexDirection="column" height="80vh" justifyContent="center">
                <Typography>{error?.response?.data?.message}</Typography>
            </Box>
        );
    return (
        <>
            <TopHeaderProfile />
            <Box mt={2} />
            <BottomSectionProfile id={id} />
        </>
    );
}

export default withStudentDetailsData(StudentDetails);
