/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Sign Up
 * @createdOn 26/12/20 10:30 PM
 */

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Translate from '../../src/components/Translate';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import Link from '../../src/components/Link';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLanguage } from '../../src/store/LanguageStore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Logo from '../../src/assets/Logo.svg';
import { useUser } from '../../src/store/UserContext';
import restApp, { authCookieName, CreateUser } from '../../src/apis/rest.app';
import { useRouter } from 'next/router';
import ImageFrame from '../../src/components/ImageFrame';
import useHandleError from '../../src/hooks/useHandleError';

const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        marginBottom: theme.spacing(14),
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
}));

const SignUp = () => {
    const classes = useStyles();
    const Router = useRouter();
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const [, setUser] = useUser();

    const [name, setName] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (name.trim() === '') {
            setNameError(Language.get('mainKey.name') + ' ' + Language.get('error.isRequired'));
            return false;
        } else {
            setNameError('');
        }
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
                setEmailError(Language.get('signup.form.error.validEmail'));
                return false;
            }
        }
        if (password.trim() === '') {
            setPasswordError(Language.get('mainKey.password') + ' ' + Language.get('error.isRequired'));
            return false;
        } else {
            if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(password)) {
                setPasswordError('');
            } else {
                setPasswordError(Language.get('signup.form.error.validPassword'));
                return false;
            }
        }
        return true;
    };

    //Create an user
    const handleLogin = async () => {
        if (validate()) {
            setLoading(true);
            CreateUser.create({ name, email, password, fcmId: 'sifw73rwejsdfdsrowe7rweoiewresdkfdsy', role: 1 })
                .then((response) => {
                    setUser(response.user);
                    // restApp.reAuthenticate();
                    restApp.authenticate({
                        strategy: 'jwt',
                        fcmId: 'sifw73rwejsdfdsrowe7rweoiewresdkfdsy',
                        accessToken: response.accessToken,
                    });
                    localStorage.setItem(authCookieName, response.accessToken);
                    enqueueSnackbar(Language.get('signup.form.success.userCreated'), {
                        variant: 'success',
                    });
                    Router.push('/verify-email');
                    setLoading(false);
                })
                .catch((error) => {
                    handleError()(error);
                    setLoading(false);
                });
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleLogin();
        }
    };

    return (
        <ImageFrame>
            <Box maxWidth="470px" width="90%">
                <div className={classes.main}>
                    <img alt="Login Logo" className={classes.image} src={Logo} />
                </div>
                <Typography className={classes.title} variant="h3">
                    <Translate>{'signup.title'}</Translate>
                </Typography>
                <Box mt={1} />
                <Typography variant="subtitle1">
                    <Translate>{'signup.description'}</Translate>
                </Typography>
                <Box mt={5.5} />
                <TextField
                    autoFocus
                    error={!!nameError}
                    fullWidth
                    helperText={nameError}
                    label={<Translate>{'signup.form.label.name'}</Translate>}
                    margin="dense"
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={handleEnter}
                    type={'text'}
                    value={name}
                    variant="outlined"
                />
                <TextField
                    error={!!emailError}
                    fullWidth
                    helperText={emailError}
                    label={<Translate>{'signup.form.label.email'}</Translate>}
                    margin="dense"
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyDown={handleEnter}
                    type={'email'}
                    value={email}
                    variant="outlined"
                />
                <TextField
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={!!passwordError}
                    fullWidth
                    helperText={passwordError}
                    label={<Translate>{'signup.form.label.password'}</Translate>}
                    margin={'dense'}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={handleEnter}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    variant="outlined"
                />
                <Box mt={2} />
                <Button
                    className={classes.button}
                    color="primary"
                    disabled={loading}
                    fullWidth
                    onClick={handleLogin}
                    variant={'contained'}
                >
                    {loading ? <CircularProgress size={24} /> : <Translate>{'signup.form.button.signUp'}</Translate>}
                </Button>
                <Box display="flex" justifyContent="center" mt={3}>
                    <Typography variant={'body2'}>
                        <Translate>{'signup.haveAnAccount'}</Translate>
                    </Typography>
                    <Box ml={0.5} />
                    <Link href={`/login`}>
                        <Typography className={classes.link} variant={'body2'}>
                            <Translate>{'signup.form.button.loginHere'}</Translate>
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </ImageFrame>
    );
};

SignUp.layout = null;

export default SignUp;
