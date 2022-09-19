import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import createTheme from '../src/theme';
import DefaultLayout from '../src/components/Layouts/DefaultLayout';
import { LanguageProvider } from '../src/store/LanguageStore';
import restApp, { authCookieName } from '../src/apis/rest.app';
import { UserProvider } from '../src/store/UserContext';
import Loader from '../src/components/loaders/Loader';
import { SnackbarProvider } from 'notistack';
import Translate from '../src/components/Translate';
import 'cropperjs/dist/cropper.css';
import { useRouter } from 'next/router';
// import { CheckUser } from '../src/utils/CheckPermit';
import '../src/components/TimeTable/plugin.sass';
import '../src/components/Zoom/react-select.css';
import '../src/components/Zoom/bootstrap.css';
import '../src/components/zoom.css';
import 'shaka-player/dist/controls.css';

export default function MyApp(props) {
    const { Component, pageProps } = props;
    const Router = useRouter();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    let Layout = DefaultLayout;
    if(Component.layout === null) Layout = React.Fragment;
    else if(Component.layout) Layout = Component.layout;

    // // eslint-disable-next-line no-unused-vars
    // const checkUserAndRedirect = (user) => {
    //     // console.log(user);
    //     if (CheckUser(user).STUDENT && (!user.phone || !user.address)) {
    //         Router.push('/student-onboarding').then(() => setLoading(false));
    //     } else if (!user.emailVerified) {
    //         Router.push('/verify-email').then(() => setLoading(false));
    //     } else setLoading(false);
    // };

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }

        // const token = cookieStorage.getItem(authCookieName);
        const token = localStorage.getItem(authCookieName);

        if (token) {
            restApp
                .authenticate(
                    {
                        strategy: 'jwt',
                        accessToken: token,
                        fcmId: 'sifw73rwejsdfdsrowe7rweoiewresdkfdsy',
                    },
                    {
                        query: {
                            $populate: ['institute'],
                        },
                    },
                )
                .then((response) => {
                    const { user, accessToken } = response;
                    localStorage.setItem(authCookieName, accessToken);
                    setUser(user);
                    if (
                        (user?.role === 128 && Router.pathname === '/login') ||
                        (user?.role === 128 && Router.pathname === '/signup')
                        // Router.pathname === '/verify-email'
                    ) {
                        Router.push('/').then(() => setLoading(false));
                    } else if (user?.role === 8 && Router.pathname === '/login') {
                        Router.push('/teacher-dashboard').then(() => setLoading(false));
                    } else if (user?.role === 1 && Router.pathname === '/login') {
                        if (user?.role === 1 && user?.studentSeat?.status === 1) {
                            Router.replace('/pending').then(() => setLoading(false));
                        } else if (user?.role === 1 && (!user.institute || !user?.phone)) {
                            Router.push('/student-onboarding').then(() => setLoading(false));
                        } else {
                            Router.push('/student-dashboard').then(() => setLoading(false));
                        }
                    } else if (user?.role === 512) {
                        localStorage.removeItem(authCookieName);
                        Router.reload();
                        Router.push('/login');
                    } else {
                        setLoading(false);
                    }
                })
                .catch(() => {
                    localStorage.removeItem(authCookieName);
                    restApp.logout();
                    Router.push('/login').then(() => setLoading(false));
                });
        } else {
            if (
                !(
                    Router.pathname === '/login' ||
                    Router.pathname === '/signup' ||
                    Router.pathname === '/result' ||
                    Router.pathname.startsWith('/student-exam-details') ||
                    Router.pathname === '/forgot-password'
                )
            ) {
                Router.push('/login').then(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
    }, []);

    if (Component.layout === null) Layout = React.Fragment;
    else if (Component.layout) Layout = Component.layout;

    const { institute = null } =
        user?.institutes?.find((each) => each.institute && each.institute._id === user.currentInstitute) || {};

    const theme = createTheme(institute?.colorCode?.primary);

    // console.log('user', user);

    return (
        <UserProvider value={[user, setUser]}>
            <LanguageProvider local="en">
                <Head>
                    <title>
                        <Translate>{'defaultPageTitle'}</Translate>
                    </title>
                    <meta content={theme.palette.primary.main} name="theme-color" />
                    <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
                </Head>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        {loading ? (
                            <Loader />
                        ) : (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        )}
                    </SnackbarProvider>
                </ThemeProvider>
            </LanguageProvider>
        </UserProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
