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
import {useUser} from "../../store/UserContext";

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
    const Language = useLanguage();

    const [, setData] = useInstituteDetailsData();
    const [user, setUser] = useUser();

    const [instName, setInstName] = useState(each && each.name ? each.name : '');
    const [instNameError, setInstNameError] = useState('');

    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (instName.trim() === '') {
            setInstNameError(Language.get('institute.form.errorMessages.nameErrorMessages'));
            return false;
        } else {
            setInstNameError('');
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            editInstitute(each._id, {
                name: instName,
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
                autoFocus
                error={!!instNameError}
                fullWidth
                helperText={instNameError}
                label={'Institute Name'}
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
