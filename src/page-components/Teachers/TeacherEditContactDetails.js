import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import Translate from '../../components/Translate';
import { UserService } from '../../apis/rest.app';
import { useTeacherDetailsData } from '../../store/TeacherDetailsContext';
import useHandleError from '../../hooks/useHandleError';

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

function TeacherEditContactDetails({
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
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const [, setData] = useTeacherDetailsData();

    const [email, setEmail] = useState(teacherEditData?.email || '');
    const [emailError, setEmailError] = useState('');

    const [phone, setPhone] = useState(teacherEditData?.phone || '');
    const [phoneError, setPhoneError] = useState('');

    const [address, setAddress] = useState(teacherEditData?.address || '');
    const [addressError, setAddresError] = useState('');

    const [loading, setLoading] = useState(false);

    const validate = () => {
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
        if (phone.trim() === '' || phone.length < 10) {
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
            UserService.patch(teacherEditData?._id, {
                email: email,
                phone: phone,
                address: address,
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
                    handleError()(error);
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
            return [Language.get('stepperTitles.firstStep')];
        } else {
            return [Language.get('stepperTitles.editTeacher')];
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
                            onChange={(event) => {
                                if (event.target.value.length <= 10) {
                                    setPhone(event.target.value);
                                }
                            }}
                            required
                            size="small"
                            type={'number'}
                            value={phone}
                            variant="outlined"
                        />
                        <TextField
                            error={addressError !== ''}
                            fullWidth
                            helperText={addressError}
                            label={Language.get('labels.address')}
                            margin="dense"
                            onChange={(event) => setAddress(event.target.value)}
                            required
                            size="small"
                            value={address}
                            variant="outlined"
                        />
                        <Box mt={1} />
                        <Button
                            className={classes.nextButton}
                            color="primary"
                            disabled={loading}
                            fullWidth
                            onClick={handleNext}
                            variant="contained"
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Translate root={'teachers/[id]'}>{'details.addSubject.button.next'}</Translate>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
TeacherEditContactDetails.propTypes = {
    teacherData: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setTeacherData: PropTypes.func,
    teacherEditData: PropTypes.any,
    position: PropTypes.any,
    onProfile: PropTypes.bool,
};
export default TeacherEditContactDetails;
