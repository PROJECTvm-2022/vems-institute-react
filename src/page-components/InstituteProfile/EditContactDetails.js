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
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';

const useStyle = makeStyles((theme) => ({
    nextButton: {
        marginTop: theme.spacing(2),
    },
    formcontrol: {
        marginBottom: theme.spacing(1),
    },
}));

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
            setInstEmailError(Language.get('errorMessages.emailErrorMessages'));
            return false;
        } else {
            if (
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    instEmail,
                )
            ) {
                setInstEmailError('');
            } else {
                setInstEmailError(Language.get('errorMessages.emailErrorMessages1'));
                return false;
            }
            setInstEmailError('');
        }
        if (webSite.trim() === '') {
            setWebSiteError(Language.get('errorMessages.websiteErrorMessages'));
            return false;
        } else {
            setWebSiteError('');
        }
        if (phone.trim() === '') {
            setPhoneError(Language.get('errorMessages.phoneErrorMessages'));
            return false;
        } else {
            setPhoneError('');
        }
        if (address.trim() === '') {
            setAddresError(Language.get('errorMessages.addressErrorMessages'));
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
                webSite: webSite,
                address: address,
            })
                .then((res) => {
                    if (!onProfile) {
                        let _institutionData = institutionData;
                        _institutionData[position] = res;
                        setInstitutionData([..._institutionData]);
                    } else {
                        setData(res);
                    }
                    enqueueSnackbar(Language.get('enqueueSnackbar.editedSuccessFully2'), {
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
                label={Language.get('email')}
                margin="dense"
                onChange={(event) => setInstEmail(event.target.value)}
                required
                size="small"
                value={instEmail}
                variant="outlined"
            />
            <TextField
                error={!!webSiteError}
                fullWidth
                helperText={webSiteError}
                label={Language.get('website')}
                margin="dense"
                onChange={(event) => setWebSite(event.target.value)}
                required
                size="small"
                value={webSite}
                variant="outlined"
            />
            <TextField
                error={!!phoneError}
                fullWidth
                helperText={phoneError}
                label={Language.get('phone')}
                margin="dense"
                onChange={(event) => setPhone(event.target.value)}
                required
                size="small"
                type={'tel'}
                value={phone}
                variant="outlined"
            />
            <TextField
                error={!!addressError}
                fullWidth
                helperText={addressError}
                label={Language.get('address')}
                margin="dense"
                onChange={(event) => setAddress(event.target.value)}
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
                    {loading ? <CircularProgress size={23} /> : <Translate root={'institute/[id]'}>{'next'}</Translate>}
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
