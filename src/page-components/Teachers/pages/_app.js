import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import DefaultLayout from '../src/components/Layouts/DefaultLayout';
import { LanguageProvider } from '../src/store/LanguageStore';
import restApp, { cookieStorage, authCookieName } from '../src/apis/rest.app';
import { UserProvider } from '../src/store/UserContext';
import Loader from '../src/components/loaders/Loader';
import { SnackbarProvider } from 'notistack';
import Translate from '../src/components/Translate';
import { useRouter } from 'next/router';
import 'cropperjs/dist/cropper.css';
import { PageGlobalStoreProvider } from '../src/store/PageGlobalContext';

export default function MyApp(props) {
    const { Component, pageProps } = props;

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const Router = useRouter();

    let Layout = DefaultLayout;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }

        const token = cookieStorage.getItem(authCookieName);
        if (token) {
            restApp
                .authenticate({
                    strategy: 'jwt',
                    accessToken: token,
                    fcmId: '123456',
                })
                .then((response) => {
                    setUser(response.user);
                    setLoading(false);
                })
                .catch(() => {
                    restApp.logout();
                    Router.push('/login');
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                });
        } else {
            Router.push('/login');
            if (Router.pathname === '/login') {
                setLoading(false);
            } else {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }
    }, []);

    if (Component.layout === null) Layout = React.Fragment;
    else if (Component.layout) Layout = Component.layout;

    return (
        <UserProvider value={user}>
            <LanguageProvider local="en">
                <Head>
                    <title>
                        <Translate>{'defaultPageTitle'}</Translate>
                    </title>
                    <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
                </Head>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider>
                        <PageGlobalStoreProvider>
                            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                            <CssBaseline />
                            {loading ? (
                                <Loader />
                            ) : (
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                            )}
                        </PageGlobalStoreProvider>
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
