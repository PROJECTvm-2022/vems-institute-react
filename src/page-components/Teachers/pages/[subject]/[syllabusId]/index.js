/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description page for getting units
 * @createdOn 09-Jan-21 4:34 PM
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAllUnits } from '../../../src/apis/units';
import useHandleError from '../../../src/hooks/useHandleError';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Translate from '../../../src/components/Translate';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import ChaptersComponent from '../../../src/page-components/selectUnit/ChaptersComponent';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import CreateDialog from '../../../src/page-components/selectCourse/CreateDialog';
import Container from '@material-ui/core/Container';

const Index = () => {
    const Router = useRouter();
    const handleError = useHandleError();
    const { syllabusId, subject } = Router.query;
    const [hasMore, setHasMore] = useState(true);
    const [units, setUnits] = useState([]);
    const [openCreateVideo, setOpenCreateVideo] = useState(false);
    const [openCreateExam, setOpenCreateExam] = useState(false);
    const [search] = useState('');
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const loadData = () => {
        setLoading(true);
        getAllUnits(units.length, 10, syllabusId, search ? search : '')
            .then((res) => {
                const { data } = res;
                const result = [...units, ...data];
                setHasMore(false);
                setUnits(result);
            })
            .catch((e) => {
                handleError()(e);
                setHasMore(false);
            })
            .finally(() => setLoading(false));
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Box
                alignItems={'center'}
                display={'flex'}
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent={'space-between'}
            >
                <Typography variant={'h3'}>{subject}</Typography>
                <Button
                    alignItems={'center'}
                    aria-controls="fade-menu"
                    aria-haspopup="true"
                    color={'primary'}
                    component={Box}
                    display={'flex'}
                    justifyContent={'space-between'}
                    mt={{ xs: 2, sm: 0 }}
                    onClick={handleClick}
                    px={3}
                    py={0.7}
                    size="large"
                    variant="contained"
                >
                    <Typography variant={'button'}>
                        <Translate>{'selectUnit.form.createLecture/Exam'}</Translate>
                    </Typography>
                    <Box
                        alignItems={'center'}
                        color={'common.white'}
                        display={'flex'}
                        justifyContent={'space-between'}
                        ml={3}
                    >
                        <ArrowDropDownIcon fontSize={'large'} />
                    </Box>
                </Button>
            </Box>
            <Box my={7}>
                <InfiniteScroll
                    hasMore={hasMore}
                    loadMore={loadData}
                    loader={
                        loading && (
                            <Typography align={'center'} style={{ padding: 10 }}>
                                {' '}
                                <CircularProgress size={28} />{' '}
                            </Typography>
                        )
                    }
                    pageStart={0}
                >
                    {units && units.length > 0 ? (
                        <Box>
                            {units.map((each) => (
                                <Grid container key={each._id} spacing={2}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography component={Box} fontWeight={'700'} variant={'h3'}>
                                            {each.name}
                                        </Typography>
                                    </Grid>
                                    <Container maxWidth={'lg'}>
                                        <ChaptersComponent each={each} />
                                    </Container>
                                </Grid>
                            ))}
                        </Box>
                    ) : loading ? (
                        <Typography align="center"></Typography>
                    ) : (
                        <Typography align="center" variant="body2">
                            <Translate>{'tableHeading.noSubjects'}</Translate>
                        </Typography>
                    )}
                </InfiniteScroll>
            </Box>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                getContentAnchorEl={null}
                onClose={handleClose}
                open={open}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box p={1}>
                    <MenuItem
                        component={Box}
                        display={'flex'}
                        justifyContent={'center'}
                        onClick={() => {
                            setOpenCreateVideo(true);
                            setAnchorEl(null);
                        }}
                    >
                        <Typography align={'center'} component={Box} px={3}>
                            <Translate>{'selectUnit.form.createLecture'}</Translate>
                        </Typography>
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                        component={Box}
                        display={'flex'}
                        justifyContent={'center'}
                        onClick={() => {
                            setOpenCreateExam(true);
                            setAnchorEl(null);
                        }}
                    >
                        <Typography align={'center'} component={Box} px={3}>
                            <Translate>{'selectUnit.form.createExam'}</Translate>
                        </Typography>
                    </MenuItem>
                </Box>
            </Menu>
            <CreateDialog close={() => setOpenCreateVideo(false)} open={openCreateVideo} />
        </React.Fragment>
    );
};

export default Index;
