import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppsIcon from '@material-ui/icons/Apps';
import StorageIcon from '@material-ui/icons/Storage';
import InstitutionAddDialog from '../../src/page-components/institution-components/InstitutionAddDialog';
import InfiniteScroll from 'react-infinite-scroller';
import { getAllInstitute } from '../../src/apis/institutes';
import CardForInstitute from '../../src/page-components/institution-components/CardForInstitute';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import InstitutionTableView from '../../src/page-components/institution-components/InstitutionTableView';
import Translate from '../../src/components/Translate';
import { withInstituteOnBoardingData } from '../../src/store/InstitutionOnBoardingContext';
import FilterComponent from '../../src/page-components/institution-components/FilterComponent';
import Hidden from '@material-ui/core/Hidden';
import InstituteSkeleton from '../../src/components/Skeleton/InstituteSkeleton';
import { CitiesService, StatesService } from '../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import { useLanguage } from '../../src/store/LanguageStore';
import Image from '../../public/Group 506.svg';

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
}));

const Institute = () => {
    const Language = useLanguage();
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [course, setCourse] = useState('none');

    const [stateId, setStateId] = useState('none');
    const [stateList, setStateList] = React.useState([]);
    const [state, setState] = useState('none');

    const [city, setCity] = useState('none');
    const [cityList, setCityList] = useState([]);

    const [changeType, setChangeType] = useState(null);
    const [tableOpen, setTableOpen] = useState(false);
    const [institutionData, setInstitutionData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const handleButtonOpen = () => {
        setTableOpen(true);
    };

    useEffect(() => {
        StatesService.find()
            .then((response) => {
                setStateList(response);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
            });
    }, []);

    useEffect(() => {
        if (stateId !== 'none')
            CitiesService.find({
                query: {
                    state: stateId,
                },
            })
                .then((response) => {
                    setCityList(response);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something Went Wrong!', { variant: 'error' });
                });
    }, [stateId]);

    const LoadInst = () => {
        setLoading(true);
        getAllInstitute(institutionData.length, {
            name: {
                $regex: search.trim() !== '' ? `.*${search}.*` : '',
                $options: 'i',
            },
            state: {
                $regex: state !== 'none' ? `.*${state}.*` : '',
                $options: 'i',
            },
            city: {
                $regex: city !== 'none' ? `.*${city}.*` : '',
                $options: 'i',
            },
        })
            .then((response) => {
                const { data, total } = response;
                const result = [...institutionData, ...data];
                setHasMore(result.length < total);
                setInstitutionData(result);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
                setLoading(false);
                setHasMore(false);
            });
    };

    useEffect(() => {
        setInstitutionData([]);
        setHasMore(true);
    }, [state]);
    useEffect(() => {
        setInstitutionData([]);
        setHasMore(true);
    }, [city]);

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate>{'institute.title'}</Translate>
                        </Typography>
                        <Box alignItems="center" className={classes.buttonDiv} display="flex" justifyContent="center">
                            <Button
                                className={classes.buttonDiv}
                                onClick={() => {
                                    setChangeType(!changeType);
                                }}
                            >
                                <Typography variant={'subtitle2'}>
                                    <Translate>{'institute.form.button.switch'}</Translate>
                                </Typography>
                                {changeType ? (
                                    <AppsIcon className={classes.switchButtonIcon} />
                                ) : (
                                    <StorageIcon className={classes.switchButtonIcon} />
                                )}
                            </Button>
                            <Hidden xsDown>
                                <Box ml={1} />
                                <Button
                                    color="primary"
                                    disabled={loading}
                                    onClick={handleButtonOpen}
                                    size="large"
                                    variant="contained"
                                >
                                    {loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <Translate>{'institute.form.button.addInstitute'}</Translate>
                                    )}
                                </Button>
                            </Hidden>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <Hidden smUp>
                        <Box mt={2} />
                        <Button
                            color="primary"
                            disabled={loading}
                            fullWidth
                            onClick={handleButtonOpen}
                            size="medium"
                            variant="contained"
                        >
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Translate>{'institute.form.button.addInstitute'}</Translate>
                            )}
                        </Button>
                    </Hidden>
                </Grid>
            </Grid>
            <FilterComponent
                city={city}
                cityList={cityList}
                course={course}
                setCity={setCity}
                setCourse={setCourse}
                setHasMore={setHasMore}
                setInstitutionData={setInstitutionData}
                setSearch={setSearch}
                setState={setState}
                setStateId={setStateId}
                stateId={stateId}
                stateList={stateList}
            />
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadInst}
                loader={
                    changeType ? (
                        <Box align={'center'} key={'allStudent'} pb={1} pt={1}>
                            <CircularProgress size={28} />
                        </Box>
                    ) : (
                        <Box align={'center'} key={'allInstitute'} my={3.8}>
                            <InstituteSkeleton />
                        </Box>
                    )
                }
                pageStart={0}
            >
                {institutionData.length ? (
                    <div className={classes.mainDiv}>
                        {!changeType ? (
                            <Grid container spacing={2}>
                                {institutionData.map((each, index) => {
                                    return (
                                        <CardForInstitute
                                            each={each}
                                            institutionData={institutionData}
                                            key={each._id}
                                            position={index}
                                            setInstitutionData={setInstitutionData}
                                        />
                                    );
                                })}
                            </Grid>
                        ) : (
                            <TableContainer
                                bgcolor={'common.white'}
                                borderRadius={'borderRadius'}
                                component={Box}
                                p={1}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                <Translate>{'institute.form.tableHeadings.color'}</Translate>
                                            </TableCell>
                                            <TableCell>
                                                <Translate>{'institute.form.tableHeadings.institutionLogo'}</Translate>
                                            </TableCell>
                                            <TableCell>
                                                <Translate>{'institute.form.tableHeadings.institutionName'}</Translate>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Translate>{'institute.form.tableHeadings.Number'}</Translate>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Translate>{'institute.form.tableHeadings.Email'}</Translate>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Translate>{'institute.form.tableHeadings.Address'}</Translate>
                                            </TableCell>
                                            <TableCell align="left" />
                                            <TableCell align="left" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {institutionData.map((each, index) => (
                                            <InstitutionTableView
                                                each={each}
                                                institutionData={institutionData}
                                                key={each._id}
                                                position={index}
                                                setInstitutionData={setInstitutionData}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box
                        alignItems={'center'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        mt={5}
                    >
                        <img alt={'image'} src={Image} />
                        <Box mt={3} />
                        <Typography variant={'h2'}>
                            <Translate>{'institute.form.errors.oops'}</Translate>
                        </Typography>
                        <Box mt={3} width={450}>
                            <Typography align={'center'} variant={'h3'}>
                                <Translate>{'institute.form.errors.noInstitution'}</Translate>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </InfiniteScroll>
            <InstitutionAddDialog
                institutionData={institutionData}
                setHasMore={setHasMore}
                setInstitutionData={setInstitutionData}
                setTableOpen={setTableOpen}
                tableOpen={tableOpen}
            />
        </React.Fragment>
    );
};

export default withInstituteOnBoardingData(Institute);
