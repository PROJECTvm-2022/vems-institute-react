/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Student onboarding (Basic Details Step 1)
 * @createdOn 07/01/21 11:06 PM
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
import { useUser } from '../../store/UserContext';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CitiesService, CreateUser, StatesService } from '../../apis/rest.app';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
}));

const StudentBasicDetails = ({ setActiveStep }) => {
    const classes = useStyle();
    const Language = useLanguage();

    StudentBasicDetails.propTypes = {
        setActiveStep: PropTypes.any.isRequired,
    };

    const [user] = useUser();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [phone, setPhone] = React.useState('');
    const [phoneError, setPhoneError] = React.useState('');

    const [address, setAddress] = React.useState('');
    const [addressError, setAddressError] = React.useState('');

    const [stateId, setStateId] = useState('none');
    const [stateList, setStateList] = React.useState([]);
    const [state, setState] = useState('none');

    const [city, setCity] = useState('none');
    const [cityList, setCityList] = useState([]);

    const [pin, setPin] = React.useState('');
    const [pinError, setPinError] = React.useState('');

    const validate = () => {
        if (phone === '') {
            setPhoneError(
                Language.get('student-onboarding.basicDetails.form.label.contactNo') +
                    ' ' +
                    Language.get('error.isRequired'),
            );
            return false;
        } else {
            if (/^\d+$/.test(phone) && phone.length === 10) {
                setPhoneError('');
            } else {
                setPhoneError(Language.get('student-onboarding.basicDetails.form.error.validPhone'));
                return false;
            }
        }
        if (address.trim() === '') {
            setAddressError(
                Language.get('student-onboarding.basicDetails.form.label.address') +
                    ' ' +
                    Language.get('error.isRequired'),
            );
            return false;
        } else {
            setAddressError('');
        }
        if (state.trim() === '' || state.trim() === 'none') {
            enqueueSnackbar(
                Language.get('student-onboarding.basicDetails.form.label.state') +
                    ' ' +
                    Language.get('error.isRequired'),
                { variant: 'warning' },
            );

            return false;
        }
        if (city.trim() === '' || city.trim() === 'none') {
            enqueueSnackbar(
                Language.get('student-onboarding.basicDetails.form.label.city') +
                    ' ' +
                    Language.get('error.isRequired'),
                { variant: 'warning' },
            );
            return false;
        }
        if (pin.trim() === '') {
            setPinError(
                Language.get('student-onboarding.basicDetails.form.label.pinCode') +
                    ' ' +
                    Language.get('error.isRequired'),
            );
            return false;
        } else {
            if (/^\d+$/.test(pin) && (pin.length === 4 || pin.length === 6)) {
                setPinError('');
            } else {
                setPinError(Language.get('student-onboarding.basicDetails.form.error.validPinCode'));
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            CreateUser.patch(user && user._id, {
                phone: phone,
                address: address,
                state: state,
                city: city,
                pin: pin,
            })
                .then(() => {
                    setLoading(false);
                    setActiveStep(1);
                    enqueueSnackbar(Language.get('student-onboarding.basicDetails.form.success.detailsAdded'), {
                        variant: 'success',
                    });
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('error.500'), {
                        variant: 'error',
                    });
                    setLoading(false);
                });
        }
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
                        <Translate>{'student-onboarding.basicDetails.title'}</Translate>
                    </Typography>
                    <Box mt={4} />
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <TextField
                                error={!!phoneError}
                                fullWidth
                                helperText={phoneError}
                                label={<Translate>{'student-onboarding.basicDetails.form.label.contactNo'}</Translate>}
                                margin="none"
                                onChange={(event) =>
                                    event.target.value.length < 11 ? setPhone(event.target.value) : ''
                                }
                                size="small"
                                type={'number'}
                                value={phone}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <TextField
                                error={!!addressError}
                                fullWidth
                                helperText={addressError}
                                label={<Translate>{'student-onboarding.basicDetails.form.label.address'}</Translate>}
                                margin="none"
                                multiline
                                onChange={(event) => setAddress(event.target.value)}
                                rows={6}
                                rowsMax={6}
                                size="small"
                                type={'text'}
                                value={address}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <TextField
                                error={!!pinError}
                                fullWidth
                                helperText={pinError}
                                label={<Translate>{'student-onboarding.basicDetails.form.label.pinCode'}</Translate>}
                                margin="none"
                                onChange={(event) => (event.target.value.length < 7 ? setPin(event.target.value) : '')}
                                size="small"
                                type={'tel'}
                                value={pin}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth margin="dense" variant="outlined">
                                <Select
                                    onChange={(e) => {
                                        setState(e.target.value.name === undefined ? 'none' : e.target.value.name);
                                        setStateId(e.target.value);
                                        setCity('none');
                                    }}
                                    value={stateId}
                                >
                                    <MenuItem value={'none'}>
                                        <Translate>{'student-onboarding.basicDetails.form.label.state'}</Translate>
                                    </MenuItem>
                                    {stateList &&
                                        stateList.map((each) => (
                                            <MenuItem key={each._id} value={each}>
                                                {each.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <FormControl fullWidth margin="dense" variant="outlined">
                                <Select
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                    }}
                                    value={city}
                                >
                                    <MenuItem value={'none'}>
                                        <Translate>{'student-onboarding.basicDetails.form.label.city'}</Translate>
                                    </MenuItem>
                                    {cityList &&
                                        cityList.map((each) => (
                                            <MenuItem key={each._id} value={each.name}>
                                                {each.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Button
                                color="primary"
                                component={Box}
                                disabled={loading}
                                fullWidth
                                height={'40px'}
                                onClick={handleNext}
                                variant="contained"
                            >
                                {loading ? (
                                    <CircularProgress size={'16px'} />
                                ) : (
                                    <Translate>{'student-onboarding.basicDetails.form.button.next'}</Translate>
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

StudentBasicDetails.layout = null;

export default StudentBasicDetails;
