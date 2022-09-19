import React, { useState, useEffect } from 'react';
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
import restApp, { authCookieName } from '../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLanguage } from '../../src/store/LanguageStore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Logo from '../../public/vemsLogo.jpg';
import { useUser } from '../../src/store/UserContext';
import { useRouter } from 'next/router';
import ImageFrame from '../../src/components/ImageFrame';
import useHandleError from '../../src/hooks/useHandleError';
import DefaultLayout from '../../src/components/Layouts/DefaultLayoutForResult';

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
}));

const Login = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const handleError = useHandleError();
    const Router = useRouter();
    const [user, setUser] = useUser();

    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = useState(false);

    // const [facebookClicked, setFacebookClicked] = useState(false);
    // const [googleClicked, setGoogleClicked] = useState(false);
    // const [isGoogleLogin, setIsGoogleLoading] = useState(false);

    const validate = () => {
        if (email.trim() === '') {
            setEmailError(Language.get('mainKey.email') + ' ' + Language.get('error.isRequired'));
            return false;
        } else {
            setEmailError('');
        }
        if (
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email,
            )
        ) {
            setEmailError('');
        } else {
            setEmailError(Language.get('login.form.error.validEmail'));
            return false;
        }
        if (password.trim() === '') {
            setPasswordError(Language.get('mainKey.password') + ' ' + Language.get('error.isRequired'));
            return false;
        } else {
            setPasswordError('');
        }
        return true;
    };

    const handleLogin = async () => {
        if (validate()) {
            try {
                setLoading(true);
                const { user, accessToken } = await restApp.authenticate(
                    {
                        strategy: 'local',
                        email,
                        password,
                        fcmId: 'sifw73ewerwerwejsdfdsrowe7rweoiewresdkfdsy',
                    },
                    {
                        query: {
                            $populate: ['institute'],
                        },
                    },
                );
                if (user?.role === 128 || user?.role === 1 || user?.role === 8) {
                    localStorage.setItem(authCookieName, accessToken);
                    setUser(user);
                    // if (user?.role !== 1) {
                    await Router.push('/');
                    // }
                    enqueueSnackbar(Language.get('login.title') + ' ' + Language.get('mainKey.successful'), {
                        variant: 'success',
                    });
                    setLoading(false);
                } else {
                    enqueueSnackbar('You don' + "'" + 't have access to the panel', {
                        variant: 'error',
                    });
                    setLoading(false);
                }
            } catch (error) {
                handleError()(error);
                setLoading(false);
            }
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

    useEffect(() => {
        if (user) {
            Router.push('/');
        }
    }, []);

    return (
        <ImageFrame>
            <Box maxWidth="470px" width="90%">
                <div className={classes.main}>
                    <img alt="Login Logo" className={classes.image} src={Logo} />
                </div>
                <Typography className={classes.title} variant="h3">
                    <Translate>{'login.title'}</Translate>
                </Typography>
                <Box mt={1} />
                <Typography variant="subtitle1">
                    <Translate>{'login.description'}</Translate>
                </Typography>
                <Box mt={5.5} />
                <TextField
                    autoFocus
                    color="primary"
                    error={!!emailError}
                    fullWidth
                    helperText={emailError}
                    label={<Translate>{'login.form.label.email'}</Translate>}
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
                    color={'primary'}
                    error={!!passwordError}
                    fullWidth
                    helperText={passwordError}
                    label={<Translate>{'login.form.label.password'}</Translate>}
                    margin={'dense'}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={handleEnter}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    variant="outlined"
                />
                <Box mt={2} />
                <Button
                    color="primary"
                    disabled={loading}
                    fullWidth
                    onClick={handleLogin}
                    size="medium"
                    variant={'contained'}
                >
                    {loading ? <CircularProgress size={24} /> : <Translate>{'login.form.button.signIn'}</Translate>}
                </Button>
            </Box>
        </ImageFrame>
    );
};

Login.layout = null;

export default Login;
