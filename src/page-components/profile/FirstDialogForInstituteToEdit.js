import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useLanguage } from '../../store/LanguageStore';
import Translate from '../../components/Translate';
import PropTypes from 'prop-types';
import { editInstitute } from '../../apis/institutes';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useUser} from "../../store/UserContext";

const useStyle = makeStyles((theme) => ({
    nextButton: {
        marginTop: theme.spacing(2),
    },
    formcontrol: {
        marginBottom: theme.spacing(1),
    },
}));

// const BootstrapInput = withStyles((theme) => ({
//     root: {
//         'label + &': {
//             marginTop: theme.spacing(3),
//         },
//     },
//     input: {
//         borderRadius: 4,
//         position: 'relative',
//         backgroundColor: theme.palette.background.paper,
//         border: '1px solid #ced4da',
//         fontSize: 16,
//         padding: '10px 26px 10px 12px',
//         transition: theme.transitions.create(['border-color', 'box-shadow']),
//     },
// }))(InputBase);

function FirstDialogForInstituteToEdit({ each, institutionData, setInstitutionData, position, setTableOpen }) {
    const classes = useStyle();
    const Language = useLanguage();
    const [user, setUser] = useUser();

    const [instName, setInstName] = useState(each && each.name ? each.name : '');
    const [instNameError, setInstNameError] = useState('');

    const [instEmail, setInstEmail] = useState(each && each.email ? each.email : '');
    const [instEmailError, setInstEmailError] = useState('');

    const [phone, setPhone] = useState(each && each.phone ? each.phone : '');
    const [phoneError, setPhoneError] = useState('');

    const [address, setAddress] = useState(each && each.address ? each.address : '');
    const [addressError, setAddresError] = useState('');

    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (instName.trim() === '') {
            setInstNameError(Language.get('institute.form.errorMessages.nameErrorMessages'));
            return false;
        } else {
            setInstNameError('');
        }
        if (instEmail.trim() === '') {
            setInstEmailError(Language.get('institute.form.errorMessages.emailErrorMessages'));
            return false;
        } else {
            if (
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    instEmail,
                )
            ) {
                setInstEmailError('');
            } else {
                setInstEmailError(Language.get('institute.form.errorMessages.emailErrorMessages1'));
                return false;
            }
            setInstEmailError('');
        }
        if (phone.trim() === '') {
            setPhoneError(Language.get('institute.form.errorMessages.phoneErrorMessages'));
            return false;
        } else {
            if (/^\d+$/.test(phone) && phone.length === 10) {
                setPhoneError('');
            } else {
                setPhoneError(Language.get('institute.form.errorMessages.phoneErrorMessages'));
                return false;
            }
        }
        if (address.trim() === '') {
            setAddresError(Language.get('institute.form.errorMessages.addressErrorMessages'));
            return false;
        } else {
            setAddresError('');
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            editInstitute(each._id, {
                name: instName,
                email: instEmail,
                phone: phone,
                address: address,
            })
                .then((res) => {
                    let _user = user;
                    _user.institute = res;
                    setUser({..._user});
                    let _institutionData = institutionData;
                    _institutionData[position] = res;
                    setInstitutionData([..._institutionData]);
                    enqueueSnackbar(Language.get('institute.form.successMessage.editedSuccessFully'), {
                        variant: 'success',
                    });
                    setLoading(false);
                    setTableOpen(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : Language.get('institute.form.error.deleteError'), {
                        variant: Language.get('institute.form.variants.variantError'),
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
                label={Language.get('institute.form.labels.institutionName')}
                margin="dense"
                onChange={(event) => {
                    setInstName(event.target.value);
                    setInstNameError('');
                }}
                required
                size="small"
                value={instName}
                variant="outlined"
            />
            <TextField
                error={!!instEmailError}
                fullWidth
                helperText={instEmailError}
                label={Language.get('institute.form.labels.institutionEmail')}
                margin="dense"
                onChange={(event) => {
                    setInstEmail(event.target.value);
                    setInstEmailError('');
                }}
                required
                size="small"
                value={instEmail}
                variant="outlined"
            />
            <TextField
                error={!!phoneError}
                fullWidth
                helperText={phoneError}
                label={Language.get('institute.form.labels.phone')}
                margin="dense"
                onChange={(event) => {
                    setPhone(event.target.value);
                    setPhoneError('');
                }}
                required
                size="small"
                type={'number'}
                value={phone}
                variant="outlined"
            />
            <TextField
                error={!!addressError}
                fullWidth
                helperText={addressError}
                label={Language.get('institute.form.labels.address')}
                margin="dense"
                onChange={(event) => {
                    setAddress(event.target.value);
                    setAddresError('');
                }}
                required
                size="small"
                value={address}
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
    tableOpen: PropTypes.any,
    setTableOpen: PropTypes.any,
};
