/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Verify Email with OTP
 * @createdOn 13/01/21 1:19 AM
 */

import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Translate from '../../src/components/Translate';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLanguage } from '../../src/store/LanguageStore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Logo from '../../src/assets/Logo.svg';
import { useUser } from '../../src/store/UserContext';
import {
    ForgetPasswordService,
    VerifyOtpServiceForForgotPassword,
    ResetPasswordService,
} from '../../src/apis/rest.app';
import OtpInput from 'react-otp-input';
import { useRouter } from 'next/router';
import ImageFrame from '../../src/components/ImageFrame';
import Hidden from '@material-ui/core/Hidden';
import useHandleError from '../../src/hooks/useHandleError';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        marginBottom: theme.spacing(20),
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
            marginBottom: theme.spacing(10),
            marginTop: theme.spacing(7),
        },
    },
    image: {
        height: 'auto',
        width: '110px',
    },
    title: {
        color: theme.palette.primary.dark,
    },
    link: {
        color: theme.palette.primary.main,
    },
    subTitle: {
        fontSize: '19px',
    },
    otpBox: {
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center',
        },
    },
    timerButton: {
        fontSize: '20px',
        color: theme.palette.background.text,
        fontWeight: '800',
        lineHeight: 1,
    },
    flexGrow: {
        flexGrow: 1,
    },
}));

