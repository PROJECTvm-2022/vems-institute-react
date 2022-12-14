import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
// import theme from '../src/theme';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* PWA primary color */}
                    {/*<meta content={theme.palette.primary.main} name="theme-color" />*/}
                    <link href="/styles/fonts-style.css" media="all" rel="stylesheet" type="text/css" />
                    <link href="https://cdn.plyr.io/3.6.2/plyr.css" rel="stylesheet" />
                    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
                    <link
                        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
                        rel="stylesheet"
                    />
                    <link href="/favicon.ico" rel="shortcut icon" />
                    <link href="/favicon.ico" rel="icon" type="image/x-icon" />
                    {/*<link href="https://source.zoom.us/1.7.9/css/bootstrap.css" rel="stylesheet" type="text/css" />*/}
                    {/*<link href="https://source.zoom.us/1.7.9/css/react-select.css" rel="stylesheet" type="text/css" />*/}
                    {/*<link href="/node_modules/@zoomus/websdk/dist/css/bootstrap.css" rel="stylesheet" type="text/css" />*/}
                    {/*<link*/}
                    {/*    href="/node_modules/@zoomus/websdk/dist/css/react-select.css"*/}
                    {/*    rel="stylesheet"*/}
                    {/*    type="text/css"*/}
                    {/*/>*/}
                </Head>
                <style>{'a:hover {text-decoration: none !important}'}</style>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. restApp.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. restApp.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. restApp.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. restApp.getInitialProps
    // 2. page.getInitialProps
    // 3. restApp.render
    // 4. page.render

    // Render restApp and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the restApp and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
