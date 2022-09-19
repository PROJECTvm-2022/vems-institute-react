import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Translate from '../../src/components/Translate';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '../../src/components/Link';
import Box from '@material-ui/core/Box';
import restApp from '../../src/apis/rest.app';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLanguage } from '../../src/store/LanguageStore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '../../src/store/UserContext';
import LoginBG from '../../src/assets/img/login-bg.png';
import Logo from '../../src/assets/img/Logo.svg';
import Paper from '@material-ui/core/Paper';
import { Animated } from 'react-animated-css';
import useHandleError from '../../src/hooks/useHandleError';

const useStyle = makeStyles((theme) => ({
    mainDiv: {
        background: `url(${LoginBG}) no-repeat`,
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paperDiv: {
        width: '90%',
        maxWidth: 440,
        padding: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 4),
        },
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1, 2),
        },
    },
    logo: {
        [theme.breakpoints.down('sm')]: {
            width: '40%',
        },
    },
}));

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(true);

    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    const Router = useRouter();
    const [user, setUser] = useUser();

    const handleError = useHandleError();

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        try {
            if (
                email.trim() === '' ||
                !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    email,
                )
            ) {
                return setError({
                    email: Language.get('login.form.error.email'),
                    password: '',
                });
            }
            if (password.trim() === '') {
                return setError({
                    email: '',
                    password: Language.get('login.form.error.password'),
                });
            }
            setLoading(true);
            const { user } = await restApp.authenticate({
                strategy: 'local',
                email: email.trim(),
                password: password.trim(),
                fcmId: '123456',
            });
            setUser(user);
            enqueueSnackbar(Language.get('login.form.success'), { variant: 'success' });
            setVisible(false);
            setTimeout(() => {
                Router.push('/');
            }, 700);
        } catch (error) {
            handleError()(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleLogin();
        }
    };

    useEffect(() => {
        if (email && error['email']) {
            setError((error) => {
                error['email'] = '';
                return error;
            });
        }
    }, [email]);

    useEffect(() => {
        if (password && error['password']) {
            setError((error) => {
                error['password'] = '';
                return error;
            });
        }
    }, [password]);

    useEffect(() => {
        if (user) Router.push('/');
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>{Language.get('login.pageTitle')}</title>
            </Head>
            <div className={classes.mainDiv}>
                <Paper className={classes.paperDiv} onKeyDown={handleEnter}>
                    <Box mb={1} textAlign="center">
                        <Animated
                            animationIn="zoomIn"
                            animationOut="zoomOut"
                            animationOutDelay={500}
                            isVisible={visible}
                        >
                            <img alt={Language.get('login.title')} className={classes.logo} src={Logo} />
                        </Animated>
                    </Box>
                    <Box mt={2} />
                    <Typography align="center" variant="h4">
                        <Animated
                            animationIn="zoomIn"
                            animationInDelay={100}
                            animationOut="zoomOut"
                            animationOutDelay={400}
                            isVisible={visible}
                        >
                            <Translate>{'login.title'}</Translate>
                        </Animated>
                    </Typography>
                    <Box mt={2} />
                    <Animated
                        animationIn="zoomIn"
                        animationInDelay={200}
                        animationOut="zoomOut"
                        animationOutDelay={300}
                        isVisible={visible}
                    >
                        <TextField
                            autoFocus={true}
                            error={error['email'] || undefined}
                            fullWidth
                            helperText={error['email'] || undefined}
                            label={<Translate>{'login.form.label.email'}</Translate>}
                            margin="normal"
                            onChange={(event) => setEmail(event.target.value)}
                            required={true}
                            size="small"
                            value={email}
                            variant="outlined"
                        />
                    </Animated>
                    <Animated
                        animationIn="zoomIn"
                        animationInDelay={300}
                        animationOut="zoomOut"
                        animationOutDelay={200}
                        isVisible={visible}
                    >
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={error['password'] || undefined}
                            fullWidth
                            helperText={error['password'] || undefined}
                            id={'password'}
                            label={<Translate>{'login.form.label.password'}</Translate>}
                            labelWidth={70}
                            margin="normal"
                            onChange={(event) => setPassword(event.target.value)}
                            required={true}
                            size="small"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            variant="outlined"
                        />
                    </Animated>
                    <Box mt={2} />
                    <Animated
                        animationIn="zoomIn"
                        animationInDelay={400}
                        animationOut="zoomOut"
                        animationOutDelay={100}
                        isVisible={visible}
                    >
                        <Button
                            color="primary"
                            disabled={loading}
                            fullWidth
                            onClick={handleLogin}
                            size="large"
                            variant="contained"
                        >
                            {loading ? (
                                <CircularProgress size={26} />
                            ) : (
                                <Translate>{'login.form.button.submit'}</Translate>
                            )}
                        </Button>
                    </Animated>
                </Paper>
            </div>
        </React.Fragment>
    );
};

Login.layout = null;

export default Login;
