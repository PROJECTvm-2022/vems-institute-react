/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Student onBoarding (Choose Institute step 2)
 * @createdOn 10/01/21 12:54 AM
 */

import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import VectorImage from '../../assets/StudentBasicDeatilsVector.svg';
import Typography from '@material-ui/core/Typography';
import Translate from '../../components/Translate';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { useLanguage } from '../../store/LanguageStore';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { InstituteService } from '../../apis/rest.app';
import { useStudentOnBoardingData } from '../../store/StudentOnBoardingContext';
import Chip from '@material-ui/core/Chip';

const useStyle = makeStyles((theme) => ({
    main: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(8),
        },
        [theme.breakpoints.down('xs')]: {
            paddingTop: theme.spacing(4),
            padding: theme.spacing(1),
        },
    },
    image: {
        width: 'auto',
        height: '100%',
        [theme.breakpoints.down('md')]: {
            width: '90%',
            height: 'auto',
        },
        [theme.breakpoints.down('sm')]: {
            width: '70%',
        },
    },
    gridContainer: {
        alignItems: 'center',
    },
    activeChip: {
        minWidth: 100,
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: 3,
    },
    detailDiv: {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        [theme.breakpoints.down('xs')]: {
            width: '95%',
        },
    },
    title: {
        color: theme.palette.background.secondary,
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(0),
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(2),
        },
    },
    description: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    instList: {
        height: '270px',
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
}));

const StudentChooseInstitute = ({ setActiveStep }) => {
    const classes = useStyle();
    const Language = useLanguage();
    const [data, setData] = useStudentOnBoardingData();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [institutionId, setInstitutionId] = useState('');
    const [institutions, setInstitutions] = useState([]);
    const [options, setOptions] = useState([]);

    const handleChange = (e) => {
        let institutionNameSearch = e.target.value;
        setOpen(false);
        setOptions([]);
        setInstitutionId('');
        if (institutionNameSearch && institutionNameSearch !== '') {
            setSearchLoading(true);
            InstituteService.find({
                query: {
                    name: {
                        $regex: institutionNameSearch.trim() !== '' ? `.*${institutionNameSearch}.*` : '',
                        $options: 'i',
                    },
                    $populate: 'user',
                },
            })
                .then((res) => {
                    setOptions(res.data);
                    setOpen(true);
                    setSearchLoading(false);
                })
                .catch(() => {
                    setSearchLoading(false);
                });
        }
    };

    const handleSelectChip = (each) => {
        if (institutionId === each._id) setInstitutionId('');
        else setInstitutionId(each._id);
        // handleNext();
    };

    useEffect(() => {
        setListLoading(true);
        InstituteService.find({
            query: {
                $limit: 10,
                $populate: 'user',
            },
        })
            .then((res) => {
                setInstitutions(res.data);
            })
            .catch(() => {})
            .finally(() => {
                setListLoading(false);
            });
    }, []);

    const validate = () => {
        if (institutionId === '') {
            enqueueSnackbar(Language.get('student-onboarding.chooseInstitute.error.selectInstitute'), {
                variant: 'error',
            });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            setData({
                institute: institutionId,
            });
            setTimeout(() => {
                setLoading(false);
                setActiveStep(2);
                enqueueSnackbar(Language.get('student-onboarding.chooseInstitute.success.instituteSelected'), {
                    variant: 'success',
                });
            }, 500);
        }
    };

    return (
        <Grid container spacing={0}>
            <Grid className={classes.main} item md={6} sm={12} xs={12}>
                <img alt={'Vector image'} className={classes.image} src={VectorImage} />
            </Grid>
            <Grid
                className={classes.gridContainer}
                component={Box}
                display={'flex'}
                flexDirection={'column'}
                item
                md={6}
                sm={12}
                xs={12}
            >
                <Box className={classes.detailDiv}>
                    <Typography className={classes.title} variant="h3">
                        <Translate>{'student-onboarding.chooseInstitute.title'}</Translate>
                    </Typography>
                    <Box mt={4} />
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Autocomplete
                                fullWidth
                                getOptionLabel={(option) => option && option.name}
                                getOptionSelected={() => true}
                                noOptionsText={Language.get('student-onboarding.chooseInstitute.form.noInstitute')}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        let _inst = institutions;
                                        if (_inst.filter((e) => e._id === newValue._id).length === 0) {
                                            setInstitutions([newValue, ..._inst]);
                                        }
                                        setInstitutionId(newValue ? newValue._id : null);
                                        setOpen(false);
                                    }
                                }}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                open={open}
                                options={options}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {searchLoading ? <CircularProgress size={20} /> : null}
                                                </React.Fragment>
                                            ),
                                        }}
                                        label={Language.get('student-onboarding.chooseInstitute.form.searchInstitute')}
                                        margin="dense"
                                        onChange={handleChange}
                                        placeholder={Language.get(
                                            'student-onboarding.chooseInstitute.form.enterInstitute',
                                        )}
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box className={classes.instList}>
                                {!listLoading ? (
                                    institutions.map((each) => (
                                        <Chip
                                            className={classes.activeChip}
                                            key={each._id}
                                            label={each.name}
                                            onClick={() => handleSelectChip(each)}
                                            variant={each._id !== institutionId ? 'outlined' : 'default'}
                                        />
                                    ))
                                ) : (
                                    <Box alignItems="center" display="flex" justifyContent="center">
                                        <CircularProgress size={'30px'} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Box mt={3} />
                            <Button
                                color={'primary'}
                                disabled={loading}
                                fullWidth
                                onClick={handleNext}
                                size={'large'}
                                variant={'contained'}
                            >
                                {loading ? (
                                    <CircularProgress size={'16px'} />
                                ) : (
                                    <Translate>{'student-onboarding.chooseInstitute.button.next'}</Translate>
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

StudentChooseInstitute.propTypes = {
    setActiveStep: PropTypes.any.isRequired,
};

StudentChooseInstitute.layout = null;

export default StudentChooseInstitute;
