import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useLanguage } from '../../store/LanguageStore';
import Translate from '../../components/Translate';
import { CitiesService, StatesService, UserService } from '../../apis/rest.app';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import { useStudentDetailsData } from '../../store/StudentDetailsContext';

const useStyle = makeStyles((theme) => ({
    nextButton: {
        marginTop: theme.spacing(2),
    },
}));

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
}))(InputBase);

function FirstDialogForStudentToEdit({
    each,
    studentData,
    setStudentData,
    setOpenEditDialog,
    position,
    onProfile = false,
}) {
    const classes = useStyle();
    const Language = useLanguage('students/[id]');
    const { enqueueSnackbar } = useSnackbar();
    const [, setData] = useStudentDetailsData();

    const [name, setName] = useState(each && each.name ? each.name : '');
    const [nameError, setNameError] = useState('');

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState(each && each.email ? each.email : '');
    const [emailError, setEmailError] = useState('');

    const [phone, setPhone] = useState(each && each.phone ? each.phone : '');
    const [phoneError, setPhoneError] = useState('');

    const [address, setAddress] = useState(each && each.address ? each.address : '');

    const [pincode, setPincode] = useState(each && each.pin ? each.pin : '');
    const [pincodeError, setPincodeError] = useState('');

    const [cityList, setCityList] = useState([]);

    const [stateList, setStateList] = React.useState([]);

    const [city, setCity] = useState(each && each.city ? each.city : 'none');
    const [cityError, setCityError] = useState('');

    const [state, setState] = useState(each && each.state ? each.state : 'none');
    const [stateError, setStateError] = useState('');

    const validate = () => {
        if (name.trim() === '') {
            setNameError(Language.get('errorMessages.nameErrorMessages'));
            return false;
        } else {
            setNameError('');
        }
        if (email.trim() === '') {
            setEmailError(Language.get('errorMessages.emailErrorMessages'));
            return false;
        } else {
            if (
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    email,
                )
            ) {
                setEmailError('');
            } else {
                setEmailError(Language.get('errorMessages.emailErrorMessages1'));
                return false;
            }
            setEmailError('');
        }
        if (phone.trim() === '') {
            setPhoneError(Language.get('errorMessages.phoneErrorMessages'));
            return false;
        } else {
            setPhoneError('');
        }
        if (city === 'none') {
            setCityError(Language.get('errorMessages.cityErrorMessages'));
            return false;
        } else {
            setCityError('');
        }
        if (state === 'none') {
            setStateError(Language.get('errorMessages.stateErrorMessages'));
            return false;
        } else {
            setStateError('');
        }
        if (pincode.trim() === '') {
            setPincodeError(Language.get('errorMessages.pincodeErrorMessages'));
            return false;
        } else {
            setPincodeError('');
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            UserService.patch(each._id, {
                name: name,
                email: email,
                phone: phone,
                address: address,
                state: state,
                pin: pincode,
            })
                .then((res) => {
                    if (!onProfile) {
                        let _studentData = studentData;
                        _studentData[position] = res;
                        setStudentData([..._studentData]);
                    } else {
                        setData(res);
                    }
                    enqueueSnackbar(Language.get('studentEditedMessage'), {
                        variant: 'success',
                    });
                    setLoading(false);
                    setOpenEditDialog(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('error.deleteError'), {
                        variant: 'error',
                    });
                });
        }
    };

    useEffect(() => {
        StatesService.find()
            .then((response) => {
                setStateList(response);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('error.deleteError'), {
                    variant: 'error',
                });
            });
    }, []);

    useEffect(() => {
        if (state !== 'none') {
            const selectedState = stateList.filter((each) => each.name === state)[0];
            CitiesService.find({
                query: {
                    state: selectedState?._id,
                },
            })
                .then((response) => {
                    setCityList(response);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('error.deleteError'), {
                        variant: 'error',
                    });
                });
        }
    }, [state]);

    return (
        <div>
            <TextField
                autoFocus
                error={nameError !== ''}
                fullWidth
                helperText={nameError}
                label={Language.get('labels.name')}
                margin="dense"
                onChange={(event) => setName(event.target.value)}
                required
                size="small"
                value={name}
                variant="outlined"
            />
            <TextField
                error={emailError !== ''}
                fullWidth
                helperText={emailError}
                label={Language.get('labels.email')}
                margin="dense"
                onChange={(event) => setEmail(event.target.value)}
                required
                size="small"
                value={email}
                variant="outlined"
            />
            <TextField
                error={phoneError !== ''}
                fullWidth
                helperText={phoneError}
                label={Language.get('labels.phone')}
                margin="dense"
                onChange={(event) => setPhone(event.target.value)}
                required
                size="small"
                type={'tel'}
                value={phone}
                variant="outlined"
            />
            <TextField
                fullWidth
                label={Language.get('labels.address')}
                margin="dense"
                onChange={(event) => setAddress(event.target.value)}
                size="small"
                value={address}
                variant="outlined"
            />
            <Box mt={0.5} />
            <FormControl className={classes.formcontrol} fullWidth variant="outlined">
                <Select
                    error={stateError !== ''}
                    helperText={stateError}
                    input={<BootstrapInput />}
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                >
                    <MenuItem value="none">{<Translate root={'students/[id]'}>{'selectState'}</Translate>}</MenuItem>
                    {stateList &&
                        stateList.map((each) => (
                            <MenuItem key={each._id} value={each.name}>
                                {each.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <Box mt={1} />
            <FormControl fullWidth variant="outlined">
                <Select
                    error={cityError !== ''}
                    helperText={cityError}
                    input={<BootstrapInput />}
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                >
                    <MenuItem value={'none'}>{<Translate root={'students/[id]'}>{'selectCity'}</Translate>}</MenuItem>
                    {cityList &&
                        cityList.map((each) => (
                            <MenuItem key={each._id} value={each.name}>
                                {each.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <TextField
                error={pincodeError !== ''}
                fullWidth
                helperText={pincodeError}
                label={Language.get('labels.pinCode')}
                margin="dense"
                onChange={(event) => setPincode(event.target.value)}
                size="small"
                value={pincode}
                variant="outlined"
            />
            <div>
                <Button
                    className={classes.nextButton}
                    color="primary"
                    disabled={loading}
                    fullWidth
                    onClick={handleNext}
                    variant="contained"
                >
                    {loading ? <CircularProgress size={24} /> : <Translate root={'students/[id]'}>{'next'}</Translate>}
                </Button>
            </div>
        </div>
    );
}
FirstDialogForStudentToEdit.propTypes = {
    each: PropTypes.any,
    position: PropTypes.number,
    studentData: PropTypes.array,
    setCourse: PropTypes.any,
    onProfile: PropTypes.bool,
    setStudentData: PropTypes.func,
    tableOpen: PropTypes.any.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,
};
export default FirstDialogForStudentToEdit;
