import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useLanguage } from '../../store/LanguageStore';
import Translate from '../../components/Translate';
import PropTypes from 'prop-types';
import { editInstitute } from '../../apis/institutes';
import { useSnackbar } from 'notistack';
import { CitiesService, StatesService } from '../../apis/rest.app';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';

const useStyle = makeStyles((theme) => ({
    nextButton: {
        marginTop: theme.spacing(2),
    },
    formcontrol: {
        marginBottom: theme.spacing(1),
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

function FirstDialogForInstituteToEdit({
    each,
    institutionData,
    setInstitutionData,
    position,
    setTableOpen,
    onProfile,
}) {
    const classes = useStyle();
    const Language = useLanguage('institute/[id]');

    const [, setData] = useInstituteDetailsData();

    const [instName, setInstName] = useState(each && each.name ? each.name : '');
    const [instNameError, setInstNameError] = useState('');

    const [pinCode, setPinCode] = useState(each && each.pin ? each.pin : '');
    const [pinCodeError, setPinCodeError] = useState('');

    const [loading, setLoading] = useState(false);

    const [cityList, setCityList] = useState([]);

    const [stateList, setStateList] = React.useState([]);

    const [city, setCity] = useState(each && each.city ? each.city : 'none');

    const [state, setState] = useState('none');

    useEffect(() => {
        StatesService.find()
            .then((response) => {
                setStateList(response);
                if (each && each.state) {
                    setState(each.state);
                }
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
            });
    }, []);

    useEffect(() => {
        let selectedId = [];
        if (state !== 'none') {
            selectedId.push(...stateList.filter((e) => e.name === state));
        }
        if (selectedId.length !== 0)
            CitiesService.find({
                query: {
                    state: selectedId[0]._id,
                },
            })
                .then((response) => {
                    setCityList(response);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something Went Wrong!', { variant: 'error' });
                });
    }, [state]);

    const validate = () => {
        if (instName.trim() === '') {
            setInstNameError(Language.get('nameErrorMessages'));
            return false;
        } else {
            setInstNameError('');
        }
        if (state === 'none') {
            enqueueSnackbar(Language.get('stateErrorMessages'), {
                variant: 'error',
            });
            return false;
        }
        if (city === 'none') {
            enqueueSnackbar(Language.get('cityErrorMessages'), {
                variant: 'error',
            });
            return false;
        }
        if (pinCode.trim() === '') {
            setPinCodeError(Language.get('stateErrorMessages'));
            return false;
        } else {
            setPinCodeError('');
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            editInstitute(each._id, {
                name: instName,
                state: state,
                city: city,
                pin: pinCode,
            })
                .then((res) => {
                    if (!onProfile) {
                        let _institutionData = institutionData;
                        _institutionData[position] = res;
                        setInstitutionData([..._institutionData]);
                    } else {
                        setData(res);
                    }
                    enqueueSnackbar(Language.get('editedSuccessFully'), {
                        variant: 'success',
                    });
                    setLoading(false);
                    setTableOpen(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('deleteError'), {
                        variant: 'error',
                    });
                    setLoading(false);
                });
        }
    };

    const { enqueueSnackbar } = useSnackbar();
    return (
        <div>
            <TextField
                autoFocus
                error={!!instNameError}
                fullWidth
                helperText={instNameError}
                label={Language.get('name')}
                margin="dense"
                onChange={(event) => setInstName(event.target.value)}
                required
                size="small"
                value={instName}
                variant="outlined"
            />
            <FormControl className={classes.formcontrol} fullWidth variant="outlined">
                <Select
                    input={<BootstrapInput />}
                    onChange={(e) => {
                        setState(e.target.value);
                        setCity('none');
                    }}
                    value={state}
                >
                    <MenuItem value="none">{<Translate>{'institute.form.menuItem.selectState'}</Translate>}</MenuItem>
                    {stateList &&
                        stateList.map((each) => (
                            <MenuItem key={each._id} value={each.name}>
                                {each && each.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
                <Select
                    input={<BootstrapInput />}
                    onChange={(e) => {
                        setCity(e.target.value);
                    }}
                    value={city}
                >
                    <MenuItem value={'none'}>{<Translate>{'institute.form.menuItem.selectCity'}</Translate>}</MenuItem>
                    {cityList &&
                        cityList.map((each) => (
                            <MenuItem key={each._id} value={each.name}>
                                {each && each.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <TextField
                error={!!pinCodeError}
                fullWidth
                helperText={pinCodeError}
                label={Language.get('institute.form.labels.pincode')}
                margin="dense"
                onChange={(event) => setPinCode(event.target.value)}
                required
                size="small"
                value={pinCode}
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
                    {loading ? <CircularProgress size={23} /> : <Translate>{'institute.form.button.next'}</Translate>}
                </Button>
            </div>
        </div>
    );
}

export default FirstDialogForInstituteToEdit;

FirstDialogForInstituteToEdit.propTypes = {
    each: PropTypes.any,
    institutionData: PropTypes.any,
    setInstitutionData: PropTypes.any,
    position: PropTypes.number,
    onProfile: PropTypes.bool,
    tableOpen: PropTypes.any,
    setTableOpen: PropTypes.any,
};
