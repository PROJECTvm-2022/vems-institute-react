import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useLanguage } from '../../store/LanguageStore';
import Translate from '../../components/Translate';
import PropTypes from 'prop-types';
import { editInstitute } from '../../apis/institutes';
import { useSnackbar } from 'notistack';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import {useUser} from "../../store/UserContext";

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
    const Language = useLanguage();
    const [, setData] = useInstituteDetailsData();
    const [user, setUser] = useUser();

    const [instEmail, setInstEmail] = useState(each && each.email ? each.email : '');
    const [instEmailError, setInstEmailError] = useState('');

    const [phone, setPhone] = useState(each && each.phone ? each.phone : '');
    const [phoneError, setPhoneError] = useState('');

    const [address, setAddress] = useState(each && each.address ? each.address : '');
    const [addressError, setAddresError] = useState('');

    const [webSite, setWebSite] = useState(each && each.website ? each.website : '');
    const [webSiteError, setWebSiteError] = useState('');

    const [loading, setLoading] = useState(false);

    const validate = () => {
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
        if (webSite.trim() === '') {
            setWebSiteError(Language.get('institute.form.errorMessages.websiteErrorMessages'));
            return false;
        } else {
            if (
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(
                    webSite,
                )
            ) {
                setWebSiteError('');
            } else {
                setWebSiteError(Language.get('institute.form.errorMessages.websiteErrorMessagesValidate'));
                return false;
            }
            setWebSiteError('');
        }
        if (phone.trim() === '') {
            setPhoneError(Language.get('institute.form.errorMessages.phoneErrorMessages'));
            return false;
        } else {
            if (/^\d+$/.test(phone) && phone.length === 10) {
                setPhoneError('');
            } else {
                setPhoneError(Language.get('institute.form.errorMessages.phoneErrorMessagesValidate'));
                return false;
            }
            setPhoneError('');
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
                email: instEmail,
                phone: phone,
                website: webSite,
                address: address,
            })
                .then((res) => {
                    if (!onProfile) {
                        let _institutionData = institutionData;
                        _institutionData[position] = res;
                        setInstitutionData([..._institutionData]);
                    } else {
                        setData(res);
                        let _user = user;
                        _user.institute = res;
                        setUser({..._user});
                    }
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
                error={!!webSiteError}
                fullWidth
                helperText={webSiteError}
                label={Language.get('institute.form.labels.website')}
                margin="dense"
                onChange={(event) => {
                    setWebSite(event.target.value);
                    setWebSiteError('');
                }}
                required
                size="small"
                value={webSite}
                variant="outlined"
            />
            <TextField
                error={!!phoneError}
                fullWidth
                helperText={phoneError}
                label={Language.get('institute.form.labels.phone')}
                margin="dense"
                onChange={(event) => {
                    if (event.target.value.length < 11) {
                        setPhone(event.target.value);
                    }
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
    onProfile: PropTypes.bool,
    tableOpen: PropTypes.any,
    setTableOpen: PropTypes.any,
};
