/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Verify Email with OTP
 * @createdOn 13/01/21 1:19 AM
 */

import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Translate from '../../src/components/Translate';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLanguage } from '../../src/store/LanguageStore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Logo from '../../src/assets/Logo.svg';
import { useUser } from '../../src/store/UserContext';
import { authCookieName, ForgetPasswordService, VerifyEmailService } from '../../src/apis/rest.app';
import OtpInput from 'react-otp-input';
import { useRouter } from 'next/router';
import ImageFrame from '../../src/components/ImageFrame';
import Hidden from '@material-ui/core/Hidden';
import useHandleError from '../../src/hooks/useHandleError';
import useTheme from '@material-ui/core/styles/useTheme';
import Confirm from '../../src/components/Confirm';

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
    const [user] = useUser();
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const [email, setEmail] = React.useState(user && user.email ? user.email : '');
    const [loading, setLoading] = useState(false);

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = React.useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const [timer, setTimer] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        if (timerRunning) {
            setTimeout(() => {
                if (timer - 1 === 0) setTimerRunning(false);
                setTimer(timer - 1);
            }, 1000);
        }
    }, [timer]);

    useEffect(() => {
        if (user) setEmail(user.email);
    }, [user]);

    const validate = () => {
        return email.trim() !== '';
    };

    const handleSendOtp = async () => {
        if (validate()) {
            setLoading(true);
            ForgetPasswordService.create({
                verification: true,
            })
                .then(() => {
                    setOtpSent(true);
                    setLoading(false);
                    enqueueSnackbar(Language.get('verify-email.form.success.otpSentSuccessfully'), {
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
            enqueueSnackbar(Language.get('verify-email.form.error.validOtp'), {
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
            VerifyEmailService.create({
                email: email,
                otp: otp,
            })
                .then(() => {
                    setVerifyLoading(false);
                    enqueueSnackbar(Language.get('verify-email.form.success.successfullyVerified'), {
                        variant: 'success',
                    });
                    if (user.role === 1 && (!user.city || user.city === '')) Router.push('/student-onboarding');
                    else Router.push('/');
                })
                .catch((error) => {
                    handleError()(error);
                    setVerifyLoading(false);
                });
        }
    };

    const handleLogout = () => {
        Confirm(Language.get('logout.title'), Language.get('logout.message'), 'Ok')
            .then(() => {
                localStorage.removeItem(authCookieName);
                Router.reload();
            })
            .catch(() => {});
    };

    return (
        <ImageFrame>
            <Box maxWidth="470px" width="90%">
                <div className={classes.main}>
                    <img alt="Login Logo" className={classes.image} src={Logo} />
                </div>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography className={classes.title} variant="h3">
                        <Translate>{'verify-email.title'}</Translate>
                    </Typography>
                    <Button color={'primary'} onClick={handleLogout} variant={'contained'}>
                        {'Logout'}
                    </Button>
                </Box>
                <Box mt={1} />
                <Typography variant="subtitle1">
                    {!otpSent ? (
                        <Translate>{'verify-email.sendOtpTo'}</Translate>
                    ) : (
                        Language.get('verify-email.sendOtpText') + ' ' + email
                    )}
                </Typography>
                <Box mt={5} />
                {!otpSent ? (
                    <Typography variant="subtitle1">
                        <Translate>{'verify-email.description'}</Translate>
                    </Typography>
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
                                            <Translate>{'verify-email.form.button.resend'}</Translate>
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
                                            <Translate>{'verify-email.form.button.resend'}</Translate>
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
                    disabled={!otpSent ? loading : verifyLoading}
                    fullWidth
                    onClick={!otpSent ? handleSendOtp : handleVerifyOtp}
                    variant={'contained'}
                >
                    {!otpSent ? (
                        loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Translate>{'verify-email.form.button.sendOtp'}</Translate>
                        )
                    ) : verifyLoading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Translate>{'verify-email.form.button.verifyOtp'}</Translate>
                    )}
                </Button>
                <Box mb={10} />
            </Box>
        </ImageFrame>
    );
};

VerifyEmail.layout = null;

export default VerifyEmail;