const VerifyEmail = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [user] = useUser();
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();

    const [email, setEmail] = React.useState(user && user.user && user.user.email ? user.user.email : '');
    const [emailError, setEmailError] = React.useState('');
    const [loading, setLoading] = useState(false);

    const [token, setToken] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = React.useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

    const [timer, setTimer] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');

    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetNewPasswordError, setResetNewPasswordError] = useState('');

    useEffect(() => {
        if (timerRunning) {
            setTimeout(() => {
                if (timer - 1 === 0) setTimerRunning(false);
                setTimer(timer - 1);
            }, 1000);
        }
    }, [timer]);

    const validate = () => {
        if (email.trim() === '') {
            setEmailError(Language.get('mainKey.email') + ' ' + Language.get('error.isRequired'));
            return false;
        } else {
            if (
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    email,
                )
            ) {
                setEmailError('');
            } else {
                setEmailError(Language.get('forgot-password.form.error.validEmail'));
                return false;
            }
        }
        return true;
    };

    const handleSendOtp = () => {
        if (validate()) {
            setLoading(true);
            ForgetPasswordService.create({
                email: email,
                target: 'email',
            })
                .then(() => {
                    setOtpSent(true);
                    setLoading(false);
                    enqueueSnackbar(Language.get('forgot-password.form.success.otpSentSuccessfully'), {
                        variant: 'success',
                    });
                    setLoading(false);
                    setTimerRunning(true);
                    setTimer(30);
                    setOtp('');
                })
                .catch((error) => {
                    handleError()(error);
                    setLoading(false);
                });
        }
    };

    const validateOtp = () => {
        if (otp.length !== 6) {
            enqueueSnackbar(Language.get('forgot-password.form.error.validOtp'), {
                variant: 'error',
            });
            return false;
        } else {
            return true;
        }
    };

    const handleVerifyOtp = () => {
        if (validateOtp()) {
            setVerifyLoading(true);
            VerifyOtpServiceForForgotPassword.create({
                email: email,
                otp: otp,
            })
                .then((res) => {
                    setToken(res.passwordResetToken);
                    setVerifyLoading(false);
                    enqueueSnackbar(Language.get('forgot-password.form.success.successfullyVerified'), {
                        variant: 'success',
                    });
                })
                .catch((error) => {
                    handleError()(error);
                    setVerifyLoading(false);
                });
        }
    };
    const validatePasswordField = () => {
        if (newPassword === '') {
            enqueueSnackbar(Language.get('forgot-password.form.error.newPassword'), {
                variant: 'error',
            });
            return false;
        }
        if (resetNewPassword === '' || resetNewPassword !== newPassword) {
            enqueueSnackbar(Language.get('forgot-password.form.error.resetNewPassword'), {
                variant: 'error',
            });
            return false;
        }
        return true;
    };
    const handleResetPassword = () => {
        if (validatePasswordField()) {
            setResetPasswordLoading(true);
            ResetPasswordService.create({
                passwordResetToken: token,
                newPassword: newPassword,
                confirmPassword: resetNewPassword,
            })
                .then(() => {
                    setResetPasswordLoading(false);
                    enqueueSnackbar(Language.get('forgot-password.form.success.passwordRestSuccessfully'), {
                        variant: 'success',
                    });
                    Router.push('/login');
                })
                .catch((error) => {
                    handleError()(error);
                    setResetPasswordLoading(false);
                })
                .finally(() => {
                    setResetPasswordLoading(false);
                });
        }
    };

    return (
        <ImageFrame>
            <Box maxWidth="470px" width="90%">
                <div className={classes.main}>
                    <img alt="Login Logo" className={classes.image} src={Logo} />
                </div>
                <Typography className={classes.title} variant="h3">
                    <Translate>{'forgot-password.title'}</Translate>
                </Typography>
                <Box mt={1} />
                <Typography variant="subtitle1">
                    {token ? (
                        <Translate>{'forgot-password.enterNewPasswordToReset'}</Translate>
                    ) : !otpSent ? (
                        <Translate>{'forgot-password.sendOtpTo'}</Translate>
                    ) : (
                        <Translate>{'forgot-password.description'}</Translate>
                    )}
                </Typography>
                <Box mt={5} />
                {token ? (
                    <>
                        <TextField
                            autoFocus
                            error={!!newPasswordError}
                            fullWidth
                            helperText={newPasswordError}
                            label={<Translate>{'forgot-password.form.label.newPassword'}</Translate>}
                            margin="dense"
                            onChange={(event) => setNewPassword(event.target.value)}
                            type={'password'}
                            value={newPassword}
                            variant="outlined"
                        />

                        <TextField
                            error={!!resetNewPasswordError}
                            fullWidth
                            helperText={resetNewPasswordError}
                            label={<Translate>{'forgot-password.form.label.reEnterNewPassword'}</Translate>}
                            margin="dense"
                            onChange={(event) => setResetNewPassword(event.target.value)}
                            type={'password'}
                            value={resetNewPassword}
                            variant="outlined"
                        />
                    </>
                ) : !otpSent ? (
                    <TextField
                        autoFocus
                        error={!!emailError}
                        fullWidth
                        helperText={emailError}
                        label={<Translate>{'forgot-password.form.label.email'}</Translate>}
                        margin="dense"
                        onChange={(event) => setEmail(event.target.value)}
                        type={'email'}
                        value={email}
                        variant="outlined"
                    />
                ) : (
                    <>
                        <Box className={classes.otpBox} display={'flex'}>
                            <OtpInput
                                className={classes.otp}
                                errorStyle="error"
                                focusStyle={{ border: `2px solid ${theme.palette.primary.main}` }}
                                hasErrored={false}
                                inputStyle={{
                                    width: '45px',
                                    height: '45px',
                                    margin: ' 10px 12px 10px 0px',
                                    fontSize: '1rem',
                                    borderRadius: 7,
                                    border: `1px solid ${theme.palette.common.black}`,
                                    outline: 'none',
                                }}
                                isDisabled={false}
                                isInputNum={true}
                                numInputs={6}
                                onChange={(event) => setOtp(event)}
                                separator={<span className={classes.separator}> </span>}
                                shouldAutoFocus
                                value={otp}
                            />
                            <Hidden xsDown>
                                <span className={classes.flexGrow} />
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                >
                                    <Typography className={classes.timerButton}>
                                        {'00:'}
                                        {timer > 9 ? timer : '0' + timer}
                                    </Typography>
                                    <Button
                                        color={'primary'}
                                        disabled={timer !== 0 || loading}
                                        onClick={handleSendOtp}
                                        size="small"
                                    >
                                        {loading ? (
                                            <CircularProgress size={13} />
                                        ) : (
                                            <Translate>{'forgot-password.form.button.resend'}</Translate>
                                        )}
                                    </Button>
                                </Box>
                            </Hidden>
                        </Box>
                        <Hidden smUp>
                            <Box display={'flex'} justifyContent={'center'}>
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                >
                                    <Typography className={classes.timerButton}>
                                        {'00:'}
                                        {timer > 9 ? timer : '0' + timer}
                                    </Typography>
                                    <Button
                                        color={'primary'}
                                        disabled={timer !== 0 || loading}
                                        onClick={handleSendOtp}
                                        size="small"
                                    >
                                        {loading ? (
                                            <CircularProgress size={13} />
                                        ) : (
                                            <Translate>{'forgot-password.form.button.resend'}</Translate>
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </Hidden>
                    </>
                )}

                <Box mt={3} />
                <Button
                    color="primary"
                    disabled={token ? resetPasswordLoading : !otpSent ? loading : verifyLoading}
                    fullWidth
                    onClick={token ? handleResetPassword : !otpSent ? handleSendOtp : handleVerifyOtp}
                    variant={'contained'}
                >
                    {token ? (
                        resetPasswordLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Translate>{'forgot-password.form.button.resetPassword'}</Translate>
                        )
                    ) : !otpSent ? (
                        loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Translate>{'forgot-password.form.button.sendOtp'}</Translate>
                        )
                    ) : verifyLoading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Translate>{'forgot-password.form.button.verifyOtp'}</Translate>
                    )}
                </Button>
                <Box mb={10} />
            </Box>
        </ImageFrame>
    );
};

VerifyEmail.layout = null;

export default VerifyEmail;
