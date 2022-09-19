import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../store/LanguageStore';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import Translate from '../../components/Translate';
import { CitiesService, StatesService } from '../../apis/rest.app';
import { UserService } from '../../apis/rest.app';
import { useTeacherDetailsData } from '../../store/TeacherDetailsContext';

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

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(2),
    },
    formcontrol: {
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    nextButton: {
        marginTop: theme.spacing(1),
    },
}));

function TeacherEditProfileDetails({
    open,
    setOpen,
    teacherEditData,
    teacherData,
    setTeacherData,
    position,
    onProfile = false,
}) {
    const classes = useStyles();
    const Language = useLanguage('teachers/[id]');
    const [, setData] = useTeacherDetailsData();

    const [name, setName] = useState(teacherEditData?.name || '');
    const [nameError, setNameError] = useState('');

    const [pincode, setPincode] = useState(teacherEditData?.pin || '');
    const [pincodeError, setPincodeError] = useState('');

    const [cityList, setCityList] = useState([]);

    const [stateList, setStateList] = React.useState([]);

    const [city, setCity] = useState(teacherEditData?.city || 'none');

    const [state, setState] = useState(teacherEditData?.state || 'none');

    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (name.trim() === '') {
            setNameError(Language.get('errorMessages.nameErrorMessages'));
            return false;
        } else {
            setNameError('');
        }
        if (state === 'none') {
            enqueueSnackbar(Language.get('errorMessages.stateErrorMessages'), {
                variant: 'warning',
            });
            return false;
        }
        if (city === 'none') {
            enqueueSnackbar(Language.get('errorMessages.cityErrorMessages'), {
                variant: 'warning',
            });
            return false;
        }
        if (pincode.trim() === '' || (pincode.length !== 4 && pincode.length !== 6)) {
            setPincodeError(Language.get('errorMessages.pinErrorMessages'));
            return false;
        } else {
            setPincodeError('');
        }
        return true;
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
        if (state !== 'none') {
            const selectedState = stateList?.filter((each) => each?.name === state)[0];
            CitiesService.find({
                query: {
                    state: selectedState?._id,
                },
            })
                .then((response) => {
                    setCityList(response);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something Went Wrong!', { variant: 'error' });
                });
        }
    }, [state]);
    const { enqueueSnackbar } = useSnackbar();

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            UserService.patch(teacherEditData?._id, {
                name: name,
                state: state === 'none' ? '' : state,
                city: city === 'none' ? '' : city,
                pin: pincode,
            })
                .then((res) => {
                    if (!onProfile) {
                        let _teacherData = teacherData;
                        _teacherData[position] = res;
                        setTeacherData([..._teacherData]);
                    } else {
                        setData(res);
                    }
                    enqueueSnackbar(Language.get('message.teacherEditedMessage'), {
                        variant: 'success',
                    });
                    setLoading(false);
                    setOpen(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('error.deleteError'), {
                        variant: 'error',
                    });
                    setLoading(false);
                    setOpen(false);
                });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    function getTitle() {
        if (!teacherEditData) {
            return [Language.get('teacher.form.stepperTitles.firstStep')];
        } else {
            return [Language.get('teacher.form.stepperTitles.editTeacher')];
        }
    }

    const title = getTitle();

    const [activeStep, setActiveStep] = React.useState(0);

    return (
        <>
            <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={open}>
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    <Typography variant="h4">{title[activeStep]}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box pb={2}>
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
                        <Box mt={0.5} />
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <FormControl className={classes.formcontrol} fullWidth variant="outlined">
                                <Select
                                    input={<BootstrapInput />}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setCity('none');
                                    }}
                                    value={state}
                                >
                                    <MenuItem value="none">{<Translate>{'selectState'}</Translate>}</MenuItem>
                                    {stateList &&
                                        stateList.map((each) => (
                                            <MenuItem key={each._id} value={each.name}>
                                                {each.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <Box mt={0.5} />
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    input={<BootstrapInput />}
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                >
                                    <MenuItem value={'none'}>{<Translate>{'selectCity'}</Translate>}</MenuItem>
                                    {cityList &&
                                        cityList.map((each) => (
                                            <MenuItem key={each._id} value={each.name}>
                                                {each.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField
                            error={pincodeError !== ''}
                            fullWidth
                            helperText={pincodeError}
                            label={Language.get('labels.pinCode')}
                            margin="dense"
                            onChange={(event) => setPincode(event.target.value)}
                            required
                            size="small"
                            value={pincode}
                            variant="outlined"
                        />
                        <Button
                            className={classes.nextButton}
                            color="primary"
                            disabled={loading}
                            fullWidth
                            onClick={handleNext}
                            variant="contained"
                        >
                            {loading ? <CircularProgress size={24} /> : <Translate>{'next'}</Translate>}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
TeacherEditProfileDetails.propTypes = {
    teacherData: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setTeacherData: PropTypes.func,
    teacherEditData: PropTypes.any,
    position: PropTypes.any,
    onProfile: PropTypes.bool,
};
export default TeacherEditProfileDetails;
